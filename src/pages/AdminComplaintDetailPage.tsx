import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  getComplaintById, 
  updateComplaintStatus,
  generateRootCauseAnalysis,
  generateSolutionRecommendation
} from '@/db/api';
import type { Complaint } from '@/types';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Brain, 
  Lightbulb, 
  Users, 
  DollarSign,
  ArrowLeft,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadComplaint();
    }
  }, [id]);

  async function loadComplaint() {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getComplaintById(id);
      setComplaint(data);
    } catch (error) {
      console.error('Failed to load complaint:', error);
      toast.error('Failed to load complaint details');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!complaint) return;
    setIsUpdating(true);
    try {
      await updateComplaintStatus(complaint.id, newStatus);
      toast.success('Status updated successfully');
      await loadComplaint();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64 bg-muted" />
          <Skeleton className="h-96 w-full bg-muted" />
        </div>
      </AdminLayout>
    );
  }

  if (!complaint) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Complaint not found</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const rootCause = generateRootCauseAnalysis(complaint);
  const solution = generateSolutionRecommendation(complaint);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              Complaint Details
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              {complaint.tracking_id}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Overview */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />
                      {complaint.is_suspicious && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Suspicious
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.category?.icon} {complaint.category?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{complaint.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(complaint.created_at), 'PPP')}
                      </p>
                    </div>
                  </div>
                  {complaint.assigned_department && (
                    <div className="flex gap-3">
                      <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Department</p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.assigned_department.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {complaint.photo_url && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Photo Evidence</p>
                    <img 
                      src={complaint.photo_url} 
                      alt="Complaint" 
                      className="rounded-lg max-h-96 object-cover w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Root Cause Analysis */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Root Cause Analysis
                </CardTitle>
                <CardDescription>
                  Automated analysis based on historical data and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {rootCause}
                </p>
              </CardContent>
            </Card>

            {/* AI Solution Recommendation */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-success" />
                  AI Solution Recommendation
                </CardTitle>
                <CardDescription>
                  Suggested action plan based on similar resolved cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Recommended Method</p>
                  <p className="text-sm text-muted-foreground">{solution.method}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Required Manpower
                    </p>
                    <p className="text-sm text-muted-foreground">{solution.manpower}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Estimated Cost
                    </p>
                    <p className="text-sm text-muted-foreground font-semibold">{solution.cost}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Update Status
                  </label>
                  <Select
                    value={complaint.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="audit_review">Audit Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card className="border-info/20 bg-info/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-info" />
                  AI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {complaint.predicted_resolution_days && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Expected Resolution Time
                    </p>
                    <p className="text-lg font-semibold text-info">
                      {complaint.predicted_resolution_days} days
                    </p>
                  </div>
                )}
                <Separator />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Priority Level
                  </p>
                  <PriorityBadge priority={complaint.priority} />
                </div>
              </CardContent>
            </Card>

            {/* Historical Context */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Similar Cases</p>
                  <p className="text-muted-foreground">3 similar complaints in this area</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-foreground">Average Resolution</p>
                  <p className="text-muted-foreground">4-6 days for this category</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-foreground">Success Rate</p>
                  <p className="text-muted-foreground">92% resolution rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
