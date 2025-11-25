export interface UserData {
  birthDate: string; // YYYY-MM-DD
  ethnicity?: string;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  bloodSugar?: number; // mg/dL
  activityLevel?: string;
  customMilestones?: {
    title: string;
    age: number;
    emoji: string;
  }[];
}

export interface LifeMilestone {
  age: number;
  title: string;
  emoji: string;
  description: string;
}

export interface LifeExpectancyResult {
  estimatedAge: number;
  weeksLived: number;
  totalWeeks: number;
  remainingWeeks: number;
  analysis: string;
  healthTips: string[];
  lifeStages: {
    stage: string;
    startAge: number;
    endAge: number;
    color: string;
    description: string;
  }[];
  milestones: LifeMilestone[];
}

export enum ViewMode {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
}