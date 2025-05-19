"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFormContext } from "@/context/FormContext"
import { servicesData } from "@/data/servicesData"
import { cn } from "@/lib/utils"
import { Check, ChevronLeft, Smartphone, PhoneIcon as WhatsApp, X } from "lucide-react"

interface WhatsAppCheckoutProps {
  isOpen: boolean
  onClose: () => void
  salesTeamPhone: string
}

export const WhatsAppCheckout = ({ isOpen, onClose, salesTeamPhone }: WhatsAppCheckoutProps) => {
  const { formState } = useFormContext()
  const { selectedServices } = formState
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Find the full service data for each selected service
  const servicesWithDetails = selectedServices
    .map((selected) => {
      const serviceData = servicesData.find((s) => s.id === selected.id)
      return {
        ...serviceData,
        selectedSubcategories: selected.subcategories,
        selectedOptions: selected.options,
      }
    })
    .filter(Boolean)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!contactInfo.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatWhatsAppMessage = () => {
    let message = `*New Service Request from ${contactInfo.name}*\n\n`
    message += `*Contact Information:*\n`
    message += `Name: ${contactInfo.name}\n`
    message += `Email: ${contactInfo.email}\n`
    message += `Phone: ${contactInfo.phone}\n\n`

    if (contactInfo.message) {
      message += `*Additional Message:*\n${contactInfo.message}\n\n`
    }

    message += `*Selected Services:*\n`

    servicesWithDetails.forEach((service, index) => {
      message += `${index + 1}. ${service.name}\n`

      if (service.selectedSubcategories?.length > 0) {
        message += `   *Options:*\n`
        service.selectedSubcategories.forEach((subId) => {
          const subcategory = service.subcategories?.find((s) => s.id === subId)
          if (subcategory) {
            message += `   - ${subcategory.name}\n`
          }
        })
      }

      if (Object.keys(service.selectedOptions || {}).length > 0) {
        message += `   *Choices:*\n`
        Object.entries(service.selectedOptions || {}).forEach(([optionId, choiceId]) => {
          const option = service.options?.find((o) => o.id === optionId)
          const choice = option?.choices.find((c) => c.id === choiceId)
          if (option && choice) {
            message += `   - ${option.name}: ${choice.name}\n`
          }
        })
      }

      message += "\n"
    })

    message += `*Sent from your website*`

    return encodeURIComponent(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const whatsappMessage = formatWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${salesTeamPhone}?text=${whatsappMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-28 sm:h-32 bg-gradient-to-r from-green-500 to-emerald-600 opacity-90" />

              <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 pb-2 sm:pb-4 flex justify-between items-start z-10">
                <button
                  onClick={onClose}
                  className="rounded-full w-8 h-8 flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={onClose}
                  className="rounded-full w-8 h-8 flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-4 flex items-center gap-3 sm:gap-4 z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <WhatsApp className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                <div className="text-white min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold">Send to Sales Team</h2>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">
                    Complete your information to send your selections to our sales team via WhatsApp
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-28 sm:h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-0" />
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactInfo.name}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all",
                        errors.name ? "border-red-300 dark:border-red-700" : "border-slate-300 dark:border-slate-700",
                      )}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all",
                        errors.email ? "border-red-300 dark:border-red-700" : "border-slate-300 dark:border-slate-700",
                      )}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all",
                        errors.phone ? "border-red-300 dark:border-red-700" : "border-slate-300 dark:border-slate-700",
                      )}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactInfo.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-medium text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-green-500" />
                    Selected Services Summary
                  </h3>

                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {servicesWithDetails.map((service) => (
                      <div key={service.id} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300">{service.name}</p>
                          {service.selectedSubcategories?.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {service.selectedSubcategories.length} options selected
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <WhatsApp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Send to Sales Team via WhatsApp</span>
              </button>

              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                Your information will be sent directly to our sales team who will contact you shortly.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}