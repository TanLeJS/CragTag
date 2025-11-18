"use client"

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/toast';
import ResetPassword from '@/components/auth/ResetPassword';
import { CircularProgress, Box } from '@mui/material';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const toast = useToast();

    React.useEffect(() => {
        // If no id is provided, redirect to forgot password page
        if (!id) {
            toast.error("Session expired. Please start over.");
            router.push('/forgot-password');
        }
    }, [id, router, toast]);

    if (!id) {
        return null; // Will redirect in useEffect
    }

    return <ResetPassword id={id} />;
}

export default function ResetPasswordPage() {
    return (
        <AuthPageLayout>
            <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                </Box>
            }>
                <ResetPasswordContent />
            </Suspense>
        </AuthPageLayout>
    );
}
