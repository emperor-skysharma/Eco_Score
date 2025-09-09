import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'

export default function Portfolio() {
  const [user, setUser] = useState(null)
  useEffect(() => { const raw = localStorage.getItem('user'); if (raw) setUser(JSON.parse(raw)) }, [])

  function exportPdf() {
    // For MVP, trigger serverless script is not wired; instruct user to run CLI
    alert('Run: npm run pdf (monorepo root) to generate sample PDF')
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Green Career Portfolio</h2>
      <Card title="Overview">
        <div>Name: {user?.name || 'Student'}</div>
        <div>Eco Points: {user?.ecoPoints ?? 0}</div>
      </Card>
      <button className="btn w-max" onClick={exportPdf}>Export as PDF</button>
    </div>
  )
}

