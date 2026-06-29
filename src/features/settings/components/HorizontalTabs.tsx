import React from 'react'

interface TabOption {
  label: string
  value: string
}

interface HorizontalTabsProps {
  tabs: TabOption[]
  activeTab: string
  onChange: (value: string) => void
}

export function HorizontalTabs({ tabs, activeTab, onChange }: HorizontalTabsProps) {
  return (
    <div className="bg-gray-50/60 dark:bg-zinc-900/40 rounded-2xl border border-border/80 p-2 shadow-xs overflow-x-auto scrollbar-thin">
      <div className="flex flex-row gap-1.5 items-center w-max min-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`whitespace-nowrap px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
              activeTab === tab.value
                ? 'bg-main-gradient text-white shadow-sm'
                : 'hover:bg-white/80 dark:hover:bg-zinc-800/80 text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
