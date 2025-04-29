import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
    // Redirect if there is no session and the route is not /auth
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/auth"
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
