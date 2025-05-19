"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useFormContext } from "../context/FormContext"
import { ServicesSection } from "./services-section"
import { ServiceSummary } from "./service-summary"
import { CategoryTabs } from "./category-tabs"
import { servicesData } from "../data/servicesData"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

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

export const ServiceSelectionFlow: React.FC = () => {
  const { formState } = useFormContext()
  const { selectedServices } = formState
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [showSummary, setShowSummary] = useState(false)

  const categories = groupServicesByCategory()
  const categoryNames = Object.keys(categories)

  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0])
    }
  }, [categoryNames, activeCategory])

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Select Your Services</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Choose the services you need and customize your options. You can review your selections at any time.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <CategoryTabs
            categories={categoryNames}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <ServicesSection services={categories[activeCategory] || []} />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = categoryNames.indexOf(activeCategory)
                if (currentIndex > 0) {
                  setActiveCategory(categoryNames[currentIndex - 1])
                }
              }}
              disabled={categoryNames.indexOf(activeCategory) === 0}
              className="px-4 py-2 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              onClick={() => {
                const currentIndex = categoryNames.indexOf(activeCategory)
                if (currentIndex < categoryNames.length - 1) {
                  setActiveCategory(categoryNames[currentIndex + 1])
                } else {
                  setShowSummary(true)
                }
              }}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {categoryNames.indexOf(activeCategory) === categoryNames.length - 1 ? (
                <>
                  Review Selections <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next Category <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:w-1/4">
          <ServiceSummary
            selectedServices={selectedServices}
            showSummary={showSummary}
            onCloseSummary={() => setShowSummary(false)}
          />
        </div>
      </div>
    </div>
  )
}
