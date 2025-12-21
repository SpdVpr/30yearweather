
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-12 px-6 md:px-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div>
                    <h4 className="text-white text-2xl font-serif font-bold mb-6">30YearWeather.</h4>
                    <p className="max-w-xs leading-relaxed text-sm mb-6">
                        Making meteorology accessible for long-term planning. Because averages lie, but data doesn't.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.pinterest.com/30yearweather/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-red-600 hover:text-white text-white p-2 rounded-full transition-all duration-300"
                            aria-label="Follow us on Pinterest"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.175-1.492-.643-2.188-2.65-2.188-4.266 0-3.195 2.328-6.125 6.742-6.125 3.546 0 5.847 2.43 5.847 5.683 0 3.396-2.132 6.129-5.094 6.129-1.005 0-1.953-.52-2.276-1.127l-.618 2.36c-.22.84-.813 2.058-1.211 2.755 1.726.541 3.208.766 4.706.766 6.64 0 12-5.362 12-11.987 0-6.62-5.36-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Product</span>
                        <Link href="/#cities" className="hover:text-white transition-colors">Destinations</Link>
                        <Link href="/finder" className="hover:text-white transition-colors flex items-center gap-2">Smart Finder <span className="px-1.5 py-0.5 rounded bg-orange-900/50 text-orange-400 text-[10px] font-bold">NEW</span></Link>
                        <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
                        <Link href="/api-docs" className="hover:text-white transition-colors">API Access</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Company</span>
                        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Legal</span>
                        <Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link>
                        <Link href="/privacy#cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Contact</span>
                        <a href="mailto:30yearweather@gmail.com" className="hover:text-white transition-colors">30yearweather@gmail.com</a>
                        <span className="text-xs opacity-50">Prague, Czech Republic</span>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                <span>© 2025 30YearWeather Intelligence. All rights reserved.</span>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-white">Privacy</Link>
                    <Link href="/terms" className="hover:text-white">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
