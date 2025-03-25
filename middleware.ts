import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/signin(.*)", "/signup(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const isAuthed = await auth();

  if (!isPublicRoute(req) && !isAuthed.userId) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
