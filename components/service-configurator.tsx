"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Service } from "@/types/types"
import { useFormContext } from "@/context/FormContext"
import { cn } from "@/lib/utils"
import { Check, ChevronLeft, ChevronRight, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { serviceIcons } from "@/lib/service-icons"

interface ServiceConfiguratorProps {
  service: Service
  onClose: () => void
  onNavigateToService?: (serviceId: string) => void
  allServices?: Service[]
  currentCategoryName?: string
}

export const ServiceConfigurator = ({
  service,
  onClose,
  onNavigateToService,
  allServices = [],
  currentCategoryName = "",
}: ServiceConfiguratorProps) => {
  const { getServiceState, toggleSubcategory, updateServiceOption, toggleService } = useFormContext()
  const serviceState = getServiceState(service.id)
  const isSelected = !!serviceState
  const [activeTab, setActiveTab] = useState<"options" | "details">("options")
  const Icon = serviceIcons[service.id] || serviceIcons.default
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [showServiceNav, setShowServiceNav] = useState(false)

  // Find current service index and next service
  const currentIndex = allServices.findIndex((s) => s.id === service.id)
  const hasNextService = currentIndex < allServices.length - 1
  const hasPrevService = currentIndex > 0
  const nextService = hasNextService ? allServices[currentIndex + 1] : null
  const prevService = hasPrevService ? allServices[currentIndex - 1] : null

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Handle arrow keys for navigation
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && hasNextService && onNavigateToService) {
        onNavigateToService(allServices[currentIndex + 1].id)
      } else if (e.key === "ArrowLeft" && hasPrevService && onNavigateToService) {
        onNavigateToService(allServices[currentIndex - 1].id)
      }
    }

    window.addEventListener("keydown", handleArrowKeys)
    return () => window.removeEventListener("keydown", handleArrowKeys)
  }, [onNavigateToService, allServices, currentIndex, hasNextService, hasPrevService])

  // Check if content is scrollable
  useEffect(() => {
    const checkScroll = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = contentRef.current
        setShowScrollIndicator(scrollHeight > clientHeight)

        // Check if scrolled to bottom
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 20
        setIsScrolledToBottom(isAtBottom)
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("scroll", checkScroll)
    }

    return () => {
      window.removeEventListener("resize", checkScroll)
      if (contentElement) {
        contentElement.removeEventListener("scroll", checkScroll)
      }
    }
  }, [activeTab, service])

  const handleNavigateToService = (serviceId: string) => {
    if (onNavigateToService) {
      onNavigateToService(serviceId)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", bounce: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90" />

          <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 pb-2 sm:pb-4 flex justify-between items-start z-10">
            <button
              onClick={hasPrevService && onNavigateToService ? () => handleNavigateToService(prevService!.id) : onClose}
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
              <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="text-white min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold truncate">{service.name}</h2>
                {currentCategoryName && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{currentCategoryName}</span>
                )}
              </div>
              {service.description && <p className="text-white/80 text-sm mt-1 line-clamp-2">{service.description}</p>}
            </div>
          </div>

          {allServices.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-center pb-2 px-6 z-10">
              <div className="flex gap-1.5">
                {allServices.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => handleNavigateToService(s.id)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === currentIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60",
                    )}
                    aria-label={`Go to ${s.name}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowServiceNav(!showServiceNav)}
                className="text-white/80 hover:text-white text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 transition-colors"
              >
                All Services
                {showServiceNav ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-0" />

          {/* Service Navigation Dropdown */}
          <AnimatePresence>
            {showServiceNav && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-slate-800 shadow-lg rounded-b-xl border-t border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto"
              >
                <div className="p-2">
                  {allServices.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        handleNavigateToService(s.id)
                        setShowServiceNav(false)
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors",
                        s.id === service.id
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          s.id === service.id
                            ? "bg-indigo-100 dark:bg-indigo-800/30 text-indigo-600 dark:text-indigo-300"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {React.createElement(serviceIcons[s.id] || serviceIcons.default, { className: "w-4 h-4" })}
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        {s.description && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                            {s.description}
                          </div>
                        )}
                      </div>
                      {s.id === service.id && (
                        <div className="ml-auto">
                          <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 sm:px-6 pb-2 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-x-auto hide-scrollbar">
          <div className="flex gap-4 sm:gap-6 min-w-max">
            <button
              onClick={() => setActiveTab("options")}
              className={cn(
                "py-3 font-medium relative whitespace-nowrap",
                activeTab === "options"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
              )}
            >
              Customize Options
              {activeTab === "options" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "py-3 font-medium relative whitespace-nowrap",
                activeTab === "details"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
              )}
            >
              Service Details
              {activeTab === "details" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                />
              )}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        {showScrollIndicator && (
          <div className="absolute top-[13.5rem] left-1/2 transform -translate-x-1/2 z-20 text-slate-400 dark:text-slate-500 animate-bounce">
            <ChevronDown className="w-5 h-5" />
          </div>
        )}

        <div ref={contentRef} className="p-4 sm:p-6 overflow-y-auto flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === "options" && (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isSelected && (
                  <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    <p className="text-sm">Select this service to customize options</p>
                  </div>
                )}

                {service.subcategories && service.subcategories.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-3 sm:mb-4">Select Options</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {service.subcategories.map((subcategory, index) => (
                        <motion.div
                          key={subcategory.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={cn(
                            "relative p-3 rounded-xl border transition-all cursor-pointer",
                            isSelected && serviceState?.subcategories.includes(subcategory.id)
                              ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800",
                          )}
                          onClick={() => {
                            if (isSelected) {
                              toggleSubcategory(service.id, subcategory.id)
                            } else {
                              toggleService(service.id)
                              setTimeout(() => {
                                toggleSubcategory(service.id, subcategory.id)
                              }, 100)
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0",
                                isSelected && serviceState?.subcategories.includes(subcategory.id)
                                  ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                                  : "border border-slate-300 dark:border-slate-700",
                              )}
                            >
                              {isSelected && serviceState?.subcategories.includes(subcategory.id) && (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "font-medium",
                                isSelected && serviceState?.subcategories.includes(subcategory.id)
                                  ? "text-indigo-700 dark:text-indigo-300"
                                  : "text-slate-700 dark:text-slate-300",
                              )}
                            >
                              {subcategory.name}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {service.options &&
                  service.options.map((option, optionIndex) => (
                    <div key={option.id} className="mb-8 last:mb-0">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">{option.name}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {option.choices.map((choice, choiceIndex) => (
                          <motion.div
                            key={choice.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: choiceIndex * 0.05 }}
                            className={cn(
                              "relative p-4 rounded-xl border transition-all cursor-pointer",
                              isSelected && serviceState?.options[option.id] === choice.id
                                ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800",
                            )}
                            onClick={() => {
                              if (isSelected) {
                                updateServiceOption(service.id, option.id, choice.id)
                              } else {
                                toggleService(service.id)
                                setTimeout(() => {
                                  updateServiceOption(service.id, option.id, choice.id)
                                }, 100)
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  "font-medium",
                                  isSelected && serviceState?.options[option.id] === choice.id
                                    ? "text-indigo-700 dark:text-indigo-300"
                                    : "text-slate-700 dark:text-slate-300",
                                )}
                              >
                                {choice.name}
                              </span>

                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                                  isSelected && serviceState?.options[option.id] === choice.id
                                    ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                                    : "border border-slate-300 dark:border-slate-700",
                                )}
                              >
                                {isSelected && serviceState?.options[option.id] === choice.id && (
                                  <Check className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}

            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="prose prose-slate dark:prose-invert max-w-none"
              >
                <h3>About {service.name}</h3>
                <p>
                  {service.description ||
                    `Our ${service.name} service provides comprehensive solutions tailored to your specific needs.`}
                </p>

                <h4>Key Benefits</h4>
                <ul>
                  {service.subcategories?.map((subcategory) => (
                    <li key={subcategory.id}>{subcategory.name}</li>
                  ))}
                  {!service.subcategories?.length && (
                    <>
                      <li>Customized solutions for your specific needs</li>
                      <li>Expert team with years of experience</li>
                      <li>Timely delivery and professional support</li>
                    </>
                  )}
                </ul>

                <h4>Process</h4>
                <ol>
                  <li>Initial consultation to understand your requirements</li>
                  <li>Proposal and planning phase</li>
                  <li>Implementation and development</li>
                  <li>Testing and quality assurance</li>
                  <li>Delivery and ongoing support</li>
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {nextService && (
          <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                  {React.createElement(serviceIcons[nextService.id] || serviceIcons.default, { className: "w-4 h-4" })}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Next Service</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
                    {nextService.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToService(nextService.id)}
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium whitespace-nowrap"
              >
                Configure <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0 sticky bottom-0 bg-white dark:bg-slate-900 shadow-md">
          <button
            onClick={() => {
              if (isSelected) {
                toggleService(service.id)
              }
              onClose()
            }}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          >
            {isSelected ? "Remove" : "Cancel"}
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {hasPrevService && onNavigateToService && (
              <button
                onClick={() => handleNavigateToService(prevService!.id)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                if (!isSelected) {
                  toggleService(service.id)
                }

                if (hasNextService && onNavigateToService) {
                  handleNavigateToService(nextService!.id)
                } else {
                  onClose()
                }
              }}
              className={cn(
                "h-10 px-4 sm:px-6 rounded-xl font-medium transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap",
                isSelected
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg",
              )}
            >
              {isSelected
                ? hasNextService && onNavigateToService
                  ? "Save & Next"
                  : "Done"
                : hasNextService && onNavigateToService
                  ? "Add & Next"
                  : "Add Service"}
              {hasNextService && onNavigateToService && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
