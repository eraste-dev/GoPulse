"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function ResponseTimeChart({ data }: { data: any[] }) {
  // Format data for chart
  const chartData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ms: item.responseTime,
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="time" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}ms`} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Line 
            type="monotone" 
            dataKey="ms" 
            stroke="#2563eb" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
