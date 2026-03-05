import { supabase } from './supabase';
import type { 
  Complaint, 
  ComplaintFormData, 
  Category, 
  Department, 
  ComplaintStats,
  ComplaintFilters 
} from '@/types';

// Generate unique tracking ID
function generateTrackingId(): string {
  const prefix = 'CM';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Simulate AI priority detection based on keywords
function detectPriority(title: string, description: string): 'low' | 'medium' | 'high' {
  const text = `${title} ${description}`.toLowerCase();
  const highPriorityKeywords = ['urgent', 'emergency', 'danger', 'critical', 'severe', 'major', 'accident', 'injury'];
  const lowPriorityKeywords = ['minor', 'small', 'cosmetic', 'aesthetic'];
  
  if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  }
  if (lowPriorityKeywords.some(keyword => text.includes(keyword))) {
    return 'low';
  }
  return 'medium';
}

// Simulate AI suspicious complaint detection
function detectSuspicious(description: string): boolean {
  const text = description.toLowerCase();
  const suspiciousPatterns = ['test', 'fake', 'spam', 'xxx'];
  return suspiciousPatterns.some(pattern => text.includes(pattern));
}

// Simulate AI resolution time prediction
function predictResolutionDays(priority: string, category: string): number {
  const baseDays: Record<string, number> = {
    high: 2,
    medium: 5,
    low: 10
  };
  return baseDays[priority] || 5;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Departments
export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Create complaint with AI predictions
export async function createComplaint(formData: ComplaintFormData): Promise<{ tracking_id: string }> {
  const trackingId = generateTrackingId();
  const priority = detectPriority(formData.title, formData.description);
  const isSuspicious = detectSuspicious(formData.description);
  const predictedDays = predictResolutionDays(priority, formData.category_id);
  
  // Get departments to assign based on category
  const { data: departments } = await supabase
    .from('departments')
    .select('id, name')
    .limit(5);
  
  const assignedDepartment = departments?.[0]?.id || null;
  
  const { error } = await supabase
    .from('complaints')
    .insert({
      tracking_id: trackingId,
      title: formData.title,
      description: formData.description,
      category_id: formData.category_id,
      location: formData.location,
      photo_url: formData.photo_url || null,
      priority,
      is_suspicious: isSuspicious,
      status: isSuspicious ? 'audit_review' : 'submitted',
      predicted_resolution_days: predictedDays,
      assigned_department_id: assignedDepartment
    });
  
  if (error) throw error;
  return { tracking_id: trackingId };
}

// Get complaint by tracking ID
export async function getComplaintByTrackingId(trackingId: string): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:categories(*),
      assigned_department:departments(*)
    `)
    .eq('tracking_id', trackingId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

// Get all complaints with filters and pagination
export async function getComplaints(
  filters?: ComplaintFilters,
  page = 1,
  limit = 20
): Promise<Complaint[]> {
  let query = supabase
    .from('complaints')
    .select(`
      *,
      category:categories(*),
      assigned_department:departments(*)
    `);
  
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters?.department_id) {
    query = query.eq('assigned_department_id', filters.department_id);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Get complaint statistics
export async function getComplaintStats(): Promise<ComplaintStats> {
  const { data: allComplaints } = await supabase
    .from('complaints')
    .select('status, priority, is_suspicious');
  
  const complaints = Array.isArray(allComplaints) ? allComplaints : [];
  
  return {
    total: complaints.length,
    urgent: complaints.filter(c => c.priority === 'high').length,
    under_audit: complaints.filter(c => c.is_suspicious || c.status === 'audit_review').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };
}

// Update complaint status
export async function updateComplaintStatus(
  id: string, 
  status: string,
  additionalData?: Partial<Complaint>
): Promise<void> {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
    ...additionalData
  };
  
  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('complaints')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
}

// Get complaint by ID (for admin detail view)
export async function getComplaintById(id: string): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:categories(*),
      assigned_department:departments(*)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

// Simulate AI root cause analysis
export function generateRootCauseAnalysis(complaint: Complaint): string {
  const causes: Record<string, string> = {
    'Road Damage': 'Possible root cause: Heavy rainfall and inadequate drainage system causing road surface deterioration',
    'Water Supply': 'Possible root cause: Aging pipeline infrastructure in the area requiring replacement',
    'Electricity': 'Possible root cause: Overloaded transformer or damaged power lines due to weather conditions',
    'Sanitation': 'Possible root cause: Insufficient waste collection frequency in high-density residential areas',
    'Public Safety': 'Possible root cause: Inadequate street lighting and lack of surveillance in the area'
  };
  
  return causes[complaint.category?.name || ''] || 'Root cause analysis pending further investigation';
}

// Simulate AI solution recommendation
export function generateSolutionRecommendation(complaint: Complaint): {
  method: string;
  department: string;
  manpower: string;
  cost: string;
} {
  const solutions: Record<string, any> = {
    'Road Damage': {
      method: 'Deploy road repair team for surface patching and resurfacing',
      department: 'Infrastructure Maintenance',
      manpower: '4-6 workers, 1 supervisor',
      cost: '₹20,000 - ₹35,000'
    },
    'Water Supply': {
      method: 'Pipeline inspection and targeted repair or replacement',
      department: 'Water Department',
      manpower: '3-5 technicians, 1 engineer',
      cost: '₹15,000 - ₹50,000'
    },
    'Electricity': {
      method: 'Electrical inspection and component replacement',
      department: 'Electricity Board',
      manpower: '2-4 electricians, 1 supervisor',
      cost: '₹10,000 - ₹30,000'
    },
    'Sanitation': {
      method: 'Increase collection frequency and deploy additional waste bins',
      department: 'Sanitation Services',
      manpower: '2-3 workers, 1 vehicle',
      cost: '₹5,000 - ₹15,000'
    },
    'Public Safety': {
      method: 'Install street lighting and surveillance cameras',
      department: 'Public Safety Division',
      manpower: '3-4 technicians, 1 security officer',
      cost: '₹25,000 - ₹60,000'
    }
  };
  
  return solutions[complaint.category?.name || ''] || {
    method: 'Detailed assessment required',
    department: 'General Administration',
    manpower: 'To be determined',
    cost: 'Pending assessment'
  };
}
