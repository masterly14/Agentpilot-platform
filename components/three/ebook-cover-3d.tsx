'use client'

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import gsap from 'gsap'
import * as THREE from 'three'

const DEG = Math.PI / 180
const ORIGIN = new THREE.Vector3(0, 0, 0)
const UP = new THREE.Vector3(0, 1, 0)

/** Vertical sway stays a fraction of the horizontal one so the cover never tips out of reading angle. */
const TILT_RATIO = 0.25
/** Half the horizontal frequency, which keeps the whole idle loop harmonic and seamless. */
const TILT_SPEED_RATIO = 0.5
const POINTER_YAW = 3
const POINTER_PITCH = 2
const POINTER_DAMPING = 3.2
/** Headroom around the book so the full cover, float and shadow stay inside the frame. */
const FIT_MARGIN = 1.32
const FIT_MARGIN_COMPACT = 1.22
/** Mobile GPUs pay for every extra pixel, and past 2x the book gains nothing visible. */
const MAX_DPR = 2
/** Full 16x anisotropy is wasted here: the cover is never seen at a grazing angle. */
const MAX_ANISOTROPY = 8

/**
 * BoxGeometry — and therefore RoundedBoxGeometry, which derives from it — exposes one material
 * group per face in this order.
 */
const FACE = {
  right: 0,
  left: 1,
  top: 2,
  bottom: 3,
  front: 4,
  back: 5,
} as const

export type EbookCover3DProps = {
  cover: string
  /** Shown instantly and kept on screen if WebGL never comes up. Defaults to `cover`. */
  poster?: string

  width?: number
  height?: number
  depth?: number
  radius?: number

  spineSide?: 'left' | 'right'

  cameraFov?: number
  /** Degrees. Negative places the camera to the left of the book. */
  cameraAzimuth?: number
  /** Degrees. Positive places the camera above the book. */
  cameraElevation?: number

  /** Degrees of idle horizontal sway. */
  rotationAmplitude?: number
  rotationSpeed?: number

  floatAmplitude?: number
  floatSpeed?: number

  interactive?: boolean
  autoAnimate?: boolean
  intro?: boolean
  debugControls?: boolean

  className?: string
}

type PointerTarget = { x: number; y: number; inside: boolean }

/**
 * Fore edge and head/tail of the page block. The gradient (bright at the outer sheets, duller in
 * the middle of the stack) is what reads as paper at small sizes; the hairlines only resolve when
 * the book is rendered large.
 */
function createPageEdgeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 8

  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, '#e2d8c4')
  gradient.addColorStop(0.08, '#fdfbf5')
  gradient.addColorStop(0.5, '#ece3d1')
  gradient.addColorStop(0.92, '#fdfbf5')
  gradient.addColorStop(1, '#ddd2bc')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const sheets = 190
  for (let i = 0; i < sheets; i += 1) {
    const x = ((i + 0.5) / sheets) * canvas.width + (Math.random() - 0.5) * 1.8
    ctx.fillStyle = `rgba(116, 104, 84, ${0.12 + Math.random() * 0.24})`
    ctx.fillRect(x, 0, 0.9, canvas.height)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

/**
 * Hardcover spine: dark board with a lighter band near each hinge, which is what gives the
 * silhouette its "bound" read instead of looking like a flat slab.
 */
function createSpineTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 8

  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, '#05050a')
  gradient.addColorStop(0.14, '#2a2a38')
  gradient.addColorStop(0.28, '#121219')
  gradient.addColorStop(0.5, '#191922')
  gradient.addColorStop(0.72, '#121219')
  gradient.addColorStop(0.86, '#2a2a38')
  gradient.addColorStop(1, '#05050a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createSoftShadowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.06,
    size / 2,
    size / 2,
    size * 0.5,
  )
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  gradient.addColorStop(0.32, 'rgba(255, 255, 255, 0.42)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * The studio reflections, painted straight into a small equirectangular canvas.
 *
 * The obvious alternative — drei's `<Environment>` with `<Lightformer>` children — builds the same
 * image by rendering a second scene through a cube camera into a half-float render target on every
 * mount. That extra pass is the single most fragile thing to ask of a mobile GPU, and it buys
 * nothing when the reflections are static. Painting the panels by hand keeps the same look for the
 * cost of one 512x256 texture upload.
 */
function createStudioEnvTexture() {
  const width = 512
  const height = 256
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const sky = ctx.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#9fb0c8')
  sky.addColorStop(0.42, '#4a5468')
  sky.addColorStop(0.6, '#1a1d26')
  sky.addColorStop(1, '#07080c')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  // three maps an equirect texture with u = atan2(z, x) and v = asin(y), and CanvasTexture flips Y,
  // so a light aimed at the book converts to canvas pixels like this.
  const panel = (
    direction: [number, number, number],
    radius: number,
    intensity: number,
    stretch = 1,
  ) => {
    const [x, y, z] = direction
    const length = Math.hypot(x, y, z)
    const u = Math.atan2(z, x) / (Math.PI * 2) + 0.5
    const v = Math.asin(y / length) / Math.PI + 0.5
    const cx = u * width
    const cy = (1 - v) * height

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    glow.addColorStop(0, `rgba(255, 255, 255, ${intensity})`)
    glow.addColorStop(0.45, `rgba(255, 255, 255, ${intensity * 0.42})`)
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')

    // Redrawn either side of the seam so a panel straddling u=0 stays continuous.
    for (const offset of [-width, 0, width]) {
      ctx.save()
      ctx.translate(cx + offset, cy)
      ctx.scale(stretch, 1)
      ctx.fillStyle = glow
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2)
      ctx.restore()
    }
  }

  ctx.globalCompositeOperation = 'lighter'
  panel([4, 3, 5], 96, 0.95, 1.35) // key, front right
  panel([0, 6, 2], 120, 0.6, 2.2) // overhead soft box
  panel([-5, -1, 4], 84, 0.34, 1.5) // fill, front left
  panel([3, 1, -5], 70, 0.5, 1.2) // rim, behind
  ctx.globalCompositeOperation = 'source-over'

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** True only while the element is on screen and the tab is in the foreground. */
function useActiveOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let onScreen = true
    const sync = () => setActive(onScreen && !document.hidden)

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { rootMargin: '200px' },
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [ref])

  return active
}

