import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Trophy, 
  BookOpen, 
  Award, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  BarChart3,
  Download
} from 'lucide-react'
import Card from '../components/Card'
import { useAuth } from '../contexts/AuthContext'
import { submissionsAPI } from '../api'
import toast from 'react-hot-toast'

const Teacher = () => {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    challenge: '',
    search: ''
  })
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingReview: 0,
    approvedToday: 0,
    totalPoints: 0
  })

  useEffect(() => {
    fetchSubmissions()
  }, [filters])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await submissionsAPI.getAll(filters)
      const submissionsData = response.data.submissions
      
      setSubmissions(submissionsData)
      
      // Calculate stats
      const totalSubmissions = submissionsData.length
      const pendingReview = submissionsData.filter(s => s.status === 'PENDING').length
      const approvedToday = submissionsData.filter(s => 
        s.status === 'APPROVED' && 
        new Date(s.verifiedAt).toDateString() === new Date().toDateString()
      ).length
      const totalPoints = submissionsData
        .filter(s => s.status === 'APPROVED')
        .reduce((sum, s) => sum + (s.points || 0), 0)
      
      setStats({
        totalSubmissions,
        pendingReview,
        approvedToday,
        totalPoints
      })
    } catch (error) {
      toast.error('Failed to fetch submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (submissionId, status, feedback, points) => {
    try {
      await submissionsAPI.updateStatus(submissionId, status, feedback, points)
      toast.success('Status updated successfully')
      fetchSubmissions() // Refresh data
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge-green'
      case 'PENDING': return 'badge-yellow'
      case 'REJECTED': return 'badge-red'
      case 'NEEDS_REVISION': return 'badge-blue'
      default: return 'badge-gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return CheckCircle
      case 'PENDING': return Clock
      case 'REJECTED': return AlertCircle
      case 'NEEDS_REVISION': return Edit
      default: return Clock
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600">
              Manage student submissions and track environmental learning progress.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalSubmissions}
            </div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.pendingReview}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.approvedToday}
            </div>
            <div className="text-sm text-gray-600">Approved Today</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Points Awarded</div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full input"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="NEEDS_REVISION">Needs Revision</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge
              </label>
              <input
                type="text"
                placeholder="Search by challenge..."
                value={filters.challenge}
                onChange={(e) => setFilters({ ...filters, challenge: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full input pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', challenge: '', search: '' })}
                className="w-full btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Submissions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Student Submissions</h2>
              <div className="flex space-x-2">
                <button className="btn btn-outline text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button className="btn btn-outline text-sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Challenge</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => {
                      const StatusIcon = getStatusIcon(submission.status)
                      return (
                        <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-green-600">
                                  {submission.user?.firstName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {submission.user?.firstName} {submission.user?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {submission.user?.school} • {submission.user?.grade}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {submission.challenge?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.challenge?.category}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="badge badge-blue">
                              {submission.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className={`badge ${getStatusColor(submission.status)}`}>
                                {submission.status}
                              </div>
                              {typeof StatusIcon === 'string' ? (
                                <span className="text-sm">{StatusIcon}</span>
                              ) : (
                                <StatusIcon className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">
                              {submission.points || 0}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(submission.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Eye className="w-4 h-4" />
                              </button>
                              {submission.status === 'PENDING' && (
                                <>
                                  <button 
                                    onClick={() => handleStatusUpdate(submission.id, 'APPROVED', 'Great work!', submission.challenge?.points)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleStatusUpdate(submission.id, 'REJECTED', 'Please improve and resubmit.')}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && submissions.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600">No student submissions match your current filters.</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Teacher