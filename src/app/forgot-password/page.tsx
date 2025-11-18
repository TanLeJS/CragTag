"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import ForgotPassword from '@/components/auth/ForgotPassword';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const handleBackToSignIn = () => {
        router.push('/login');
    };

    return (
        <AuthPageLayout>
            <ForgotPassword onBackToSignIn={handleBackToSignIn} />
        </AuthPageLayout>
    );
}