/**
 * Exact framing for an off-axis camera. Pushing the camera back along its own forward axis leaves
 * view-space x and y untouched, so the distance that makes every corner fit can be solved directly
 * instead of iterating.
 */
function computeCameraDistance({
  corners,
  direction,
  fov,
  aspect,
  margin,
}: {
  corners: THREE.Vector3[]
  direction: THREE.Vector3
  fov: number
  aspect: number
  margin: number
}) {
  const probeDistance = 10
  const probe = direction.clone().multiplyScalar(probeDistance)
  const view = new THREE.Matrix4()
    .lookAt(probe, ORIGIN, UP)
    .setPosition(probe)
    .invert()

  const tanV = Math.tan((fov * DEG) / 2)
  const tanH = tanV * aspect

  let delta = -Infinity
  const point = new THREE.Vector3()

  for (const corner of corners) {
    point.copy(corner).applyMatrix4(view)
    delta = Math.max(
      delta,
      (Math.abs(point.x) * margin) / tanH + point.z,
      (Math.abs(point.y) * margin) / tanV + point.z,
    )
  }

  return Math.max(probeDistance + delta, 0.1)
}

function StudioLighting() {
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    const texture = createStudioEnvTexture()
    scene.environment = texture

    return () => {
      scene.environment = null
      texture.dispose()
    }
  }, [scene])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 6]} intensity={1.5} />
      <directionalLight position={[-5, -1, 3]} intensity={0.5} />
    </>
  )
}

type BookProps = {
  coverTexture: THREE.Texture
  width: number
  height: number
  depth: number
  radius: number
  spineSide: 'left' | 'right'
  rotationAmplitude: number
  rotationSpeed: number
  floatAmplitude: number
  floatSpeed: number
  interactive: boolean
  autoAnimate: boolean
  intro: boolean
  pointer: React.RefObject<PointerTarget>
}

