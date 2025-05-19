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
import { Search, Send, ChevronDown } from "lucide-react"
import Image from "next/image"

export function ServiceSelectionForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Show success modal
    setShowSuccessModal(true)

    // Reset form
    setContactInfo({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  // Auto-scroll to contact form when services are selected
  useEffect(() => {
    if (selectedServices.length > 0 && !showContactForm) {
      setShowContactForm(true)
    }
  }, [selectedServices, showContactForm])

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

        {/* Contact form */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ampl-black flex items-center gap-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-ampl-green text-white text-center font-bold">
                      2
                    </span>
                    Your Information
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowContactForm(false)} className="text-gray-400">
                    <ChevronDown size={20} />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-ampl-black">
                        Full Name <span className="text-ampl-red">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={contactInfo.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="border-gray-200 focus:border-ampl-green focus:ring-ampl-green"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-ampl-black">
                        Email Address <span className="text-ampl-red">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="border-gray-200 focus:border-ampl-green focus:ring-ampl-green"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-ampl-black">
                        Phone Number <span className="text-ampl-red">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        required
                        className="border-gray-200 focus:border-ampl-green focus:ring-ampl-green"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-ampl-black">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={contactInfo.company}
                        onChange={handleInputChange}
                        placeholder="ACME Inc."
                        className="border-gray-200 focus:border-ampl-green focus:ring-ampl-green"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-ampl-black">
                      Additional Information
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactInfo.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your project or specific requirements..."
                      className="border-gray-200 focus:border-ampl-green focus:ring-ampl-green min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || selectedServices.length === 0}
                        className="bg-ampl-green hover:bg-ampl-green/90 text-white px-8 py-6 text-lg rounded-md flex items-center gap-2"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                        {!isSubmitting && <Send size={18} />}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to action when no services selected */}
        {selectedServices.length === 0 && !showContactForm && (
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
        onSendToSales={() => {
          if (showContactForm) {
            // Scroll to form
            document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })
          } else {
            setShowContactForm(true)
            setTimeout(() => {
              document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })
            }, 100)
          }
        }}
      />

      {/* Success modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSelectedServices([])
          setShowContactForm(false)
        }}
      />

      <Toaster />
    </div>
  )
}
