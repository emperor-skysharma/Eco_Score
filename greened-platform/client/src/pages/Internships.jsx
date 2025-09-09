import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Filter, 
  Search,
  ChevronRight,
  ExternalLink,
  Calendar,
  Building,
  Star
} from 'lucide-react'
import Card from '../components/Card'
import Header from '../components/Header'

const Internships = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: ''
  })

  useEffect(() => {
    fetchInternships()
  }, [filters])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, this would come from API
      const mockInternships = [
        {
          id: '1',
          title: 'Environmental Research Intern',
          company: 'Punjab Environmental Research Institute',
          location: 'Chandigarh, Punjab',
          type: 'FULL_TIME',
          duration: '3 months',
          description: 'Join our research team studying climate change impacts on local agriculture. Work on data analysis, field research, and report writing.',
          requirements: 'Students pursuing Environmental Science, Biology, or related fields. Basic knowledge of data analysis preferred.',
          postedDate: '2024-01-15',
          applicationDeadline: '2024-02-15',
          applicants: 12,
          rating: 4.8
        },
        {
          id: '2',
          title: 'Community Outreach Volunteer',
          company: 'Green Punjab Foundation',
          location: 'Various locations in Punjab',
          type: 'PART_TIME',
          duration: '2 months',
          description: 'Help organize environmental awareness programs in rural areas. Conduct workshops, distribute educational materials, and engage with local communities.',
          requirements: 'Good communication skills, passion for environmental causes, ability to travel.',
          postedDate: '2024-01-10',
          applicationDeadline: '2024-02-01',
          applicants: 8,
          rating: 4.6
        },
        {
          id: '3',
          title: 'Sustainability Coordinator',
          company: 'EcoTech Solutions',
          location: 'Ludhiana, Punjab',
          type: 'FULL_TIME',
          duration: '6 months',
          description: 'Assist in developing and implementing sustainability initiatives for local businesses. Work on waste reduction, energy efficiency, and green technology adoption.',
          requirements: 'Background in Environmental Science or Business. Strong project management skills.',
          postedDate: '2024-01-08',
          applicationDeadline: '2024-01-25',
          applicants: 15,
          rating: 4.9
        },
        {
          id: '4',
          title: 'Water Conservation Intern',
          company: 'Punjab Water Resources Department',
          location: 'Amritsar, Punjab',
          type: 'PART_TIME',
          duration: '4 months',
          description: 'Support water conservation projects and community education programs. Help with data collection, analysis, and public awareness campaigns.',
          requirements: 'Interest in water management, good analytical skills, willingness to work in field conditions.',
          postedDate: '2024-01-05',
          applicationDeadline: '2024-01-30',
          applicants: 6,
          rating: 4.7
        }
      ]

      // Apply filters
      let filteredInternships = mockInternships
      
      if (filters.type) {
        filteredInternships = filteredInternships.filter(internship => 
          internship.type === filters.type
        )
      }
      
      if (filters.location) {
        filteredInternships = filteredInternships.filter(internship => 
          internship.location.toLowerCase().includes(filters.location.toLowerCase())
        )
      }
      
      if (filters.search) {
        filteredInternships = filteredInternships.filter(internship => 
          internship.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          internship.company.toLowerCase().includes(filters.search.toLowerCase()) ||
          internship.description.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      setInternships(filteredInternships)
    } catch (error) {
      console.error('Failed to fetch internships:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'FULL_TIME': return 'badge-green'
      case 'PART_TIME': return 'badge-blue'
      case 'VOLUNTEER': return 'badge-purple'
      case 'REMOTE': return 'badge-yellow'
      default: return 'badge-gray'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'FULL_TIME': return 'Full Time'
      case 'PART_TIME': return 'Part Time'
      case 'VOLUNTEER': return 'Volunteer'
      case 'REMOTE': return 'Remote'
      default: return type
    }
  }

  const isApplicationOpen = (deadline) => {
    return new Date(deadline) > new Date()
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Internships & Opportunities"
        subtitle="Find environmental internships and volunteer opportunities"
        action={
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search internships..."
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
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full input"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full input"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ type: '', location: '', search: '' })}
                className="w-full btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Internships Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {internships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {internship.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{internship.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{internship.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`badge ${getTypeColor(internship.type)}`}>
                        {getTypeLabel(internship.type)}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{internship.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {internship.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {internship.requirements}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{internship.applicants} applicants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(internship.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Posted {new Date(internship.postedDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="btn btn-outline text-sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      <button 
                        className={`btn text-sm ${
                          isApplicationOpen(internship.applicationDeadline) 
                            ? 'btn-primary' 
                            : 'btn-secondary cursor-not-allowed'
                        }`}
                        disabled={!isApplicationOpen(internship.applicationDeadline)}
                      >
                        {isApplicationOpen(internship.applicationDeadline) 
                          ? 'Apply Now' 
                          : 'Closed'
                        }
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && internships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Don't see what you're looking for?
              </h2>
              <p className="text-gray-600 mb-6">
                We're always adding new opportunities. Check back regularly or contact us to suggest new positions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn btn-primary">
                  Get Notified
                </button>
                <button className="btn btn-outline">
                  Contact Us
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Internships