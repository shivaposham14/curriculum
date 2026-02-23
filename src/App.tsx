import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CurriculumForm from './components/CurriculumForm';
import CurriculumDisplay from './components/CurriculumDisplay';
import TrendsDashboard from './components/TrendsDashboard';
import ComparisonView from './components/ComparisonView';
import { generateCurriculum } from './services/geminiService';
import { Curriculum } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [page, setPage] = useState<'home' | 'generate' | 'trends'>('home');
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [history, setHistory] = useState<Curriculum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastParams, setLastParams] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleGenerate = async (params: any) => {
    setIsLoading(true);
    setLastParams(params);
    try {
      const result = await generateCurriculum(params);
      setCurriculum(result);
      setHistory(prev => [result, ...prev].slice(0, 5)); // Keep last 5
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate curriculum. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastParams) handleGenerate(lastParams);
  };

  const handleUpdateCurriculum = (updated: Curriculum) => {
    setCurriculum(updated);
    setHistory(prev => prev.map(c => 
      c.degree === updated.degree && 
      c.branch === updated.branch && 
      c.specialization === updated.specialization 
        ? updated 
        : c
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavigate={(p) => {
          setPage(p);
          if (p !== 'generate') setCurriculum(null);
        }} 
        onCompare={() => setIsComparing(true)}
        canCompare={history.length >= 2}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onGenerate={() => setPage('generate')} 
                onViewTrends={() => setPage('trends')} 
              />
            </motion.div>
          )}

          {page === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {curriculum ? (
                <CurriculumDisplay 
                  data={curriculum} 
                  onRegenerate={handleRegenerate} 
                  onUpdate={handleUpdateCurriculum}
                  onCompare={history.length >= 2 ? () => setIsComparing(true) : undefined}
                />
              ) : (
                <CurriculumForm 
                  onSubmit={handleGenerate} 
                  isLoading={isLoading} 
                />
              )}
            </motion.div>
          )}

          {page === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TrendsDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {isComparing && history.length >= 2 && (
            <ComparisonView 
              curricula={[history[0], history[1]]} 
              onClose={() => setIsComparing(false)} 
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
              <span className="text-lg font-bold tracking-tight">CurricuForge</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2026 CurricuForge AI. All rights reserved. Built for the future of education.
            </p>
            <div className="flex gap-6 text-sm font-medium text-zinc-600">
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
