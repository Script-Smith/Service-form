"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Service } from "../types/types"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormContext } from "../context/FormContext"
import { servicesData } from "../data/servicesData"

interface ServiceSummaryProps {
  selectedServices: Array<{ id: string; subcategories: string[]; options: Record<string, string> }>
  showSummary: boolean
  onCloseSummary: () => void
}

export const ServiceSummary: React.FC<ServiceSummaryProps> = ({ selectedServices, showSummary, onCloseSummary }) => {
  const { getServiceState } = useFormContext()
  const [isSticky, setIsSticky] = useState(false)

  // Find the full service data for each selected service
  const servicesWithDetails = selectedServices
    .map((selected) => {
      const serviceData = servicesData.find((s) => s.id === selected.id)
      const serviceState = getServiceState(selected.id)

      return {
        ...serviceData,
        selectedSubcategories: serviceState?.subcategories || [],
        selectedOptions: serviceState?.options || {},
      }
    })
    .filter(Boolean) as Array<
    Service & {
      selectedSubcategories: string[]
      selectedOptions: Record<string, string>
    }
  >

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300",
        isSticky ? "lg:sticky lg:top-6" : "",
      )}
    >
      <div className="p-5 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-medium text-slate-800">Your Selections</h3>
        <div className="flex items-center gap-1.5">
          <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-0.5 rounded-full">
            {selectedServices.length}
          </span>
        </div>
      </div>

      <div className="p-5">
        {selectedServices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No services selected yet</p>
            <p className="text-sm text-slate-400 mt-1">Select services to see them here</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {servicesWithDetails.map((service) => (
              <li key={service.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{service.name}</h4>

                    {service.selectedSubcategories.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-slate-500 mb-1">Options:</h5>
                        <ul className="space-y-1">
                          {service.selectedSubcategories.map((subId) => {
                            const subcategory = service.subcategories?.find((s) => s.id === subId)
                            return subcategory ? (
                              <li key={subId} className="text-sm text-slate-600 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                                {subcategory.name}
                              </li>
                            ) : null
                          })}
                        </ul>
                      </div>
                    )}

                    {Object.keys(service.selectedOptions).length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-slate-500 mb-1">Choices:</h5>
                        <ul className="space-y-1">
                          {Object.entries(service.selectedOptions).map(([optionId, choiceId]) => {
                            const option = service.options?.find((o) => o.id === optionId)
                            const choice = option?.choices.find((c) => c.id === choiceId)
                            return option && choice ? (
                              <li key={optionId} className="text-sm text-slate-600 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                                {option.name}: <span className="font-medium">{choice.name}</span>
                              </li>
                            ) : null
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-5 border-t border-slate-200">
        <button
          className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          disabled={selectedServices.length === 0}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onCloseSummary}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Review Your Selections</h2>
                <button onClick={onCloseSummary} className="text-slate-500 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {selectedServices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No services selected yet</p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {servicesWithDetails.map((service) => (
                      <li key={service.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                        <h3 className="font-medium text-lg text-slate-800 mb-3">{service.name}</h3>

                        {service.selectedSubcategories.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Selected Options:</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                              {service.selectedSubcategories.map((subId) => {
                                const subcategory = service.subcategories?.find((s) => s.id === subId)
                                return subcategory ? (
                                  <li key={subId} className="text-sm text-slate-600 flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    {subcategory.name}
                                  </li>
                                ) : null
                              })}
                            </ul>
                          </div>
                        )}

                        {Object.keys(service.selectedOptions).length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Selected Choices:</h4>
                            <ul className="space-y-3">
                              {Object.entries(service.selectedOptions).map(([optionId, choiceId]) => {
                                const option = service.options?.find((o) => o.id === optionId)
                                const choice = option?.choices.find((c) => c.id === choiceId)
                                return option && choice ? (
                                  <li key={optionId}>
                                    <span className="text-sm text-slate-500">{option.name}:</span>
                                    <span className="ml-2 text-sm font-medium text-slate-700">{choice.name}</span>
                                  </li>
                                ) : null
                              })}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end">
                <button
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  disabled={selectedServices.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
