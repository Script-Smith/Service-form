"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto hide-scrollbar pb-2 gap-1">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "px-4 py-2.5 rounded-lg font-medium whitespace-nowrap relative transition-colors",
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
            <span className="relative">
              {category}
              {index === 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-white rounded-full">
                  1
                </span>
              )}
            </span>
          </button>
        ))}
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
