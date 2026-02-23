import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Briefcase, Search, Filter } from 'lucide-react';
import { IndustryTrend } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '../lib/utils';

export default function TrendsDashboard() {
  const [trends, setTrends] = useState<IndustryTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/trends')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch trends');
        return res.json();
      })
      .then(data => {
        setTrends(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredTrends = trends.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const chartData = React.useMemo(() => {
    if (trends.length === 0) return [];
    const years = trends[0].growth.length;
    return Array.from({ length: years }, (_, i) => {
      const entry: any = { year: 2022 + i };
      trends.forEach(t => {
        entry[t.name] = t.growth[i];
      });
      return entry;
    });
  }, [trends]);

  if (loading) return <div className="p-24 text-center">Loading trends...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 font-serif italic">Industry Trends Dashboard</h2>
          <p className="text-zinc-500 mt-1">Real-time analysis of global technology adoption and job market demand.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search technologies..."
              className="pl-10 pr-4 py-2 rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">Technology Growth (2022–2026)</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                {trends.slice(0, 5).map((t, i) => (
                  <Area key={t.name} type="monotone" dataKey={t.name} stroke={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]} fillOpacity={1} fill="url(#colorVal)" />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl bg-indigo-600 text-white border-none">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp size={24} />
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Hot</span>
            </div>
            <p className="text-sm font-medium opacity-80">Highest Growth</p>
            <p className="text-3xl font-bold mt-1">LangChain (AI)</p>
            <p className="text-sm mt-4 opacity-80">+85% adoption in 12 months</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Briefcase size={24} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Job Market Demand</p>
            <p className="text-3xl font-bold mt-1">Python & AWS</p>
            <p className="text-sm mt-4 text-emerald-600 font-medium">92% Industry Requirement</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Users size={24} className="text-amber-600" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Learning Curve</p>
            <p className="text-3xl font-bold mt-1">Moderate</p>
            <p className="text-sm mt-4 text-zinc-500">Average 6 months to proficiency</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend, i) => (
          <motion.div
            key={trend.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel p-6 rounded-2xl hover:border-indigo-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">{trend.name}</h4>
              <span className={cn(
                "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                trend.demand > 80 ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-600"
              )}>
                {trend.demand > 80 ? 'High Demand' : 'Stable'}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-500">Adoption Rate</span>
                  <span className="text-zinc-900">{trend.adoption}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full group-hover:bg-indigo-500 transition-all" style={{ width: `${trend.adoption}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-500">Job Demand</span>
                  <span className="text-zinc-900">{trend.demand}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full group-hover:bg-emerald-500 transition-all" style={{ width: `${trend.demand}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
