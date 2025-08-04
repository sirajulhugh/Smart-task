# SmartTaskAI - Intelligent Task Manager

Your AI-powered task manager and productivity assistant built with Next.js, Supabase, and Google Gemini AI.

## 🚀 Features

- **AI-Powered Task Enhancement**: Transform vague tasks into clear, actionable items
- **Smart Analytics**: Get insights into your productivity patterns
- **Daily Planning**: AI-powered recommendations for optimal task scheduling
- **Task Management**: Complete CRUD operations with categories, priorities, and subtasks
- **Real-time Sync**: Powered by Supabase for seamless data synchronization
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini AI
- **Deployment**: Vercel

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Supabase Account**: [Create account](https://supabase.com)
2. **Google AI Studio Account**: [Get API key](https://makersuite.google.com/app/apikey)
3. **Vercel Account**: [Create account](https://vercel.com)

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/smart-task-ai)

### Method 2: Manual Deploy

1. **Clone or download this project**
2. **Install Vercel CLI**:
   \`\`\`bash
   npm i -g vercel
   \`\`\`
3. **Deploy**:
   \`\`\`bash
   vercel
   \`\`\`

## ⚙️ Environment Variables

Set these in your Vercel dashboard (Settings → Environment Variables):

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
\`\`\`

## 🗄️ Database Setup

1. **Create Supabase Project**
2. **Run the SQL script** from `scripts/create-tasks-table.sql` in your Supabase SQL editor
3. **Enable Row Level Security** (already included in the script)

## 🔧 Local Development

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   # Fill in your actual values
   \`\`\`

3. **Run development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open** [http://localhost:3000](http://localhost:3000)

## 📱 Features Overview

### Dashboard
- Task completion statistics
- High-priority task alerts
- Quick action buttons
- Recent task activity

### Task Management
- Create, edit, delete tasks
- Categories: Work, Personal, Health, Study, Communication, Errands
- Priority levels: Low, Medium, High, Critical
- Effort estimation (1-5 scale)
- Due dates and subtasks

### AI Assistant
- **Task Enhancement**: Clarify vague tasks
- **Task Analysis**: Smart categorization and scheduling
- **Subtask Generation**: Break down complex tasks
- **Help & Guidance**: Get tips and solutions
- **Daily Insights**: Personalized productivity advice

### Daily Planner
- Calendar view of scheduled tasks
- AI-powered time recommendations
- Overdue task alerts
- Energy-based scheduling suggestions

### Analytics
- Completion rate tracking
- Category performance analysis
- Priority distribution
- Effort analysis and recommendations

## 🔒 Security Features

- Row Level Security (RLS) enabled
- User authentication via Supabase Auth
- Secure API key handling
- CORS protection
- XSS protection headers

## 🎨 UI/UX Features

- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Accessible components
- Intuitive navigation

## 📊 Performance

- Server-side rendering with Next.js
- Optimized database queries
- Lazy loading components
- Image optimization
- Efficient state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](#troubleshooting)
2. Review environment variable setup
3. Verify Supabase configuration
4. Check Vercel deployment logs

## 🔧 Troubleshooting

### Common Issues

**Build Errors**:
- Ensure all environment variables are set
- Check TypeScript compilation errors
- Verify all dependencies are installed

**Database Connection**:
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure database schema is created

**AI Features Not Working**:
- Verify Gemini API key is valid
- Check API quota limits
- Ensure proper error handling

---

Built with ❤️ using Next.js, Supabase, and Google Gemini AI