function Book({
  coverTexture,
  width,
  height,
  depth,
  radius,
  spineSide,
  rotationAmplitude,
  rotationSpeed,
  floatAmplitude,
  floatSpeed,
  interactive,
  autoAnimate,
  intro,
  pointer,
}: BookProps) {
  const groupRef = useRef<THREE.Group>(null)
  const shadowRef = useRef<THREE.Mesh>(null)
  const yaw = useRef(0)
  const pitch = useRef(0)
  /** GSAP owns this object; useFrame only reads it, so the two never fight over a property. */
  const entrance = useRef({ yaw: intro ? 22 : 0, scale: intro ? 0.88 : 1 })
  const shadowY = -height / 2 - floatAmplitude - width * 0.05

  const geometries = useMemo(() => {
    const boardThickness = Math.max(depth * 0.13, width * 0.009)
    const overhang = width * 0.018
    const spineInset = boardThickness * 0.55
    const boardRadius = Math.min(radius, boardThickness * 0.38, width * 0.01)

    const pagesWidth = width - overhang - spineInset
    const pagesHeight = height - overhang * 2
    const pagesDepth = Math.max(depth - boardThickness * 2 - 0.004, depth * 0.55)
    const pagesRadius = Math.min(overhang * 0.35, pagesDepth * 0.18)

    const spineSign = spineSide === 'left' ? -1 : 1
    const pagesX = spineSign * ((spineInset - overhang) / 2)
    const spineX = spineSign * (width / 2 - boardThickness / 2)
    const boardZ = depth / 2 - boardThickness / 2

    // One segment is enough: the bevel is a highlight catcher, not a silhouette, and this keeps
    // the whole book near 300 triangles.
    return {
      front: new RoundedBoxGeometry(width, height, boardThickness, 1, boardRadius),
      back: new RoundedBoxGeometry(width, height, boardThickness, 1, boardRadius),
      spine: new RoundedBoxGeometry(boardThickness, height, depth, 1, boardRadius),
      pages: new RoundedBoxGeometry(pagesWidth, pagesHeight, pagesDepth, 1, pagesRadius),
      boardZ,
      spineX,
      pagesX,
    }
  }, [width, height, depth, radius, spineSide])

  const textures = useMemo(() => {
    const foreEdge = createPageEdgeTexture()
    // Head and tail map u along the width and v along the depth, so the sheet lines need a
    // quarter turn in UV space to keep running across the stack.
    const headEdge = foreEdge.clone()
    headEdge.center.set(0.5, 0.5)
    headEdge.rotation = Math.PI / 2
    headEdge.needsUpdate = true

    return { foreEdge, headEdge, spine: createSpineTexture(), shadow: createSoftShadowTexture() }
  }, [])

  /**
   * Everything is MeshStandardMaterial on purpose. MeshPhysicalMaterial's clearcoat adds a second
   * specular lobe plus extra varyings to every one of these shaders, and on tile-based mobile GPUs
   * that is the difference between compiling in a frame and stalling — or, on the tightest
   * varying budgets, failing outright and leaving a blank canvas. A low roughness against the
   * studio environment map produces the same lacquered read for a fraction of the cost.
   */
  const materials = useMemo(() => {
    const pagesFore = new THREE.MeshStandardMaterial({
      map: textures.foreEdge,
      roughness: 0.88,
      metalness: 0,
      envMapIntensity: 0.55,
    })
    const pagesHead = new THREE.MeshStandardMaterial({
      map: textures.headEdge,
      roughness: 0.88,
      metalness: 0,
      envMapIntensity: 0.55,
    })
    const pagesFace = new THREE.MeshStandardMaterial({
      color: '#f3ead8',
      roughness: 0.9,
      metalness: 0,
      envMapIntensity: 0.35,
    })
    const board = new THREE.MeshStandardMaterial({
      color: '#0e0e13',
      roughness: 0.26,
      metalness: 0,
      envMapIntensity: 1.15,
    })
    const spine = new THREE.MeshStandardMaterial({
      map: textures.spine,
      roughness: 0.24,
      metalness: 0,
      envMapIntensity: 1.15,
    })
    const coverFront = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.22,
      metalness: 0,
      envMapIntensity: 1.25,
    })

    const frontBoard: THREE.Material[] = [board, board, board, board, coverFront, board]
    const backBoard: THREE.Material[] = [board, board, board, board, board, board]
    const spineBoard: THREE.Material[] = [spine, spine, board, board, board, board]
    const pageBlock: THREE.Material[] = []
    pageBlock[FACE.right] = pagesFore
    pageBlock[FACE.left] = pagesFore
    pageBlock[FACE.top] = pagesHead
    pageBlock[FACE.bottom] = pagesHead
    pageBlock[FACE.front] = pagesFace
    pageBlock[FACE.back] = pagesFace

    return {
      frontBoard,
      backBoard,
      spineBoard,
      pageBlock,
      unique: [pagesFore, pagesHead, pagesFace, board, spine, coverFront],
    }
  }, [coverTexture, textures])

  useEffect(
    () => () => {
      geometries.front.dispose()
      geometries.back.dispose()
      geometries.spine.dispose()
      geometries.pages.dispose()
    },
    [geometries],
  )
  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose())
    },
    [textures],
  )
  useEffect(
    () => () => {
      materials.unique.forEach((material) => material.dispose())
    },
    [materials],
  )

  useEffect(() => {
    if (!intro) return

    entrance.current.yaw = 22
    entrance.current.scale = 0.88

    const tween = gsap.to(entrance.current, {
      yaw: 0,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out',
    })
    return () => {
      tween.kill()
    }
  }, [intro])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    const time = state.clock.elapsedTime
    const swayAmplitude = rotationAmplitude * DEG
    const tiltAmplitude = rotationAmplitude * TILT_RATIO * DEG

    const autoYaw = autoAnimate ? Math.sin(time * rotationSpeed) * swayAmplitude : 0
    const autoPitch = autoAnimate
      ? Math.sin(time * rotationSpeed * TILT_SPEED_RATIO) * tiltAmplitude
      : 0
    const autoFloat = autoAnimate ? Math.sin(time * floatSpeed) * floatAmplitude : 0

    const active = interactive && pointer.current.inside
    const targetYaw = active ? pointer.current.x * POINTER_YAW * DEG : 0
    const targetPitch = active ? -pointer.current.y * POINTER_PITCH * DEG : 0

    yaw.current = THREE.MathUtils.damp(yaw.current, targetYaw, POINTER_DAMPING, delta)
    pitch.current = THREE.MathUtils.damp(pitch.current, targetPitch, POINTER_DAMPING, delta)

    group.rotation.y = entrance.current.yaw * DEG + autoYaw + yaw.current
    group.rotation.x = autoPitch + pitch.current
    group.position.y = autoFloat
    group.scale.setScalar(entrance.current.scale)

    const shadow = shadowRef.current
    if (!shadow) return

    const lift01 = THREE.MathUtils.clamp(
      (autoFloat + floatAmplitude) / Math.max(floatAmplitude * 2, 1e-4),
      0,
      1,
    )
    const spread = 0.9 + lift01 * 0.5
    shadow.position.x = Math.sin(group.rotation.y) * width * 0.18
    shadow.position.y = shadowY
    shadow.position.z = Math.sin(group.rotation.x) * height * 0.08
    shadow.scale.set(spread, spread, 1)

    const shadowMaterial = shadow.material
    if (!Array.isArray(shadowMaterial)) {
      shadowMaterial.opacity = 0.62 - lift01 * 0.34
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <mesh
          geometry={geometries.front}
          material={materials.frontBoard}
          position={[0, 0, geometries.boardZ]}
        />
        <mesh
          geometry={geometries.back}
          material={materials.backBoard}
          position={[0, 0, -geometries.boardZ]}
        />
        <mesh
          geometry={geometries.spine}
          material={materials.spineBoard}
          position={[geometries.spineX, 0, 0]}
        />
        <mesh
          geometry={geometries.pages}
          material={materials.pageBlock}
          position={[geometries.pagesX, 0, 0]}
        />
      </group>
      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, shadowY, 0]}
        renderOrder={-1}
      >
        <planeGeometry args={[width * 1.55, width * 0.82]} />
        <meshBasicMaterial
          map={textures.shadow}
          transparent
          opacity={0.45}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  )
}

