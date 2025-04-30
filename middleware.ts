import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/", "/auth"]

export async function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: { [key: string]: string }) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: { [key: string]: string }) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Session in middleware:", session ? "✅ Valid" : "❌ Not found")

    // Check if the current route is public
    const isPublicRoute = publicRoutes.some(
      (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith("/auth/")
    )

    console.log("Is public route:", isPublicRoute ? "Yes" : "No")

    // Allow access to public routes regardless of auth status
    if (isPublicRoute) {
      return response
    }

    // If not a public route and no session, redirect to home
    if (!session) {
      console.log("No session, redirecting to home")
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/"
      return NextResponse.redirect(redirectUrl)
    }

    // If authenticated and trying to access root, redirect to questionnaire
    if (session && request.nextUrl.pathname === "/") {
      console.log("User is authenticated, redirecting to questionnaire")
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/questionnaire"
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (error) {
    console.error("Error in middleware:", error)
    return response
  }
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
