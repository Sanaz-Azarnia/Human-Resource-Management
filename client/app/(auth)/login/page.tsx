import { auth } from "@/auth";
import LoginForm from "@/components/ui/LoginForm";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();
    if(session) {
        redirect("/dashboard");
    }
    return(
        <LoginForm />
    )
}