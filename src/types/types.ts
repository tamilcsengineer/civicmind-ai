export interface Category {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  tracking_id: string;
  title: string;
  description: string;
  category_id: string | null;
  location: string;
  photo_url: string | null;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  is_suspicious: boolean;
  predicted_resolution_days: number | null;
  assigned_department_id: string | null;
  root_cause: string | null;
  solution_plan: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  category?: Category;
  assigned_department?: Department;
}

export type ComplaintStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'in_progress' 
  | 'resolved' 
  | 'audit_review';

export type ComplaintPriority = 'low' | 'medium' | 'high';

export interface ComplaintFormData {
  title: string;
  description: string;
  category_id: string;
  location: string;
  photo_url?: string;
}

export interface ComplaintStats {
  total: number;
  urgent: number;
  under_audit: number;
  resolved: number;
}

export interface ComplaintFilters {
  location?: string;
  department_id?: string;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
}
