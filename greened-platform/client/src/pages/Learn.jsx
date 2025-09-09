import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Filter, 
  Search,
  ChevronRight,
  Play,
  CheckCircle,
  Award
} from 'lucide-react'
import Card from '../components/Card'
import Header from '../components/Header'
import { modulesAPI } from '../api'
import toast from 'react-hot-toast'

const Learn = () => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  })
  const [categories, setCategories] = useState([])
  const [difficulties, setDifficulties] = useState([])

  useEffect(() => {
    fetchModules()
    fetchFilters()
  }, [filters])

  const fetchModules = async () => {
    try {
      setLoading(true)
      const response = await modulesAPI.getAll(filters)
      setModules(response.data.modules)
    } catch (error) {
      toast.error('Failed to fetch modules')
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const [categoriesRes, difficultiesRes] = await Promise.all([
        modulesAPI.getCategories(),
        modulesAPI.getDifficulties()
      ])
      setCategories(categoriesRes.data.categories)
      setDifficulties(difficultiesRes.data.difficulties)
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
      CLIMATE_CHANGE: '🌍',
      RENEWABLE_ENERGY: '⚡',
      WASTE_MANAGEMENT: '♻️',
      BIODIVERSITY: '🦋',
      WATER_CONSERVATION: '💧',
      SUSTAINABLE_LIVING: '🌱'
    }
    return icons[category] || '📚'
  }

  const getCategoryColor = (category) => {
    const colors = {
      CLIMATE_CHANGE: 'bg-red-100 text-red-800',
      RENEWABLE_ENERGY: 'bg-yellow-100 text-yellow-800',
      WASTE_MANAGEMENT: 'bg-blue-100 text-blue-800',
      BIODIVERSITY: 'bg-green-100 text-green-800',
      WATER_CONSERVATION: 'bg-cyan-100 text-cyan-800',
      SUSTAINABLE_LIVING: 'bg-emerald-100 text-emerald-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Learning Modules"
        subtitle="Master environmental concepts through interactive learning"
        action={
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search modules..."
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {difficulties.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: '', difficulty: '', search: '' })}
                className="w-full btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modules Grid */}
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
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getCategoryIcon(module.category)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {module.title}
                        </h3>
                        <div className={`badge ${getCategoryColor(module.category)} text-xs`}>
                          {categories.find(c => c.value === module.category)?.label || module.category}
                        </div>
                      </div>
                    </div>
                    <div className={`badge ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{module.points} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.quizzes?.length || 0} quizzes</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <span className="text-sm text-gray-500">(124 reviews)</span>
                    </div>
                    
                    <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Start Learning</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && modules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Learn