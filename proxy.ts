import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes - routes that DON'T require authentication
const isPublicRoute = createRouteMatcher([
  '/',                    // Home/landing page
  '/sign-in(.*)',         // Sign in page and sub-routes
  '/sign-up(.*)',         // Sign up page and sub-routes
  '/api/webhooks(.*)',    // Webhook endpoints (if you have any)
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is NOT public, require authentication
  if (!isPublicRoute(request)) {
    await auth.protect();  // Redirects to sign-in if not authenticated
  }
});

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

