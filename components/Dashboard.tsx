import React from 'react';
import { LifeExpectancyResult, UserData } from '../types';
import { LifeGrid } from './LifeGrid';

interface DashboardProps {
  data: LifeExpectancyResult;
  userData: UserData;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, userData, onReset }) => {
  const percentageLived = ((data.weeksLived / data.totalWeeks) * 100).toFixed(1);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b-2 border-black pb-8">
        <div>
           <h1 className="text-5xl md:text-7xl font-bold text-black mb-2 font-display tracking-tight">Life in Weeks</h1>
           <p className="text-ink-500 text-xl font-medium">
             Projected Horizon: <span className="bg-black text-white px-2 py-1 font-mono font-bold rounded-sm">{data.estimatedAge} years</span>
           </p>
        </div>
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-white hover:bg-paper-100 text-black border-2 border-black font-bold rounded-lg transition-colors font-display tracking-widest uppercase shadow-sm"
        >
          Recalculate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Stats Card */}
        <div className="lg:col-span-4 bg-white border-2 border-paper-200 rounded-2xl p-8 shadow-sm h-full flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-6 font-display border-b border-paper-100 pb-2">Status</h3>
            
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold font-display text-black">{percentageLived}%</span>
                <span className="text-ink-500 font-medium">Completed</span>
            </div>

            <div className="w-full bg-paper-100 rounded-full h-4 overflow-hidden mb-8">
                <div 
                  className="bg-black h-full rounded-full" 
                  style={{ width: `${percentageLived}%` }}
                ></div>
            </div>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center p-4 bg-paper-50 rounded-xl">
                 <span className="text-sm font-bold text-ink-500 uppercase">Weeks Lived</span>
                 <span className="text-2xl font-mono font-bold text-black">{data.weeksLived.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-black text-white rounded-xl shadow-lg">
                 <span className="text-sm font-bold opacity-70 uppercase">Weeks Left</span>
                 <span className="text-2xl font-mono font-bold text-highlight-prime">{data.remainingWeeks.toLocaleString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Analysis Card */}
        <div className="lg:col-span-8 bg-white border-2 border-paper-200 rounded-2xl p-8 shadow-sm">
           <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-6 font-display border-b border-paper-100 pb-2">Actuarial Analysis</h3>
           <p className="text-black mb-8 text-2xl font-display font-medium leading-relaxed">"{data.analysis}"</p>
           
           <h4 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">Optimization Protocol</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {data.healthTips.map((tip, idx) => (
               <div key={idx} className="flex flex-col p-5 rounded-xl bg-paper-50 border border-paper-100 hover:border-black transition-colors group">
                 <span className="text-black text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">✦</span>
                 <span className="text-sm text-ink-900 font-bold leading-snug">{tip}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white border-2 border-paper-200 rounded-3xl p-6 md:p-12 shadow-xl">
        <LifeGrid data={data} birthDate={userData.birthDate} />
      </div>

      <div className="mt-16 text-center space-y-3">
        <p className="text-ink-400 text-xs font-mono uppercase tracking-[0.2em] opacity-50">Memento Mori • Tempus Fugit</p>
        <p className="text-ink-300 text-[10px] max-w-xl mx-auto leading-relaxed">
            Disclaimer: This tool is for entertainment and informational purposes only. The life expectancy and milestones generated are estimates based on general statistical data and AI analysis. They do not constitute medical advice, diagnosis, or prognosis.
        </p>
      </div>
    </div>
  );
};