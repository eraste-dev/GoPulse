"use client"

import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Cell
} from "recharts"

export default function ResponseBarChart({ data }: { data: any[] }) {
  // Format data for chart
  const chartData = data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ms: item.responseTime,
  }));

  // Find max value to highlight the peak or just render normally
  // We will highlight the highest bar as per "barre bleue mise en exergue"
  const maxVal = Math.max(...chartData.map(d => d.ms));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#9CA3AF' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => `${value}`} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: "#ffffff", 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px",
              color: "#111827",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: '12px'
            }}
          />
          <Bar dataKey="ms" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.ms === maxVal ? '#0066FF' : '#E5E7EB'} 
                className="transition-all duration-300 hover:opacity-80" 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
