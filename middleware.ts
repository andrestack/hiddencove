import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/", "/auth"]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith("/auth/")
  )

  // Allow access to public routes regardless of auth status
  if (isPublicRoute) {
    return res
  }

  // If not a public route and no session, redirect to home
  if (!session) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

/**
 * Uncomment the following code to enable authentication with Clerk
 */

// const isProtectedRoute = createRouteMatcher(['/protected'])

// export default clerkMiddleware(async (auth, req) => {
//     if (isProtectedRoute(req)) {
//       // Handle protected routes check here
//       return NextResponse.redirect(req.nextUrl.origin)
//     }

//     return NextResponse.next()
// })

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
