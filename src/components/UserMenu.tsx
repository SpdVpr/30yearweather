"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Heart, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserMenu() {
    const { user, userProfile, logout, loading, initializing } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
    };

    const handleNavigate = (path: string) => {
        setShowDropdown(false);
        router.push(path);
    };

    // Show loading skeleton only during initial Firebase check
    if (initializing) {
        return (
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
        );
    }

    // Not logged in - show sign in button
    if (!user) {
        return (
            <>
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md shadow-orange-500/25 font-medium text-sm"
                >
                    <User className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                </button>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </>
        );
    }

    // Logged in - show user menu
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 min-h-[44px] bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
            >
                {user.photoURL ? (
                    <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                            {(user.displayName || user.email || 'U')[0].toUpperCase()}
                        </span>
                    </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
                    >
                        {/* User Info */}
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-b border-slate-100">
                            <p className="font-medium text-slate-900 truncate">
                                {user.displayName || 'User'}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                                {user.email}
                            </p>
                            {userProfile?.homeLocation && typeof userProfile.homeLocation === 'object' && (
                                <p className="text-xs text-slate-400 mt-1">
                                    📍 {userProfile.homeLocation.name}, {userProfile.homeLocation.country}
                                </p>
                            )}
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <MenuItem
                                icon={<Heart className="w-4 h-4" />}
                                label="My Favorites"
                                onClick={() => handleNavigate('/profile/favorites')}
                            />
                            <MenuItem
                                icon={<Settings className="w-4 h-4" />}
                                label="Settings"
                                onClick={() => handleNavigate('/profile/settings')}
                            />
                            <div className="my-2 border-t border-slate-100" />
                            <MenuItem
                                icon={<LogOut className="w-4 h-4" />}
                                label="Sign Out"
                                onClick={handleLogout}
                                variant="danger"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

function MenuItem({ icon, label, onClick, variant = 'default' }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left
                ${variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-700 hover:bg-slate-100'}
            `}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
