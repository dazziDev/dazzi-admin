import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 정적 파일과 관련된 요청은 변경하지 않음
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // 현재 경로가 /admin으로 시작하지 않으면 리다이렉트
  if (!url.pathname.startsWith("/admin")) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
