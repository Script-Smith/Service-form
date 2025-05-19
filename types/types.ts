export interface ServiceOption {
  id: string
  name: string
  choices: {
    id: string
    name: string
  }[]
}

export interface ServiceFeature {
  id: string
  name: string
  description?: string
  included: boolean
  options?: ServiceOption[]
}

export interface SubService {
  id: string
  name: string
  description?: string
  features: ServiceFeature[]
}

export interface Service {
  id: string
  name: string
  description?: string
  category: string
  subServices: SubService[]
}

export interface SelectedOption {
  optionId: string
  choiceId: string
}

export interface SelectedFeature {
  id: string
  selectedOptions: SelectedOption[]
}

export interface SelectedSubService {
  id: string
  selectedFeatures: SelectedFeature[]
}

export interface SelectedService {
  id: string
  selectedSubServices: SelectedSubService[]
}
