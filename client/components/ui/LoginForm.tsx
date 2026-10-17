"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [personnelId, setPersonnelId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading , setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            const result = await signIn('credentials', {
                personnelId,
                password,
                redirect: false
            });

            if(result?.error) {
                setError('Invalid credentials');
                return;
            }

            if(!result){
                setError('Unable to connect. Please try again.');
                return;
            }

            router.push('/dashboard');
            router.refresh();

        }
        catch(err) {
            setError('An unexpected error occurred.');
            console.error('Login error: ', err);

        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen flex items-center 
        justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">HRM Pro</h1>
                    <p className="text-slate-500 mt-2">sign in to your account.</p>
                </div>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Personnel ID

                        </label>
                        <input type="text"
                        value={personnelId}
                        onChange={(e) => setPersonnelId(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your personnel Id"
                        required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" >
                            Password
                        </label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 
                        rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your password"
                        required />
                    </div>
                    <button type="submit" disabled={loading} 
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>

            </div>

        </div>
    )
}