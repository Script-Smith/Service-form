export interface Service {
  id: string
  name: string
  description: string
  category: string
}

export const services: Service[] = [
  {
    id: "web-design",
    name: "Website Design",
    description: "Custom website design tailored to your brand and business needs",
    category: "Web Development",
  },
  {
    id: "web-development",
    name: "Website Development",
    description: "Full-stack website development with responsive design and modern technologies",
    category: "Web Development",
  },
  {
    id: "ecommerce",
    name: "E-commerce Solutions",
    description: "Complete online store setup with payment processing and inventory management",
    category: "Web Development",
  },
  {
    id: "seo",
    name: "Search Engine Optimization",
    description: "Improve your website's visibility in search engine results",
    category: "Digital Marketing",
  },
  {
    id: "ppc",
    name: "Pay-Per-Click Advertising",
    description: "Targeted advertising campaigns on Google, Bing, and other platforms",
    category: "Digital Marketing",
  },
  {
    id: "social-media",
    name: "Social Media Marketing",
    description: "Strategic social media campaigns to grow your audience and engagement",
    category: "Digital Marketing",
  },
  {
    id: "content-marketing",
    name: "Content Marketing",
    description: "Engaging content creation and distribution to attract and retain customers",
    category: "Digital Marketing",
  },
  {
    id: "email-marketing",
    name: "Email Marketing",
    description: "Effective email campaigns to nurture leads and drive conversions",
    category: "Digital Marketing",
  },
  {
    id: "branding",
    name: "Branding & Identity",
    description: "Develop a strong brand identity with logo design and brand guidelines",
    category: "Design",
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    description: "Professional graphic design for print and digital media",
    category: "Design",
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    description: "User-centered design to enhance user experience and interface",
    category: "Design",
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    description: "Data analysis and reporting to track performance and inform decisions",
    category: "Analytics",
  },
  {
    id: "consulting",
    name: "Digital Strategy Consulting",
    description: "Expert guidance on digital transformation and online strategy",
    category: "Consulting",
  },
  {
    id: "maintenance",
    name: "Website Maintenance",
    description: "Regular updates, security patches, and technical support for your website",
    category: "Support",
  },
  {
    id: "hosting",
    name: "Web Hosting",
    description: "Reliable and secure hosting solutions for your website",
    category: "Support",
  },
]