/** Reports once the book has actually been drawn, so the poster only leaves on a real frame. */
function FirstFrameProbe({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)

  useFrame(() => {
    if (frames.current > 2) return
    frames.current += 1
    if (frames.current === 2) onReady()
  })

  return null
}

type BookSceneProps = Omit<EbookCover3DProps, 'className' | 'poster'> & {
  pointer: React.RefObject<PointerTarget>
  reducedMotion: boolean
  onReady: () => void
}

function BookScene({
  cover,
  width = 3,
  height,
  depth,
  radius,
  // Western hardcover: spine on the left, page block on the right. The camera sits slightly
  // to the right so the 3/4 view shows the fore edge instead of hiding it.
  spineSide = 'left',
  cameraFov = 38,
  cameraAzimuth = 32,
  cameraElevation = 9,
  rotationAmplitude = 6.5,
  rotationSpeed = 0.68,
  floatAmplitude,
  floatSpeed = 1.05,
  interactive = true,
  autoAnimate = true,
  intro = true,
  debugControls = false,
  pointer,
  reducedMotion,
  onReady,
}: BookSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const coverTexture = useTexture(cover)
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)

  useLayoutEffect(() => {
    // BoxGeometry's front face already maps u left-to-right and v bottom-to-top, so the default
    // flipY reads the artwork upright and unmirrored — no UV or rotation correction needed.
    coverTexture.colorSpace = THREE.SRGBColorSpace
    coverTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), MAX_ANISOTROPY)
    coverTexture.minFilter = THREE.LinearMipmapLinearFilter
    coverTexture.magFilter = THREE.LinearFilter
    coverTexture.needsUpdate = true
  }, [coverTexture, gl])

  const image = coverTexture.image as { width: number; height: number } | undefined
  const aspect = image && image.height > 0 ? image.width / image.height : 1
  const bookHeight = height ?? width / aspect
  const bookDepth = depth ?? width * 0.07
  const bookRadius = radius ?? bookDepth * 0.25
  const float = floatAmplitude ?? width * 0.038

  const cameraPosition = useMemo(() => {
    const direction = new THREE.Vector3(
      Math.sin(cameraAzimuth * DEG) * Math.cos(cameraElevation * DEG),
      Math.sin(cameraElevation * DEG),
      Math.cos(cameraAzimuth * DEG) * Math.cos(cameraElevation * DEG),
    )

    const compact = size.width < 768
    const margin = compact ? FIT_MARGIN_COMPACT : FIT_MARGIN
    const halfWidth = (width / 2) * (compact ? 1.12 : 1.2)
    const halfHeight = bookHeight / 2 + float
    const halfDepth = Math.max(bookDepth / 2, compact ? width * 0.28 : width * 0.42)
    const bottomPad = compact ? width * 0.08 : width * 0.12
    const corners: THREE.Vector3[] = []
    for (const x of [-halfWidth, halfWidth]) {
      for (const y of [-(halfHeight + bottomPad), halfHeight]) {
        for (const z of [-halfDepth, halfDepth]) {
          corners.push(new THREE.Vector3(x, y, z))
        }
      }
    }

    const distance = computeCameraDistance({
      corners,
      direction,
      fov: cameraFov,
      aspect: size.width / size.height,
      margin,
    })

    return direction.multiplyScalar(distance).toArray() as [number, number, number]
  }, [
    cameraAzimuth,
    cameraElevation,
    cameraFov,
    width,
    bookHeight,
    bookDepth,
    float,
    size.width,
    size.height,
  ])

  useLayoutEffect(() => {
    const camera = cameraRef.current
    if (!camera) return

    camera.lookAt(ORIGIN)
    camera.updateProjectionMatrix()
  }, [cameraPosition])

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={cameraFov}
        position={cameraPosition}
        near={0.1}
        far={100}
      />
      <StudioLighting />
      <Book
        coverTexture={coverTexture}
        width={width}
        height={bookHeight}
        depth={bookDepth}
        radius={bookRadius}
        spineSide={spineSide}
        rotationAmplitude={rotationAmplitude}
        rotationSpeed={rotationSpeed}
        floatAmplitude={float}
        floatSpeed={floatSpeed}
        interactive={interactive && !reducedMotion && !debugControls}
        autoAnimate={autoAnimate && !reducedMotion}
        intro={intro && !reducedMotion}
        pointer={pointer}
      />
      <FirstFrameProbe onReady={onReady} />
      {debugControls && <OrbitControls makeDefault enablePan={false} />}
    </>
  )
}

