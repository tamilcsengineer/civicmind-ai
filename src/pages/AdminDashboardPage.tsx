import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { StatsCard } from "@/components/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Clock
} from "lucide-react";

import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AdminDashboardPage() {

  const [stats, setStats] = useState<any>(null);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  function loadDashboardData() {

    setIsLoading(true);

    setTimeout(() => {

      setStats({
        total: 24,
        urgent: 5,
        under_audit: 3,
        resolved: 16
      });

      setRecentComplaints([
        {
          id: "1",
          title: "Road damage near bus stand",
          description: "Large potholes causing traffic issues",
          location: "Main Road",
          status: "pending",
          priority: "high",
          created_at: new Date().toISOString(),
          category: {
            name: "Infrastructure",
            icon: "🛣️"
          }
        },
        {
          id: "2",
          title: "Street lights not working",
          description: "Street is dark at night",
          location: "Park Street",
          status: "in_progress",
          priority: "medium",
          created_at: new Date().toISOString(),
          category: {
            name: "Electricity",
            icon: "💡"
          }
        }
      ]);

      setIsLoading(false);

    }, 800);
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage citizen complaints
          </p>
        </div>


        {/* Stats */}
        {isLoading ? (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <StatsCard
              title="Total Complaints"
              value={stats.total}
              icon={FileText}
              description="All submissions"
            />

            <StatsCard
              title="Urgent Complaints"
              value={stats.urgent}
              icon={AlertTriangle}
              description="High priority"
            />

            <StatsCard
              title="Under Audit"
              value={stats.under_audit}
              icon={Clock}
              description="Suspicious cases"
            />

            <StatsCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              description="Closed complaints"
            />

          </div>

        )}



        {/* Recent Complaints */}
        <Card>

          <CardHeader>

            <div className="flex justify-between items-center">

              <div>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>
                  Latest issues reported by citizens
                </CardDescription>
              </div>

              <Link to="/admin/complaints">
                <Button size="sm" variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </Link>

            </div>

          </CardHeader>


          <CardContent>

            {isLoading ? (

              <Skeleton className="h-24 w-full"/>

            ) : recentComplaints.length > 0 ? (

              <div className="space-y-4">

                {recentComplaints.map((complaint) => (

                  <Link
                    key={complaint.id}
                    to={`/admin/complaint/${complaint.id}`}
                  >

                    <div className="border p-4 rounded-lg hover:bg-accent/40 transition">

                      <h3 className="font-semibold mb-1">
                        {complaint.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-2">
                        {complaint.description}
                      </p>

                      <div className="flex gap-3 text-xs text-muted-foreground">

                        <span>
                          {complaint.category.icon} {complaint.category.name}
                        </span>

                        <span>•</span>

                        <span>{complaint.location}</span>

                        <span>•</span>

                        <span>
                          {format(new Date(complaint.created_at),"PP")}
                        </span>

                      </div>

                      <div className="flex gap-2 mt-2">

                        <StatusBadge status={complaint.status}/>
                        <PriorityBadge priority={complaint.priority}/>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            ) : (

              <p className="text-center text-muted-foreground">
                No complaints found
              </p>

            )}

          </CardContent>

        </Card>


        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">

          <Card className="hover:shadow-lg cursor-pointer">
            <Link to="/admin/complaints">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <FileText className="h-5 w-5"/>
                  All Complaints
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg cursor-pointer">
            <Link to="/admin/audit">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <AlertTriangle className="h-5 w-5"/>
                  Audit Queue
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg cursor-pointer">
            <Link to="/admin/analytics">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <TrendingUp className="h-5 w-5"/>
                  Analytics
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>

        </div>

      </div>

    </AdminLayout>
  );
}