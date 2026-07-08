function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function scrollToElement(target: HTMLElement, duration = 900) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) {
    target.scrollIntoView({ behavior: "auto", block: "start" })
    return
  }

  const start = window.scrollY
  const end = target.getBoundingClientRect().top + window.scrollY
  const distance = end - start
  let startTime: number | null = null

  function step(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, start + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function scrollToSection(targetId: string, duration = 900) {
  const target = document.getElementById(targetId)
  if (!target) return
  scrollToElement(target, duration)
}
