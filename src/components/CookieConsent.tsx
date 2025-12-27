"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Settings, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useConsent, ConsentSettings } from "@/context/ConsentContext";
import Link from "next/link";

export default function CookieConsent() {
    const { showBanner, acceptAll, rejectAll, savePreferences, closeBanner, consent } = useConsent();
    const [showDetails, setShowDetails] = useState(false);
    const [customSettings, setCustomSettings] = useState<ConsentSettings>({
        necessary: true,
        analytics: consent?.analytics ?? true,
        marketing: consent?.marketing ?? true,
        personalization: consent?.personalization ?? true,
    });

    if (!showBanner) return null;

    const handleToggle = (key: keyof ConsentSettings) => {
        if (key === 'necessary') return; // Can't toggle necessary
        setCustomSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSavePreferences = () => {
        savePreferences(customSettings);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-[9998]"
                        onClick={closeBanner}
                    />

                    {/* Cookie Banner */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
                    >
                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-xl">
                                        <Cookie className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            We value your privacy
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            🇪🇺 GDPR Compliant
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={rejectAll}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-4">
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    We use cookies to enhance your browsing experience, analyze site traffic,
                                    and personalize content. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                                    You can manage your preferences or learn more in our{" "}
                                    <Link href="/privacy" className="text-orange-600 hover:underline">
                                        Privacy Policy
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/gdpr" className="text-orange-600 hover:underline">
                                        GDPR Policy
                                    </Link>.
                                </p>
                            </div>

                            {/* Expandable Details */}
                            <div className="px-6">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Customize preferences
                                    {showDetails ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showDetails && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="py-4 space-y-3">
                                                {/* Necessary Cookies */}
                                                <CookieOption
                                                    title="Necessary"
                                                    description="Essential for the website to function. Cannot be disabled."
                                                    checked={true}
                                                    disabled={true}
                                                    icon={<Shield className="w-4 h-4" />}
                                                />

                                                {/* Analytics Cookies */}
                                                <CookieOption
                                                    title="Analytics"
                                                    description="Help us understand how visitors interact with our website."
                                                    checked={customSettings.analytics}
                                                    onChange={() => handleToggle('analytics')}
                                                />

                                                {/* Marketing Cookies */}
                                                <CookieOption
                                                    title="Marketing"
                                                    description="Used to deliver personalized advertisements."
                                                    checked={customSettings.marketing}
                                                    onChange={() => handleToggle('marketing')}
                                                />

                                                {/* Personalization Cookies */}
                                                <CookieOption
                                                    title="Personalization"
                                                    description="Remember your preferences and saved favorites."
                                                    checked={customSettings.personalization}
                                                    onChange={() => handleToggle('personalization')}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 p-6 pt-4 bg-slate-50 border-t border-slate-100">
                                <button
                                    onClick={rejectAll}
                                    className="flex-1 px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Reject All
                                </button>

                                {showDetails && (
                                    <button
                                        onClick={handleSavePreferences}
                                        className="flex-1 px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Save Preferences
                                    </button>
                                )}

                                <button
                                    onClick={acceptAll}
                                    className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface CookieOptionProps {
    title: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    onChange?: () => void;
    icon?: React.ReactNode;
}

function CookieOption({ title, description, checked, disabled, onChange, icon }: CookieOptionProps) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    {icon || <Cookie className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className={`
                    w-11 h-6 rounded-full peer
                    ${disabled
                        ? 'bg-green-500 cursor-not-allowed'
                        : 'bg-slate-300 peer-checked:bg-orange-500'}
                    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                    after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                    peer-checked:after:translate-x-5
                `} />
            </label>
        </div>
    );
}
