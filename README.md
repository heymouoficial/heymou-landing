# Plataforma Digital heyMou

A bilingual digital platform that serves as the meeting point between visionary entrepreneurs and their comprehensive technology partner. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Technology Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom brand colors
- **Backend**: BuildShip workflows (proxy architecture)
- **Database**: Supabase (accessed via BuildShip)
- **Internationalization**: Spanish/English support
- **Code Quality**: ESLint + Prettier

## 🎨 Brand Colors

- **Primary**: Deep blue (#1e3a8a)
- **Primary Hover**: Lighter blue (#3b82f6)
- **Borders**: Slate colors (#e2e8f0, #cbd5e1)

## 📁 Project Structure

```text
/
├── src/app/              # Next.js App Router pages
├── components/           # React components
│   ├── ui/              # Basic UI components
│   ├── layout/          # Layout components
│   └── sections/        # Page sections
├── lib/                 # Utilities and integrations
│   ├── buildship/       # BuildShip integration
│   ├── supabase/        # Supabase types (via BuildShip)
│   └── utils.ts         # General utilities
├── types/               # TypeScript definitions
├── locales/             # Translation files
│   ├── es/             # Spanish translations
│   └── en/             # English translations
└── .kiro/              # Kiro specs and configuration
```

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

## 🌐 Internationalization

The platform supports Spanish (default) and English with:

- Locale-based routing
- Translation files in `/locales`
- Bilingual content management

## 🔧 Environment Setup

This project uses a BuildShip proxy architecture where:

- Frontend communicates only with BuildShip endpoints
- BuildShip handles all Supabase interactions
- No direct Supabase credentials in frontend environment

## 📋 Development Guidelines

- **TypeScript**: Strict mode enabled with additional safety checks
- **Code Style**: Prettier with single quotes, 2-space indentation
- **Linting**: ESLint with Next.js and TypeScript rules
- **Components**: Organized by type (ui, layout, sections)
- **Imports**: Organized with path aliases (@/components, @/lib, etc.)

## 🚦 Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## 📝 Next Steps

This foundation is ready for:

- Internationalization setup (Task 2)
- BuildShip integration (Task 3)
- UI component development (Task 4)
- Content management (Tasks 7-8)

## 🔍 Quality Checks

All code passes:

- ✅ TypeScript strict type checking
- ✅ ESLint with no warnings/errors
- ✅ Prettier formatting
- ✅ Next.js build optimization
