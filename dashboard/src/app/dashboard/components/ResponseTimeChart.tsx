"use client"

import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid 
} from "recharts"

export default function ResponseTimeChart({ data }: { data: any[] }) {
  // Format data for chart
  const chartData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ms: item.responseTime,
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0070f3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0070f3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `${value}ms`} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#ffffff", 
              border: "1px solid #e5e7eb", 
              borderRadius: "12px",
              color: "#111827",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            itemStyle={{ color: "#0070f3" }}
            cursor={{ stroke: '#0070f3', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="ms" 
            stroke="#0070f3" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMs)" 
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, strokeOpacity: 1, fill: '#0070f3' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
