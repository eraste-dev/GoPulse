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
              <stop offset="5%" stopColor="#16db65" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#16db65" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => `${value}ms`} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#0d2818", 
              border: "1px solid #04471c", 
              borderRadius: "12px",
              color: "#fff" 
            }}
            itemStyle={{ color: "#16db65" }}
            cursor={{ stroke: '#058c42', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="ms" 
            stroke="#16db65" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMs)" 
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
