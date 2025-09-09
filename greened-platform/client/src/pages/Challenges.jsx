import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import { api, uploadFile } from '../api.js'

export default function Challenges() {
  const [challenges, setChallenges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [selected, setSelected] = useState(null)
  const [file, setFile] = useState()
  const [status, setStatus] = useState('')

  useEffect(() => {
    api('/api/challenges').then(d => setChallenges(d.challenges || []))
    api('/api/challenges/leaderboard').then(d => setLeaderboard(d.leaderboard || []))
  }, [])

  async function submit() {
    if (!selected || !file) return
    setStatus('Submitting...')
    const res = await uploadFile('/api/submissions', file, { challengeId: selected })
    setStatus(res.status === 200 ? 'Submitted!' : 'Failed')
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Eco Challenges</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map(c => (
          <Card key={c.id} title={`${c.title} (+${c.points})`}>
            <div className="text-sm">{c.description}</div>
            <div className="mt-2 flex items-center gap-2">
              <input type="radio" name="challenge" value={c.id} onChange={() => setSelected(c.id)} /> Select
            </div>
          </Card>
        ))}
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Submit Proof</h3>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
        <button className="btn ml-2" onClick={submit}>Upload</button>
        <span className="ml-3 text-sm">{status}</span>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Leaderboard</h3>
        <ol className="list-decimal ml-6 text-sm">
          {leaderboard.map(u => <li key={u.id}>{u.name} - {u.ecoPoints} pts</li>)}
        </ol>
      </div>
    </div>
  )
}

