import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  const linkClass = ({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-green-700">GreenEd</Link>
        <div className="flex items-center gap-2 text-sm">
          <NavLink to="/learn" className={linkClass}>Learn</NavLink>
          <NavLink to="/challenges" className={linkClass}>Challenges</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink>
          <NavLink to="/internships" className={linkClass}>Internships</NavLink>
          <NavLink to="/teacher" className={linkClass}>Teacher</NavLink>
        </div>
      </div>
    </nav>
  )
}

