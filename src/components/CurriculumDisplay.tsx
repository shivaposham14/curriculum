import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, RefreshCw, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, ChevronRight, Box, Target, Leaf, DollarSign, ExternalLink, Edit3, Save, X, Plus, Trash2, BarChart3, Clock, Briefcase, GraduationCap, BookOpen, Layers } from 'lucide-react';
import { Curriculum, Subject, Semester } from '../types';
import Markdown from 'react-markdown';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

function SubjectModal({ subject, onClose }: { subject: Subject; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-zinc-400">{subject.code}</span>
          <h2 className="text-xl font-bold text-zinc-900">{subject.name}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-indigo-50 p-6 rounded-3xl">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Clock size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Hours/Week</span>
            </div>
            <p className="text-3xl font-bold text-indigo-900">{subject.hours_per_week || 4} hrs</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-3xl">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Credits</span>
            </div>
            <p className="text-3xl font-bold text-emerald-900">{subject.credits}</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-3xl md:col-span-2">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <GraduationCap size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Learning Outcomes</span>
            </div>
            <ul className="space-y-1">
              {(subject.learning_outcomes || ['Master core concepts', 'Apply practical skills']).map((outcome, i) => (
                <li key={i} className="text-sm font-medium text-amber-900 flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Syllabus Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                <BookOpen className="text-indigo-600" /> Detailed Syllabus
              </h3>
              <div className="space-y-6">
                {(subject.units || []).map((unit, idx) => (
                  <div key={idx} className="border border-zinc-100 rounded-2xl overflow-hidden">
                    <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                      <h4 className="font-bold text-zinc-900">Unit {idx + 1}: {unit.title}</h4>
                    </div>
                    <div className="p-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {(unit.topics || []).map((topic, i) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-300 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                <ExternalLink className="text-amber-600" /> Suggested Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(subject.suggested_projects || []).map((project, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-zinc-900">{project.title}</h5>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                        project.difficulty === 'Beginner' && "bg-emerald-50 text-emerald-600",
                        project.difficulty === 'Intermediate' && "bg-amber-50 text-amber-600",
                        project.difficulty === 'Advanced' && "bg-rose-50 text-rose-600"
                      )}>
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900 text-white p-8 rounded-3xl">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-400" /> Career Alignment
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Future Jobs</p>
                  <div className="flex flex-wrap gap-2">
                    {(subject.future_jobs || ['Specialist', 'Consultant']).map(job => (
                      <span key={job} className="text-xs bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg">
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Industry Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {(subject.required_tools || []).map(tool => (
                      <span key={tool} className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 p-8 rounded-3xl">
              <h4 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Target size={20} className="text-indigo-600" /> Future Scope
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed italic">
                "{subject.future_scope}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SubjectDetail({ subject, isEditing, onUpdate, onDelete, onViewDetails }: { 
  subject: Subject; 
  isEditing: boolean; 
  onUpdate: (updated: Subject) => void;
  onDelete: () => void;
  onViewDetails: () => void;
}) {
  if (isEditing) {
    return (
      <div className="border-b border-zinc-100 p-6 bg-zinc-50/30 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Code</label>
            <input 
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm"
              value={subject.code}
              onChange={(e) => onUpdate({ ...subject, code: e.target.value })}
            />
          </div>
          <div className="flex-[3] space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Subject Name</label>
            <input 
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm"
              value={subject.name}
              onChange={(e) => onUpdate({ ...subject, name: e.target.value })}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Credits</label>
            <input 
              type="number"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm"
              value={subject.credits}
              onChange={(e) => onUpdate({ ...subject, credits: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-end pb-1">
            <button 
              onClick={onDelete}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Type</label>
            <select 
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm"
              value={subject.type}
              onChange={(e) => onUpdate({ ...subject, type: e.target.value as any })}
            >
              <option>Core</option>
              <option>Adaptive</option>
              <option>Emerging</option>
              <option>Elective</option>
              <option>Non-Credit</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input 
              type="checkbox"
              id={`lab-${subject.code}`}
              checked={subject.lab_required}
              onChange={(e) => onUpdate({ ...subject, lab_required: e.target.checked })}
              className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={`lab-${subject.code}`} className="text-sm font-medium text-zinc-700">Lab Required</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-100 last:border-0">
      <div 
        className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
        onClick={onViewDetails}
      >
        <div className="flex items-center gap-4 flex-1">
          <span className="text-sm font-mono text-zinc-400 w-20">{subject.code}</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{subject.name}</span>
              {subject.lab_required && (
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Lab</span>
              )}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider mt-0.5",
              subject.type === 'Core' && "text-blue-600",
              subject.type === 'Adaptive' && "text-emerald-600",
              subject.type === 'Emerging' && "text-amber-600",
              subject.type === 'Elective' && "text-purple-600",
              subject.type === 'Non-Credit' && "text-zinc-400",
            )}>
              {subject.type}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-sm font-bold text-zinc-900">{subject.credits} Credits</span>
          <ChevronRight size={18} className="text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}

export default function CurriculumDisplay({ 
  data, 
  onRegenerate, 
  onUpdate,
  onCompare
}: { 
  data: Curriculum; 
  onRegenerate: () => void;
  onUpdate: (updated: Curriculum) => void;
  onCompare?: () => void;
}) {
  const [activeSemester, setActiveSemester] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Curriculum>(data);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    setEditData(data);
  }, [data]);
  
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  const getDistribution = (semesters: Semester[]) => [
    { name: 'Core', value: semesters.reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Core').length, 0) },
    { name: 'Adaptive', value: semesters.reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Adaptive').length, 0) },
    { name: 'Emerging', value: semesters.reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Emerging').length, 0) },
    { name: 'Elective', value: semesters.reduce((acc, sem) => acc + (sem.subjects || []).filter(s => s.type === 'Elective').length, 0) },
  ];

  const distributionData = getDistribution(editData.semesters || []);
  const currentSemester = (editData.semesters || []).find(s => s.semester === activeSemester);
  const semesterDistribution = currentSemester ? getDistribution([currentSemester]) : [];

  const skillChartData = (editData.skill_mapping || []).map(s => ({
    name: s.skill,
    count: (s.subjects || []).length
  }));

  const handleUpdateSubject = (semesterNum: number, subjectCode: string, updatedSubject: Subject) => {
    const newSemesters = editData.semesters.map(sem => {
      if (sem.semester === semesterNum) {
        return {
          ...sem,
          subjects: sem.subjects.map(sub => sub.code === subjectCode ? updatedSubject : sub)
        };
      }
      return sem;
    });
    
    const totalCredits = newSemesters.reduce((acc, sem) => acc + sem.subjects.reduce((sAcc, sub) => sAcc + sub.credits, 0), 0);
    setEditData({ ...editData, semesters: newSemesters, total_credits: totalCredits });
  };

  const handleDeleteSubject = (semesterNum: number, subjectCode: string) => {
    const newSemesters = editData.semesters.map(sem => {
      if (sem.semester === semesterNum) {
        return {
          ...sem,
          subjects: sem.subjects.filter(sub => sub.code !== subjectCode)
        };
      }
      return sem;
    });
    
    const actualTotalCredits = newSemesters.reduce((acc, sem) => acc + sem.subjects.reduce((sAcc, sub) => sAcc + sub.credits, 0), 0);
    setEditData({ ...editData, semesters: newSemesters, total_credits: actualTotalCredits });
  };

  const handleAddSubject = (semesterNum: number) => {
    const newSubject: Subject = {
      code: `NEW-${Math.floor(Math.random() * 1000)}`,
      name: 'New Subject',
      credits: 3,
      type: 'Core',
      lab_required: false,
      future_scope: 'TBD',
      required_tools: [],
      suggested_projects: [],
      hours_per_week: 4,
      future_jobs: [],
      learning_outcomes: [],
      units: Array(5).fill(null).map((_, i) => ({
        title: `Unit ${i + 1}`,
        topics: ['Topic 1', 'Topic 2']
      }))
    };

    const newSemesters = editData.semesters.map(sem => {
      if (sem.semester === semesterNum) {
        return {
          ...sem,
          subjects: [...sem.subjects, newSubject]
        };
      }
      return sem;
    });

    const totalCredits = newSemesters.reduce((acc, sem) => acc + sem.subjects.reduce((sAcc, sub) => sAcc + sub.credits, 0), 0);
    setEditData({ ...editData, semesters: newSemesters, total_credits: totalCredits });
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold text-zinc-900">{editData.degree} in {editData.branch}</h2>
          </div>
          <p className="text-zinc-500">Specialization: {editData.specialization || 'General'}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {onCompare && (
            <button 
              onClick={onCompare}
              className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-200"
            >
              <RefreshCw size={16} /> Compare Curricula
            </button>
          )}
          {isEditing ? (
            <>
              <button 
                onClick={() => { setEditData(data); setIsEditing(false); }} 
                className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition-all"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all"
              >
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition-all"
              >
                <Edit3 size={16} /> Edit Curriculum
              </button>
              <button onClick={onRegenerate} className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition-all">
                <RefreshCw size={16} /> Regenerate
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-all">
                <Download size={16} /> Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Industry Score</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1"><Target size={12} /> Alignment</span>
              <span>{editData.industry_score}%</span>
            </div>
            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full" style={{ width: `${editData.industry_score}%` }} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-emerald-600 text-xs font-medium">
            <CheckCircle2 size={14} /> Validated
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Sustainability</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1 text-emerald-600"><Leaf size={12} /> Score</span>
              <span>{editData.sustainability_score}%</span>
            </div>
            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full" style={{ width: `${editData.sustainability_score}%` }} />
            </div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} innerRadius={20} outerRadius={30} paddingAngle={5} dataKey="value">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Distribution</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
              {distributionData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 text-[9px] font-bold uppercase">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {d.name}: {d.value}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={semesterDistribution} innerRadius={20} outerRadius={30} paddingAngle={5} dataKey="value">
                  {semesterDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sem {activeSemester} Distribution</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
              {semesterDistribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 text-[9px] font-bold uppercase">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {d.name}: {d.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Curriculum Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Horizontal Semester Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {editData.semesters.map((sem) => (
              <button
                key={sem.semester}
                onClick={() => setActiveSemester(sem.semester)}
                className={cn(
                  "flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold transition-all border",
                  activeSemester === sem.semester 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-indigo-300"
                )}
              >
                Semester {sem.semester}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentSemester && (
              <motion.div
                key={activeSemester}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="glass-panel rounded-3xl overflow-hidden"
              >
                <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900">Semester {activeSemester} Overview</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-indigo-600">{currentSemester.total_credits} Total Credits</span>
                    {isEditing && (
                      <button 
                        onClick={() => handleAddSubject(activeSemester)}
                        className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                      >
                        <Plus size={14} /> Add Subject
                      </button>
                    )}
                  </div>
                </div>
                {currentSemester.analysis && (
                  <div className="px-6 py-4 bg-indigo-50/30 border-b border-zinc-100">
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Semester Analysis</span>
                      {currentSemester.analysis}
                    </p>
                  </div>
                )}
                <div className="divide-y divide-zinc-100">
                  {currentSemester.subjects.map((sub) => (
                    <SubjectDetail 
                      key={sub.code} 
                      subject={sub} 
                      isEditing={isEditing}
                      onUpdate={(updated) => handleUpdateSubject(activeSemester, sub.code, updated)}
                      onDelete={() => handleDeleteSubject(activeSemester, sub.code)}
                      onViewDetails={() => setSelectedSubject(sub)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skill Mapping Visualization */}
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 size={24} className="text-indigo-600" /> Skill Coverage Analysis
              </h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f1f1" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#52525b' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-3xl sticky top-24">
            <h4 className="flex items-center gap-2 text-lg font-bold mb-4">
              <Info size={20} className="text-indigo-600" /> AI Analysis
            </h4>
            <div className="prose prose-sm prose-zinc">
              <Markdown>{editData.explanation}</Markdown>
            </div>

            <div className="mt-8">
              <h5 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wider">Skill Mapping</h5>
              <div className="space-y-4">
                {editData.skill_mapping.map((skill) => (
                  <div key={skill.skill}>
                    <p className="text-sm font-medium text-zinc-700 mb-1">{skill.skill}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.subjects.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h5 className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-2">
                <AlertCircle size={16} /> Recommendations
              </h5>
              <p className="text-xs text-amber-800 leading-relaxed">
                {editData.recommendations}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedSubject && (
          <SubjectModal 
            subject={selectedSubject} 
            onClose={() => setSelectedSubject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
