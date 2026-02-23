export interface Subject {
  code: string;
  name: string;
  credits: number;
  type: 'Core' | 'Adaptive' | 'Emerging' | 'Elective' | 'Non-Credit';
  lab_required?: boolean;
  future_scope?: string;
  required_tools?: string[];
  suggested_projects?: { title: string; description: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }[];
  hours_per_week: number;
  future_jobs: string[];
  learning_outcomes: string[];
  units: {
    title: string;
    topics: string[];
  }[];
}

export interface Semester {
  semester: number;
  total_credits: number;
  subjects: Subject[];
  analysis?: string;
}

export interface Curriculum {
  degree: string;
  branch: string;
  specialization?: string;
  semesters: Semester[];
  total_credits: number;
  non_credit_subject?: string;
  industry_score: number;
  sustainability_score: number;
  skill_mapping: { skill: string; subjects: string[] }[];
  recommendations: string;
  explanation: string;
}

export interface IndustryTrend {
  name: string;
  adoption: number;
  demand: number;
  growth: number[];
}
