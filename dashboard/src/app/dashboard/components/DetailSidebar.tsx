"use client"

import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DetailSidebar({ 
  monitorName, 
  currentValue, 
  sparklineData,
  stats
}: {
  monitorName: string,
  currentValue: string,
  sparklineData: number[],
  stats: { label: string, value: string }[]
}) {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full flex flex-col border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{monitorName}</h3>
          <p className="text-sm text-gray-400">Real-time Analysis</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs hover:bg-blue-50 hover:text-primary border-gray-200">
          Details
        </Button>
      </div>

      {/* Sparkline Placeholder */}
      <div className="h-32 w-full bg-gradient-to-b from-red-50 to-transparent rounded-xl border border-red-100 relative mb-6 overflow-hidden flex items-end">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <path 
            d={`M0,${100 - (sparklineData[0] || 0)} ${sparklineData.map((d, i) => `L${(i / (sparklineData.length - 1)) * 100},${100 - d}`).join(' ')}`} 
            fill="none" 
            stroke="#EF4444" 
            strokeWidth="3" 
            vectorEffect="non-scaling-stroke"
          />
          <path 
             d={`M0,${100 - (sparklineData[0] || 0)} ${sparklineData.map((d, i) => `L${(i / (sparklineData.length - 1)) * 100},${100 - d}`).join(' ')} L100,100 L0,100 Z`} 
             fill="rgba(239, 68, 68, 0.1)" 
          />
        </svg>
      </div>

      <div className="text-center mb-8">
        <span className="text-5xl font-bold text-gray-900">{currentValue}</span>
        <span className="text-sm text-gray-400 ml-2 font-medium">ms</span>
      </div>

      <div className="space-y-3 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
            <span className="text-sm font-bold text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4 px-1">
          <span>Synced 2m ago</span>
          <Activity className="w-4 h-4 text-green-500" />
        </div>
        <Button className="w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all">
          Sync Data Now
        </Button>
      </div>
    </div>
  )
}
