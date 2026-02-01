'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { getDashboardRoute } from '@/lib/navigation/routes';

interface RegisterForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone_number?: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const { setUser, setAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm<RegisterForm>();

    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);

        try {
            const { confirmPassword, ...registerData } = data;
            const response = await authApi.register(registerData);

            if (response.success) {
                setUser(response.user);
                setAuthenticated(true);
                toast.success('Registration successful! Welcome to Society360!');

                // Redirect to role-specific dashboard
                const dashboardRoute = getDashboardRoute(response.user.role);
                router.push(dashboardRoute);
            } else {
                setError('email', { type: 'server', message: response.message || 'Registration failed' });
                toast.error(response.message || 'Registration failed');
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string; errors?: Array<{ msg: string, param: string }> } } };
            const errorMessage = errorObj.response?.data?.message || 'An error occurred during registration';

            // Map server-side field errors (if any) to form fields
            const fieldErrors = errorObj.response?.data?.errors;
            if (fieldErrors && Array.isArray(fieldErrors)) {
                fieldErrors.forEach((error) => {
                    // @ts-ignore: react-hook-form setError dynamic key
                    setError(error.param as any, { type: 'server', message: error.msg });
                });
            } else {
                setError('email', { type: 'server', message: errorMessage });
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 px-4 py-12">
            <div className="w-full max-w-2xl">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary)] rounded-2xl mb-4 shadow-lg">
                        <span className="text-3xl font-bold text-white">S</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-2">
                        Join Society360
                    </h1>
                    <p className="text-[var(--gray-600)]">
                        Create your account to get started
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-[var(--gray-200)]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Error Alert */}
                        {(() => {
                            const serverErrorMsg = Object.values(errors).find((e: any) => e?.type === 'server')?.message;
                            return serverErrorMsg ? (
                                <Alert variant="error" title="Registration failed">
                                    {serverErrorMsg}
                                </Alert>
                            ) : null;
                        })()}

                        {/* Name Fields - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                type="text"
                                placeholder="John"
                                icon={<FiUser />}
                                error={errors.first_name?.message}
                                {...register('first_name', {
                                    required: 'First name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'First name must be at least 2 characters',
                                    },
                                })}
                            />

                            <Input
                                label="Last Name"
                                type="text"
                                placeholder="Doe"
                                icon={<FiUser />}
                                error={errors.last_name?.message}
                                {...register('last_name', {
                                    required: 'Last name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Last name must be at least 2 characters',
                                    },
                                })}
                            />
                        </div>

                        {/* Email Input */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john.doe@example.com"
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

                        {/* Phone Number (Optional) */}
                        <Input
                            label="Phone Number (Optional)"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            icon={<FiPhone />}
                            error={errors.phone_number?.message}
                            {...register('phone_number', {
                                pattern: {
                                    value: /^[0-9+\s()-]{10,20}$/,
                                    message: 'Invalid phone number',
                                },
                            })}
                        />

                        {/* Password Fields - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: 'Password must contain uppercase, lowercase, and number',
                                    },
                                })}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<FiLock />}
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match',
                                })}
                            />
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• At least 6 characters long</li>
                                <li>• Contains at least one uppercase letter</li>
                                <li>• Contains at least one lowercase letter</li>
                                <li>• Contains at least one number</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 pt-6 border-t border-[var(--gray-200)]">
                        <p className="text-center text-sm text-[var(--gray-600)]">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors inline-flex items-center gap-1"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </p>
                    </div>

                    {/* Info Notice */}
                    <div className="mt-4 pt-4 border-t border-[var(--gray-200)]">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-xs text-amber-800">
                                <strong>Note:</strong> New registrations will be assigned the "Resident" role by default.
                                Contact your society administrator to upgrade your access level if needed.
                            </p>
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
