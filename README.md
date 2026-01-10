# CoForm - Collaborative Form Builder

> Build beautiful forms in minutes. Share instantly. Collect responses effortlessly.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ Features

- 🎨 **Drag-and-Drop Builder** - Intuitive form creation
- � **Auto-Save** - Never lose your work
- 🌐 **Public Sharing** - Share forms with anyone
- 📊 **Response Dashboard** - View all submissions
- 📥 **Export Data** - CSV & JSON export
- 🎯 **7 Field Types** - Text, email, number, textarea, date, select, checkbox
- 📱 **Fully Responsive** - Works on all devices
- 🔒 **Secure** - Row-level security with Supabase
- ⚡ **Fast** - Optimized performance
- 🎭 **Clean UI** - Beautiful, minimal design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/coform.git
cd coform/liveforms

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
# Go to Supabase Dashboard → SQL Editor
# Run the SQL from supabase/migrations/001_initial_schema.sql

# Start development server
pnpm dev
```

Visit `http://localhost:3000`

## 📖 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Week 1](WEEK1.md) - Form Editor
- [Week 2](WEEK2.md) - Supabase Integration
- [Week 3](WEEK3.md) - Form Sharing & Submissions
- [Week 4](WEEK4.md) - Export & Field Types
- [Code Quality](CODE_QUALITY.md) - Architecture guide

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Drag & Drop:** dnd-kit
- **Deployment:** Vercel

## 📁 Project Structure

```
liveforms/
├── src/
│   ├── app/                    # Next.js routes
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Authentication
│   │   ├── dashboard/         # User dashboard
│   │   ├── editor/            # Form editor
│   │   └── form/              # Public forms
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── editor/           # Form editor
│   │   ├── form/             # Public form
│   │   └── dashboard/        # Dashboard
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Business logic
│   │   ├── auth/            # Authentication
│   │   ├── forms/           # Form operations
│   │   ├── submissions/     # Submissions
│   │   └── supabase/        # Database clients
│   └── types/               # TypeScript types
├── supabase/
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## 🎯 Features Roadmap

### ✅ Completed (Weeks 1-4)
- [x] Form builder with drag-and-drop
- [x] 7 field types
- [x] User authentication
- [x] Auto-save functionality
- [x] Public form sharing
- [x] Submissions dashboard
- [x] CSV/JSON export
- [x] Mobile responsive

### 🚧 In Progress (Week 5)
- [ ] Landing page optimization
- [ ] SEO & meta tags
- [ ] Performance optimization
- [ ] Production deployment

### 📋 Planned (Weeks 6-8)
- [ ] Real-time collaboration
- [ ] Form analytics
- [ ] Email notifications
- [ ] Webhooks
- [ ] Form templates
- [ ] Conditional logic
- [ ] File uploads
- [ ] API access

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Deployment platform

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourusername](https://twitter.com/yourusername)
- Email: your.email@example.com

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
