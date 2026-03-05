import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CitizenHeader } from '@/components/layouts/CitizenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Calendar, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getComplaintByTrackingId } from '@/db/api';
import type { Complaint } from '@/types';
import { TrackingTimeline } from '@/components/TrackingTimeline';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';

export default function TrackComplaintPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingId(id);
      handleSearch(id);
    }
  }, []);

  async function handleSearch(id?: string) {
    const searchId = id || trackingId;
    if (!searchId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await getComplaintByTrackingId(searchId.trim());
      if (data) {
        setComplaint(data);
        setSearchParams({ id: searchId.trim() });
      } else {
        setComplaint(null);
        toast.error('Complaint not found. Please check your tracking ID.');
      }
    } catch (error) {
      toast.error('Failed to fetch complaint details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CitizenHeader />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Track Your Complaint
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your tracking ID to view the status and progress of your complaint
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking ID</CardTitle>
              <CardDescription>
                You received this ID when you submitted your complaint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="tracking-id" className="sr-only">Tracking ID</Label>
                  <Input
                    id="tracking-id"
                    placeholder="e.g., CM-ABCD1234-EFGH"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {hasSearched && !isLoading && !complaint && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No complaint found with this tracking ID. Please check and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {complaint && (
            <div className="space-y-6">
              {/* Complaint Overview */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={complaint.status} />
                        <PriorityBadge priority={complaint.priority} />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-mono font-semibold text-foreground">
                        {complaint.tracking_id}
                      </p>
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
                    {complaint.predicted_resolution_days && (
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Expected Resolution</p>
                          <p className="text-sm text-muted-foreground">
                            {complaint.predicted_resolution_days} days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Description</p>
                    <p className="text-sm text-muted-foreground">{complaint.description}</p>
                  </div>

                  {complaint.photo_url && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Photo</p>
                      <img 
                        src={complaint.photo_url} 
                        alt="Complaint" 
                        className="rounded-lg max-h-64 object-cover"
                      />
                    </div>
                  )}

                  {complaint.assigned_department && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Assigned Department
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.assigned_department.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Timeline</CardTitle>
                  <CardDescription>
                    Track the journey of your complaint from submission to resolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrackingTimeline complaint={complaint} />
                </CardContent>
              </Card>

              {/* AI Predictions */}
              {complaint.predicted_resolution_days && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-primary">🤖</span>
                      AI Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Estimated Resolution Time
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {complaint.predicted_resolution_days} days
                        </span>
                      </div>
                      {complaint.assigned_department && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Recommended Department
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {complaint.assigned_department.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
