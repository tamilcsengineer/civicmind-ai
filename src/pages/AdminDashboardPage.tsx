import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight,
  Clock
} from 'lucide-react';
import { getComplaintStats, getComplaints } from '@/db/api';
import type { ComplaintStats, Complaint } from '@/types';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    try {
      const [statsData, complaintsData] = await Promise.all([
        getComplaintStats(),
        getComplaints({}, 1, 5)
      ]);
      setStats(statsData);
      setRecentComplaints(complaintsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor and analyze citizen complaints with AI-powered insights
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Complaints"
              value={stats.total}
              icon={FileText}
              description="All time submissions"
            />
            <StatsCard
              title="Urgent Complaints"
              value={stats.urgent}
              icon={AlertTriangle}
              description="High priority issues"
            />
            <StatsCard
              title="Under Audit"
              value={stats.under_audit}
              icon={Clock}
              description="Suspicious reports"
            />
            <StatsCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              description="Successfully closed"
            />
          </div>
        ) : null}

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>Latest submissions requiring attention</CardDescription>
              </div>
              <Link to="/admin/complaints">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full bg-muted" />
                ))}
              </div>
            ) : recentComplaints.length > 0 ? (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <Link 
                    key={complaint.id} 
                    to={`/admin/complaint/${complaint.id}`}
                    className="block"
                  >
                    <div className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {complaint.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {complaint.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>{complaint.category?.icon} {complaint.category?.name}</span>
                            <span>•</span>
                            <span>{complaint.location}</span>
                            <span>•</span>
                            <span>{format(new Date(complaint.created_at), 'PPp')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge status={complaint.status} />
                          <PriorityBadge priority={complaint.priority} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No complaints yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/admin/complaints">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  All Complaints
                </CardTitle>
                <CardDescription>
                  View and manage all citizen complaints
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/admin/audit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Audit Queue
                </CardTitle>
                <CardDescription>
                  Review suspicious complaints flagged by AI
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/admin/analytics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View trends and performance metrics
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
