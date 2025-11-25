import React, { useState } from 'react';
import { UserData } from '../types';

interface InputFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

interface CustomMilestoneState {
  title: string;
  age: string;
  emoji: string;
}

const COMMON_EMOJIS = ["🏠", "🎓", "💍", "👶", "🚀", "💰", "🌍", "🏆", "🏔️", "🎸", "📚", "🏥", "🐕"];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    birthDate: '',
    ethnicity: '',
    gender: 'other',
    heightCm: undefined,
    weightKg: undefined,
    bloodPressureSys: undefined,
    bloodPressureDia: undefined,
    bloodSugar: undefined,
    activityLevel: 'moderate',
    customMilestones: []
  });

  const [newMilestone, setNewMilestone] = useState<CustomMilestoneState>({
    title: '',
    age: '',
    emoji: '🎯'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ethnicity' || name === 'birthDate' || name === 'gender' || name === 'activityLevel'
        ? value 
        : value === '' ? undefined : Number(value)
    }));
  };

  const handleAddMilestone = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newMilestone.title && newMilestone.age) {
      setFormData(prev => ({
        ...prev,
        customMilestones: [
          ...(prev.customMilestones || []),
          {
            title: newMilestone.title,
            age: Number(newMilestone.age),
            emoji: newMilestone.emoji
          }
        ]
      }));
      setNewMilestone({ title: '', age: '', emoji: '🎯' });
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customMilestones: prev.customMilestones?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full bg-paper-50 border-2 border-paper-200 rounded-lg px-4 py-3 text-ink-900 focus:ring-0 focus:border-black outline-none transition-all placeholder-ink-400 font-medium";
  const labelClasses = "block text-xs font-bold text-ink-900 uppercase tracking-widest mb-1 font-display";

  return (
    <div className="w-full max-w-3xl mx-auto relative">
        <div className="relative p-8 md:p-12 bg-white rounded-[2rem] border border-paper-200 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-ink-900 font-display tracking-tighter">Life in Weeks</h2>
            <p className="text-ink-500 text-lg font-medium max-w-md mx-auto">
              Mapping the finite journey of human existence through biological, sociological, and personal milestones.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section: Basics */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-paper-100">
                <span className="text-xl bg-black text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">1</span>
                <h3 className="text-lg font-bold text-ink-900 font-display uppercase tracking-wider">Demographics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses}>Date of Birth</label>
                  <input
                    type="date"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Biological Sex</label>
                  <div className="relative">
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Context */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-paper-100">
                <span className="text-xl bg-black text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">2</span>
                <h3 className="text-lg font-bold text-ink-900 font-display uppercase tracking-wider">Context</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className={labelClasses}>Ethnicity <span className="text-ink-400 normal-case tracking-normal font-normal">(Affects statistical data)</span></label>
                   <input
                    type="text"
                    name="ethnicity"
                    placeholder="e.g., East Asian, Hispanic"
                    value={formData.ethnicity}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Activity Level</label>
                  <div className="relative">
                    <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="athlete">Athlete</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Custom Milestones */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-paper-100">
                 <span className="text-xl bg-black text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">3</span>
                 <h3 className="text-lg font-bold text-ink-900 font-display uppercase tracking-wider">Goals & Milestones</h3>
                 <span className="text-[10px] font-bold bg-white border border-paper-200 px-3 py-1 rounded-full uppercase tracking-wider text-ink-500 ml-auto">Optional</span>
              </div>
              
              <div className="bg-paper-50 p-6 rounded-xl border border-paper-200 space-y-4">
                 <p className="text-sm text-ink-500 mb-4">Add your own dreams or expected events to visualize them on your life map.</p>
                 
                 <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="w-full md:w-1/2 space-y-1">
                      <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider">Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Climb Everest" 
                        className={inputClasses} 
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone(prev => ({...prev, title: e.target.value}))}
                      />
                    </div>
                    <div className="w-full md:w-1/4 space-y-1">
                      <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider">Age</label>
                      <input 
                        type="number" 
                        placeholder="45" 
                        className={inputClasses}
                        value={newMilestone.age}
                        onChange={(e) => setNewMilestone(prev => ({...prev, age: e.target.value}))}
                       />
                    </div>
                    <div className="w-full md:w-auto space-y-1">
                       <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider">Icon</label>
                       <div className="relative group">
                          <input 
                            type="text" 
                            className={`${inputClasses} w-full md:w-20 text-center`}
                            value={newMilestone.emoji}
                            onChange={(e) => setNewMilestone(prev => ({...prev, emoji: e.target.value}))}
                          />
                          <div className="hidden group-hover:flex absolute bottom-full left-0 mb-2 bg-white p-2 rounded-lg shadow-xl border border-paper-200 gap-1 flex-wrap w-48 z-10">
                              {COMMON_EMOJIS.map(em => (
                                <button key={em} onClick={(e) => { e.preventDefault(); setNewMilestone(prev => ({...prev, emoji: em}))}} className="w-8 h-8 hover:bg-paper-100 rounded flex items-center justify-center text-lg">
                                  {em}
                                </button>
                              ))}
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={handleAddMilestone}
                      className="w-full md:w-auto px-6 py-3 bg-white border-2 border-paper-200 hover:border-black text-black font-bold rounded-lg uppercase tracking-wider text-xs h-[52px] transition-colors"
                    >
                      Add
                    </button>
                 </div>

                 {/* List of added milestones */}
                 {formData.customMilestones && formData.customMilestones.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-paper-200">
                      {formData.customMilestones.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white pl-3 pr-2 py-2 rounded-lg border border-paper-200 shadow-sm">
                           <span className="text-lg">{m.emoji}</span>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-ink-900">{m.title}</span>
                              <span className="text-[10px] text-ink-500 font-mono">Age {m.age}</span>
                           </div>
                           <button onClick={() => removeMilestone(idx)} className="ml-2 text-ink-400 hover:text-red-500 p-1">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                           </button>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </div>

            {/* Section: Biometrics */}
            <div className="bg-paper-50 p-8 rounded-xl border border-paper-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-black text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">4</span>
                  <h3 className="text-lg font-bold text-ink-900 font-display uppercase tracking-wider">Biometrics</h3>
                </div>
                <span className="text-[10px] font-bold bg-white border border-paper-200 px-3 py-1 rounded-full uppercase tracking-wider text-ink-500">Optional</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="space-y-2">
                  <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider block text-center">Height (cm)</label>
                  <input
                    type="number"
                    name="heightCm"
                    placeholder="-"
                    value={formData.heightCm || ''}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-paper-200 rounded-lg px-3 py-3 text-ink-900 focus:border-black outline-none text-center font-mono font-bold"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider block text-center">Weight (kg)</label>
                  <input
                    type="number"
                    name="weightKg"
                    placeholder="-"
                    value={formData.weightKg || ''}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-paper-200 rounded-lg px-3 py-3 text-ink-900 focus:border-black outline-none text-center font-mono font-bold"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider block text-center">BP (Sys)</label>
                  <input
                    type="number"
                    name="bloodPressureSys"
                    placeholder="120"
                    value={formData.bloodPressureSys || ''}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-paper-200 rounded-lg px-3 py-3 text-ink-900 focus:border-black outline-none text-center font-mono font-bold"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-[10px] text-ink-500 font-bold uppercase tracking-wider block text-center">Sugar</label>
                  <input
                    type="number"
                    name="bloodSugar"
                    placeholder="mg/dL"
                    value={formData.bloodSugar || ''}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-paper-200 rounded-lg px-3 py-3 text-ink-900 focus:border-black outline-none text-center font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-ink-900 text-white font-bold py-5 rounded-xl shadow-lg transform transition-all hover:translate-y-[-2px] active:translate-y-[0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg tracking-widest uppercase font-display"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Actuarial Data...
                </>
              ) : (
                'Generate Life Map'
              )}
            </button>
            <p className="text-center text-[10px] text-ink-400 font-medium">
              DISCLAIMER: For entertainment purposes only. Not medical advice. inspiration  https://waitbutwhy.com/2014/05/life-weeks.html
            </p>
          </form>
        </div>
    </div>
  );
};