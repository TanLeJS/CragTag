"use client"

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/toast';
import VerifyCode from '@/components/auth/VerifyCode';
import { CircularProgress, Box } from '@mui/material';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

function VerifyCodeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const toast = useToast();

    React.useEffect(() => {
        // If no email is provided, redirect to forgot password page
        if (!email) {
            toast.error("Please enter your email first");
            router.push('/forgot-password');
        }
    }, [email, router, toast]);

    const handleBack = () => {
        router.push('/forgot-password');
    };

    if (!email) {
        return null; // Will redirect in useEffect
    }

    return (
        <VerifyCode
            email={email}
            onBack={handleBack}
        />
    );
}

export default function VerifyCodePage() {
    return (
        <AuthPageLayout>
            <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                </Box>
            }>
                <VerifyCodeContent />
            </Suspense>
        </AuthPageLayout>
    );
}
