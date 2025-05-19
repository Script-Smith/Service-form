import type React from "react"
import { Code, Palette, Megaphone, Layers, BarChart, Globe, Smartphone, Search } from "lucide-react"

export const categoryIcons: Record<string, React.ComponentType<any>> = {
  Development: Code,
  Design: Palette,
  Marketing: Megaphone,
  Analytics: BarChart,
  SEO: Search,
  Web: Globe,
  Mobile: Smartphone,
  General: Layers,
  default: Layers,
}
