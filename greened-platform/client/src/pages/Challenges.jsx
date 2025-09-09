import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Clock, 
  Users, 
  Filter, 
  Search,
  ChevronRight,
  Play,
  CheckCircle,
  Award,
  Leaf,
  Recycle,
  Zap,
  Droplets,
  Trash2,
  Compost,
  Wrench
} from 'lucide-react'
import Card from '../components/Card'
import Header from '../components/Header'
import { challengesAPI } from '../api'
import toast from 'react-hot-toast'

const Challenges = () => {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    type: '',
    search: ''
  })
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])

  useEffect(() => {
    fetchChallenges()
    fetchFilters()
  }, [filters])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await challengesAPI.getAll(filters)
      setChallenges(response.data.challenges)
    } catch (error) {
      toast.error('Failed to fetch challenges')
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const [categoriesRes, typesRes] = await Promise.all([
        challengesAPI.getCategories(),
        challengesAPI.getTypes()
      ])
      setCategories(categoriesRes.data.categories)
      setTypes(typesRes.data.types)
    } catch (error) {
      console.error('Failed to fetch filters:', error)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'badge-green'
      case 'MEDIUM': return 'badge-yellow'
      case 'HARD': return 'badge-red'
      default: return 'badge-blue'
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      TREE_PLANTING: Leaf,
      WASTE_SEGREGATION: Recycle,
      ENERGY_CONSERVATION: Zap,
      WATER_SAVING: Droplets,
      RECYCLING: Trash2,
      COMPOSTING: Compost,
      CLEANUP_DRIVE: Wrench
    }
    return icons[category] || Trophy
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'QUIZ': return 'badge-blue'
      case 'TASK': return 'badge-green'
      case 'PROJECT': return 'badge-yellow'
      case 'COMMUNITY': return 'badge-purple'
      default: return 'badge-gray'
    }
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Environmental Challenges"
        subtitle="Take on real-world environmental challenges and make a difference"
        action={
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full input"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full input"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full input"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: '', difficulty: '', type: '', search: '' })}
                className="w-full btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => {
              const CategoryIcon = getCategoryIcon(challenge.category)
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 ${getCategoryColor(challenge.category)} rounded-lg flex items-center justify-center`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {challenge.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`badge ${getCategoryColor(challenge.category)} text-xs`}>
                              {categories.find(c => c.value === challenge.category)?.label || challenge.category}
                            </div>
                            <div className={`badge ${getTypeColor(challenge.type)} text-xs`}>
                              {challenge.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {challenge.description}
                    </p>

                    {challenge.requirements && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                        <div className="text-sm text-gray-600">
                          {typeof challenge.requirements === 'string' 
                            ? JSON.parse(challenge.requirements).instructions?.slice(0, 2).map((instruction, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{instruction}</span>
                                </div>
                              ))
                            : challenge.requirements.instructions?.slice(0, 2).map((instruction, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{instruction}</span>
                                </div>
                              ))
                          }
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{challenge.points} pts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{challenge.submissions?.length || 0} participants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Ongoing</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Created by {challenge.creator?.firstName} {challenge.creator?.lastName}
                      </div>
                      
                      <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium group-hover:translate-x-1 transition-transform">
                        <span>Take Challenge</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && challenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Challenges