// components/modals/CreateModal.tsx
"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import ModalLayout from '@/components/ui/ModalLayout';
import { CreateModalProps } from '@/lib/api/types';

export default function CreateModal({ 
    title, 
    action, 
    redirectPath, 
    children,
    onSubmit 
}: CreateModalProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const dataToSubmit = onSubmit ? onSubmit(formData) : formData;

        startTransition(async () => {
            try {
                const result = await action(dataToSubmit as FormData);

                if (result.success) {
                    router.push(redirectPath);
                    router.refresh();
                } else {
                    setError(result.message || `Failed to create ${title.toLowerCase()}`);
                }
            } catch (err) {
                console.error(err);
                setError(`Something went wrong while creating ${title.toLowerCase()}`);
            }
        });
    }

    return (
        <ModalLayout title={`New ${title}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                {children}
                
                <div className="flex gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={() => router.back()} 
                        disabled={pending}
                        className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={pending} 
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pending ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </ModalLayout>
    );
}