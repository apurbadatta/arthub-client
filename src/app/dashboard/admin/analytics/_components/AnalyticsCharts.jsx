"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export default function AnalyticsCharts({ salesData, categoryData }) {
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
      <div className="lg:col-span-2 bg-[#0b111e] border border-slate-800/80 p-5 rounded-xl shadow-xl flex flex-col justify-between">
        <h3 className="text-xs font-bold text-slate-400 mb-4 tracking-wide uppercase">Sales Timeline Growth</h3>
        <div className="w-full h-72 text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

  
      <div className="bg-[#0b111e] border border-slate-800/80 p-5 rounded-xl shadow-xl flex flex-col justify-between">
        <h3 className="text-xs font-bold text-slate-400 mb-2 tracking-wide uppercase">Artworks by Category</h3>
        <div className="w-full h-64 flex justify-center items-center text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="48%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ bottom: -5 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}