"use client"
import { motion } from "framer-motion"
import type { Service } from "@/types/types"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { serviceIcons } from "@/lib/service-icons"

interface ServiceCardProps {
  service: Service
  index: number
  onSelect: () => void
  isSelected: boolean
}

export const ServiceCard = ({ service, index, onSelect, isSelected }: ServiceCardProps) => {
  const Icon = serviceIcons[service.id] || serviceIcons.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer",
        "border hover:border-indigo-300 dark:hover:border-indigo-700",
        "hover:shadow-lg hover:-translate-y-1",
        isSelected
          ? "border-indigo-300 dark:border-indigo-700 shadow-md bg-white dark:bg-slate-900"
          : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm",
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 sm:mb-4">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white mb-1 sm:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {service.name}
          </h3>
          {service.description && (
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{service.description}</p>
          )}
        </div>

        <div className="mt-auto">
          <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
            Includes
          </div>
          <div className="flex flex-wrap gap-1.5">
            {service.subServices.slice(0, 3).map((subService) => (
              <span
                key={subService.id}
                className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[120px]"
              >
                {subService.name}
              </span>
            ))}
            {service.subServices.length > 3 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                +{service.subServices.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1.5">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              isSelected ? "bg-gradient-to-r from-indigo-500 to-purple-600 w-full" : "w-0",
            )}
          />
        </div>
      </div>
    </motion.div>
  )
}
