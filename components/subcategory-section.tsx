"use client"

import type React from "react"
import type { Service } from "../types/types"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SubcategorySectionProps {
  service: Service
  selectedSubcategories: string[]
  onToggleSubcategory: (subcategoryId: string) => void
}

export const SubcategorySection: React.FC<SubcategorySectionProps> = ({
  service,
  selectedSubcategories,
  onToggleSubcategory,
}) => {
  return (
    <div>
      <h4 className="font-medium text-slate-700 mb-4">Select Options:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
        {service.subcategories?.map((subcategory, index) => (
          <motion.div
            key={subcategory.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center"
          >
            <div
              onClick={() => onToggleSubcategory(subcategory.id)}
              className={cn(
                "w-5 h-5 rounded flex items-center justify-center mr-3 cursor-pointer transition-colors",
                selectedSubcategories.includes(subcategory.id)
                  ? "bg-primary text-white"
                  : "border border-slate-300 hover:border-primary/60",
              )}
            >
              {selectedSubcategories.includes(subcategory.id) && <Check className="w-3.5 h-3.5" />}
            </div>
            <label
              onClick={() => onToggleSubcategory(subcategory.id)}
              className="text-slate-700 cursor-pointer hover:text-slate-900 transition-colors"
            >
              {subcategory.name}
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
