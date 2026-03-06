import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', complaints: 12 },
  { month: 'Feb', complaints: 19 },
  { month: 'Mar', complaints: 8 },
  { month: 'Apr', complaints: 15 },
  { month: 'May', complaints: 22 },
]

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>

      <div className="p-6 space-y-6">

        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">

          <Card>
            <CardHeader>
              <CardTitle>Total Complaints</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              24
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolved Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              67%
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Urgent Issues</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              5
            </CardContent>
          </Card>

        </div>


        {/* Chart */}
        <Card>

          <CardHeader>
            <CardTitle>Monthly Complaint Trend</CardTitle>
          </CardHeader>

          <CardContent>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={data}>

                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="complaints"
                  fill="#3b82f6"
                  radius={[6,6,0,0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </div>

    </AdminLayout>
  )
}