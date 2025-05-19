"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ServiceCard } from "./service-card"
import { ServiceSummaryPanel } from "./service-summary-panel"
import { CategorySelector } from "./category-selector"
import { servicesData } from "@/data/servicesData"
import { useFormContext } from "@/context/FormContext"
import { cn } from "@/lib/utils"
import { ChevronRight, Sparkles, PhoneIcon as WhatsApp } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { WhatsAppCheckout } from "./whatsapp-checkout"
import { ServiceWizard } from "./service-wizard"
import Image from "next/image"

// Group services by category
const groupServicesByCategory = () => {
  const categories: Record<string, typeof servicesData> = {}

  servicesData.forEach((service) => {
    const category = service.category || "General"
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(service)
  })

  return categories
}

export const ServiceSelectionExperience = () => {
  const { formState } = useFormContext()
  const { selectedServices } = formState
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  const [showWhatsAppCheckout, setShowWhatsAppCheckout] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Replace with your sales team's WhatsApp number (international format without + or spaces)
  const salesTeamPhone = "916260852317"

  const categories = groupServicesByCategory()
  const categoryNames = Object.keys(categories)

  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0])
    }
  }, [categoryNames, activeCategory])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setShowWizard(true)
  }

  const handleCloseWizard = () => {
    setShowWizard(false)
    setSelectedServiceId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="fixed inset-0 bg-[url('/grid-pattern.png')] bg-center opacity-[0.02] pointer-events-none" />

      <header
        className={cn(
          "sticky top-0 z-30 w-full backdrop-blur-md transition-all duration-300",
          scrollPosition > 10 ? "bg-white/80 dark:bg-slate-950/80 shadow-sm" : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image src={"/logo.png"} alt="Logo" width={isMobile ? 120 : 200} height={isMobile ? 40 : 50} priority />

            {activeCategory && (
              <span className="hidden md:inline-block text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {activeCategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {selectedServices.length > 0 && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                  {selectedServices.length} selected
                </span>
              </div>
            )}

            {selectedServices.length > 0 ? (
              <button
                onClick={() => setShowWhatsAppCheckout(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 h-9"
              >
                <WhatsApp className="w-4 h-4" />
                <span className="whitespace-nowrap">Send to Sales</span>
              </button>
            ) : (
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 h-9">
                <span className="whitespace-nowrap">Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customize your experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Select Your Services
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Choose from our premium services and customize them to fit your needs perfectly.
            </p>
          </motion.div>

          <CategorySelector
            categories={categoryNames}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence mode="wait">
              {categories[activeCategory]?.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onSelect={() => handleServiceSelect(service.id)}
                  isSelected={selectedServices.some((s) => s.id === service.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {selectedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 sm:mt-12 text-center"
            >
              <button
                onClick={() => setShowWhatsAppCheckout(true)}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                <WhatsApp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Send Selections to Sales Team</span>
              </button>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 sm:mt-3">
                Our sales team will contact you to discuss your selected services
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <ServiceSummaryPanel onSendToSales={() => setShowWhatsAppCheckout(true)} />

      <ServiceWizard
        isOpen={showWizard && !!selectedServiceId}
        onClose={handleCloseWizard}
        serviceId={selectedServiceId || ""}
      />

      <WhatsAppCheckout
        isOpen={showWhatsAppCheckout}
        onClose={() => setShowWhatsAppCheckout(false)}
        salesTeamPhone={salesTeamPhone}
      />
    </div>
  )
}
