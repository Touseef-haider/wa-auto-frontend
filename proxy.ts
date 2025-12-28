import { NextRequest, NextResponse } from "next/server";


const publicPaths = [
    "/login",
    "/register"
]

export default function proxy(request:NextRequest){
    const token = request.cookies.get("token")
    if(token && publicPaths.includes(request.nextUrl.pathname)){
        return NextResponse.redirect(new URL("/",request.url))
    }
    else if(!token && !publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/login",request.url))
    }
}

export const config = {
    matcher:[
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
}