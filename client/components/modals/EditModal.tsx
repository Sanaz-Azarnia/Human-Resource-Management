// components/modals/EditModal.tsx
"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import ModalLayout from '@/components/ui/ModalLayout';
import { EditModalProps } from '@/lib/api/types';

export default function EditModal({ 
    title, 
    action, 
    redirectPath, 
    data,
    children 
}: EditModalProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    if (!data) {
        return (
            <ModalLayout title={`Edit ${title}`}>
                <p>Loading...</p>
            </ModalLayout>
        );
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                const result = await action(formData);

                if (result.success) {
                    router.push(redirectPath);
                    router.refresh();
                } else {
                    setError(result.message || `Failed to update ${title.toLowerCase()}`);
                }
            } catch (err) {
                console.error(err);
                setError(`Something went wrong while updating ${title.toLowerCase()}`);
            }
        });
    }

    return (
        <ModalLayout title={`Edit ${title}`}>
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
                        {pending ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
        </ModalLayout>
    );
}