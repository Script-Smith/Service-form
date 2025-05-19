"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Send, ChevronDown } from "lucide-react"
import type { Service } from "@/data/services"
import { cn } from "@/lib/utils"

interface FloatingCartProps {
  selectedServices: string[]
  services: Service[]
  onSendToSales: () => void
}

export function FloatingCart({ selectedServices, services, onSendToSales }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Show cart when services are selected
  useEffect(() => {
    if (selectedServices.length > 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
      setIsOpen(false)
    }
  }, [selectedServices])

  // Get selected service details
  const selectedServiceDetails = services.filter((service) => selectedServices.includes(service.id))

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium text-ampl-black">Selected Services</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {selectedServiceDetails.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 hover:bg-gray-50 rounded-md flex items-start gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-ampl-green mt-2" />
                  <div>
                    <p className="font-medium text-sm text-ampl-black">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={onSendToSales}
                className="w-full py-2 bg-ampl-green hover:bg-ampl-green/90 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={16} />
                <span>Send to Sales Team</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "flex items-center gap-2 rounded-full shadow-lg cursor-pointer transition-all",
          isMinimized ? "bg-white border border-gray-200 pr-3" : "bg-ampl-green text-white",
        )}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center",
            isMinimized ? "bg-ampl-green text-white" : "",
          )}
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false)
              setIsOpen(true)
            } else {
              setIsOpen(!isOpen)
            }
          }}
        >
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-1 bg-ampl-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {selectedServices.length}
          </span>
        </motion.div>

        {!isMinimized && (
          <>
            <span className="font-medium pr-1" onClick={() => setIsOpen(!isOpen)}>
              {selectedServices.length} {selectedServices.length === 1 ? "service" : "services"}
            </span>
            <button
              onClick={() => setIsMinimized(true)}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronDown size={14} />
            </button>
          </>
        )}

        {isMinimized && (
          <span
            className="font-medium text-ampl-black"
            onClick={() => {
              setIsMinimized(false)
              setIsOpen(true)
            }}
          >
            {selectedServices.length} selected
          </span>
        )}
      </motion.div>
    </div>
  )
}
