# Quick Start Guide - Clerk Authentication

## What's Been Implemented

✅ **Clerk Authentication** with multiple providers:
- Google OAuth
- GitHub OAuth
- MetaMask (Web3)
- Email/Username

✅ **MongoDB Atlas Integration** for storing NGO data

✅ **Complete Authentication Flow**:
- Sign-up/Sign-in pages
- NGO onboarding form
- Protected dashboard
- Profile management
- Logout functionality

## Immediate Setup Steps

### 1. Create `.env.local` File

**IMPORTANT:** Create this file now in the `ngo-portal` directory:

```bash
# In PowerShell, run:
cd "c:\Users\beras\OneDrive\Desktop\celoo\NovaAid\FRONTEND\ngo-portal"
copy .env.example .env.local
notepad .env.local
```

The file should contain:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmlybS1tb25rZmlzaC0xNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_rxuzEysUPSAtvUdTqWMkrL3yxLng4sV8rND5UoZ8U2
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

### 2. Set Up MongoDB Atlas (5 minutes)

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account (M0 cluster)
3. Create database user with password
4. Allow access from anywhere (0.0.0.0/0) for development
5. Get connection string: Click "Connect" → "Connect your application"
6. Copy connection string and paste into `.env.local` as `MONGODB_URI`
7. Replace `<password>` with your database password
8. Replace `<dbname>` with `ngo-portal`

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.xxxxx.mongodb.net/ngo-portal?retryWrites=true&w=majority
```

### 3. Configure Clerk Dashboard

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign in (or create account if needed)
3. Your app should already exist with the provided keys
4. Enable authentication providers:
   - **Google**: Navigate to "Social Connections" → Enable Google
   - **GitHub**: Enable GitHub (requires GitHub OAuth app)
   - **MetaMask**: Enable Web3 authentication
   - **Email**: Already enabled by default

5. Set redirect URLs in "Paths" section:
   - After sign-in URL: `/onboarding`
   - After sign-up URL: `/onboarding`

### 4. Run the Application

```bash
npm run dev
```

Visit: **http://localhost:3002**

## Testing the Flow

### 1. Sign Up Flow
1. Open http://localhost:3002
2. Click "Profile" in sidebar
3. Click "Sign up" on the sign-in page
4. Choose authentication method (Google, GitHub, MetaMask, or Email)
5. Complete authentication
6. Fill out NGO onboarding form with organization details
7. Submit form
8. You'll be redirected to `/ngo-portal` dashboard

### 2. Sign In Flow (After Registration)
1. Open http://localhost:3002
2. Click "Profile" in sidebar
3. Sign in with your credentials
4. You'll be automatically redirected to `/ngo-portal`

### 3. Profile Management
1. In the dashboard, click "Profile" in sidebar
2. View your NGO details
3. Click "Edit Profile" to update information
4. Click "Save Changes"

### 4. Logout
1. In the dashboard, click "Logout" button at bottom of sidebar
2. You'll be signed out and redirected to home page

## Pages & Routes

### Public Routes (No Auth Required)
- `/` - Landing page
- `/sign-in` - Sign-in page
- `/sign-up` - Sign-up page

### Protected Routes (Auth Required)
- `/onboarding` - NGO registration form (one-time)
- `/ngo-portal` - Main dashboard
- `/ngo-portal/profile` - Profile management

## Features Implemented

### Sidebar Changes
✅ Removed "Logout" option from public sidebar
✅ Added "Profile" option that redirects to sign-in
✅ In authenticated portal, "Profile" goes to profile page
✅ Logout button appears at bottom of authenticated sidebar

### Authentication Features
✅ Multi-provider OAuth (Google, GitHub, MetaMask)
✅ Email/Username authentication
✅ Automatic redirect after login to onboarding
✅ Skip onboarding if profile already exists
✅ Protected routes with middleware

### NGO Management
✅ Complete registration form with all organization details
✅ MongoDB storage for all NGO data
✅ Profile viewing and editing
✅ Real-time data synchronization

### Data Collected
- NGO Name
- Registration Number
- Email & Phone
- Full Address (Street, City, State, Country, Zip)
- Website (optional)
- Description
- Founded Year
- Focus Areas

## What Happens on First Login

1. User signs up via Clerk (Google/GitHub/MetaMask/Email)
2. Redirected to `/onboarding`
3. Fills out NGO organization form
4. Data saved to MongoDB Atlas
5. Redirected to `/ngo-portal` dashboard
6. Can now access profile, edit details, and use portal

## What Happens on Subsequent Logins

1. User signs in via Clerk
2. System checks if NGO profile exists
3. If exists: Redirect to `/ngo-portal`
4. If not exists: Redirect to `/onboarding` (shouldn't happen normally)

## Troubleshooting

### "Unauthorized" Error
- Check that Clerk keys are correct in `.env.local`
- Verify you're signed in
- Clear browser cookies and try again

### "MongoDB Connection Failed"
- Verify `MONGODB_URI` is correct in `.env.local`
- Check database user password is correct
- Ensure IP address is whitelisted (0.0.0.0/0 for dev)

### Profile Not Saving
- Check browser console for errors
- Verify all required fields are filled
- Check MongoDB connection is working

### Can't Access Protected Routes
- Make sure you're signed in
- Check middleware.ts is properly configured
- Verify Clerk session is active

## Files Created/Modified

### New Files
- `middleware.ts` - Clerk authentication middleware
- `app/sign-in/[[...sign-in]]/page.tsx` - Sign-in page
- `app/sign-up/[[...sign-up]]/page.tsx` - Sign-up page
- `app/onboarding/page.tsx` - NGO registration form
- `app/ngo-portal/page.tsx` - Authenticated dashboard
- `app/ngo-portal/profile/page.tsx` - Profile management
- `app/api/ngo/create/route.ts` - Create NGO API
- `app/api/ngo/profile/route.ts` - Get/Update NGO API
- `lib/mongodb.ts` - MongoDB connection
- `models/NGO.ts` - NGO data model
- `.env.example` - Environment template
- `CLERK_SETUP.md` - Detailed setup guide

### Modified Files
- `app/layout.tsx` - Added Clerk provider
- `app/page.tsx` - Updated sidebar, added auth redirect
- `package.json` - Added Clerk and Mongoose dependencies

## Next Steps

1. **Configure Clerk Providers**: Set up Google, GitHub, and MetaMask OAuth
2. **Test Authentication**: Try signing up with different providers
3. **Customize Forms**: Adjust onboarding form fields as needed
4. **Add Features**: Build out dashboard functionality
5. **Production Setup**: Configure production environment variables

## Support Resources

- **Clerk Docs**: https://clerk.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Next.js Docs**: https://nextjs.org/docs

For detailed configuration, see [CLERK_SETUP.md](./CLERK_SETUP.md)
