# NGO Portal - NovaAid

A comprehensive NGO management portal with authentication and organization profile management.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Clerk Authentication** with multiple providers (Google, GitHub, MetaMask, Email)
- **MongoDB Atlas** for data storage
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Framer Motion** for animations
- **Runs on port 3002**

## Setup Instructions

### 1. Install Dependencies

Navigate to the ngo-portal directory and install all required packages:

```bash
cd "c:\Users\beras\OneDrive\Desktop\celoo\NovaAid\FRONTEND\ngo-portal"
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
copy .env.example .env.local
```

Update `.env.local` with your MongoDB Atlas connection string:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmlybS1tb25rZmlzaC0xNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_rxuzEysUPSAtvUdTqWMkrL3yxLng4sV8rND5UoZ8U2
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

**Important:** Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string.

### 3. Set Up Clerk Authentication

See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed instructions on:
- Configuring authentication providers (Google, GitHub, MetaMask, Email)
- Setting up MongoDB Atlas
- Configuring redirect URLs

### 4. Run the Development Server

```bash
npm run dev
```

The NGO portal will start on **http://localhost:3002**

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
ngo-portal/
├── app/
│   ├── api/
│   │   └── ngo/
│   │       ├── create/route.ts    # Create NGO profile API
│   │       └── profile/route.ts   # Get/Update NGO profile API
│   ├── ngo-portal/
│   │   ├── page.tsx               # Authenticated dashboard
│   │   └── profile/page.tsx       # Profile management page
│   ├── onboarding/page.tsx        # NGO registration form
│   ├── sign-in/[[...sign-in]]/page.tsx   # Sign-in page
│   ├── sign-up/[[...sign-up]]/page.tsx   # Sign-up page
│   ├── layout.tsx                 # Root layout with Clerk provider
│   ├── page.tsx                   # Public homepage
│   └── globals.css                # Global styles
├── components/
│   └── ui/
│       ├── sidebar.tsx            # Animated sidebar component
│       ├── background-paths.tsx   # Animated background
│       └── button.tsx             # shadcn Button component
├── lib/
│   ├── mongodb.ts                 # MongoDB connection
│   └── utils.ts                   # Utility functions
├── models/
│   └── NGO.ts                     # MongoDB NGO model
├── middleware.ts                  # Clerk auth middleware
├── .env.example                   # Environment template
├── CLERK_SETUP.md                 # Setup documentation
└── package.json                   # Dependencies
```

## Authentication Flow

1. **Landing Page** (`/`): Public homepage with sidebar navigation
   - "Profile" button redirects to sign-in for unauthenticated users
   - Automatically redirects authenticated users to `/ngo-portal`

2. **Sign Up/Sign In**: Multiple authentication options
   - Google OAuth
   - GitHub OAuth
   - MetaMask (Web3)
   - Email/Username

3. **Onboarding** (`/onboarding`): NGO registration form
   - Collects organization details
   - Stores data in MongoDB Atlas
   - Redirects to dashboard after completion

4. **NGO Portal** (`/ngo-portal`): Protected dashboard
   - Sidebar navigation with Profile option
   - Logout button at bottom of sidebar
   - Displays organization name and info

5. **Profile Page** (`/ngo-portal/profile`):
   - View organization details
   - Edit profile information
   - Logout functionality

## Key Features

### Authentication & Authorization
- ✅ Multi-provider OAuth (Google, GitHub, MetaMask)
- ✅ Email/Username authentication
- ✅ Protected routes with Clerk middleware
- ✅ Automatic redirect handling

### NGO Management
- ✅ Complete organization profile creation
- ✅ Profile editing capabilities
- ✅ MongoDB Atlas data persistence
- ✅ Real-time data synchronization

### User Interface
- ✅ Modern, responsive design
- ✅ Animated sidebar navigation
- ✅ Dark mode support
- ✅ Form validation
- ✅ Loading states and error handling

## API Routes

- **POST** `/api/ngo/create` - Create new NGO profile
- **GET** `/api/ngo/profile` - Get authenticated user's NGO profile
- **PUT** `/api/ngo/profile` - Update NGO profile

## Development Notes

- The portal runs independently on port 3002
- All protected routes require authentication
- NGO data is stored in MongoDB Atlas
- Clerk handles all authentication and session management
- Uses the same design system (shadcn + Tailwind)
- Fully typed with TypeScript

## Troubleshooting

See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed troubleshooting guide.
