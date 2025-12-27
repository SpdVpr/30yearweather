"use client";

import Link from "next/link";
import { useConsent } from "@/context/ConsentContext";

export default function Footer() {
    const { openSettings } = useConsent();

    return (
        <footer className="bg-stone-900 text-stone-400 py-4 md:py-6 px-4 md:px-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                <div className="flex md:block items-center gap-3 md:gap-0">
                    <h4 className="text-white text-lg md:text-2xl font-serif font-bold md:mb-6">30YearWeather.</h4>
                    <p className="hidden md:block max-w-xs leading-relaxed text-sm mb-6">
                        Making meteorology accessible for long-term planning. Because averages lie, but data doesn't.
                    </p>
                    <a
                        href="https://www.pinterest.com/30yearweather/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 hover:bg-red-600 hover:text-white text-white p-2 md:p-2.5 rounded-full transition-all duration-300 min-w-[40px] min-h-[40px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center"
                        aria-label="Follow us on Pinterest (opens in new tab)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6">
                            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                        </svg>
                    </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 text-xs md:text-sm w-full md:w-auto">
                    <div className="flex flex-col gap-1.5 md:gap-3">
                        <span className="text-white font-bold text-sm md:text-base mb-0.5 md:mb-1">Product</span>
                        <Link href="/#cities" className="hover:text-white transition-colors py-1">Destinations</Link>
                        <Link href="/finder" className="hover:text-white transition-colors py-1 flex items-center gap-1.5">Smart Finder <span className="px-1 py-0.5 rounded bg-orange-900/50 text-orange-400 text-[9px] md:text-[10px] font-bold">NEW</span></Link>
                        <Link href="/research" className="hover:text-white transition-colors py-1">Research</Link>
                        <Link href="/methodology" className="hover:text-white transition-colors py-1 hidden md:block">Methodology</Link>
                        <Link href="/api-docs" className="hover:text-white transition-colors py-1 hidden md:block">API Access</Link>
                    </div>
                    <div className="flex flex-col gap-1.5 md:gap-3">
                        <span className="text-white font-bold text-sm md:text-base mb-0.5 md:mb-1">Company</span>
                        <Link href="/about" className="hover:text-white transition-colors py-1">About Us</Link>
                        <Link href="/terms" className="hover:text-white transition-colors py-1">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors py-1">Privacy</Link>
                    </div>
                    <div className="flex flex-col gap-1.5 md:gap-3">
                        <span className="text-white font-bold text-sm md:text-base mb-0.5 md:mb-1">Legal</span>
                        <Link href="/gdpr" className="hover:text-white transition-colors py-1">GDPR</Link>
                        <Link href="/privacy#cookies" className="hover:text-white transition-colors py-1">Cookies</Link>
                        <button
                            onClick={openSettings}
                            className="text-left hover:text-white transition-colors py-1"
                        >
                            Settings
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5 md:gap-3">
                        <span className="text-white font-bold text-sm md:text-base mb-0.5 md:mb-1">Contact</span>
                        <a href="mailto:30yearweather@gmail.com" className="hover:text-white transition-colors py-1 break-all">30yearweather@gmail.com</a>
                        <span className="text-[10px] md:text-xs opacity-50">Prague, Czech Republic</span>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-4 md:mt-6 pt-3 md:pt-4 border-t border-stone-800 text-[10px] md:text-xs flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4">
                <span>© 2025 30YearWeather Intelligence</span>
                <div className="flex gap-4 md:gap-6">
                    <Link href="/privacy" className="hover:text-white py-1.5 md:py-2 px-1 min-h-[36px] md:min-h-[44px] flex items-center">Privacy</Link>
                    <Link href="/terms" className="hover:text-white py-1.5 md:py-2 px-1 min-h-[36px] md:min-h-[44px] flex items-center">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