/**
 * Anything that goes wrong below the Canvas — no WebGL context, a shader that refuses to link, a
 * texture that 404s — must not take the cover off the page, so it degrades to the poster instead
 * of unmounting into nothing.
 */
class SceneBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[EbookCover3D] falling back to the flat cover:', error)
    this.props.onFail()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function EbookCover3D({ className, cover, poster, ...props }: EbookCover3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<PointerTarget>({ x: 0, y: 0, inside: false })
  const reducedMotion = usePrefersReducedMotion()
  const onScreen = useActiveOnScreen(containerRef)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointer.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    pointer.current.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
    pointer.current.inside = true
  }

  const handlePointerLeave = () => {
    pointer.current.inside = false
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <img
        src={poster ?? cover}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
        style={{ opacity: ready ? 0 : 1 }}
      />
      {!failed && (
        <SceneBoundary onFail={handleFail}>
          <Canvas
            flat
            dpr={[1, MAX_DPR]}
            frameloop={onScreen ? 'always' : 'never'}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              powerPreference: 'high-performance',
            }}
            onCreated={({ gl }) => {
              // A lost context leaves a frozen or blank canvas; the poster has to come back.
              gl.domElement.addEventListener('webglcontextlost', (event) => {
                event.preventDefault()
                setReady(false)
              })
              gl.domElement.addEventListener('webglcontextrestored', () => setReady(true))
            }}
            className="!absolute inset-0 transition-opacity duration-500"
            style={{ background: 'transparent', opacity: ready ? 1 : 0 }}
          >
            <Suspense fallback={null}>
              <BookScene
                {...props}
                cover={cover}
                pointer={pointer}
                reducedMotion={reducedMotion}
                onReady={handleReady}
              />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  )
}

export default EbookCover3D
