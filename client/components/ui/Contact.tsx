import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { LinkedInIcon, GitHubIcon, XIcon } from "@/components/ui/SocialIcons";
import Link from "next/link";

export default function Contact() {
    const contactInfo = [
        {
            icon: Mail,
            label: "Email",
            value: "support@hrmpro.com",
            href: "mailto:support@hrmpro.com",
            color: "text-blue-600 bg-blue-50",
        },
        {
            icon: Phone,
            label: "Phone",
            value: "+1 (555) 123-4567",
            href: "tel:+15551234567",
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            icon: MapPin,
            label: "Office",
            value: "San Francisco, CA",
            href: "#",
            color: "text-purple-600 bg-purple-50",
        },
    ];

    const socialLinks = [
        {
            icon: LinkedInIcon,
            label: "LinkedIn",
            href: "https://linkedin.com/company/hrmpro",
            color: "hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]",
            iconDefaultColor: "text-[#0077B5]",
        },
        {
            icon: GitHubIcon,
            label: "GitHub",
            href: "https://github.com/hrmpro",
            color: "hover:bg-slate-900 hover:text-white hover:border-slate-900",
            iconDefaultColor: "text-slate-900",
        },
        {
            icon: XIcon,
            label: "X (Twitter)",
            href: "https://twitter.com/hrmpro",
            color: "hover:bg-black hover:text-white hover:border-black",
            iconDefaultColor: "text-black",
        },
    ];

    return (
        <section id="contact" className="px-6 py-24 bg-gradient-to-b from-white to-slate-50">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Get in Touch
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Have questions or want to learn more? We're here to help.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left Side - Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">
                            Contact Information
                        </h3>
                        
                        <div className="space-y-4">
                            {contactInfo.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all group"
                                    >
                                        <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">
                                                {item.label}
                                            </p>
                                            <p className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {item.value}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Business Hours */}
                        <div className="mt-8 p-6 rounded-xl bg-indigo-50 border border-indigo-100">
                            <h4 className="font-semibold text-indigo-900 mb-3">
                                Business Hours
                            </h4>
                            <div className="space-y-2 text-sm text-indigo-700">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="font-medium">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Social & CTA */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">
                            Connect With Us
                        </h3>

                        {/* Social Links */}
                        <div className="grid grid-cols-3 gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:scale-105 group ${social.color}`}
                                    >
                                        <Icon 
                                            className={`w-8 h-8 mb-2 ${social.iconDefaultColor} group-hover:text-white transition-colors`} 
                                        />
                                        <span className="text-sm font-medium group-hover:text-white transition-colors">
                                            {social.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* CTA Card */}
                        <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                            <h4 className="text-xl font-bold mb-3">
                                Ready to Get Started?
                            </h4>
                            <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                                Try our demo accounts to experience the full power of HRM Pro. 
                                No credit card required, explore all features instantly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="#roles"
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
                                >
                                    Try Demo
                                </Link>
                                <a
                                    href="https://docs.hrmpro.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                                >
                                    View Docs
                                </a>
                            </div>
                        </div>

                        {/* Support Badge */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-emerald-900">
                                    24/7 Support Available
                                </p>
                                <p className="text-sm text-emerald-700">
                                    We're here to help you succeed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}