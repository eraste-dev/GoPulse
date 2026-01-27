import { prisma } from '@/lib/prisma';
import { 
  Heart, 
  Activity, 
  Zap, 
  Timer, 
  Search, 
  Bell, 
  Settings, 
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  ChevronDown
} from 'lucide-react';
import { KPICard } from './components/KPICard';
import { DetailSidebar } from './components/DetailSidebar';
import { ActivityList } from './components/ActivityList';
import ResponseBarChart from './components/ResponseBarChart';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch real data
  const reports = await prisma.pingReport.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50,
    include: { monitor: true }
  });

  const monitors = await prisma.monitor.findMany({
    take: 1
  });

  if (reports.length === 0) {
    return <div className="p-10">No data available</div>;
  }

  const latest = reports[0];
  const total = reports.length;
  const successCount = reports.filter((r) => r.status === 'UP').length;
  const uptime = ((successCount / total) * 100).toFixed(1);
  const avgResponse = (reports.reduce((acc, curr) => acc + curr.responseTime, 0) / total).toFixed(0);
  
  // Data for Sidebar
  const recentPings = reports.slice(0, 10).map(r => r.responseTime);
  const maxPing = Math.max(...recentPings);
  
  // Mapping "Heart Rate" concepts to Ping concepts for the demo
  const stats = [
    { label: "Best", value: `${Math.min(...recentPings).toFixed(0)} ms` },
    { label: "Average", value: `${avgResponse} ms` },
    { label: "Peak", value: `${Math.max(...recentPings).toFixed(0)} ms` },
    { label: "Last", value: `${latest.responseTime.toFixed(0)} ms` }
  ];

  return (
    <div className="bg-[#F4F5F7] min-h-screen p-6 md:p-8 font-sans">
      {/* Main Wrapper Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm mx-auto max-w-[1600px]">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-12 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">GoPulse</span>
            </div>
            
            <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto no-scrollbar">
              <a href="#" className="flex items-center gap-2 text-gray-900 font-bold whitespace-nowrap">
                Dashboard
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 whitespace-nowrap">Monitors</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 whitespace-nowrap">Analytics</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 whitespace-nowrap">Incidents</a>
            </nav>
          </div>

          {/* Center: Context */}
          <div className="flex items-center gap-4 bg-[#F4F5F7] p-1.5 pl-4 pr-1.5 rounded-full hidden lg:flex">
             <div className="flex items-center gap-2 text-gray-500 text-sm font-medium border-r border-gray-200 pr-4">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
             </div>
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-gray-900 text-sm font-bold">
                <ClockIcon className="w-4 h-4 text-primary" />
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
          </div>

          {/* Right: Tools */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </Button>
            
            <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-3 transition-colors">
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden xl:block text-left">
                <p className="text-xs text-gray-900 font-bold">Admin User</p>
                <p className="text-[10px] text-gray-400 font-medium">Pro Plan</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="space-y-8">
          
          {/* Top Row: KPIs (4 Cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              icon={Activity} 
              title="Global Uptime" 
              value={`${uptime}`} 
              unit="%" 
              footer={<span><strong>+0.2%</strong> vs last week</span>}
            />
            <KPICard 
              icon={Timer} 
              title="Avg Response" 
              value={avgResponse} 
              unit="ms" 
              footer="Optimal performance"
            />
            <KPICard 
              icon={Zap} 
              title="Active Monitors" 
              value={total > 0 ? "1" : "0"} 
              subtitle="All Systems Operational"
              footer="Running smoothly"
            />
            <KPICard 
              icon={Heart} 
              title="Health Score" 
              value={latest.status === 'UP' ? 98 : 45} 
              unit="/100" 
              footer="Based on 50 checks"
            />
          </div>

          {/* Main Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar (1/3) */}
            <div className="lg:col-span-4 max-w-full">
              <DetailSidebar 
                monitorName={latest.monitor.name}
                currentValue={latest.responseTime.toFixed(0)}
                sparklineData={recentPings.map(p => Math.min(p, 100))} // Clamp for viz
                stats={stats}
              />
            </div>

            {/* Right Content (2/3) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1: Gauge (Simulated with simple CSS/SVG or just text for now) */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                   <h4 className="text-gray-900 font-bold self-start mb-4">Availability Zones</h4>
                   <div className="relative w-48 h-24 overflow-hidden mt-4">
                      <div className="w-48 h-48 rounded-full border-[12px] border-gray-100 border-t-primary border-r-primary border-l-transparent border-b-transparent transform -rotate-45" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
                        <div className="text-3xl font-bold">{uptime}%</div>
                        <div className="text-xs text-gray-400 font-medium">Target</div>
                      </div>
                   </div>
                   <div className="flex gap-4 mt-8 pb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-semibold text-gray-500">Up</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-200" />
                        <span className="text-xs font-semibold text-gray-500">Down</span>
                      </div>
                   </div>
                </div>

                {/* Chart 2: Bar Chart */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-gray-900 font-bold">Response Analysis</h4>
                    <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-lg py-1 px-2 cursor-pointer outline-none">
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  <div className="h-[200px]">
                     <ResponseBarChart data={reports.slice(0, 20).reverse()} />
                  </div>
                </div>
              </div>

              {/* Activity List Row */}
              <div>
                <ActivityList activities={reports.slice(0, 3)} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
