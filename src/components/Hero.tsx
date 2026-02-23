import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BarChart3, BookOpen, ArrowRight, TrendingUp } from 'lucide-react';

export default function Hero({ onGenerate, onViewTrends }: { onGenerate: () => void, onViewTrends: () => void }) {
  return (
    <div className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              <Sparkles size={14} />
              AI-Powered Curriculum Design
            </span>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Forge the Future of <span className="gradient-text">Education</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              CurricuForge uses advanced AI to design industry-aligned, accreditation-ready curricula for institutions and students. Stay ahead of the curve with real-time trend integration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={onGenerate}
                className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-500 transition-all"
              >
                Generate Curriculum
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onViewTrends}
                className="flex items-center gap-2 text-lg font-semibold leading-6 text-zinc-900 hover:text-indigo-600 transition-colors"
              >
                View Trends <BarChart3 size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              title: "Institutional Design",
              desc: "Accreditation-ready reports with OBE and CO-PO mapping for universities.",
              icon: <BookOpen className="text-indigo-600" />,
            },
            {
              title: "Industry Aligned",
              desc: "Curricula mapped to real-world job market demands and emerging technologies.",
              icon: <TrendingUp className="text-emerald-600" />,
            },
            {
              title: "Student Focused",
              desc: "Personalized learning paths with logical difficulty progression and skill building.",
              icon: <Sparkles className="text-amber-600" />,
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-zinc-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
