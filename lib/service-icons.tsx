import type React from "react"
import { Globe, Smartphone, Paintbrush, Bookmark, Search, FileText, Code2, Layers } from "lucide-react"

export const serviceIcons: Record<string, React.ComponentType<any>> = {
  "web-dev": Globe,
  "mobile-dev": Smartphone,
  "ui-design": Paintbrush,
  branding: Bookmark,
  seo: Search,
  content: FileText,
  backend: Code2,
  default: Layers,
}
