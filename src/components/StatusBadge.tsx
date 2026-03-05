import { Badge } from '@/components/ui/badge';
import type { ComplaintStatus } from '@/types';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<ComplaintStatus, { label: string; className: string }> = {
    submitted: { 
      label: 'Submitted', 
      className: 'bg-info text-white hover:bg-info/90' 
    },
    under_review: { 
      label: 'Under Review', 
      className: 'bg-primary text-primary-foreground hover:bg-primary/90' 
    },
    in_progress: { 
      label: 'In Progress', 
      className: 'bg-warning text-white hover:bg-warning/90' 
    },
    resolved: { 
      label: 'Resolved', 
      className: 'bg-success text-white hover:bg-success/90' 
    },
    audit_review: { 
      label: 'Under Audit Review', 
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
    }
  };

  const config = variants[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
