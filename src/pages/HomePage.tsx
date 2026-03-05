import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CitizenHeader } from '@/components/layouts/CitizenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  FileText, 
  Search, 
  Brain, 
  TrendingUp, 
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CitizenHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              AI-Powered Governance Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Transform Public Complaints into
              <span className="text-primary"> Actionable Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              CivicMind AI empowers citizens to report issues anonymously while enabling government officials to analyze, prioritize, and resolve complaints efficiently using AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/submit">
                <Button size="lg" className="w-full sm:w-auto">
                  Submit a Complaint
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Track Your Complaint
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligent Governance Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leveraging AI and cloud technology to modernize public service management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Anonymous & Secure</CardTitle>
                <CardDescription>
                  Report issues without sharing personal information. Your privacy is protected.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Automatic priority detection, resolution predictions, and root cause analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Tracking</CardTitle>
                <CardDescription>
                  Track your complaint status with a unique ID and receive progress updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Predictive Intelligence</CardTitle>
                <CardDescription>
                  AI predicts resolution timelines and recommends optimal solutions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fraud Detection</CardTitle>
                <CardDescription>
                  Automatic detection of suspicious complaints for audit review.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Efficient Resolution</CardTitle>
                <CardDescription>
                  Streamlined workflows help government teams resolve issues faster.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple process for citizens and powerful tools for administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Citizen Flow */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">For Citizens</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Submit Complaint</h4>
                    <p className="text-muted-foreground">Report public issues with details and optional photos</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Receive Tracking ID</h4>
                    <p className="text-muted-foreground">Get a unique ID to monitor your complaint status</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Track Progress</h4>
                    <p className="text-muted-foreground">Monitor resolution status and predicted timeline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Flow */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">For Administrators</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Monitor Dashboard</h4>
                    <p className="text-muted-foreground">View all complaints with AI-generated priorities</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">AI Analysis</h4>
                    <p className="text-muted-foreground">Review root cause analysis and solution recommendations</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Take Action</h4>
                    <p className="text-muted-foreground">Deploy resources efficiently based on AI insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Public Service?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join the future of governance intelligence. Report issues or access the admin dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Submit Complaint
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container text-center text-muted-foreground">
          <p>© 2026 CivicMind AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
