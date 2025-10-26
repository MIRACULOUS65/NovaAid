import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", 
  "/sign-up(.*)", 
  "/",
  "/test-auth"
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes without auth check
  if (isPublicRoute(request)) {
    return;
  }
  
  // For protected routes, require authentication
  await auth.protect();
  
  // Role-based enforcement: Block USER role users from accessing NGO portal
  const { userId, sessionClaims } = await auth();
  
  if (userId && sessionClaims) {
    const publicMetadata = sessionClaims?.publicMetadata as { activeRole?: string } | undefined;
    const activeRole = publicMetadata?.activeRole;
    
    // If user has USER role, redirect to user portal
    if (activeRole === 'user') {
      const userPortalUrl = process.env.NEXT_PUBLIC_USER_PORTAL_URL || 'http://localhost:3000';
      console.log(`🚫 User with USER role attempting to access NGO portal. Redirecting to: ${userPortalUrl}/homepage`);
      return NextResponse.redirect(new URL(`${userPortalUrl}/homepage`));
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
