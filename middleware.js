import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);

  // ১. যদি সেশন না থাকে এবং ড্যাশবোর্ড রুট হয় - লগইন পেজে পাঠান
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ২. যদি লগইন করা থাকে, তবে লগইন/রেজিস্টার পেজ থেকে রিডাইরেক্ট করে দিন
  if ((pathname === "/auth/login" || pathname === "/auth/register") && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ৩. রোল ভিত্তিক সুরক্ষা (Role-based protection)
  // ধরুন আপনার সেশন অবজেক্টের ভেতর 'user.role' আছে
  if (session) {
    const userRole = session.user?.role; // আপনার auth কনফিগারেশন অনুযায়ী চেক করুন

    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/dashboard/artist") && userRole !== "artist") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};