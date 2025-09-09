import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Award, 
  Trophy, 
  BookOpen, 
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  FileText,
  Share2,
  Eye
} from 'lucide-react'
import Card from '../components/Card'
import { useAuth } from '../contexts/AuthContext'
import { submissionsAPI } from '../api'
import toast from 'react-hot-toast'

const Portfolio = () => {
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState({
    achievements: [],
    activities: [],
    badges: [],
    stats: {
      totalPoints: 0,
      challengesCompleted: 0,
      modulesCompleted: 0,
      badgesEarned: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's submissions
      const submissionsRes = await submissionsAPI.getMySubmissions({ limit: 50 })
      const submissions = submissionsRes.data.submissions

      // Calculate stats
      const completedSubmissions = submissions.filter(s => s.status === 'APPROVED')
      const totalPoints = completedSubmissions.reduce((sum, s) => sum + (s.points || 0), 0)
      
      // Group activities by type
      const activities = completedSubmissions.map(submission => ({
        id: submission.id,
        title: submission.challenge?.title || 'Activity',
        type: submission.challenge?.category || 'General',
        points: submission.points || 0,
        date: submission.createdAt,
        description: submission.content || 'Environmental activity completed',
        status: submission.status
      }))

      // Mock badges data (in real app, this would come from user.badges)
      const badges = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Complete your first environmental challenge',
          icon: '🌱',
          earnedAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Tree Hugger',
          description: 'Plant 5 trees',
          icon: '🌳',
          earnedAt: '2024-01-20'
        },
        {
          id: '3',
          name: 'Waste Warrior',
          description: 'Complete 10 waste management challenges',
          icon: '♻️',
          earnedAt: '2024-02-01'
        }
      ]

      setPortfolioData({
        achievements: activities.slice(0, 10),
        activities,
        badges,
        stats: {
          totalPoints: user?.points || totalPoints,
          challengesCompleted: completedSubmissions.length,
          modulesCompleted: 0, // This would come from module completion tracking
          badgesEarned: badges.length
        }
      })
    } catch (error) {
      toast.error('Failed to fetch portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    try {
      setGeneratingPDF(true)
      // In a real implementation, this would call the portfolio API
      toast.success('PDF generation started! You will receive it via email.')
      
      // Simulate PDF generation
      setTimeout(() => {
        setGeneratingPDF(false)
        toast.success('PDF generated successfully!')
      }, 3000)
    } catch (error) {
      toast.error('Failed to generate PDF')
      setGeneratingPDF(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      TREE_PLANTING: 'bg-green-100 text-green-800',
      WASTE_SEGREGATION: 'bg-blue-100 text-blue-800',
      ENERGY_CONSERVATION: 'bg-yellow-100 text-yellow-800',
      WATER_SAVING: 'bg-cyan-100 text-cyan-800',
      RECYCLING: 'bg-purple-100 text-purple-800',
      COMPOSTING: 'bg-orange-100 text-orange-800',
      CLEANUP_DRIVE: 'bg-red-100 text-red-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
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
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Portfolio
              </h1>
              <p className="text-gray-600">
                Track your environmental achievements and build your green career profile.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="btn btn-outline flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button 
                onClick={generatePDF}
                disabled={generatingPDF}
                className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{generatingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">
                    {user?.school && `${user.school} • `}
                    {user?.grade && `Grade ${user.grade} • `}
                    Level {portfolioData.stats.totalPoints > 0 ? Math.floor(portfolioData.stats.totalPoints / 100) + 1 : 1}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {portfolioData.stats.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {portfolioData.stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {portfolioData.stats.challengesCompleted}
            </div>
            <div className="text-sm text-gray-600">Challenges</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {portfolioData.stats.modulesCompleted}
            </div>
            <div className="text-sm text-gray-600">Modules</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {portfolioData.stats.badgesEarned}
            </div>
            <div className="text-sm text-gray-600">Badges</div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {portfolioData.achievements.length > 0 ? (
                  portfolioData.achievements.map((achievement, index) => (
                    <div key={achievement.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {achievement.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              +{achievement.points} pts
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(achievement.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`badge ${getCategoryColor(achievement.type)} text-xs`}>
                            {achievement.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No achievements yet</p>
                    <p className="text-sm text-gray-500">Complete some challenges to see your achievements here!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Badges Earned</h2>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {portfolioData.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {badge.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-gray-900">5 activities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-sm font-medium text-gray-900">2 activities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Streak</span>
                  <span className="text-sm font-medium text-green-600">7 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rank</span>
                  <span className="text-sm font-medium text-gray-900">#42 in school</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio