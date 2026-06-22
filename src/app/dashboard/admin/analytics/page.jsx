"use client";
import { useState, useEffect } from "react";
import AnalyticsCards from "./_components/AnalyticsCards";
import AnalyticsCharts from "./_components/AnalyticsCharts";


export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/analytics-data`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        
        const result = await res.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [baseUrl]);

  return (
    <div className="w-full min-h-screen text-slate-200 p-6 space-y-6">
      
 
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Overview</h1>
        
      </div>

      <div className="w-full border-t border-slate-800/60 my-2"></div>

      {loading ? (
      
        <div className="flex flex-col justify-center items-center py-32 text-indigo-500">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500">Assembling interactive visual charts...</p>
        </div>
      ) : !stats ? (
       
        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-[#0b0f19]">
          Failed to load dashboard metrics.
        </div>
      ) : (
   
        <div className="space-y-6">
        
          <AnalyticsCards stats={stats} />
          
      
          <AnalyticsCharts 
            salesData={stats.salesData} 
            categoryData={stats.categoryData} 
          />
        </div>
      )}
    </div>
  );
}