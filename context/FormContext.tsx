"use client"

import type React from "react"
import type { SelectedService, SelectedSubService, SelectedFeature } from "@/types/types"

import { createContext, useContext, useState, type ReactNode } from "react"

interface FormContextProps {
  formState: {
    selectedServices: SelectedService[]
  }
  toggleService: (serviceId: string) => void
  toggleSubService: (serviceId: string, subServiceId: string) => void
  toggleFeature: (serviceId: string, subServiceId: string, featureId: string) => void
  updateOption: (serviceId: string, subServiceId: string, featureId: string, optionId: string, choiceId: string) => void
  getServiceState: (serviceId: string) => SelectedService | undefined
  getSubServiceState: (serviceId: string, subServiceId: string) => SelectedSubService | undefined
  getFeatureState: (serviceId: string, subServiceId: string, featureId: string) => SelectedFeature | undefined
  getOptionChoice: (serviceId: string, subServiceId: string, featureId: string, optionId: string) => string | undefined
}

const FormContext = createContext<FormContextProps | undefined>(undefined)

interface FormProviderProps {
  children: ReactNode
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formState, setFormState] = useState<{
    selectedServices: SelectedService[]
  }>({
    selectedServices: [],
  })

  const toggleService = (serviceId: string) => {
    setFormState((prevState) => {
      const isSelected = prevState.selectedServices.some((s) => s.id === serviceId)

      if (isSelected) {
        return {
          ...prevState,
          selectedServices: prevState.selectedServices.filter((s) => s.id !== serviceId),
        }
      } else {
        return {
          ...prevState,
          selectedServices: [
            ...prevState.selectedServices,
            {
              id: serviceId,
              selectedSubServices: [],
            },
          ],
        }
      }
    })
  }

  const toggleSubService = (serviceId: string, subServiceId: string) => {
    setFormState((prevState) => {
      const serviceIndex = prevState.selectedServices.findIndex((s) => s.id === serviceId)

      if (serviceIndex === -1) {
        // If service is not selected, add it with the subservice
        return {
          ...prevState,
          selectedServices: [
            ...prevState.selectedServices,
            {
              id: serviceId,
              selectedSubServices: [{ id: subServiceId, selectedFeatures: [] }],
            },
          ],
        }
      }

      const service = prevState.selectedServices[serviceIndex]
      const subServiceIndex = service.selectedSubServices.findIndex((s) => s.id === subServiceId)

      let updatedSubServices = [...service.selectedSubServices]

      if (subServiceIndex === -1) {
        // Add subservice
        updatedSubServices.push({ id: subServiceId, selectedFeatures: [] })
      } else {
        // Remove subservice
        updatedSubServices = updatedSubServices.filter((s) => s.id !== subServiceId)
      }

      const updatedService = { ...service, selectedSubServices: updatedSubServices }
      const updatedSelectedServices = [...prevState.selectedServices]
      updatedSelectedServices[serviceIndex] = updatedService

      return { ...prevState, selectedServices: updatedSelectedServices }
    })
  }

  const toggleFeature = (serviceId: string, subServiceId: string, featureId: string) => {
    setFormState((prevState) => {
      const serviceIndex = prevState.selectedServices.findIndex((s) => s.id === serviceId)

      if (serviceIndex === -1) {
        // If service is not selected, add it with the subservice and feature
        return {
          ...prevState,
          selectedServices: [
            ...prevState.selectedServices,
            {
              id: serviceId,
              selectedSubServices: [
                {
                  id: subServiceId,
                  selectedFeatures: [{ id: featureId, selectedOptions: [] }],
                },
              ],
            },
          ],
        }
      }

      const service = { ...prevState.selectedServices[serviceIndex] }
      const subServiceIndex = service.selectedSubServices.findIndex((s) => s.id === subServiceId)

      const updatedSubServices = [...service.selectedSubServices]

      if (subServiceIndex === -1) {
        // Add subservice with feature
        updatedSubServices.push({
          id: subServiceId,
          selectedFeatures: [{ id: featureId, selectedOptions: [] }],
        })
      } else {
        // Update existing subservice
        const subService = { ...service.selectedSubServices[subServiceIndex] }
        const featureIndex = subService.selectedFeatures.findIndex((f) => f.id === featureId)

        let updatedFeatures = [...subService.selectedFeatures]

        if (featureIndex === -1) {
          // Add feature
          updatedFeatures.push({ id: featureId, selectedOptions: [] })
        } else {
          // Remove feature
          updatedFeatures = updatedFeatures.filter((f) => f.id !== featureId)
        }

        const updatedSubService = { ...subService, selectedFeatures: updatedFeatures }
        updatedSubServices[subServiceIndex] = updatedSubService
      }

      const updatedService = { ...service, selectedSubServices: updatedSubServices }
      const updatedSelectedServices = [...prevState.selectedServices]
      updatedSelectedServices[serviceIndex] = updatedService

      return { ...prevState, selectedServices: updatedSelectedServices }
    })
  }

  const updateOption = (
    serviceId: string,
    subServiceId: string,
    featureId: string,
    optionId: string,
    choiceId: string,
  ) => {
    setFormState((prevState) => {
      const serviceIndex = prevState.selectedServices.findIndex((s) => s.id === serviceId)

      if (serviceIndex === -1) {
        // If service is not selected, add it with the subservice, feature, and option
        return {
          ...prevState,
          selectedServices: [
            ...prevState.selectedServices,
            {
              id: serviceId,
              selectedSubServices: [
                {
                  id: subServiceId,
                  selectedFeatures: [
                    {
                      id: featureId,
                      selectedOptions: [{ optionId, choiceId }],
                    },
                  ],
                },
              ],
            },
          ],
        }
      }

      const service = { ...prevState.selectedServices[serviceIndex] }
      const subServiceIndex = service.selectedSubServices.findIndex((s) => s.id === subServiceId)

      const updatedSubServices = [...service.selectedSubServices]

      if (subServiceIndex === -1) {
        // Add subservice with feature and option
        updatedSubServices.push({
          id: subServiceId,
          selectedFeatures: [
            {
              id: featureId,
              selectedOptions: [{ optionId, choiceId }],
            },
          ],
        })
      } else {
        // Update existing subservice
        const subService = { ...service.selectedSubServices[subServiceIndex] }
        const featureIndex = subService.selectedFeatures.findIndex((f) => f.id === featureId)

        const updatedFeatures = [...subService.selectedFeatures]

        if (featureIndex === -1) {
          // Add feature with option
          updatedFeatures.push({
            id: featureId,
            selectedOptions: [{ optionId, choiceId }],
          })
        } else {
          // Update existing feature
          const feature = { ...subService.selectedFeatures[featureIndex] }
          const optionIndex = feature.selectedOptions.findIndex((o) => o.optionId === optionId)

          const updatedOptions = [...feature.selectedOptions]

          if (optionIndex === -1) {
            // Add option
            updatedOptions.push({ optionId, choiceId })
          } else {
            // Update existing option
            updatedOptions[optionIndex] = { optionId, choiceId }
          }

          const updatedFeature = { ...feature, selectedOptions: updatedOptions }
          updatedFeatures[featureIndex] = updatedFeature
        }

        const updatedSubService = { ...subService, selectedFeatures: updatedFeatures }
        updatedSubServices[subServiceIndex] = updatedSubService
      }

      const updatedService = { ...service, selectedSubServices: updatedSubServices }
      const updatedSelectedServices = [...prevState.selectedServices]
      updatedSelectedServices[serviceIndex] = updatedService

      return { ...prevState, selectedServices: updatedSelectedServices }
    })
  }

  const getServiceState = (serviceId: string) => {
    return formState.selectedServices.find((s) => s.id === serviceId)
  }

  const getSubServiceState = (serviceId: string, subServiceId: string) => {
    const service = getServiceState(serviceId)
    return service?.selectedSubServices.find((s) => s.id === subServiceId)
  }

  const getFeatureState = (serviceId: string, subServiceId: string, featureId: string) => {
    const subService = getSubServiceState(serviceId, subServiceId)
    return subService?.selectedFeatures.find((f) => f.id === featureId)
  }

  const getOptionChoice = (serviceId: string, subServiceId: string, featureId: string, optionId: string) => {
    const feature = getFeatureState(serviceId, subServiceId, featureId)
    const option = feature?.selectedOptions.find((o) => o.optionId === optionId)
    return option?.choiceId
  }

  const value: FormContextProps = {
    formState,
    toggleService,
    toggleSubService,
    toggleFeature,
    updateOption,
    getServiceState,
    getSubServiceState,
    getFeatureState,
    getOptionChoice,
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}
