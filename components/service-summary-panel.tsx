"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFormContext } from "@/context/FormContext"
import { servicesData } from "@/data/servicesData"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, ChevronUp, ShoppingCart, PhoneIcon as WhatsApp, X, Edit } from "lucide-react"
import { serviceIcons } from "@/lib/service-icons"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ServiceSummaryPanelProps {
  onSendToSales: () => void
}

export const ServiceSummaryPanel = ({ onSendToSales }: ServiceSummaryPanelProps) => {
  const { formState } = useFormContext()
  const { selectedServices } = formState
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close panel when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMobile && isExpanded && !target.closest(".summary-panel")) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, isExpanded])

  if (selectedServices.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile floating button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-center relative"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-indigo-600 text-xs sm:text-sm font-bold flex items-center justify-center shadow-sm">
              {selectedServices.length}
            </span>
          </button>
        </div>
      )}

      {/* Summary panel */}
      <AnimatePresence>
        {(!isMobile || isExpanded) && (
          <motion.div
            initial={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, x: 100 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
            exit={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, x: 100 }}
            transition={{ type: "spring", bounce: 0.1 }}
            className={cn(
              "summary-panel fixed z-40 bg-white dark:bg-slate-900 shadow-2xl",
              isMobile
                ? "left-3 right-3 bottom-3 rounded-2xl max-h-[80vh] overflow-hidden"
                : "top-24 bottom-6 right-6 w-80 rounded-2xl overflow-hidden",
            )}
          >
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">Selected Services</h3>
                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full">
                  {selectedServices.length}
                </span>
              </div>

              {isMobile && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="overflow-y-auto p-3 sm:p-4" style={{ maxHeight: isMobile ? "50vh" : "calc(100% - 130px)" }}>
              <AnimatePresence initial={false}>
                {selectedServices.map((selectedService) => {
                  const serviceData = servicesData.find((s) => s.id === selectedService.id)
                  if (!serviceData) return null

                  const Icon = serviceIcons[serviceData.id] || serviceIcons.default

                  return (
                    <ServiceSummaryItem
                      key={selectedService.id}
                      selectedService={selectedService}
                      serviceData={serviceData}
                      Icon={Icon}
                    />
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onSendToSales}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-10"
              >
                <WhatsApp className="w-4 h-4" />
                <span className="whitespace-nowrap">Send to Sales Team</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface ServiceSummaryItemProps {
  selectedService: any
  serviceData: any
  Icon: React.ComponentType<any>
}

const ServiceSummaryItem = ({ selectedService, serviceData, Icon }: ServiceSummaryItemProps) => {
  const { toggleService } = useFormContext()
  const [isExpanded, setIsExpanded] = useState(false)

  // Count selected features
  const totalSelectedFeatures = selectedService.selectedSubServices.reduce((total, subService) => {
    return total + subService.selectedFeatures.length
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-slate-800 dark:text-white truncate pr-2">{serviceData.name}</h4>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => (window.location.href = `#${serviceData.id}`)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0"
                  title="Edit service"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleService(selectedService.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0"
                  title="Remove service"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{selectedService.selectedSubServices.length} components</span>
              <span>•</span>
              <span>{totalSelectedFeatures} features</span>
            </div>

            {selectedService.selectedSubServices.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      <span>Hide details</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>Show details</span>
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="space-y-3">
                        {selectedService.selectedSubServices.map((selectedSubService) => {
                          const subServiceData = serviceData.subServices.find((s) => s.id === selectedSubService.id)
                          if (!subServiceData) return null

                          return (
                            <div key={selectedSubService.id} className="pl-1">
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-indigo-500" />
                                {subServiceData.name}
                              </div>

                              {selectedSubService.selectedFeatures.length > 0 && (
                                <div className="pl-5 space-y-1.5">
                                  {selectedSubService.selectedFeatures.map((selectedFeature) => {
                                    const featureData = subServiceData.features.find((f) => f.id === selectedFeature.id)
                                    if (!featureData) return null

                                    return (
                                      <div key={selectedFeature.id}>
                                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                          <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                          {featureData.name}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
