import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEMO_USERS: Record<string, { personnelId: string; envKey: string }> = {
    Admin:    { personnelId: "86720194", envKey: "ADMIN_PASSWORD" },
    Manager:  { personnelId: "12345678", envKey: "MANAGER_PASSWORD" },
    Deputy:   { personnelId: "23456789", envKey: "DEPUTY_PASSWORD" },
    Employee: { personnelId: "34567890", envKey: "EMPLOYEE_PASSWORD" },
};

export async function POST(request: NextRequest) {
    try {
        const { role } = await request.json();

         
        if (!role || !DEMO_USERS[role]) {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        const demoUser = DEMO_USERS[role];
        
        const password = process.env[demoUser.envKey];

        if (!password) {
            console.error(`${demoUser.envKey} not set in environment`);
            return NextResponse.json(
                { error: "Demo account not configured" },
                { status: 500 }
            );
        }

         
        const backendUrl = process.env.BACKEND_URL;
        const loginRes = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                personnelId: demoUser.personnelId,
                password: password,
            }),
        });

        if (!loginRes.ok) {
            return NextResponse.json(
                { error: "Login failed" },
                { status: loginRes.status }
            );
        }

        const user = await loginRes.json();

         
        const cookieStore = await cookies();
        cookieStore.set("token", user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return NextResponse.json({ 
            success: true,
            user: {
                userId: user.userId,
                firstname: user.firstname,
                lastname: user.lastname,
                roleId: user.roleId,
                avatarUrl: user.avatarUrl,
            }
        });
    } catch (error) {
        console.error("Demo login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}