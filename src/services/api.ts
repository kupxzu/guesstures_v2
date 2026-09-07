import {
  User,
  UserRole,
  AuthResponse,
  Project,
  SystemType,
  PriceCalculationRequest,
  PriceCalculationResponse,
  DifficultyEstimationResponse,
  Payment,
  Review,
} from '../types';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  'http://127.0.0.1:8000/api';

const TOKEN_KEY = 'gst_auth_token';
const USER_KEY = 'gst_auth_user';

// --- Session helpers (real account session only; no mock data) ---
function getSessionUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setSessionUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// --- Core request wrapper with Sanctum bearer token ---
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `API error ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

/* =========================================================
   LIVE API (no mock / demo data)
   ========================================================= */

export const api = {
  // ---------------- AUTH ----------------
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      const res = await apiRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setSessionUser(res.user);
      }
      return res;
    },

    async register(data: {
      name: string;
      email: string;
      password: string;
      password_confirmation?: string;
      role?: UserRole;
      school_or_company?: string;
      student_id?: string;
    }): Promise<AuthResponse> {
      const res = await apiRequest<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setSessionUser(res.user);
      }
      return res;
    },

    async getProfile(): Promise<User | null> {
      try {
        const res = await apiRequest<{ user: User }>('/profile');
        setSessionUser(res.user);
        return res.user;
      } catch {
        return getSessionUser();
      }
    },

    async updateRole(role: UserRole): Promise<User> {
      const res = await apiRequest<{ user: User }>('/update-role', {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      setSessionUser(res.user);
      return res.user;
    },

    logout(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },

    getCurrentUser(): User | null {
      return getSessionUser();
    },
  },

  // ---------------- PROJECTS ----------------
  projects: {
    async getSystemTypes(): Promise<SystemType[]> {
      const res = await apiRequest<{ system_types: SystemType[] }>('/system-types');
      return res.system_types;
    },

    async getTechnologyOptions(systemTypeId: number): Promise<{
      system_type: SystemType;
      backend_options: any[];
      frontend_options: any[];
    }> {
      return apiRequest(`/system-types/${systemTypeId}/options`);
    },

    async calculatePrice(params: PriceCalculationRequest): Promise<PriceCalculationResponse> {
      return apiRequest<PriceCalculationResponse>('/projects/calculate-price', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    async estimateDifficulty(description: string): Promise<DifficultyEstimationResponse> {
      return apiRequest<DifficultyEstimationResponse>('/projects/estimate-difficulty', {
        method: 'POST',
        body: JSON.stringify({ description }),
      });
    },

    async getAll(): Promise<Project[]> {
      const res = await apiRequest<{ projects: Project[] }>('/projects');
      return res.projects;
    },

    async getById(id: number): Promise<Project> {
      const res = await apiRequest<{ project: Project }>(`/projects/${id}`);
      return res.project;
    },

    // Student intake: capstone or robotics. Price is quoted later by admin.
    async create(data: {
      system_type_id: number;
      category: 'capstone' | 'robotics';
      title: string;
      description: string;
      backend_option?: string;
      frontend_option?: string;
      difficulty_level?: 'easy' | 'medium' | 'hard';
    }): Promise<Project> {
      const res = await apiRequest<{ project: Project }>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.project;
    },

    // Business intake: UI style + title + description + company. Quoted later by admin.
    async createBusiness(data: {
      ui_style: string;
      title: string;
      description: string;
      company_name: string;
    }): Promise<Project> {
      const res = await apiRequest<{ project: Project }>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.project;
    },

    async delete(id: number): Promise<void> {
      await apiRequest(`/projects/${id}`, { method: 'DELETE' });
    },
  },

  // ---------------- PAYMENTS ----------------
  payments: {
    async createGcashPayment(
      projectId: number,
      billing?: { name?: string; email?: string; phone?: string }
    ): Promise<Payment> {
      const res = await apiRequest<{ payment: Payment }>('/payments/gcash', {
        method: 'POST',
        body: JSON.stringify({ project_id: projectId, billing }),
      });
      return res.payment;
    },

    async createGrabPayPayment(
      projectId: number,
      billing?: { name?: string; email?: string; phone?: string }
    ): Promise<Payment> {
      const res = await apiRequest<{ payment: Payment }>('/payments/grabpay', {
        method: 'POST',
        body: JSON.stringify({ project_id: projectId, billing }),
      });
      return res.payment;
    },

    async getUserPayments(): Promise<Payment[]> {
      const res = await apiRequest<{ payments: Payment[] }>('/payments');
      return res.payments;
    },
  },

  // ---------------- REVIEWS ----------------
  reviews: {
    async getApprovedReviews(): Promise<Review[]> {
      const res = await apiRequest<{ reviews: Review[] }>('/reviews');
      return res.reviews;
    },

    async submitReview(data: { content: string; rating: number; project_type?: string }): Promise<void> {
      await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // ---------------- ADMIN ----------------
  admin: {
    async getStats() {
      const res = await apiRequest<any>('/admin/dashboard');
      return res?.stats ?? res ?? {};
    },

    async getAllProjects(
      statusFilter?: string,
      searchQuery?: string,
      category?: string
    ): Promise<Project[]> {
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') queryParams.set('status', statusFilter);
      if (searchQuery) queryParams.set('search', searchQuery);
      if (category && category !== 'all') queryParams.set('category', category);
      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';

      const res = await apiRequest<any>(`/admin/projects${queryStr}`);
      const list = Array.isArray(res) ? res : res?.data || res?.projects || [];
      return Array.isArray(list) ? list : [];
    },

    // Paginated projects — returns { data, lastPage, total }.
    async getProjectsPage(
      page = 1,
      statusFilter?: string,
      searchQuery?: string,
      category?: string
    ): Promise<{ data: Project[]; lastPage: number; total: number }> {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(page));
      if (statusFilter && statusFilter !== 'all') queryParams.set('status', statusFilter);
      if (searchQuery) queryParams.set('search', searchQuery);
      if (category && category !== 'all') queryParams.set('category', category);
      const res = await apiRequest<any>(`/admin/projects?${queryParams.toString()}`);
      return {
        data: Array.isArray(res?.data) ? res.data : [],
        lastPage: res?.last_page ?? 1,
        total: res?.total ?? 0,
      };
    },

    // Paginated users.
    async getUsersPage(page = 1): Promise<{ data: User[]; lastPage: number; total: number }> {
      const res = await apiRequest<any>(`/admin/users?page=${page}`);
      return {
        data: Array.isArray(res?.data) ? res.data : [],
        lastPage: res?.last_page ?? 1,
        total: res?.total ?? 0,
      };
    },

    // Paginated payments.
    async getPaymentsPage(page = 1): Promise<{ data: Payment[]; lastPage: number; total: number }> {
      const res = await apiRequest<any>(`/payments?page=${page}`);
      return {
        data: Array.isArray(res?.data) ? res.data : [],
        lastPage: res?.last_page ?? 1,
        total: res?.total ?? 0,
      };
    },

    // Admin sets the deal/quote price for any project (student or business).
    async setQuote(projectId: number, quotedPrice: number): Promise<Project> {
      const res = await apiRequest<any>(`/admin/projects/${projectId}/quote`, {
        method: 'POST',
        body: JSON.stringify({ quoted_price: quotedPrice }),
      });
      return res?.project || res?.data || res;
    },

    async updateProjectStatus(projectId: number, status: any): Promise<Project> {
      const res = await apiRequest<any>(`/admin/projects/${projectId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return res?.project || res?.data || res;
    },

    async updateMilestone(projectId: number, milestoneId: number, is_completed: boolean): Promise<Project> {
      const res = await apiRequest<any>(`/admin/milestones/${milestoneId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_completed }),
      });
      return res?.project || res?.data || res;
    },

    async updateProjectLinks(
      projectId: number,
      deployment_url: string,
      repository_url: string
    ): Promise<Project> {
      const res = await apiRequest<any>(`/admin/projects/${projectId}/deployment-url`, {
        method: 'PUT',
        body: JSON.stringify({ deployment_url, repository_url }),
      });
      return res?.project || res?.data || res;
    },

    async getAllUsers(): Promise<User[]> {
      const res = await apiRequest<any>('/admin/users');
      const list = Array.isArray(res) ? res : res?.data || res?.users || [];
      return Array.isArray(list) ? list : [];
    },

    async getAllPayments(): Promise<Payment[]> {
      const res = await apiRequest<any>('/payments');
      const list = Array.isArray(res) ? res : res?.data || res?.payments || [];
      return Array.isArray(list) ? list : [];
    },
  },
};
