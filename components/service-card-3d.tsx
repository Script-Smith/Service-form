"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Service } from "@/data/services"

interface ServiceCard3DProps {
  service: Service
  isSelected: boolean
  onToggle: () => void
}

export function ServiceCard3D({ service, isSelected, onToggle }: ServiceCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // Mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for card rotation
  const rotateX = useSpring(useTransform(mouseY, [0, 300], [10, -10]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [0, 300], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  })

  // Handle mouse move on card to update rotation
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    mouseX.set(offsetX)
    mouseY.set(offsetY)
  }

  // Reset card rotation when mouse leaves
  function handleMouseLeave() {
    mouseX.set(150)
    mouseY.set(150)
    setHovered(false)
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Web Development": "bg-blue-100 text-blue-800",
      "Digital Marketing": "bg-purple-100 text-purple-800",
      Design: "bg-pink-100 text-pink-800",
      Analytics: "bg-orange-100 text-orange-800",
      Consulting: "bg-indigo-100 text-indigo-800",
      Support: "bg-teal-100 text-teal-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative h-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        "border shadow-lg hover:shadow-xl",
        isSelected ? "border-ampl-green bg-white" : "border-gray-200 bg-white hover:border-gray-300",
      )}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onToggle}
    >
      <motion.div
        className="relative w-full h-full p-5"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 3D floating elements */}
        <motion.div
          className={cn(
            "absolute top-3 right-3 w-12 h-12 rounded-full",
            "flex items-center justify-center",
            "transform -translate-z-20",
            isSelected ? "bg-ampl-green text-white" : "bg-gray-100 text-gray-400",
          )}
          style={{
            z: 20,
            translateZ: hovered ? 20 : 0,
            transition: "transform 0.3s ease-out",
          }}
        >
          <Checkbox
            checked={isSelected}
            className={cn(
              "h-5 w-5 pointer-events-none",
              isSelected ? "text-white data-[state=checked]:bg-transparent border-white" : "",
            )}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>

        <motion.div
          className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-ampl-yellow/10 transform -translate-z-10"
          style={{
            translateZ: hovered ? -20 : 0,
            transition: "transform 0.3s ease-out",
          }}
        />

        <motion.div
          className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-ampl-green/10 transform -translate-z-10"
          style={{
            translateZ: hovered ? -10 : 0,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <span className={cn("text-xs px-2 py-1 rounded-full inline-block mb-3", getCategoryColor(service.category))}>
            {service.category}
          </span>
          <h3 className="text-lg font-bold text-ampl-black mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm">{service.description}</p>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-ampl-green"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
