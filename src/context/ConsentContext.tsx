"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ConsentSettings {
    necessary: boolean;       // Always true - essential cookies
    analytics: boolean;       // Google Analytics, Firebase Analytics
    marketing: boolean;       // Future: ads, remarketing
    personalization: boolean; // Saved preferences, favorites
}

interface ConsentContextType {
    consent: ConsentSettings | null;
    hasConsented: boolean;
    showBanner: boolean;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: (settings: Partial<ConsentSettings>) => void;
    openSettings: () => void;
    closeBanner: () => void;
}

const defaultConsent: ConsentSettings = {
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

// Generate anonymous consent ID for GDPR audit trail
const getConsentId = (): string => {
    if (typeof window === 'undefined') return '';

    let consentId = localStorage.getItem('consentId');
    if (!consentId) {
        consentId = 'consent_' + crypto.randomUUID();
        localStorage.setItem('consentId', consentId);
    }
    return consentId;
};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
    const [consent, setConsent] = useState<ConsentSettings | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load saved consent from localStorage
        const savedConsent = localStorage.getItem('cookieConsent');
        if (savedConsent) {
            try {
                const parsed = JSON.parse(savedConsent) as ConsentSettings;
                setConsent(parsed);
                setShowBanner(false);
            } catch {
                setShowBanner(true);
            }
        } else {
            setShowBanner(true);
        }
        setMounted(true);
    }, []);

    const saveToFirebase = async (settings: ConsentSettings, action: 'accept_all' | 'reject_all' | 'custom') => {
        try {
            const consentId = getConsentId();
            if (!consentId) return;

            await setDoc(doc(db, 'consent_logs', consentId), {
                consentId,
                settings,
                action,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            });
        } catch (error) {
            console.error('Failed to save consent to Firebase:', error);
        }
    };

    const saveConsent = (settings: ConsentSettings, action: 'accept_all' | 'reject_all' | 'custom') => {
        // Ensure necessary is always true
        const finalSettings = { ...settings, necessary: true };

        setConsent(finalSettings);
        localStorage.setItem('cookieConsent', JSON.stringify(finalSettings));
        setShowBanner(false);

        // Save to Firebase for GDPR audit
        saveToFirebase(finalSettings, action);

        // Trigger analytics enable/disable
        if (finalSettings.analytics && typeof window !== 'undefined') {
            // Enable Google Analytics
            window.gtag?.('consent', 'update', {
                analytics_storage: 'granted'
            });
        } else if (typeof window !== 'undefined') {
            // Disable Google Analytics
            window.gtag?.('consent', 'update', {
                analytics_storage: 'denied'
            });
        }
    };

    const acceptAll = () => {
        saveConsent({
            necessary: true,
            analytics: true,
            marketing: true,
            personalization: true,
        }, 'accept_all');
    };

    const rejectAll = () => {
        saveConsent({
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false,
        }, 'reject_all');
    };

    const savePreferences = (settings: Partial<ConsentSettings>) => {
        const newSettings = {
            ...defaultConsent,
            ...consent,
            ...settings,
            necessary: true, // Always true
        };
        saveConsent(newSettings, 'custom');
    };

    const openSettings = () => {
        setShowBanner(true);
    };

    const closeBanner = () => {
        setShowBanner(false);
    };

    // Don't render banner during SSR
    if (!mounted) {
        return (
            <ConsentContext.Provider value={{
                consent: null,
                hasConsented: false,
                showBanner: false,
                acceptAll,
                rejectAll,
                savePreferences,
                openSettings,
                closeBanner
            }}>
                {children}
            </ConsentContext.Provider>
        );
    }

    return (
        <ConsentContext.Provider value={{
            consent,
            hasConsented: consent !== null,
            showBanner,
            acceptAll,
            rejectAll,
            savePreferences,
            openSettings,
            closeBanner
        }}>
            {children}
        </ConsentContext.Provider>
    );
}

export function useConsent() {
    const context = useContext(ConsentContext);
    if (context === undefined) {
        throw new Error("useConsent must be used within a ConsentProvider");
    }
    return context;
}

// Extend Window interface for gtag
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}
