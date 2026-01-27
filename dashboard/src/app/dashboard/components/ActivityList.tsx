"use client"

import { Card } from "@/components/ui/card"
import { MoreHorizontal, ArrowRight, Clock, Flame, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ActivityList({ activities }: { activities: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Latest Activities</h3>
        </div>
        <button className="text-sm font-semibold text-primary hover:text-blue-700 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-4">
        {activities.map((activity, i) => (
          <div key={i} className="group bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                activity.status === 'UP' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                <ActivityIcon status={activity.status} />
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">{activity.monitor.name}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  {new Date(activity.timestamp).toLocaleDateString()}
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 md:gap-12">
              <div className="hidden md:block text-right">
                <span className="block text-xs text-gray-400 font-medium mb-1">Response</span>
                <span className="font-bold text-gray-900">{activity.responseTime.toFixed(0)} ms</span>
              </div>
              <div className="hidden md:block text-right">
                <span className="block text-xs text-gray-400 font-medium mb-1">Status</span>
                <Badge variant={activity.status === 'UP' ? 'secondary' : 'destructive'} className="rounded-md">
                   {activity.status}
                </Badge>
              </div>
              <div className="text-right min-w-[60px]">
                <span className="block text-xs text-gray-400 font-medium mb-1">Code</span>
                <span className="font-bold text-gray-900 text-lg">{activity.statusCode}</span>
              </div>
              
              <MoreHorizontal className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityIcon({ status }: { status: string }) {
  if (status === 'UP') return <Zap className="w-6 h-6 fill-current" />
  return <Flame className="w-6 h-6 fill-current" />
}
