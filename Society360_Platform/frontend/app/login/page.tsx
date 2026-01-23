'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getDashboardRoute } from '@/lib/navigation/routes';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { setUser, setAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await authApi.login(data);

            if (response.success) {
                setUser(response.user);
                setAuthenticated(true);
                toast.success('Login successful!');

                // Redirect to role-specific dashboard
                const dashboardRoute = getDashboardRoute(response.user.role);
                router.push(dashboardRoute);
            } else {
                setError(response.message || 'Login failed');
                toast.error(response.message || 'Login failed');
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || 'An error occurred during login';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary)] rounded-2xl mb-4 shadow-lg">
                        <span className="text-3xl font-bold text-white">S</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-2">
                        Society360
                    </h1>
                    <p className="text-[var(--gray-600)]">
                        Welcome back! Please login to your account.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-[var(--gray-200)]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                <FiAlertCircle className="flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Email Input */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@society360.com"
                            icon={<FiMail />}
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />

                        {/* Password Input */}
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<FiLock />}
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-[var(--gray-200)]">
                        <p className="text-sm text-[var(--gray-600)] mb-3 font-medium">
                            Demo Credentials:
                        </p>
                        <div className="space-y-2 text-xs text-[var(--gray-500)]">
                            <div className="flex justify-between p-2 bg-[var(--gray-50)] rounded">
                                <span className="font-medium">Admin:</span>
                                <span>admin@society360.com / admin123</span>
                            </div>
                            <div className="flex justify-between p-2 bg-[var(--gray-50)] rounded">
                                <span className="font-medium">Staff:</span>
                                <span>staff@society360.com / staff123</span>
                            </div>
                            <div className="flex justify-between p-2 bg-[var(--gray-50)] rounded">
                                <span className="font-medium">Resident:</span>
                                <span>resident@society360.com / resident123</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-[var(--gray-500)] mt-6">
                    Powered by <span className="font-semibold text-[var(--primary)]">Civora</span>
                </p>
            </div>
        </div>
    );
}
