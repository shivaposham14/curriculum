import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowRight, Target, Leaf, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { Curriculum } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

export default function ComparisonView({ 
  curricula, 
  onClose 
}: { 
  curricula: [Curriculum, Curriculum]; 
  onClose: () => void;
}) {
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];
  
  const getDistribution = (data: Curriculum) => [
    { name: 'Core', value: (data.semesters || []).reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Core').length, 0) },
    { name: 'Adaptive', value: (data.semesters || []).reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Adaptive').length, 0) },
    { name: 'Emerging', value: (data.semesters || []).reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Emerging').length, 0) },
    { name: 'Elective', value: (data.semesters || []).reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Elective').length, 0) },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Curriculum Comparison</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {curricula.map((cur, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="pb-6 border-b border-zinc-100">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 block">
                  Curriculum {idx + 1}
                </span>
                <h3 className="text-2xl font-bold text-zinc-900">{cur.degree} in {cur.branch}</h3>
                <p className="text-zinc-500">{cur.specialization || 'General'}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Credits</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1">{cur.total_credits}</p>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Industry Score</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{cur.industry_score}%</p>
                </div>
              </div>

              {/* Impact Scores */}
              <div className="bg-zinc-50 p-6 rounded-3xl space-y-4">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                  <Target size={16} /> Impact Analysis
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Sustainability</span>
                      <span className="text-emerald-600">{cur.sustainability_score}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${cur.sustainability_score}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="bg-zinc-50 p-6 rounded-3xl">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <PieChartIcon size={16} /> Subject Distribution
                </h4>
                <div className="flex items-center gap-8">
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={getDistribution(cur)} 
                          innerRadius={40} 
                          outerRadius={60} 
                          paddingAngle={5} 
                          dataKey="value"
                        >
                          {getDistribution(cur).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 gap-y-2">
                    {getDistribution(cur).map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        {d.name}: {d.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Semester Summary */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Semester-wise Credits</h4>
                <div className="flex flex-wrap gap-2">
                  {cur.semesters.map(sem => (
                    <div key={sem.semester} className="bg-white border border-zinc-200 px-3 py-2 rounded-xl text-center min-w-[80px]">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Sem {sem.semester}</p>
                      <p className="text-sm font-bold text-zinc-900">{sem.total_credits}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Summary Table */}
        <div className="mt-16 bg-zinc-900 rounded-3xl p-8 text-white">
          <h3 className="text-xl font-bold mb-8">Direct Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-sm font-bold text-zinc-400 uppercase tracking-widest">Feature</th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest">Curriculum 1</th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest">Curriculum 2</th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { label: 'Total Credits', val1: curricula[0].total_credits, val2: curricula[1].total_credits },
                  { label: 'Industry Score', val1: curricula[0].industry_score, val2: curricula[1].industry_score, suffix: '%' },
                  { label: 'Sustainability', val1: curricula[0].sustainability_score, val2: curricula[1].sustainability_score, suffix: '%' },
                  { label: 'Core Subjects', val1: (curricula[0].semesters || []).reduce((acc, s) => acc + (s.subjects || []).filter(sub => sub.type === 'Core').length, 0), val2: (curricula[1].semesters || []).reduce((acc, s) => acc + (s.subjects || []).filter(sub => sub.type === 'Core').length, 0) },
                  { label: 'Emerging Tech', val1: (curricula[0].semesters || []).reduce((acc, s) => acc + (s.subjects || []).filter(sub => sub.type === 'Emerging').length, 0), val2: (curricula[1].semesters || []).reduce((acc, s) => acc + (s.subjects || []).filter(sub => sub.type === 'Emerging').length, 0) },
                ].map((row, idx) => {
                  const diff = row.val1 - row.val2;
                  return (
                    <tr key={idx}>
                      <td className="py-4 text-sm font-medium text-zinc-400">{row.label}</td>
                      <td className="py-4 font-bold">{row.val1}{row.suffix}</td>
                      <td className="py-4 font-bold">{row.val2}{row.suffix}</td>
                      <td className={cn(
                        "py-4 font-bold",
                        diff > 0 ? "text-emerald-400" : diff < 0 ? "text-rose-400" : "text-zinc-500"
                      )}>
                        {diff > 0 ? '+' : ''}{diff}{row.suffix}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
