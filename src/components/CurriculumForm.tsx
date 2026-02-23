import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Building2, User, ChevronRight, ChevronLeft, Loader2, Upload, Briefcase, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function CurriculumForm({ onSubmit, isLoading }: FormProps) {
  const [mode, setMode] = useState<'institutional' | 'external' | 'corporate' | null>(null);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setStep(1);
  }, [mode]);

  const [formData, setFormData] = useState({
    institutionName: '',
    accreditationType: 'Autonomous',
    degreeType: 'B.Tech',
    duration: '4',
    totalCredits: '160',
    industryAlignment: 80,
    includeInternship: true,
    includeCapstone: true,
    branch: 'CSE',
    specialization: 'AI/ML',
    targetRole: '',
    companyContext: '',
    skillGap: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFile({
          name: selectedFile.name,
          data: base64,
          mimeType: selectedFile.type || 'application/pdf'
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  if (!mode) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            onClick={() => setMode('institutional')}
            className="group glass-panel p-8 rounded-3xl text-left hover:border-indigo-500 transition-all hover:shadow-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Building2 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Institutional</h3>
            <p className="text-zinc-600">For universities looking for accreditation-ready frameworks.</p>
          </button>

          <button
            onClick={() => setMode('external')}
            className="group glass-panel p-8 rounded-3xl text-left hover:border-emerald-500 transition-all hover:shadow-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <User size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Personal</h3>
            <p className="text-zinc-600">For students seeking industry-aligned personalized paths.</p>
          </button>

          <button
            onClick={() => setMode('corporate')}
            className="group glass-panel p-8 rounded-3xl text-left hover:border-amber-500 transition-all hover:shadow-xl"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Briefcase size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Corporate</h3>
            <p className="text-zinc-600">For companies looking to upskill teams for specific roles.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-12 px-6">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => setMode(null)} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
          <ChevronLeft size={16} /> Change Mode
        </button>
        <div className="flex gap-2">
          {[1, 2].map(i => (
            <div key={i} className={cn("h-1.5 w-12 rounded-full transition-all", step >= i ? "bg-indigo-600" : "bg-zinc-200")} />
          ))}
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel p-8 rounded-3xl"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Basic Details</h3>
            {mode === 'institutional' ? (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Institution Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    placeholder="e.g. Stanford University"
                    value={formData.institutionName}
                    onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Degree Type</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                      placeholder="e.g. B.Tech"
                      value={formData.degreeType}
                      onChange={e => setFormData({ ...formData, degreeType: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Branch</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                      placeholder="e.g. CSE"
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Specialization (Optional)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    placeholder="e.g. AI/ML"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Accreditation Type</label>
                  <select
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    value={formData.accreditationType}
                    onChange={e => setFormData({ ...formData, accreditationType: e.target.value })}
                  >
                    <option>NAAC</option>
                    <option>NBA</option>
                    <option>Autonomous</option>
                    <option>Global Standard</option>
                  </select>
                </div>
              </div>
            ) : mode === 'corporate' ? (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Target Role</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    placeholder="e.g. Senior Cloud Architect"
                    value={formData.targetRole}
                    onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Specialization (Optional)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    placeholder="e.g. AWS Security"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Company Context</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    placeholder="e.g. Fintech Startup scaling to AWS"
                    value={formData.companyContext}
                    onChange={e => setFormData({ ...formData, companyContext: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Degree Type</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                      placeholder="e.g. B.Tech"
                      value={formData.degreeType}
                      onChange={e => setFormData({ ...formData, degreeType: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Branch</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                      placeholder="e.g. CSE"
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Specialization (Optional)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm"
                    placeholder="e.g. AI/ML"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-white font-bold hover:bg-indigo-500 transition-all"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Industry Alignment ({formData.industryAlignment}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={formData.industryAlignment}
                onChange={e => setFormData({ ...formData, industryAlignment: parseInt(e.target.value) })}
              />
            </div>
            
            {mode === 'corporate' && (
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Skill Gap Analysis</label>
                <textarea
                  className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 shadow-sm h-24"
                  placeholder="Describe the skills your team is missing..."
                  value={formData.skillGap}
                  onChange={e => setFormData({ ...formData, skillGap: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
              <div>
                <p className="font-medium text-zinc-900">Include Internship</p>
                <p className="text-sm text-zinc-500">Add mandatory industry internship</p>
              </div>
              <input
                type="checkbox"
                className="h-6 w-6 rounded text-indigo-600 focus:ring-indigo-500"
                checked={formData.includeInternship}
                onChange={e => setFormData({ ...formData, includeInternship: e.target.checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
              <div>
                <p className="font-medium text-zinc-900">Include Capstone</p>
                <p className="text-sm text-zinc-500">Final year major project</p>
              </div>
              <input
                type="checkbox"
                className="h-6 w-6 rounded text-indigo-600 focus:ring-indigo-500"
                checked={formData.includeCapstone}
                onChange={e => setFormData({ ...formData, includeCapstone: e.target.checked })}
              />
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer",
                file ? "border-indigo-500 bg-indigo-50/50" : "border-zinc-200 hover:border-indigo-300"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="text-indigo-600 mb-2" size={32} />
                  <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="mt-2 text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <X size={12} /> Remove file
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-zinc-400 mb-2" size={32} />
                  <p className="text-sm font-medium text-zinc-900">Upload Previous Curriculum (Optional)</p>
                  <p className="text-xs text-zinc-500 mt-1">PDF, DOCX or TXT up to 10MB</p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 rounded-xl border border-zinc-200 py-4 font-bold hover:bg-zinc-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => onSubmit({ mode, details: formData, file })}
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-white font-bold hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Generate Curriculum"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
