import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getComplaints, getDepartments } from '@/db/api';
import type { Complaint, Department, ComplaintFilters } from '@/types';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { Search, Filter, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ComplaintFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [complaintsData, departmentsData] = await Promise.all([
        getComplaints(filters),
        getDepartments()
      ]);
      setComplaints(complaintsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(key: keyof ComplaintFilters, value: string) {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  }

  const filteredComplaints = complaints.filter(complaint => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      complaint.title.toLowerCase().includes(search) ||
      complaint.description.toLowerCase().includes(search) ||
      complaint.tracking_id.toLowerCase().includes(search) ||
      complaint.location.toLowerCase().includes(search)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            All Complaints
          </h1>
          <p className="text-muted-foreground">
            View, filter, and manage citizen complaints
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={filters.priority || 'all'}
                onValueChange={(value) => handleFilterChange('priority', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="audit_review">Audit Review</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.department_id || 'all'}
                onValueChange={(value) => handleFilterChange('department_id', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''}
            </CardTitle>
            <CardDescription>
              Click on a complaint to view detailed AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full bg-muted" />
                ))}
              </div>
            ) : filteredComplaints.length > 0 ? (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {complaint.title}
                            </h3>
                            <div className="flex gap-2 shrink-0">
                              <StatusBadge status={complaint.status} />
                              <PriorityBadge priority={complaint.priority} />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {complaint.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">ID:</span>
                            <span className="font-mono">{complaint.tracking_id}</span>
                          </span>
                          <span>•</span>
                          <span>{complaint.category?.icon} {complaint.category?.name}</span>
                          <span>•</span>
                          <span>📍 {complaint.location}</span>
                          <span>•</span>
                          <span>{format(new Date(complaint.created_at), 'PPp')}</span>
                        </div>

                        {complaint.assigned_department && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Department: </span>
                            <span className="font-medium text-foreground">
                              {complaint.assigned_department.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link to={`/admin/complaint/${complaint.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No complaints found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
