import type { Complaint } from '@/types';
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

interface TrackingTimelineProps {
  complaint: Complaint;
}

export function TrackingTimeline({ complaint }: TrackingTimelineProps) {
  const getStatusSteps = () => {
    const allSteps = [
      { 
        status: 'submitted', 
        label: 'Complaint Submitted', 
        icon: FileText,
        completed: true 
      },
      { 
        status: 'under_review', 
        label: 'Under Review', 
        icon: Clock,
        completed: ['under_review', 'in_progress', 'resolved'].includes(complaint.status)
      },
      { 
        status: 'in_progress', 
        label: 'In Progress', 
        icon: AlertCircle,
        completed: ['in_progress', 'resolved'].includes(complaint.status)
      },
      { 
        status: 'resolved', 
        label: 'Resolved', 
        icon: CheckCircle2,
        completed: complaint.status === 'resolved'
      }
    ];

    if (complaint.status === 'audit_review') {
      return [
        { 
          status: 'submitted', 
          label: 'Complaint Submitted', 
          icon: FileText,
          completed: true 
        },
        { 
          status: 'audit_review', 
          label: 'Under Audit Review', 
          icon: AlertCircle,
          completed: true,
          isAudit: true
        }
      ];
    }

    return allSteps;
  };

  const steps = getStatusSteps();

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        const isAudit = 'isAudit' in step && step.isAudit;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? isAudit 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {!isLast && (
                <div 
                  className={`w-0.5 h-12 ${
                    step.completed ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {step.completed ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
