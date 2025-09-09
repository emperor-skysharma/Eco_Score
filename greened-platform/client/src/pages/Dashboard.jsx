import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  BookOpen, 
  Award, 
  TrendingUp,
  Calendar,
  Target,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'
import Card from '../components/Card'
import { useAuth } from '../contexts/AuthContext'
import { submissionsAPI, modulesAPI, challengesAPI } from '../api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    challengesCompleted: 0,
    modulesCompleted: 0,
    badgesEarned: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [recentModules, setRecentModules] = useState([])
  const [recentChallenges, setRecentChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's submissions
      const submissionsRes = await submissionsAPI.getMySubmissions({ limit: 10 })
      const recentSubmissions = submissionsRes.data.submissions

      // Fetch recent modules
      const modulesRes = await modulesAPI.getAll({ limit: 3 })
      setRecentModules(modulesRes.data.modules)

      // Fetch recent challenges
      const challengesRes = await challengesAPI.getAll({ limit: 3 })
      setRecentChallenges(challengesRes.data.challenges)

      // Calculate stats
      const completedSubmissions = recentSubmissions.filter(s => s.status === 'APPROVED')
      const totalPoints = completedSubmissions.reduce((sum, s) => sum + (s.points || 0), 0)
      
      setStats({
        totalPoints: user?.points || totalPoints,
        level: user?.level || 1,
        challengesCompleted: completedSubmissions.filter(s => s.challenge).length,
        modulesCompleted: 0, // This would come from module completion tracking
        badgesEarned: user?.badges?.length || 0
      })

      setRecentActivity(recentSubmissions.slice(0, 5))
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
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
      case 'REJECTED': return '❌'
      case 'NEEDS_REVISION': return '⚠️'
      default: return Clock
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
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
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Continue your environmental learning journey and make a positive impact.
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
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              Level {stats.level}
            </div>
            <div className="text-sm text-gray-600">Current Level</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.challengesCompleted}
            </div>
            <div className="text-sm text-gray-600">Challenges Completed</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.badgesEarned}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => {
                    const StatusIcon = getStatusIcon(activity.status)
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 ${getStatusColor(activity.status)} rounded-full flex items-center justify-center`}>
                          {typeof StatusIcon === 'string' ? (
                            <span className="text-sm">{StatusIcon}</span>
                          ) : (
                            <StatusIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {activity.challenge?.title || 'Submission'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {activity.status === 'APPROVED' && activity.points && `+${activity.points} points`}
                            {activity.status === 'PENDING' && 'Under review'}
                            {activity.status === 'REJECTED' && 'Needs improvement'}
                            {activity.status === 'NEEDS_REVISION' && 'Please revise'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent activity</p>
                    <p className="text-sm text-gray-500">Complete some challenges to see your progress here!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Continue Learning</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Take Challenges</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">View Portfolio</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </Card>

            {/* Recent Modules */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Modules</h2>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentModules.slice(0, 3).map((module) => (
                  <div key={module.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {module.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {module.points} points • {module.duration} min
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Level Progress</span>
                  <span className="text-sm text-gray-600">
                    {stats.totalPoints % 100}/100 points to next level
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.totalPoints % 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">This Month</span>
                  <span className="text-sm text-gray-600">Keep it up!</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>5 challenges</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>3 modules</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard