import type { Service } from "../types/types"

export const servicesData: Service[] = [
  {
    id: "social-media-management",
    name: "Social Media Management",
    description: "Comprehensive social media management services to grow your brand presence",
    category: "Marketing",
    subServices: [
      {
        id: "instagram-management",
        name: "Instagram Management",
        description: "Grow your brand presence and engagement on Instagram",
        features: [
          {
            id: "feed-posts",
            name: "Feed Posts",
            description: "Regular posts to your Instagram feed",
            included: true,
            options: [
              {
                id: "feed-post-types",
                name: "Post Types",
                choices: [
                  { id: "images-only", name: "Images only" },
                  { id: "images-and-carousels", name: "Images and Carousels" },
                  { id: "full-mix", name: "Full mix (Images, Carousels, Videos)" },
                ],
              },
              {
                id: "posting-frequency",
                name: "Posting Frequency",
                choices: [
                  { id: "frequency-low", name: "2-3 times per week" },
                  { id: "frequency-medium", name: "4-5 times per week" },
                  { id: "frequency-high", name: "Daily posting" },
                ],
              },
            ],
          },
          {
            id: "instagram-stories",
            name: "Instagram Stories",
            description: "Daily stories to engage your audience",
            included: true,
            options: [
              {
                id: "stories-frequency",
                name: "Stories Frequency",
                choices: [
                  { id: "stories-3-per-week", name: "3 per week" },
                  { id: "stories-5-per-week", name: "5 per week" },
                  { id: "stories-daily", name: "Daily" },
                ],
              },
            ],
          },
          {
            id: "instagram-reels",
            name: "Instagram Reels",
            description: "Short-form video content for higher engagement",
            included: true,
            options: [
              {
                id: "reels-frequency",
                name: "Reels Frequency",
                choices: [
                  { id: "reels-1-per-week", name: "1 per week" },
                  { id: "reels-2-per-week", name: "2 per week" },
                  { id: "reels-3-per-week", name: "3 per week" },
                ],
              },
            ],
          },
          {
            id: "instagram-engagement",
            name: "Engagement Management",
            description: "Responding to comments and messages",
            included: true,
            options: [
              {
                id: "engagement-level",
                name: "Engagement Level",
                choices: [
                  { id: "basic-engagement", name: "Basic (Comments only)" },
                  { id: "standard-engagement", name: "Standard (Comments and DMs)" },
                  { id: "premium-engagement", name: "Premium (Full engagement)" },
                ],
              },
            ],
          },
          {
            id: "instagram-analytics",
            name: "Analytics & Insights",
            description: "Tracking performance metrics and audience insights",
            included: true,
          },
          {
            id: "instagram-hashtag-research",
            name: "Hashtag Research & Strategy",
            description: "Researching and implementing effective hashtags",
            included: true,
          },
        ],
      },
      {
        id: "facebook-management",
        name: "Facebook Management",
        description: "Comprehensive management of your Facebook business presence",
        features: [
          {
            id: "facebook-page-posts",
            name: "Page Posts",
            description: "Regular posts to your Facebook page",
            included: true,
            options: [
              {
                id: "facebook-post-types",
                name: "Post Types",
                choices: [
                  { id: "text-and-images", name: "Text and Images" },
                  { id: "mixed-content", name: "Mixed Content (Text, Images, Links)" },
                  { id: "full-content-mix", name: "Full Content Mix (Including Videos)" },
                ],
              },
              {
                id: "fb-posting-frequency",
                name: "Posting Frequency",
                choices: [
                  { id: "fb-frequency-low", name: "2-3 times per week" },
                  { id: "fb-frequency-medium", name: "4-5 times per week" },
                  { id: "fb-frequency-high", name: "Daily posting" },
                ],
              },
            ],
          },
          {
            id: "facebook-stories",
            name: "Facebook Stories",
            description: "Ephemeral content for your Facebook page",
            included: true,
            options: [
              {
                id: "facebook-stories-frequency",
                name: "Stories Frequency",
                choices: [
                  { id: "fb-stories-2-per-week", name: "2 per week" },
                  { id: "fb-stories-3-per-week", name: "3 per week" },
                  { id: "fb-stories-5-per-week", name: "5 per week" },
                ],
              },
            ],
          },
          {
            id: "facebook-engagement",
            name: "Engagement Management",
            description: "Responding to comments and messages",
            included: true,
            options: [
              {
                id: "fb-engagement-level",
                name: "Engagement Level",
                choices: [
                  { id: "fb-basic-engagement", name: "Basic (Comments only)" },
                  { id: "fb-standard-engagement", name: "Standard (Comments and Messages)" },
                  { id: "fb-premium-engagement", name: "Premium (Full community management)" },
                ],
              },
            ],
          },
          {
            id: "facebook-insights",
            name: "Analytics & Insights",
            description: "Tracking performance metrics and audience insights",
            included: true,
          },
          {
            id: "facebook-page-optimization",
            name: "Page Optimization",
            description: "Optimizing your Facebook page for maximum visibility",
            included: true,
          },
        ],
      },
      {
        id: "linkedin-management",
        name: "LinkedIn Management",
        description: "Professional management of your LinkedIn company presence",
        features: [
          {
            id: "linkedin-posts",
            name: "Company Page Posts",
            description: "Regular posts to your LinkedIn company page",
            included: true,
            options: [
              {
                id: "linkedin-post-types",
                name: "Post Types",
                choices: [
                  { id: "text-posts", name: "Text posts and articles" },
                  { id: "mixed-posts", name: "Mixed posts (Text, Images, Articles)" },
                  { id: "comprehensive-posts", name: "Comprehensive mix (Including Documents and Videos)" },
                ],
              },
              {
                id: "linkedin-frequency",
                name: "Posting Frequency",
                choices: [
                  { id: "li-frequency-low", name: "2-3 times per week" },
                  { id: "li-frequency-medium", name: "4-5 times per week" },
                  { id: "li-frequency-high", name: "Daily posting" },
                ],
              },
            ],
          },
          {
            id: "linkedin-engagement",
            name: "Engagement Management",
            description: "Responding to comments and messages",
            included: true,
            options: [
              {
                id: "li-engagement-level",
                name: "Engagement Level",
                choices: [
                  { id: "li-basic-engagement", name: "Basic (Comments only)" },
                  { id: "li-standard-engagement", name: "Standard (Comments and Messages)" },
                  { id: "li-premium-engagement", name: "Premium (Full professional engagement)" },
                ],
              },
            ],
          },
          {
            id: "linkedin-analytics",
            name: "Analytics & Insights",
            description: "Tracking performance metrics and audience insights",
            included: true,
          },
          {
            id: "linkedin-page-optimization",
            name: "Company Page Optimization",
            description: "Optimizing your LinkedIn company page",
            included: true,
          },
        ],
      },
    ],
  },
  {
    id: "seo",
    name: "Search Engine Optimization (SEO)",
    description: "Comprehensive SEO services to improve your website visibility and rankings",
    category: "Marketing",
    subServices: [
      {
        id: "on-page-seo",
        name: "On-Page SEO",
        description: "Optimizing individual pages to rank higher and earn more relevant traffic",
        features: [
          {
            id: "keyword-research",
            name: "Keyword Research",
            description: "Researching and identifying target keywords",
            included: true,
            options: [
              {
                id: "keyword-research-depth",
                name: "Research Depth",
                choices: [
                  { id: "basic-keyword-research", name: "Basic (10-20 keywords)" },
                  { id: "standard-keyword-research", name: "Standard (20-50 keywords)" },
                  { id: "comprehensive-keyword-research", name: "Comprehensive (50+ keywords)" },
                ],
              },
            ],
          },
          {
            id: "meta-tags-optimization",
            name: "Meta Tags Optimization",
            description: "Optimizing title tags and meta descriptions",
            included: true,
          },
          {
            id: "content-optimization",
            name: "Content Optimization",
            description: "Optimizing existing content for target keywords",
            included: true,
            options: [
              {
                id: "content-optimization-scope",
                name: "Optimization Scope",
                choices: [
                  { id: "basic-content-optimization", name: "Basic (5-10 pages)" },
                  { id: "standard-content-optimization", name: "Standard (10-20 pages)" },
                  { id: "comprehensive-content-optimization", name: "Comprehensive (20+ pages)" },
                ],
              },
            ],
          },
          {
            id: "image-optimization",
            name: "Image Optimization",
            description: "Optimizing images for search engines",
            included: true,
          },
          {
            id: "internal-linking",
            name: "Internal Linking Strategy",
            description: "Implementing effective internal linking",
            included: true,
          },
        ],
      },
      {
        id: "off-page-seo",
        name: "Off-Page SEO",
        description: "Building your site's authority through external signals",
        features: [
          {
            id: "backlink-building",
            name: "Backlink Building",
            description: "Building high-quality backlinks to your website",
            included: true,
            options: [
              {
                id: "backlink-volume",
                name: "Backlink Volume",
                choices: [
                  { id: "basic-backlinks", name: "Basic (3-5 per month)" },
                  { id: "standard-backlinks", name: "Standard (5-10 per month)" },
                  { id: "premium-backlinks", name: "Premium (10+ per month)" },
                ],
              },
            ],
          },
          {
            id: "competitor-backlink-analysis",
            name: "Competitor Backlink Analysis",
            description: "Analyzing competitor backlink profiles",
            included: true,
          },
          {
            id: "guest-posting",
            name: "Guest Posting",
            description: "Creating and publishing guest posts on relevant websites",
            included: false,
            options: [
              {
                id: "guest-posting-volume",
                name: "Guest Posting Volume",
                choices: [
                  { id: "basic-guest-posting", name: "Basic (1-2 per month)" },
                  { id: "standard-guest-posting", name: "Standard (3-4 per month)" },
                  { id: "premium-guest-posting", name: "Premium (5+ per month)" },
                ],
              },
            ],
          },
          {
            id: "social-bookmarking",
            name: "Social Bookmarking",
            description: "Submitting your content to social bookmarking sites",
            included: true,
          },
        ],
      },
      {
        id: "technical-seo",
        name: "Technical SEO",
        description: "Optimizing the technical aspects of your website for better crawling and indexing",
        features: [
          {
            id: "site-audit",
            name: "Technical Site Audit",
            description: "Comprehensive audit of technical SEO issues",
            included: true,
            options: [
              {
                id: "audit-frequency",
                name: "Audit Frequency",
                choices: [
                  { id: "quarterly-audit", name: "Quarterly audit" },
                  { id: "bimonthly-audit", name: "Bi-monthly audit" },
                  { id: "monthly-audit", name: "Monthly audit" },
                ],
              },
            ],
          },
          {
            id: "site-speed-optimization",
            name: "Site Speed Optimization",
            description: "Improving website loading speed",
            included: true,
          },
          {
            id: "mobile-optimization",
            name: "Mobile Optimization",
            description: "Ensuring website is fully optimized for mobile devices",
            included: true,
          },
          {
            id: "sitemap-optimization",
            name: "XML Sitemap Optimization",
            description: "Creating and optimizing XML sitemaps",
            included: true,
          },
          {
            id: "robots-txt-optimization",
            name: "Robots.txt Optimization",
            description: "Optimizing robots.txt file for proper crawling",
            included: true,
          },
        ],
      },
    ],
  },
  {
    id: "website-design",
    name: "Website Design & Development",
    description: "Professional website design and development services",
    category: "Design & Development",
    subServices: [
      {
        id: "landing-page",
        name: "Landing Page Design",
        description: "Design and development of high-converting landing pages",
        features: [
          {
            id: "landing-page-design",
            name: "Custom Design",
            description: "Creating custom landing page designs",
            included: true,
            options: [
              {
                id: "landing-design-level",
                name: "Design Level",
                choices: [
                  { id: "landing-basic-design", name: "Basic (Template-based)" },
                  { id: "landing-standard-design", name: "Standard (Semi-custom)" },
                  { id: "landing-premium-design", name: "Premium (Fully custom)" },
                ],
              },
            ],
          },
          {
            id: "landing-page-copywriting",
            name: "Copywriting",
            description: "Writing compelling landing page copy",
            included: false,
            options: [
              {
                id: "landing-copy-level",
                name: "Copywriting Level",
                choices: [
                  { id: "landing-basic-copy", name: "Basic (Content outline)" },
                  { id: "landing-standard-copy", name: "Standard (Full page copy)" },
                  { id: "landing-premium-copy", name: "Premium (Conversion-optimized copy)" },
                ],
              },
            ],
          },
          {
            id: "landing-page-development",
            name: "Development",
            description: "Developing the landing page",
            included: true,
          },
          {
            id: "landing-page-responsive",
            name: "Responsive Design",
            description: "Making the landing page responsive for all devices",
            included: true,
          },
          {
            id: "landing-page-form",
            name: "Form Integration",
            description: "Integrating contact or lead forms",
            included: true,
          },
        ],
      },
      {
        id: "business-website",
        name: "Business Website",
        description: "Design and development of professional business websites",
        features: [
          {
            id: "business-website-design",
            name: "Custom Design",
            description: "Creating custom website designs",
            included: true,
            options: [
              {
                id: "business-design-level",
                name: "Design Level",
                choices: [
                  { id: "business-basic-design", name: "Basic (Template-based)" },
                  { id: "business-standard-design", name: "Standard (Semi-custom)" },
                  { id: "business-premium-design", name: "Premium (Fully custom)" },
                ],
              },
            ],
          },
          {
            id: "business-website-development",
            name: "Development",
            description: "Developing the website",
            included: true,
          },
          {
            id: "business-website-responsive",
            name: "Responsive Design",
            description: "Making the website responsive for all devices",
            included: true,
          },
          {
            id: "business-website-cms",
            name: "Content Management System",
            description: "Implementing a content management system",
            included: true,
          },
          {
            id: "business-website-seo",
            name: "Basic SEO Setup",
            description: "Setting up basic on-page SEO",
            included: true,
          },
        ],
      },
      {
        id: "ecommerce-website",
        name: "E-commerce Website",
        description: "Design and development of online stores",
        features: [
          {
            id: "ecommerce-website-design",
            name: "Custom Design",
            description: "Creating custom e-commerce designs",
            included: true,
            options: [
              {
                id: "ecommerce-design-level",
                name: "Design Level",
                choices: [
                  { id: "ecommerce-basic-design", name: "Basic (Template-based)" },
                  { id: "ecommerce-standard-design", name: "Standard (Semi-custom)" },
                  { id: "ecommerce-premium-design", name: "Premium (Fully custom)" },
                ],
              },
            ],
          },
          {
            id: "ecommerce-product-setup",
            name: "Product Setup",
            description: "Setting up products in the online store",
            included: true,
            options: [
              {
                id: "product-setup-volume",
                name: "Product Setup Volume",
                choices: [
                  { id: "products-up-to-20", name: "Up to 20 products" },
                  { id: "products-up-to-50", name: "Up to 50 products" },
                  { id: "products-up-to-100", name: "Up to 100 products" },
                  { id: "products-100-plus", name: "100+ products" },
                ],
              },
            ],
          },
          {
            id: "ecommerce-payment-gateway",
            name: "Payment Gateway Integration",
            description: "Integrating payment gateways",
            included: true,
            options: [
              {
                id: "payment-gateway-count",
                name: "Number of Payment Gateways",
                choices: [
                  { id: "payment-1-gateway", name: "1 payment gateway" },
                  { id: "payment-2-gateways", name: "2 payment gateways" },
                  { id: "payment-3-plus-gateways", name: "3+ payment gateways" },
                ],
              },
            ],
          },
          {
            id: "ecommerce-shipping-setup",
            name: "Shipping Setup",
            description: "Setting up shipping options",
            included: true,
          },
          {
            id: "ecommerce-tax-setup",
            name: "Tax Setup",
            description: "Setting up tax calculations",
            included: true,
          },
        ],
      },
    ],
  },
]
