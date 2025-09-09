import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Award, 
  Leaf, 
  Zap, 
  Droplets, 
  Recycle,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react'
import Card from '../components/Card'
import Header from '../components/Header'

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description: 'Engaging modules on climate change, renewable energy, and sustainability',
      color: 'text-blue-600'
    },
    {
      icon: Trophy,
      title: 'Gamified Challenges',
      description: 'Complete eco-tasks, earn points, and unlock achievements',
      color: 'text-yellow-600'
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Connect with peers, share experiences, and collaborate on projects',
      color: 'text-green-600'
    },
    {
      icon: Award,
      title: 'Career Development',
      description: 'Build your green career portfolio with certifications and skills',
      color: 'text-purple-600'
    }
  ]

  const categories = [
    {
      icon: Leaf,
      title: 'Tree Planting',
      description: 'Plant trees and contribute to reforestation',
      color: 'bg-green-100 text-green-600',
      count: '50+ Activities'
    },
    {
      icon: Recycle,
      title: 'Waste Management',
      description: 'Learn proper waste segregation and recycling',
      color: 'bg-blue-100 text-blue-600',
      count: '30+ Activities'
    },
    {
      icon: Zap,
      title: 'Energy Conservation',
      description: 'Discover ways to save energy and use renewables',
      color: 'bg-yellow-100 text-yellow-600',
      count: '25+ Activities'
    },
    {
      icon: Droplets,
      title: 'Water Conservation',
      description: 'Learn water-saving techniques and practices',
      color: 'bg-cyan-100 text-cyan-600',
      count: '20+ Activities'
    }
  ]

  const stats = {
    users: '2,500+',
    challenges: '15,000+',
    points: '500,000+'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Header
        title="Learn. Act. Impact."
        subtitle="Gamified environmental education for a sustainable future"
        showStats={true}
        stats={stats}
        action={
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/learn"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Learning
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/challenges"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Take Challenges
              <Trophy className="ml-2 w-5 h-5" />
            </Link>
          </div>
        }
      />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose GreenEd?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines education, gamification, and community to make 
              environmental learning engaging and impactful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <div className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Environmental Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deep into various environmental topics through interactive 
              learning modules and hands-on challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full group cursor-pointer">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      {category.count}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with environmental learning in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up & Learn',
                description: 'Create your account and start with interactive learning modules',
                icon: BookOpen
              },
              {
                step: '2',
                title: 'Complete Challenges',
                description: 'Take on real-world environmental challenges and earn points',
                icon: Trophy
              },
              {
                step: '3',
                title: 'Build Your Portfolio',
                description: 'Track your progress and build a green career portfolio',
                icon: Award
              }
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of students already making an impact on the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                <Play className="mr-2 w-5 h-5" />
                Explore Learning
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌱</span>
                </div>
                <span className="text-xl font-bold">GreenEd</span>
              </div>
              <p className="text-gray-400">
                Gamified environmental education for a sustainable future.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Learn</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/learn" className="hover:text-white transition-colors">Modules</Link></li>
                <li><Link to="/challenges" className="hover:text-white transition-colors">Challenges</Link></li>
                <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/internships" className="hover:text-white transition-colors">Internships</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GreenEd Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home