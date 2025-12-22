
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ")

interface NavBarProps {
  items: Array<{
    name: string
    url: string
    icon: LucideIcon
  }>
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)

  const handleNavigation = (url: string) => {
    setActiveTab(url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={cn("fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6", className)}>
      <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg border border-white/10 py-1 px-1 rounded-full shadow-lg shadow-blue-500/10">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.url

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => handleNavigation(item.url)}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-6 py-2 rounded-full transition-colors",
                "text-white/80 hover:text-blue-400",
                isActive && "bg-white/10 text-blue-400"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden"><Icon size={18} strokeWidth={2.5} /></span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-blue-500/10 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-blue-400/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-blue-400/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-blue-400/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
