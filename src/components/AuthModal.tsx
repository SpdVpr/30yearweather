"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, MapPin, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface GeocodedCity {
    id: string;
    name: string;
    country: string;
    lat: number;
    lng: number;
    state?: string;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'onboarding';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const {
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        updateUserProfile,
        user,
        userProfile,
        error,
        clearError,
        loading,
        initializing
    } = useAuth();

    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [homeLocation, setHomeLocation] = useState('');
    const [selectedCity, setSelectedCity] = useState<GeocodedCity | null>(null);
    const [citySearchResults, setCitySearchResults] = useState<GeocodedCity[]>([]);
    const [isSearchingCity, setIsSearchingCity] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Debounced search for cities
    useEffect(() => {
        if ((mode !== 'register' && mode !== 'onboarding') || homeLocation.length < 2 || selectedCity) {
            setCitySearchResults([]);
            setIsSearchingCity(false);
            return;
        }

        setIsSearchingCity(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/geocode?q=${encodeURIComponent(homeLocation)}`);
                if (response.ok) {
                    const data = await response.json();
                    setCitySearchResults(data);
                }
            } catch (error) {
                console.error("Failed to search cities:", error);
            } finally {
                setIsSearchingCity(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [homeLocation, mode, selectedCity]);

    // Watch for successful login to close modal
    useEffect(() => {
        if (user && !loading && !initializing && isOpen) {
            handleClose();
        }
    }, [user, loading, initializing, isOpen]);

    const handleClose = () => {
        clearError();
        setEmail('');
        setPassword('');
        setDisplayName('');
        setHomeLocation('');
        setSelectedCity(null);
        setCitySearchResults([]);
        setResetSent(false);
        setMode('login'); // Reset mode
        onClose();
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (mode === 'login') {
            await signInWithEmail(email, password);
        } else if (mode === 'register') {
            // Use selectedCity object if available, otherwise fallback to string (legacy support)
            // But prefer object structure for backend compatibility
            const locationToSave = selectedCity ? {
                name: selectedCity.name,
                country: selectedCity.country,
                lat: selectedCity.lat,
                lng: selectedCity.lng
            } : homeLocation;

            await signUpWithEmail(email, password, displayName, locationToSave);
        } else if (mode === 'forgot') {
            try {
                await resetPassword(email);
                setResetSent(true);
            } catch {
                // Error handled in context
            }
        } else if (mode === 'onboarding') {
            if (!homeLocation.trim()) return;
            const locationToSave = selectedCity ? {
                name: selectedCity.name,
                country: selectedCity.country,
                lat: selectedCity.lat,
                lng: selectedCity.lng
            } : undefined;

            if (locationToSave) {
                await updateUserProfile({ homeLocation: locationToSave });
            }
        }
    };

    const handleGoogleSignIn = async () => {
        clearError();
        await signInWithGoogle();
    };

    const switchMode = (newMode: AuthMode) => {
        clearError();
        setResetSent(false);
        setMode(newMode);
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[9998]"
                        onClick={mode === 'onboarding' ? undefined : handleClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[9999] overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                            >
                                {/* Header */}
                                <div className="relative p-6 pb-4 bg-gradient-to-br from-orange-500 to-amber-500">
                                    <button
                                        onClick={handleClose}
                                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold">
                                            {mode === 'login' && 'Welcome Back'}
                                            {mode === 'register' && 'Create Account'}
                                            {mode === 'forgot' && 'Reset Password'}
                                            {mode === 'onboarding' && 'Complete Profile'}
                                        </h2>
                                        <p className="text-orange-100 text-sm mt-1">
                                            {mode === 'login' && 'Sign in to save your favorite destinations'}
                                            {mode === 'register' && 'Join to unlock personalized features'}
                                            {mode === 'forgot' && 'We\'ll send you a reset link'}
                                            {mode === 'onboarding' && 'Just one more thing'}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                                        >
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Success Message for password reset */}
                                    {resetSent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
                                        >
                                            ✓ Password reset email sent! Check your inbox.
                                        </motion.div>
                                    )}

                                    {/* Google Sign In (not shown in forgot or onboarding mode) */}
                                    {mode !== 'forgot' && mode !== 'onboarding' && (
                                        <>
                                            <button
                                                onClick={handleGoogleSignIn}
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                )}
                                                Continue with Google
                                            </button>

                                            <div className="relative my-6">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-slate-200" />
                                                </div>
                                                <div className="relative flex justify-center text-sm">
                                                    <span className="px-4 bg-white text-slate-500">or</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Email/Onboarding Form */}
                                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                                        {/* Display Name (register only) */}
                                        {mode === 'register' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Your Name
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
                                                        placeholder="John Doe"
                                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Home Location (register and onboarding) */}
                                        {(mode === 'register' || mode === 'onboarding') && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Home City <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={homeLocation}
                                                        onChange={(e) => {
                                                            setHomeLocation(e.target.value);
                                                            setSelectedCity(null); // Clear selection on edit
                                                        }}
                                                        placeholder="e.g. London, UK"
                                                        required
                                                        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                        autoComplete="off"
                                                    />
                                                    {isSearchingCity && (
                                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                                                    )}

                                                    {/* Autocomplete Results */}
                                                    {citySearchResults.length > 0 && !selectedCity && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                                            {citySearchResults.map((city) => (
                                                                <button
                                                                    key={city.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCity(city);
                                                                        setHomeLocation(`${city.name}, ${city.country}`);
                                                                        setCitySearchResults([]);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                                                >
                                                                    <Search className="w-3 h-3 text-slate-400" />
                                                                    <div>
                                                                        <div className="text-sm font-medium text-slate-700">{city.name}</div>
                                                                        <div className="text-xs text-slate-500">{city.state ? `${city.state}, ` : ''}{city.country}</div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {mode === 'onboarding' && (
                                                    <p className="text-xs text-slate-500 mt-1.5">
                                                        We need your home city to show you relevant travel time comparisons and accurate weather insights.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Email (not onboarding) */}
                                        {mode !== 'onboarding' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="you@example.com"
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Password (login/register only) */}
                                        {(mode === 'login' || mode === 'register') && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        required
                                                        minLength={6}
                                                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Forgot Password Link (login only) */}
                                        {mode === 'login' && (
                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => switchMode('forgot')}
                                                    className="text-sm text-orange-600 hover:text-orange-700"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                            {mode === 'login' && 'Sign In'}
                                            {mode === 'register' && 'Create Account'}
                                            {mode === 'forgot' && 'Send Reset Link'}
                                            {mode === 'onboarding' && 'Save Profile'}
                                        </button>
                                    </form>

                                    {/* Switch Mode */}
                                    {mode !== 'onboarding' && (
                                        <div className="mt-6 text-center text-sm text-slate-600">
                                            {mode === 'login' && (
                                                <>
                                                    Don&apos;t have an account?{" "}
                                                    <button
                                                        onClick={() => switchMode('register')}
                                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                                    >
                                                        Sign up
                                                    </button>
                                                </>
                                            )}
                                            {mode === 'register' && (
                                                <>
                                                    Already have an account?{" "}
                                                    <button
                                                        onClick={() => switchMode('login')}
                                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                                    >
                                                        Sign in
                                                    </button>
                                                </>
                                            )}
                                            {mode === 'forgot' && (
                                                <>
                                                    Remember your password?{" "}
                                                    <button
                                                        onClick={() => switchMode('login')}
                                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                                    >
                                                        Sign in
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
