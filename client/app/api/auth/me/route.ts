// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        console.log("=== AUTH/ME DEBUG ===");
        console.log("Token exists:", !!token);

        if (!token) {
            console.log("No token in cookie");
            return NextResponse.json({ error: "No Token" }, { status: 401 });
        }
        
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        console.log("Backend status:", res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend error:", res.status, errorText);
            return NextResponse.json(
                { error: "Backend error", status: res.status },
                { status: res.status }
            );
        }

        const user = await res.json();
        console.log("User from backend:", user);

        return NextResponse.json(user);

    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        );
    }
}