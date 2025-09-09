import Card from '../components/Card.jsx'

export default function Internships() {
  const listings = [
    { title: 'Waste Management Intern', org: 'Municipal Corp Ludhiana' },
    { title: 'Tree Plantation Drive Volunteer', org: 'Punjab Forest Dept' },
  ]
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Internships & Volunteering</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {listings.map((l, i) => (
          <Card key={i} title={l.title}>{l.org}</Card>
        ))}
      </div>
    </div>
  )
}

