export type DisciplineId = 'web' | 'mobile' | 'ai' | 'robotics' | 'multi';

export interface Discipline {
  id: DisciplineId;
  code: string;
  tag: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  benchmark: string;
  specDetails: {
    stack: string[];
    architecture: string;
    keyDeliverables: string[];
    latencyProfile: string;
    sampleSchematic: string;
  };
}

export type PricingMode = 'business' | 'student';

export interface PricingTier {
  id: string;
  tierCode: string;
  duration: string;
  title: string;
  description: string;
  recommended?: boolean;
  business: {
    price: string;
    period: string;
    subtext: string;
  };
  student: {
    price: string;
    period: string;
    subtext: string;
  };
  features: string[];
  ctaLabel: string;
}

export interface LifecyclePhase {
  phase: string;
  timeframe: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface GovernanceTerm {
  id: string;
  num: string;
  title: string;
  content: string;
  standardNote: string;
}

export interface CommissionSubmission {
  email: string;
  discipline: DisciplineId;
  entity: 'business' | 'student' | 'individual';
  scope: string;
  timestamp: string;
  submissionId: string;
}

// User & Authentication Types
export type UserRole = 'student' | 'business' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  school_or_company?: string;
  student_id?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

// Project & Milestones Types
export type ProjectStatus =
  | 'pending'
  | 'approved'
  | 'in_progress'
  | 'ready_for_defense'
  | 'completed'
  | 'cancelled';

// Intake categories
export type ProjectCategory = 'capstone' | 'robotics' | 'business';

// UI design styles offered to business clients
export const UI_STYLES = [
  'Brutalist',
  'Minimalist',
  'Neumorphism',
  'Glassmorphism',
  'Claymorphism',
  'Dark Mode First',
  'Corporate / Clean',
  'Retro / Y2K',
  'Maximalist',
  'Swiss / International',
] as const;

export type UiStyle = (typeof UI_STYLES)[number] | string;

export interface ProjectMilestone {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  order: number;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface SystemType {
  id: number;
  name: string;
  slug: 'web_app' | 'mobile_app' | 'ai_system' | 'arduino' | string;
  base_price: number;
  description: string;
  is_active: boolean;
  backendOptions?: TechnologyOption[];
  frontendOptions?: TechnologyOption[];
}

export interface TechnologyOption {
  id: number;
  system_type_id: number;
  type: 'backend' | 'frontend';
  name: string;
  slug: string;
  price: number;
  is_active: boolean;
}

export interface Project {
  id: number;
  user_id: number;
  system_type_id: number;
  category?: ProjectCategory;
  thesis_title: string;
  description: string;
  ui_style?: string | null;
  company_name?: string | null;
  backend_option_id?: number | null;
  frontend_option_id?: number | null;
  difficulty_level?: 'easy' | 'medium' | 'hard' | null;
  base_price: number;
  backend_price: number;
  frontend_price: number;
  difficulty_price: number;
  total_price: number;
  quoted_price?: number | null;
  currency: string;
  status: ProjectStatus;
  progress: number; // 0 - 100
  deployment_url?: string | null;
  repository_url?: string | null;
  created_at: string;
  updated_at?: string;
  user?: User;
  systemType?: SystemType;
  backendOption?: TechnologyOption | null;
  frontendOption?: TechnologyOption | null;
  milestones?: ProjectMilestone[];
  payments?: Payment[];
}

// Payment Types
export type PaymentMethod = 'gcash' | 'grabpay' | 'maya' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'cancelled';

export interface Payment {
  id: number;
  user_id: number;
  project_id: number;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
  description: string;
  status: PaymentStatus;
  checkout_url?: string;
  created_at: string;
}

// Price Calculation & Difficulty Estimation Types
export interface PriceCalculationRequest {
  system_type_id: number;
  backend_option?: string;
  frontend_option?: string;
  difficulty_level?: 'easy' | 'medium' | 'hard';
  description?: string;
}

export interface PriceCalculationResponse {
  base_price: number;
  backend_price: number;
  frontend_price: number;
  difficulty_price: number;
  total_price: number;
  currency: string;
}

export interface DifficultyEstimationResponse {
  estimated_difficulty: 'easy' | 'medium' | 'hard';
  confidence: number;
  difficulty_price: number;
  base_price: number;
  total_estimate: number;
}

// Reviews
export interface Review {
  id: number;
  content: string;
  rating: number;
  project_type?: string;
  display_name: string;
  created_at: string;
}
