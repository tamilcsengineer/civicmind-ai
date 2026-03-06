
import { useState } from "react"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Complaint {
  id: number
  title: string
  reason: string
  location: string
  category: string
  priority: string
  status: string
}

export default function AdminAuditPage() {

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 102,
      title: "Fake road damage complaint",
      reason: "AI detected duplicate complaint",
      location: "Main Road, Ward 4",
      category: "Infrastructure",
      priority: "High",
      status: "pending"
    },
    {
      id: 87,
      title: "Duplicate electricity complaint",
      reason: "Reported multiple times",
      location: "Park Street",
      category: "Electricity",
      priority: "Medium",
      status: "pending"
    },
    {
  id: 91,
  title: "Street sign slightly damaged",
  reason: "Minor infrastructure issue reported by citizen",
  location: "Lake View Street",
  category: "Infrastructure",
  priority: "Low",
  status: "pending"
}
  ])

  function approveComplaint(id:number){

    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "approved" } : c
      )
    )

    toast.success(`Complaint #${id} approved`)
  }

  function rejectComplaint(id:number){

    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "rejected" } : c
      )
    )

    toast.error(`Complaint #${id} rejected`)
  }

  return (

    <AdminLayout>

      <div className="p-6 space-y-6 max-w-5xl mx-auto">

        <div>
          <h1 className="text-3xl font-bold">Audit Queue</h1>
          <p className="text-muted-foreground">
            AI flagged complaints for manual verification
          </p>
        </div>

        {complaints.map((item) => (

          <Card key={item.id} className="shadow-sm">

            <CardHeader className="flex flex-row items-center justify-between">

              <CardTitle>
                Complaint #{item.id}
              </CardTitle>

              <Badge>

                {item.status === "pending" && "Pending Audit"}
                {item.status === "approved" && "Approved"}
                {item.status === "rejected" && "Rejected"}

              </Badge>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <p className="font-semibold text-lg">
                  {item.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  Reason: {item.reason}
                </p>

              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">

                <div>
                  <span className="text-muted-foreground">Category</span>
                  <p>{item.category}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Location</span>
                  <p>{item.location}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Priority</span>
                  <p>{item.priority}</p>
                </div>

              </div>

              {item.status === "pending" && (

                <div className="flex gap-3 pt-2">

                  <Button
                    variant="destructive"
                    onClick={() => rejectComplaint(item.id)}
                  >
                    Reject Complaint
                  </Button>

                  <Button
                    onClick={() => approveComplaint(item.id)}
                  >
                    Approve Complaint
                  </Button>

                </div>

              )}

            </CardContent>

          </Card>

        ))}

      </div>

    </AdminLayout>

  )
}

