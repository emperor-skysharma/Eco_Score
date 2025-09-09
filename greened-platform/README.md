# 🌍 GreenEd Platform

A gamified environmental education platform designed for schools and colleges in Punjab, India. This platform teaches sustainability through interactive learning, challenges, and community engagement.

## 🎯 Features

- **Gamified Learning**: Quizzes, challenges, and interactive lessons with points and badges
- **Career Development**: Green career portfolio with auto-generated resumes and certifications
- **Community**: Forums, project collaboration, and internship listings
- **Teacher Tools**: Dashboard for progress tracking and student management
- **Mobile-First**: Responsive design optimized for low-bandwidth usage

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up Database**
   ```bash
   npm run db:setup
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Access the Platform**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🏗️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + Prisma + PostgreSQL/SQLite
- **Authentication**: JWT with role-based access
- **File Uploads**: Multer
- **PDF Generation**: Custom Node.js scripts

## 📁 Project Structure

```
greened-platform/
├── client/          # React frontend
├── server/          # Node.js backend
├── scripts/         # Utility scripts
└── prompts/         # AI prompts for verification
```

## 🎮 Gamification System

- **Points**: Earned through quizzes, challenges, and eco-tasks
- **Badges**: Achievement-based rewards
- **Leaderboards**: School and regional rankings
- **Portfolio**: Auto-generated career portfolio from activities

## 🔧 Development

- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **API**: RESTful API with Express.js
- **Auth**: JWT tokens with role-based permissions
- **File Upload**: Image/video uploads for eco-task verification

## 📱 Mobile Support

Optimized for mobile devices with:
- Responsive design
- Touch-friendly interactions
- Offline capability (future)
- Low-bandwidth optimization

## 🌱 Future Integrations

- AI-powered content verification
- AR/VR learning modules
- Real-time environmental data
- IoT sensor integration

## 📄 License

MIT License - see LICENSE file for details