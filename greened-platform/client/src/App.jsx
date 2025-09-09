import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Nav from './components/Nav'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Challenges from './pages/Challenges'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Internships from './pages/Internships'
import Teacher from './pages/Teacher'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } 
            />
            <Route path="/internships" element={<Internships />} />
            <Route 
              path="/teacher" 
              element={
                <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                  <Teacher />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App