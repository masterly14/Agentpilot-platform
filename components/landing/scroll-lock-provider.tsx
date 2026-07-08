"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type ScrollLockContextValue = {
  isLocked: boolean
  unlock: () => void
}

const ScrollLockContext = createContext<ScrollLockContextValue | null>(null)

export function useScrollLock() {
  const context = useContext(ScrollLockContext)
  if (!context) {
    throw new Error("useScrollLock must be used within ScrollLockProvider")
  }
  return context
}

export function ScrollLockProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true)

  const unlock = useCallback(() => {
    setIsLocked(false)
  }, [])

  useEffect(() => {
    if (!isLocked) return

    const html = document.documentElement
    const body = document.body

    html.classList.add("landing-scroll-locked")
    body.classList.add("landing-scroll-locked")

    const preventScroll = (event: Event) => {
      event.preventDefault()
    }

    const preventScrollKeys = (event: KeyboardEvent) => {
      const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"]
      if (scrollKeys.includes(event.key)) {
        event.preventDefault()
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0)
    }

    window.addEventListener("wheel", preventScroll, { passive: false })
    window.addEventListener("touchmove", preventScroll, { passive: false })
    window.addEventListener("keydown", preventScrollKeys)
    window.addEventListener("scroll", resetScroll)

    return () => {
      html.classList.remove("landing-scroll-locked")
      body.classList.remove("landing-scroll-locked")
      window.removeEventListener("wheel", preventScroll)
      window.removeEventListener("touchmove", preventScroll)
      window.removeEventListener("keydown", preventScrollKeys)
      window.removeEventListener("scroll", resetScroll)
    }
  }, [isLocked])

  return (
    <ScrollLockContext.Provider value={{ isLocked, unlock }}>
      {children}
    </ScrollLockContext.Provider>
  )
}
