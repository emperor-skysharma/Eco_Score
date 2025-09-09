import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import { api } from '../api.js'

export default function Teacher() {
  const [submissions, setSubmissions] = useState([])
  useEffect(() => {
    // For MVP, reuse student list but in real app teacher can view all
    api('/api/submissions').then(d => setSubmissions(d.submissions || [])).catch(() => {})
  }, [])
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
      <Card title="Pending Submissions">
        <ul className="text-sm list-disc ml-6">
          {submissions.filter(s => s.status === 'PENDING').map(s => (
            <li key={s.id}>{s.imageUrl} - {s.status}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

