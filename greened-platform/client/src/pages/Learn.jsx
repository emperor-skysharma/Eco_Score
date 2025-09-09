import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import { api } from '../api.js'

export default function Learn() {
  const [modules, setModules] = useState([])
  useEffect(() => { api('/api/modules').then(d => setModules(d.modules || [])).catch(() => {}) }, [])
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Learning Modules</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {modules.map(m => (
          <Card key={m.id} title={m.title}>{m.summary}</Card>
        ))}
      </div>
    </div>
  )
}

