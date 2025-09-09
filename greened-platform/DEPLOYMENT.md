# 🚀 GreenEd Platform - Deployment Guide

## Quick Start

1. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Default Credentials

- **Admin:** admin@greened.com / password123
- **Teacher:** teacher@greened.com / password123
- **Student:** student@greened.com / password123

## Manual Setup

If you prefer manual setup:

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp server/.env.example server/.env

# Edit server/.env with your configuration
```

### 3. Database Setup
```bash
cd server
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Start Development
```bash
# From root directory
npm run dev

# Or run separately
npm run server:dev  # Backend on port 5000
npm run client:dev  # Frontend on port 5173
```

## Production Deployment

### Backend (Node.js + Express)

1. **Environment Variables:**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-production-secret
   CLIENT_URL=https://your-domain.com
   ```

2. **Deploy to:**
   - **Vercel:** `vercel --prod`
   - **Railway:** Connect GitHub repo
   - **Google Cloud Run:** Use Dockerfile
   - **AWS EC2:** PM2 process manager

### Frontend (React + Vite)

1. **Build:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to:**
   - **Vercel:** `vercel --prod`
   - **Netlify:** Drag & drop dist folder
   - **AWS S3 + CloudFront:** Upload dist contents

### Database (PostgreSQL)

1. **Production Database:**
   - **Supabase:** Free tier available
   - **Railway:** PostgreSQL addon
   - **AWS RDS:** Managed PostgreSQL
   - **Google Cloud SQL:** Managed PostgreSQL

2. **Migration:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

## Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Docker Compose
```yaml
version: '3.8'
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: greened_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    environment:
      DATABASE_URL: postgresql://postgres:password@database:5432/greened_platform
      JWT_SECRET: your-secret
    depends_on:
      - database
    ports:
      - "5000:5000"

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key"

# Server Configuration
PORT=5000
NODE_ENV="production"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760

# AI/ML Services (optional)
GOOGLE_VISION_API_KEY=""
PLANT_ID_API_KEY=""

# Email Service (optional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# Frontend URL
CLIENT_URL="https://your-domain.com"
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Database: Prisma connection test
- Frontend: Static file serving

### Logs
- Backend: Console logs + file logging
- Frontend: Browser console
- Database: Query logs (development)

### Backup
- Database: Regular PostgreSQL dumps
- Files: Upload directory backup
- Code: Git repository

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set up CORS properly
- [ ] Validate file uploads
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection
- [ ] CSRF protection

## Performance Optimization

### Backend
- Database indexing
- Query optimization
- Caching (Redis)
- CDN for static files
- Image optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis
- CDN delivery

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check DATABASE_URL
   - Verify database is running
   - Check network connectivity

2. **JWT token invalid:**
   - Check JWT_SECRET
   - Verify token expiration
   - Check clock synchronization

3. **File upload failed:**
   - Check UPLOAD_DIR permissions
   - Verify MAX_FILE_SIZE
   - Check disk space

4. **CORS errors:**
   - Check CLIENT_URL configuration
   - Verify frontend URL matches

### Support

For issues and questions:
- Check logs for error details
- Verify environment variables
- Test API endpoints with Postman
- Check browser console for frontend errors

## License

MIT License - see LICENSE file for details.