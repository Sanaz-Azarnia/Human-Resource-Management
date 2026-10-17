import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import Roles from "@/components/ui/Roles";
import Contact from "@/components/ui/Contact";
import Footer from "@/components/ui/Footer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if(session) {
    redirect("/dashboard");
  }

  return (
    
      
        <div className="min-h-screen bg-gradient-to-br from-slate-50 
    to-slate-100 font-sans text-slate-800">
      <Header />
      <Hero />
      <Features />
      <Roles />
      <Contact />
      <Footer />
      </div>

      
      

   
     
  );
}
