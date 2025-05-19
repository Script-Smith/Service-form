"use client"

import type React from "react"
import type { Service } from "../types/types"
import { ServiceCard } from "./service-card"
import { useFormContext } from "../context/FormContext"
import { motion } from "framer-motion"

interface ServicesSectionProps {
  services: Service[]
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const { formState, toggleService } = useFormContext()
  const { selectedServices } = formState

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isSelected={selectedServices.some((s) => s.id === service.id)}
          onToggle={() => toggleService(service.id)}
        />
      ))}
    </motion.div>
  )
}
