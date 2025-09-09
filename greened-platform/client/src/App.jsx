import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Learn from './pages/Learn.jsx'
import Challenges from './pages/Challenges.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Internships from './pages/Internships.jsx'
import Teacher from './pages/Teacher.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Nav />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/teacher" element={<Teacher />} />
        </Routes>
      </div>
    </div>
  )
}

