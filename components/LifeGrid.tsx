import React, { useMemo } from 'react';
import { LifeExpectancyResult, LifeMilestone } from '../types';

interface LifeGridProps {
  data: LifeExpectancyResult;
  birthDate: string;
}

export const LifeGrid: React.FC<LifeGridProps> = ({ data }) => {
  const { estimatedAge, weeksLived, lifeStages, milestones } = data;

  // Create a map of weekIndex -> Milestone[] for O(1) lookup during render
  // We use an array because multiple milestones might fall in the same year/week
  const milestoneMap = useMemo(() => {
    const map = new Map<number, LifeMilestone[]>();
    milestones.forEach(m => {
      // Place the milestone roughly in the middle of that year (week 26)
      // Or distribute them slightly if we really wanted to, but week 26 is a good default anchor for "Year X"
      const weekIndex = (m.age * 52) + 26;
      const existing = map.get(weekIndex) || [];
      map.set(weekIndex, [...existing, m]);
    });
    return map;
  }, [milestones]);

  const decades = useMemo(() => {
    // Determine how many decades we need to show
    const totalYears = estimatedAge;
    const decadeCount = Math.ceil(totalYears / 10);
    
    return Array.from({ length: decadeCount }, (_, i) => {
      const startAge = i * 10;
      const endAge = Math.min(startAge + 9, totalYears - 1);
      
      return {
        id: i,
        startAge,
        endAge,
        years: Array.from({ length: endAge - startAge + 1 }, (_, y) => startAge + y)
      };
    });
  }, [estimatedAge]);

  const getWeekStyle = (weekIndex: number) => {
    if (weekIndex < weeksLived) {
      const yearsPassed = Math.floor(weekIndex / 52);
      const stage = lifeStages.find(s => yearsPassed >= s.startAge && yearsPassed <= s.endAge);
      return {
        bg: stage ? stage.color : '#cbd5e1', // Fallback gray
        opacity: 0.8,
        border: 'transparent'
      };
    }
    if (weekIndex === weeksLived) {
      return {
        bg: '#1C1917', // Black current week
        opacity: 1,
        border: '#1C1917'
      };
    }
    // Future
    return {
      bg: '#fff', 
      opacity: 1,
      border: '#e5e5e5' // Light border for future
    };
  };

  return (
    <div className="w-full select-none font-sans">
      {/* Legend Container */}
      <div className="mb-12 bg-paper-50 p-6 rounded-xl border border-paper-200">
        
        {/* 1. Life Stages Legend */}
        <h4 className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-4">Life Stages</h4>
        <div className="flex flex-wrap gap-4 mb-8">
            {lifeStages.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-900 bg-white px-3 py-2 rounded border border-paper-200 shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }}></div>
                <span>{stage.stage}</span>
            </div>
            ))}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-900 bg-white px-3 py-2 rounded border border-paper-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-black animate-pulse"></div>
                <span>Current</span>
            </div>
        </div>

        {/* 2. Milestones Legend */}
        <h4 className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-4">Key Markers & Goals</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {milestones.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border border-paper-200/60 text-xs text-ink-600">
              <span className="text-base filter drop-shadow-sm">{m.emoji}</span>
              <span className="font-medium truncate">{m.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {decades.map((decade) => (
          <div key={decade.id} className="relative flex gap-4 md:gap-6 group">
            {/* Decade Marker (Left Axis) */}
            <div className="w-8 md:w-12 shrink-0 flex flex-col justify-start pt-1 text-right pr-2 border-r-2 border-paper-200">
              <span className="text-xl md:text-2xl font-bold text-ink-400 font-display">
                {decade.startAge}
              </span>
            </div>

            {/* Grid for this decade */}
            <div className="grow pt-1.5">
               <div 
                 className="grid gap-[2px] md:gap-[3px]" 
                 style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}
               >
                 {decade.years.map(year => {
                    return Array.from({length: 52}).map((_, weekIndex) => {
                       const absoluteWeek = (year * 52) + weekIndex;
                       const isCurrent = absoluteWeek === weeksLived;
                       const weekMilestones = milestoneMap.get(absoluteWeek);
                       const hasMilestone = weekMilestones && weekMilestones.length > 0;
                       
                       // Prioritize showing user goals or key markers if multiple exist
                       const displayMilestone = hasMilestone ? weekMilestones![0] : null;
                       
                       const style = getWeekStyle(absoluteWeek);
                       
                       return (
                         <div
                           key={`${year}-${weekIndex}`}
                           className="aspect-square relative group/week"
                         >
                           {/* The Square itself */}
                           <div 
                              className={`
                                w-full h-full rounded-[1px] transition-all duration-200
                                ${isCurrent ? 'animate-pulse ring-2 ring-offset-2 ring-black z-10' : ''}
                                ${!isCurrent && !hasMilestone ? 'hover:bg-black hover:scale-125 hover:z-20' : ''}
                              `}
                              style={{
                                backgroundColor: style.bg,
                                opacity: style.opacity,
                                border: `1px solid ${style.border}`
                              }}
                           />

                           {/* Milestone Emoji - Always Visible */}
                           {displayMilestone && (
                             <div className="absolute inset-0 flex items-center justify-center -mt-[50%] -ml-[50%] w-[200%] h-[200%] z-20 pointer-events-none">
                               <span className="text-[10px] md:text-sm lg:text-base filter drop-shadow-md transform hover:scale-150 transition-transform cursor-help pointer-events-auto">
                                 {displayMilestone.emoji}
                               </span>
                             </div>
                           )}

                           {/* Tooltip */}
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover/week:block z-50 pointer-events-none">
                             <div className="bg-white text-ink-900 text-xs rounded-lg p-3 shadow-xl border border-paper-200 ring-1 ring-black/5">
                               <div className="flex justify-between items-baseline mb-2 border-b border-paper-100 pb-2">
                                  <span className="font-display font-bold text-sm">Age {year}</span>
                                  <span className="font-mono text-ink-400 text-[10px]">WK {weekIndex + 1}</span>
                               </div>
                               
                               {/* Render all milestones for this week */}
                               {hasMilestone && weekMilestones!.map((m, mIdx) => (
                                   <div key={mIdx} className="mb-2 bg-paper-50 p-2 rounded border border-paper-200 last:mb-0">
                                       <div className="flex items-center gap-1 mb-1">
                                         <span className="">{m.emoji}</span>
                                         <span className="font-bold">{m.title}</span>
                                       </div>
                                       <p className="text-ink-500 leading-tight">{m.description}</p>
                                   </div>
                               ))}
                               
                               <p className="text-ink-400 italic mt-2">
                                   {absoluteWeek < weeksLived ? "Past" : isCurrent ? "Present" : "Future"}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                    });
                 })}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};