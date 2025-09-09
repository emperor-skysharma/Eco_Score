import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import { api } from '../api.js'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [subs, setSubs] = useState([])
  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) setUser(JSON.parse(raw))
    api('/api/submissions').then(d => setSubs(d.submissions || [])).catch(() => {})
  }, [])
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Profile">
          <div>Name: {user?.name || 'Guest'}</div>
          <div>Eco Points: {user?.ecoPoints ?? 0}</div>
        </Card>
        <Card title="Badges">
          <div className="text-xs text-gray-500">Earn badges by completing challenges.</div>
        </Card>
        <Card title="Progress">
          <div className="text-xs text-gray-500">Modules completed will show here.</div>
        </Card>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Recent Submissions</h3>
        <ul className="text-sm list-disc ml-6">
          {subs.map(s => (
            <li key={s.id}>{s.imageUrl} - {s.status} {s.pointsAwarded ? `(+${s.pointsAwarded})` : ''}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

