import * as React from "react"
import { cn } from "@/lib/utils"

export interface DynamicTab {
  id: string
  label: string
  disabled?: boolean
}

export interface DynamicTabsProps {
  tabs: DynamicTab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'compact'
}

const DynamicTabs = React.forwardRef<
  HTMLDivElement,
  DynamicTabsProps
>(({ tabs, activeTab, onChange, className, variant = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted p-1",
        variant === 'compact' && "gap-0.5 p-0.5",
        className
      )}
      {...props}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            variant === 'compact' && "px-3 py-1.5 text-xs",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
})

DynamicTabs.displayName = "DynamicTabs"

export { DynamicTabs }