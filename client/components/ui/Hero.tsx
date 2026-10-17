import Link from "next/link"
export default function Hero()
{
    return (
        <section className="relative overflow-hidden px-6 pt-20 pb-24">
            <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"></div>
                    <div className="mx-auto max-w-7xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border 
                        border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Human Resource Management System
                            
                        </div>
                        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold 
                        tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Manage Your Workforce<br/>
                            <span className="text-indigo-600">with Confidence</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
                        A comprehensive HRM platform for attendance, payroll, leave requests, reports, 
                        and employee management.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link href="#roles" className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg 
                            shadow-indigo-200 hover:bg-indigo-700 transition-all hover:shadow-xl">
                                Explore Roles
                            </Link>
                            <Link href="#contact" className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 
                            hover:border-slate-300 hover:bg-slate-50 transition-all">
                                Contact Us
                            </Link>

                        </div>

                    </div>
                 
        </section>
    )
}