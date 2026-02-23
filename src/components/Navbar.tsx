import React from 'react';
import { GraduationCap, TrendingUp, Github, RefreshCw } from 'lucide-react';

export default function Navbar({ onNavigate, onCompare, canCompare }: { 
  onNavigate: (page: 'home' | 'generate' | 'trends') => void;
  onCompare?: () => void;
  canCompare?: boolean;
}) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          className="flex cursor-pointer items-center gap-2" 
          onClick={() => onNavigate('home')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">CurricuForge</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('generate')}
            className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors"
          >
            Generate
          </button>
          <button 
            onClick={() => onNavigate('trends')}
            className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors"
          >
            Industry Trends
          </button>
          {canCompare && (
            <button 
              onClick={onCompare}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              <RefreshCw size={16} /> Compare
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-600">
            <Github size={20} />
          </a>
          <button 
            onClick={() => onNavigate('generate')}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-all shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
