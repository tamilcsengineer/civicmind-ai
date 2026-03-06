import { Badge } from '@/components/ui/badge'
import type { ComplaintPriority } from '@/types'

interface PriorityBadgeProps {
  priority: ComplaintPriority | string
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {

  const variants: Record<string, { label: string; className: string }> = {
    high: {
      label: 'High Priority',
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    },
    medium: {
      label: 'Medium Priority',
      className: 'bg-warning text-white hover:bg-warning/90'
    },
    low: {
      label: 'Low Priority',
      className: 'bg-muted text-muted-foreground hover:bg-muted/90'
    }
  }

  const config = variants[priority] || {
    label: priority,
    className: 'bg-gray-200 text-gray-700'
  }

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}