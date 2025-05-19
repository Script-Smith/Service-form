"use client"

import { useCallback, useEffect, useRef } from "react"
import ReactCanvasConfetti from "react-canvas-confetti"
import type confetti from "canvas-confetti"

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null)

  const getInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance
  }, [])

  const makeShot = useCallback((particleRatio: number, opts: confetti.Options) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7, x: 0.5 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ["#33A853", "#FFCC00", "#E41E26", "#4285F4"],
    })

    makeShot(0.2, {
      spread: 60,
      colors: ["#33A853", "#FFCC00", "#E41E26", "#4285F4"],
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ["#33A853", "#FFCC00", "#E41E26", "#4285F4"],
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ["#33A853", "#FFCC00", "#E41E26", "#4285F4"],
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ["#33A853", "#FFCC00", "#E41E26", "#4285F4"],
    })

    setTimeout(() => {
      onComplete && onComplete()
    }, 1500)
  }, [makeShot, onComplete])

  useEffect(() => {
    if (active) {
      fire()
    }
  }, [active, fire])

  return (
    <ReactCanvasConfetti
      refConfetti={getInstance}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    />
  )
}
