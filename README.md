# HuaMeng Office Web Application

A modern web application built with Next.js, TypeScript, and Prisma for office management and data visualization.

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion animations
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

### Backend & Database
- **Database**: SQLite (development), PostgreSQL (production recommended)
- **ORM**: Prisma 5
- **Authentication**: bcryptjs for password hashing
- **API**: Next.js API Routes

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js built-in bundler
- **Code Quality**: TypeScript strict mode
- **Database Migrations**: Prisma Migrate

## 📁 Project Structure

```
HuaMengWorkspaceWeb/
├── src/                    # Application source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components
│   └── lib/              # Utility functions and configurations
├── prisma/                # Database schema and migrations
│   ├── schema.prisma     # Database schema definition
│   ├── migrations/       # Database migration files
│   └── seed.ts          # Database seeding script
├── public/               # Static assets
├── .next/               # Next.js build output (auto-generated)
├── node_modules/        # Dependencies (auto-generated)
└── Configuration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HuaMengWorkspaceWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with initial data

## 🗄️ Database Schema

The application uses Prisma with the following main entities:

- **Users** - User management and authentication
- **[Additional entities based on your schema]**

To view the full schema:
```bash
npx prisma studio
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Add other environment variables as needed
```

### Database Configuration

**Development**: Uses SQLite by default (`file:./dev.db`)

**Production**: Recommended to use PostgreSQL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/huameng_db"
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on git push

### Docker Deployment
1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   RUN npx prisma generate
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://user:password@db:5432/huameng
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=huameng
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Traditional Server Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up production database**
   ```bash
   npx prisma migrate deploy
   ```

3. **Start the application**
   ```bash
   npm start
   ```

## 🔒 Security Considerations

- Environment variables are never committed to version control
- Passwords are hashed using bcryptjs
- Database connections use secure connection strings
- Next.js built-in security headers are enabled

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run test coverage
npm run test:coverage
```

## 📊 Performance Optimization

- Next.js automatic code splitting
- Image optimization with Next.js Image component
- Tailwind CSS purging in production
- Database query optimization with Prisma

## 🔍 Monitoring and Debugging

### Development Tools
- **Prisma Studio**: `npx prisma studio`
- **Next.js Dev Tools**: Built-in dev server debugging
- **React DevTools**: Browser extension for React debugging

### Production Monitoring
- Consider integrating with Vercel Analytics
- Set up error tracking (Sentry, etc.)
- Monitor database performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and Prisma**
