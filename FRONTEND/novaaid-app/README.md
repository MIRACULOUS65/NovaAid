# NovaAid - Refugee Aid Platform

A comprehensive refugee aid website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Loading Animation**: Beautiful 3-second loading animation with NovaAid branding
- **Landing Page**: Stunning shader animation background with Get Started button
- **Homepage**: 3D hero section with animated boxes and feature cards
- **Sidebar Navigation**: Responsive sidebar with smooth animations
- **Modern UI Components**: Gradient buttons, badges, and more

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
novaaid-app/
├── app/
│   ├── landing/          # Landing page with shader animation
│   ├── homepage/         # Main homepage with sidebar
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Entry point with loading animation
│   └── globals.css       # Global styles
├── components/
│   └── ui/               # Reusable UI components
│       ├── loading-animation.tsx
│       ├── shader-animation.tsx
│       ├── gradient-button.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       ├── hero-section.tsx
│       └── sidebar.tsx
└── lib/
    └── utils.ts          # Utility functions
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Styled Components** - CSS-in-JS for loading animation

## Design Components

All UI components follow the designs from the UI COMPONENTS folder:
- Loading animation with NovaAid branding
- Shader animation for landing page
- Gradient buttons for CTAs
- 3D hero section with animated boxes
- Responsive sidebar navigation
