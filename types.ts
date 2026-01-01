
export type Plan = 'FREE' | 'PREMIUM';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  password?: string;
  billingZip?: string;
}

export interface RecommendedProduct {
  name: string;
  category: string;
  reason: string;
  priceRange: string;
  link: string;
}

export interface SkinAnalysisResult {
  skinType: 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive';
  description: string;
  concerns: string[];
  hydrationLevel: number;
  sensitivityScore: number;
  healthScore: number;
  ageIndex: number;
  recommendations: {
    ingredients: string[];
    routine: {
      morning: string[];
      evening: string[];
    };
    lifestyle: string[];
    products: RecommendedProduct[];
  };
  disclaimer: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
