import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/landing(.*)',
  '/role-select(.*)',
  '/homepage(.*)',
  '/ngo-dashboard(.*)',
  '/pricing(.*)',
  '/testimonials(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  
  // Role-based enforcement: Block NGO users from accessing user portal
  const { userId, sessionClaims } = await auth();
  
  if (userId && sessionClaims) {
    const publicMetadata = sessionClaims?.publicMetadata as { activeRole?: string } | undefined;
    const activeRole = publicMetadata?.activeRole;
    
    // If user has NGO role, redirect to NGO portal
    if (activeRole === 'ngo' && !request.nextUrl.pathname.startsWith('/role-select')) {
      const ngoPortalUrl = process.env.NEXT_PUBLIC_NGO_PORTAL_URL || 'http://localhost:3002';
      console.log(`🚫 User with NGO role attempting to access user portal. Redirecting to: ${ngoPortalUrl}`);
      return NextResponse.redirect(new URL(ngoPortalUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
