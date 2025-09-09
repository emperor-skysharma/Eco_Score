import { motion } from 'framer-motion'
import Card from '../components/Card.jsx'

export default function Home() {
  return (
    <div className="grid gap-4">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
        Learn. Act. Lead. For a Greener Punjab.
      </motion.h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Gamified Learning">Quizzes, challenges, and eco-tasks to build habits.</Card>
        <Card title="Green Career Portfolio">Auto-generate and export your eco achievements.</Card>
        <Card title="Community">Collaborate in projects and forums.</Card>
        <Card title="Teacher Tools">Track progress, approve submissions, run analytics.</Card>
      </div>
    </div>
  )
}

