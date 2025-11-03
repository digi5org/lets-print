import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/signup"];
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));

  // Allow access to public paths and API routes
  if (isPublicPath || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (pathname.startsWith("/dashboard")) {
    // Redirect to login if no session or no user
    if (!session || !session.user) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // For any other protected routes, check session
  if (!session?.user) {
    return NextResponse.next();
  }

  // Check if user is active
  if (!session.user.isActive) {
    return NextResponse.redirect(new URL("/login?error=account-deactivated", req.url));
  }

  // Role-based access control for dashboard sections (if needed in future)
  if (pathname.startsWith("/dashboard")) {
    const roleName = session.user.roleName;

    // Business owner specific routes
    if (pathname.startsWith("/dashboard/businesses") && roleName !== "business_owner") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Production owner specific routes
    if (pathname.startsWith("/dashboard/production") && roleName !== "production_owner") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
