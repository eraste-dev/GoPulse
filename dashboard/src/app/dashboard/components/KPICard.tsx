"use client"

import * as React from "react"
import { Check, Info } from "lucide-react"

export function KPICard({ 
  icon: Icon, 
  title, 
  subtitle, 
  value, 
  unit, 
  footer,
  trend 
}: { 
  icon: any, 
  title: string, 
  subtitle?: string, 
  value: string | number, 
  unit?: string, 
  footer?: React.ReactNode,
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-gray-900">{value}</span>
          {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50/50 -mx-6 -mb-6 p-4 rounded-b-[20px]">
        <Info className="w-4 h-4 text-blue-400" />
        {footer}
      </div>
    </div>
  )
}
