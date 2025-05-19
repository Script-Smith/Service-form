"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { categoryIcons } from "@/lib/category-icons"

interface CategorySelectorProps {
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
}

export const CategorySelector = ({ categories, activeCategory, onSelectCategory }: CategorySelectorProps) => {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto hide-scrollbar pb-2 gap-1">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category] || categoryIcons.default

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium whitespace-nowrap relative transition-colors flex items-center gap-1.5 sm:gap-2",
                activeCategory === category ? "text-primary" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              )}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative flex items-center gap-1.5 sm:gap-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[80px] sm:max-w-none">{category}</span>
                {index === 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs font-medium bg-primary text-white rounded-full">
                    1
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
      <div className="h-0.5 bg-slate-200 mt-1 rounded-full">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{
            width: `${100 / categories.length}%`,
            x: `${categories.indexOf(activeCategory) * 100}%`,
          }}
          transition={{ type: "spring", duration: 0.5 }}
        />
      </div>
    </div>
  )
}
