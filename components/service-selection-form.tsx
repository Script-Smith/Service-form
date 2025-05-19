"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { services } from "@/data/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ServiceCard3D } from "./service-card-3d"
import { FloatingCart } from "./floating-cart"
import { SuccessModal } from "./success-modal"
import { WhatsAppCheckout } from "./whatsapp-checkout"
import { Search, Send, ChevronDown } from "lucide-react"
import Image from "next/image"

export function ServiceSelectionForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showWhatsAppCheckout, setShowWhatsAppCheckout] = useState(false)

  const { toast } = useToast()

  // Extract unique categories
  const categories = Array.from(new Set(services.map((service) => service.category)))

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory ? service.category === activeCategory : true
    return matchesSearch && matchesCategory
  })

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  // Replace with your sales team's WhatsApp number (international format without + or spaces)
  const salesTeamPhone = "916260852317"

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-66B4egwxfsfvLnJdjcziN79vFp5aRZ.png"
            alt="AMPL Logo"
            width={240}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-ampl-black mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ampl-green to-ampl-black">
              Select Your Services
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the services you're interested in and our team will create a customized solution to amplify your
            digital presence.
          </p>
        </motion.div>

        {/* Search and filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-ampl-green focus:ring-ampl-green"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap ${!activeCategory ? "bg-ampl-green text-white border-ampl-green" : ""}`}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap ${activeCategory === category ? "bg-ampl-green text-white border-ampl-green" : ""}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Services grid */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ServiceCard3D
                    service={service}
                    isSelected={selectedServices.includes(service.id)}
                    onToggle={() => handleServiceToggle(service.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory(null)
                }}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Call to action when no services selected */}
        {selectedServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8"
          >
            <p className="text-gray-500 mb-4">Select services to continue</p>
            <div className="animate-bounce">
              <ChevronDown size={24} className="text-ampl-green mx-auto" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating cart */}
      <FloatingCart
        selectedServices={selectedServices}
        services={services}
        onSendToSales={() => setShowWhatsAppCheckout(true)}
      />

      {/* WhatsApp checkout modal */}
      <WhatsAppCheckout
        isOpen={showWhatsAppCheckout}
        onClose={() => setShowWhatsAppCheckout(false)}
        salesTeamPhone={salesTeamPhone}
      />

      {/* Success modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSelectedServices([])
        }}
      />

      <Toaster />
    </div>
  )
}