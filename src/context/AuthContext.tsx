"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    homeLocation?: string | {
        name: string;
        country: string;
        lat: number;
        lng: number;
    };
    temperatureUnit?: 'C' | 'F';
    createdAt?: Date;
    lastLoginAt?: Date;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    initializing: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string, homeLocation: any) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load user profile from Firestore
    const loadUserProfile = async (firebaseUser: User) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data() as UserProfile);
            } else {
                // Create new profile
                const newProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    temperatureUnit: 'C',
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                };
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    ...newProfile,
                    createdAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp(),
                });
                setUserProfile(newProfile);
            }
        } catch (err) {
            console.error('Failed to load user profile:', err);
        }
    };

    // Update last login time
    const updateLastLogin = async (uid: string) => {
        try {
            await setDoc(doc(db, 'users', uid), {
                lastLoginAt: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Failed to update last login:', err);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await loadUserProfile(firebaseUser);
            } else {
                setUserProfile(null);
            }
            setInitializing(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setError(null);
            setActionLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            await updateLastLogin(result.user.uid);
        } catch (err: unknown) {
            const firebaseError = err as { code?: string; message?: string };
            console.error('Google sign-in error:', err);
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                setError('Sign-in was cancelled');
            } else if (firebaseError.code === 'auth/popup-blocked') {
                setError('Pop-up was blocked. Please allow pop-ups for this site.');
            } else {
                setError(firebaseError.message || 'Failed to sign in with Google');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setError(null);
            setActionLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            await updateLastLogin(result.user.uid);
        } catch (err: unknown) {
            const firebaseError = err as { code?: string; message?: string };
            console.error('Email sign-in error:', err);
            if (firebaseError.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (firebaseError.code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (firebaseError.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (firebaseError.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError(firebaseError.message || 'Failed to sign in');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string, homeLocation: any) => {
        try {
            setError(null);
            setActionLoading(true);
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name if provided
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }

            // Create initial profile with home location
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                email: result.user.email,
                displayName: displayName || null,
                photoURL: result.user.photoURL,
                homeLocation: homeLocation,
                temperatureUnit: 'C',
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
            });
        } catch (err: unknown) {
            const firebaseError = err as { code?: string; message?: string };
            console.error('Email sign-up error:', err);
            if (firebaseError.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists');
            } else if (firebaseError.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters');
            } else if (firebaseError.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else {
                setError(firebaseError.message || 'Failed to create account');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
            setUserProfile(null);
        } catch (err: unknown) {
            const firebaseError = err as { message?: string };
            console.error('Logout error:', err);
            setError(firebaseError.message || 'Failed to sign out');
        }
    };

    const resetPassword = async (email: string) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        } catch (err: unknown) {
            const firebaseError = err as { code?: string; message?: string };
            console.error('Password reset error:', err);
            if (firebaseError.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else {
                setError(firebaseError.message || 'Failed to send reset email');
            }
            throw err;
        }
    };

    const updateUserProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;

        try {
            setError(null);
            await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
            setUserProfile(prev => prev ? { ...prev, ...updates } : null);
        } catch (err: unknown) {
            const firebaseError = err as { message?: string };
            console.error('Profile update error:', err);
            setError(firebaseError.message || 'Failed to update profile');
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading: actionLoading,
            initializing,
            error,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            logout,
            resetPassword,
            updateUserProfile,
            clearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
