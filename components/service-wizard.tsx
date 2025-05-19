"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useFormContext } from "@/context/FormContext"
import { servicesData } from "@/data/servicesData"
import { serviceIcons } from "@/lib/service-icons"
import type { Service, SubService, ServiceFeature, ServiceOption } from "@/types/types"

interface ServiceWizardProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
}

export const ServiceWizard = ({ isOpen, onClose, serviceId }: ServiceWizardProps) => {
  const { toggleService, toggleSubService, toggleFeature, updateOption, getServiceState } = useFormContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Array<{ title: string; type: string; id: string }>>([])
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({})
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, Record<string, string>>>>({})
  const service = servicesData.find((s) => s.id === serviceId)
  const serviceState = getServiceState(serviceId)
  const Icon = service ? serviceIcons[service.id] || serviceIcons.default : null

  // Initialize steps and selections based on service data
  useEffect(() => {
    if (!service) return

    // First step is always service overview
    const wizardSteps = [{ title: "Service Overview", type: "overview", id: "overview" }]

    // Add a step for each subservice
    service.subServices.forEach((subService) => {
      wizardSteps.push({
        title: subService.name,
        type: "subService",
        id: subService.id,
      })
    })

    // Add a final review step
    wizardSteps.push({ title: "Review & Confirm", type: "review", id: "review" })

    setSteps(wizardSteps)

    // Initialize selections from existing state if available
    if (serviceState) {
      const subServiceIds = serviceState.selectedSubServices.map((ss) => ss.id)
      setSelectedSubServices(subServiceIds)

      const featureMap: Record<string, string[]> = {}
      const optionMap: Record<string, Record<string, Record<string, string>>> = {}

      serviceState.selectedSubServices.forEach((ss) => {
        featureMap[ss.id] = ss.selectedFeatures.map((f) => f.id)

        const featureOptionMap: Record<string, Record<string, string>> = {}
        ss.selectedFeatures.forEach((f) => {
          const optionChoiceMap: Record<string, string> = {}
          f.selectedOptions.forEach((o) => {
            optionChoiceMap[o.optionId] = o.choiceId
          })
          featureOptionMap[f.id] = optionChoiceMap
        })

        optionMap[ss.id] = featureOptionMap
      })

      setSelectedFeatures(featureMap)
      setSelectedOptions(optionMap)
    } else {
      // Default: select all subservices
      setSelectedSubServices(service.subServices.map((ss) => ss.id))

      // Default: select all included features
      const featureMap: Record<string, string[]> = {}
      service.subServices.forEach((ss) => {
        featureMap[ss.id] = ss.features.filter((f) => f.included).map((f) => f.id)
      })
      setSelectedFeatures(featureMap)
    }
  }, [service, serviceState])

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      saveAndClose()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleToggleSubService = (subServiceId: string) => {
    setSelectedSubServices((prev) => {
      if (prev.includes(subServiceId)) {
        return prev.filter((id) => id !== subServiceId)
      } else {
        return [...prev, subServiceId]
      }
    })
  }

  const handleToggleFeature = (subServiceId: string, featureId: string) => {
    setSelectedFeatures((prev) => {
      const subServiceFeatures = prev[subServiceId] || []

      if (subServiceFeatures.includes(featureId)) {
        return {
          ...prev,
          [subServiceId]: subServiceFeatures.filter((id) => id !== featureId),
        }
      } else {
        return {
          ...prev,
          [subServiceId]: [...subServiceFeatures, featureId],
        }
      }
    })
  }

  const handleSelectOption = (subServiceId: string, featureId: string, optionId: string, choiceId: string) => {
    setSelectedOptions((prev) => {
      const subServiceOptions = prev[subServiceId] || {}
      const featureOptions = subServiceOptions[featureId] || {}

      return {
        ...prev,
        [subServiceId]: {
          ...subServiceOptions,
          [featureId]: {
            ...featureOptions,
            [optionId]: choiceId,
          },
        },
      }
    })
  }

  const saveAndClose = () => {
    // First, ensure the service is selected
    if (!serviceState) {
      toggleService(serviceId)
    }

    // For each subservice, toggle if its selection state differs from current state
    service?.subServices.forEach((subService) => {
      const isCurrentlySelected = serviceState?.selectedSubServices.some((ss) => ss.id === subService.id) || false
      const shouldBeSelected = selectedSubServices.includes(subService.id)

      if (isCurrentlySelected !== shouldBeSelected) {
        toggleSubService(serviceId, subService.id)
      }
    })

    // For each feature, toggle if its selection state differs from current state
    selectedSubServices.forEach((subServiceId) => {
      const subService = service?.subServices.find((ss) => ss.id === subServiceId)
      if (!subService) return

      const selectedFeatureIds = selectedFeatures[subServiceId] || []

      subService.features.forEach((feature) => {
        const isCurrentlySelected =
          serviceState?.selectedSubServices
            .find((ss) => ss.id === subServiceId)
            ?.selectedFeatures.some((f) => f.id === feature.id) || false
        const shouldBeSelected = selectedFeatureIds.includes(feature.id)

        if (isCurrentlySelected !== shouldBeSelected) {
          toggleFeature(serviceId, subServiceId, feature.id)
        }
      })
    })

    // For each option, update if its selection differs from current state
    Object.entries(selectedOptions).forEach(([subServiceId, featureOptions]) => {
      Object.entries(featureOptions).forEach(([featureId, optionChoices]) => {
        Object.entries(optionChoices).forEach(([optionId, choiceId]) => {
          updateOption(serviceId, subServiceId, featureId, optionId, choiceId)
        })
      })
    })

    onClose()
  }

  const currentStepData = steps[currentStep] || { title: "Loading...", type: "loading", id: "loading" }
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-28 sm:h-32 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90" />

              <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 pb-2 sm:pb-4 flex justify-between items-start z-10">
                <button
                  onClick={handleBack}
                  className={cn(
                    "rounded-full w-8 h-8 flex items-center justify-center transition-colors",
                    isFirstStep
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white/20 text-white hover:bg-white/30",
                  )}
                  disabled={isFirstStep}
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
                  {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8" />}
                </div>

                <div className="text-white min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold truncate">{service.name}</h2>
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {currentStepData.title} ({currentStep + 1}/{steps.length})
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <AnimatePresence mode="wait">
                {currentStepData.type === "overview" && <ServiceOverviewStep key="overview" service={service} />}

                {currentStepData.type === "subService" && (
                  <SubServiceStep
                    key={currentStepData.id}
                    subService={service.subServices.find((ss) => ss.id === currentStepData.id)!}
                    isSelected={selectedSubServices.includes(currentStepData.id)}
                    selectedFeatures={selectedFeatures[currentStepData.id] || []}
                    selectedOptions={selectedOptions[currentStepData.id] || {}}
                    onToggleSubService={() => handleToggleSubService(currentStepData.id)}
                    onToggleFeature={(featureId) => handleToggleFeature(currentStepData.id, featureId)}
                    onSelectOption={(featureId, optionId, choiceId) =>
                      handleSelectOption(currentStepData.id, featureId, optionId, choiceId)
                    }
                  />
                )}

                {currentStepData.type === "review" && (
                  <ReviewStep
                    key="review"
                    service={service}
                    selectedSubServices={selectedSubServices}
                    selectedFeatures={selectedFeatures}
                    selectedOptions={selectedOptions}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={onClose}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {isLastStep ? "Save & Finish" : "Next"}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ServiceOverviewStepProps {
  service: Service
}

const ServiceOverviewStep = ({ service }: ServiceOverviewStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">About This Service</h3>
        <p className="text-slate-600 dark:text-slate-300">
          {service.description ||
            `Our ${service.name} service provides comprehensive solutions tailored to your specific needs.`}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What's Included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.subServices.map((subService) => (
            <div
              key={subService.id}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">{subService.name}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{subService.description}</p>
              <div className="space-y-1">
                {subService.features
                  .filter((f) => f.included)
                  .slice(0, 3)
                  .map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature.name}</span>
                    </div>
                  ))}
                {subService.features.filter((f) => f.included).length > 3 && (
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                    +{subService.features.filter((f) => f.included).length - 3} more included features
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
        <h3 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">How to Customize</h3>
        <p className="text-sm text-indigo-700 dark:text-indigo-400">
          In the following steps, you'll be able to customize each component of this service to fit your specific needs.
          You can select which components you want and configure their options.
        </p>
      </div>
    </motion.div>
  )
}

interface SubServiceStepProps {
  subService: SubService
  isSelected: boolean
  selectedFeatures: string[]
  selectedOptions: Record<string, Record<string, string>>
  onToggleSubService: () => void
  onToggleFeature: (featureId: string) => void
  onSelectOption: (featureId: string, optionId: string, choiceId: string) => void
}

const SubServiceStep = ({
  subService,
  isSelected,
  selectedFeatures,
  selectedOptions,
  onToggleSubService,
  onToggleFeature,
  onSelectOption,
}: SubServiceStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 cursor-pointer",
            isSelected ? "bg-indigo-600 text-white" : "border border-slate-300 dark:border-slate-700",
          )}
          onClick={onToggleSubService}
        >
          {isSelected && <Check className="w-4 h-4" />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{subService.name}</h3>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{subService.description}</p>
        </div>
      </div>

      {isSelected && (
        <div className="ml-9 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Features & Options</h4>
            <div className="space-y-5">
              {subService.features.map((feature) => (
                <FeatureItem
                  key={feature.id}
                  feature={feature}
                  isSelected={selectedFeatures.includes(feature.id)}
                  selectedOptions={selectedOptions[feature.id] || {}}
                  onToggleFeature={() => onToggleFeature(feature.id)}
                  onSelectOption={(optionId, choiceId) => onSelectOption(feature.id, optionId, choiceId)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!isSelected && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30 mt-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-500 dark:text-amber-400 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">This component is not selected</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Check the box above to include this component in your service package and configure its options.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface FeatureItemProps {
  feature: ServiceFeature
  isSelected: boolean
  selectedOptions: Record<string, string>
  onToggleFeature: () => void
  onSelectOption: (optionId: string, choiceId: string) => void
}

const FeatureItem = ({ feature, isSelected, selectedOptions, onToggleFeature, onSelectOption }: FeatureItemProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        isSelected
          ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10"
          : "border-slate-200 dark:border-slate-800",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 cursor-pointer",
            isSelected ? "bg-indigo-600 text-white" : "border border-slate-300 dark:border-slate-700",
          )}
          onClick={onToggleFeature}
        >
          {isSelected && <Check className="w-3 h-3" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-slate-800 dark:text-white">{feature.name}</h5>
            {feature.included && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                Included
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{feature.description}</p>
        </div>
      </div>

      {isSelected && feature.options && feature.options.length > 0 && (
        <div className="mt-4 ml-8 space-y-4">
          {feature.options.map((option) => (
            <OptionSelector
              key={option.id}
              option={option}
              selectedChoiceId={selectedOptions[option.id]}
              onSelectOption={(choiceId) => onSelectOption(option.id, choiceId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface OptionSelectorProps {
  option: ServiceOption
  selectedChoiceId?: string
  onSelectOption: (choiceId: string) => void
}

const OptionSelector = ({ option, selectedChoiceId, onSelectOption }: OptionSelectorProps) => {
  return (
    <div>
      <h6 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{option.name}:</h6>
      <div className="flex flex-wrap gap-2">
        {option.choices.map((choice) => (
          <button
            key={choice.id}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-colors",
              selectedChoiceId === choice.id
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700",
            )}
            onClick={() => onSelectOption(choice.id)}
          >
            {choice.name}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ReviewStepProps {
  service: Service
  selectedSubServices: string[]
  selectedFeatures: Record<string, string[]>
  selectedOptions: Record<string, Record<string, Record<string, string>>>
}

const ReviewStep = ({ service, selectedSubServices, selectedFeatures, selectedOptions }: ReviewStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review Your Selections</h3>
        <p className="text-slate-600 dark:text-slate-300">
          Please review your selected components and options below. You can go back to make changes if needed.
        </p>
      </div>

      <div className="space-y-4">
        {service.subServices.map((subService) => {
          const isSubServiceSelected = selectedSubServices.includes(subService.id)
          if (!isSubServiceSelected) return null

          const subServiceFeatures = selectedFeatures[subService.id] || []

          return (
            <div
              key={subService.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">{subService.name}</h4>

              {subServiceFeatures.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {subServiceFeatures.map((featureId) => {
                    const feature = subService.features.find((f) => f.id === featureId)
                    if (!feature) return null

                    const featureOptions = selectedOptions[subService.id]?.[featureId] || {}
                    const hasOptions = Object.keys(featureOptions).length > 0

                    return (
                      <div key={featureId} className="pl-1">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{feature.name}</span>
                        </div>

                        {hasOptions && (
                          <div className="ml-6 mt-1 space-y-1">
                            {Object.entries(featureOptions).map(([optionId, choiceId]) => {
                              const option = feature.options?.find((o) => o.id === optionId)
                              if (!option) return null

                              const choice = option.choices.find((c) => c.id === choiceId)
                              if (!choice) return null

                              return (
                                <div key={optionId} className="text-sm text-slate-600 dark:text-slate-400">
                                  <span className="text-slate-500 dark:text-slate-500">{option.name}:</span>{" "}
                                  <span className="font-medium">{choice.name}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No features selected</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
        <div className="flex items-start gap-3">
          <div className="text-green-500 dark:text-green-400 mt-0.5">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-300">Ready to Save</h4>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Click "Save & Finish" to confirm your selections and add this service to your package.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
