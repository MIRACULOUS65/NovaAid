# Clerk Authentication Setup Guide

## Overview
This NGO Portal uses Clerk for authentication with support for multiple providers including Google, GitHub, MetaMask, and manual email/username login.

## Prerequisites
- Node.js installed
- MongoDB Atlas account
- Clerk account

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of the ngo-portal directory with the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmlybS1tb25rZmlzaC0xNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_rxuzEysUPSAtvUdTqWMkrL3yxLng4sV8rND5UoZ8U2

# MongoDB Atlas Connection String
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

### 2. Configure Clerk Dashboard

1. **Sign in to Clerk Dashboard**: Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)

2. **Select Your Application**: Use the application with the provided keys or create a new one

3. **Enable Authentication Providers**:
   
   Navigate to `Authentication` → `Social Connections`
   
   #### Google OAuth
   - Enable Google provider
   - Add your OAuth credentials (Client ID and Secret)
   - Configure authorized redirect URIs
   
   #### GitHub OAuth
   - Enable GitHub provider
   - Create OAuth App in GitHub Developer Settings
   - Add Client ID and Secret from GitHub
   
   #### MetaMask (Web3)
   - Enable Web3 authentication
   - Configure MetaMask connection settings
   
   #### Email/Username
   - Already enabled by default
   - Configure under `Email, Phone, Username` settings
   - Enable email verification if required

4. **Configure User Profile Fields**:
   - Go to `User & Authentication` → `Email, Phone, Username`
   - Enable required fields for your NGO registration

5. **Set Redirect URLs**:
   - After sign-in URL: `/onboarding`
   - After sign-up URL: `/onboarding`
   - Home URL: `/`
   
   Set these in `Paths` section of Clerk Dashboard

### 3. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**: Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a Cluster**:
   - Choose free tier (M0) for development
   - Select your preferred region
   - Create cluster

3. **Configure Database Access**:
   - Go to `Database Access`
   - Create a database user
   - Set username and password
   - Grant read/write permissions

4. **Configure Network Access**:
   - Go to `Network Access`
   - Add IP Address
   - For development, you can use `0.0.0.0/0` (allow from anywhere)
   - For production, restrict to specific IPs

5. **Get Connection String**:
   - Click `Connect` on your cluster
   - Choose `Connect your application`
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `ngo-portal`)
   - Paste into `.env.local` as `MONGODB_URI`

Example MongoDB URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ngo-portal?retryWrites=true&w=majority
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

## Authentication Flow

1. **Landing Page** (`/`): 
   - Shows NGO portal preview
   - "Profile" button in sidebar leads to sign-in

2. **Sign Up/Sign In** (`/sign-up`, `/sign-in`):
   - Multiple authentication options:
     - Google
     - GitHub
     - MetaMask
     - Email/Username
   - Redirects to onboarding after successful authentication

3. **Onboarding** (`/onboarding`):
   - Collects NGO organization details:
     - NGO Name
     - Registration Number
     - Contact Information (Email, Phone, Website)
     - Address (Street, City, State, Country, Zip)
     - Organization Details (Description, Founded Year, Focus Areas)
   - Data is stored in MongoDB Atlas
   - Redirects to NGO Portal after completion

4. **NGO Portal** (`/ngo-portal`):
   - Main dashboard for authenticated NGOs
   - Sidebar with navigation:
     - Dashboard
     - Beneficiaries
     - Aid Programs
     - Reports
     - Settings
     - Profile
   - Logout button at bottom of sidebar

5. **Profile Page** (`/ngo-portal/profile`):
   - View NGO organization details
   - Edit profile information
   - Logout option

## Features

### Authentication
- ✅ Multiple OAuth providers (Google, GitHub, MetaMask)
- ✅ Email/Username authentication
- ✅ Secure session management with Clerk
- ✅ Protected routes with middleware

### NGO Management
- ✅ Complete organization profile
- ✅ MongoDB Atlas data storage
- ✅ Profile editing capabilities
- ✅ Real-time data synchronization

### User Experience
- ✅ Modern, responsive UI
- ✅ Dark mode support
- ✅ Animated sidebar navigation
- ✅ Form validation
- ✅ Loading states

## API Routes

### POST `/api/ngo/create`
Creates a new NGO profile
- Requires authentication
- Stores NGO data in MongoDB
- Returns created NGO information

### GET `/api/ngo/profile`
Retrieves the authenticated user's NGO profile
- Requires authentication
- Returns full NGO details

### PUT `/api/ngo/profile`
Updates the authenticated user's NGO profile
- Requires authentication
- Validates and updates NGO data
- Returns updated information

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Keep Clerk keys secure and rotate regularly
3. **MongoDB Access**: Restrict network access in production
4. **User Data**: All sensitive data is encrypted at rest in MongoDB Atlas
5. **Authentication**: All protected routes require valid Clerk session

## Troubleshooting

### Clerk Authentication Issues
- Verify API keys in `.env.local` match Clerk Dashboard
- Check redirect URLs are configured correctly
- Ensure social OAuth apps are properly configured

### MongoDB Connection Issues
- Verify connection string format
- Check database user credentials
- Ensure IP address is whitelisted
- Verify database name in connection string

### Profile Not Saving
- Check MongoDB connection
- Verify API routes are accessible
- Check browser console for errors
- Ensure all required fields are filled

## Next Steps

1. Configure production environment variables
2. Set up proper error handling and logging
3. Add email notifications for new registrations
4. Implement role-based access control
5. Add data backup and recovery procedures

## Support

For issues or questions:
- Clerk Documentation: [https://clerk.com/docs](https://clerk.com/docs)
- MongoDB Atlas Documentation: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
