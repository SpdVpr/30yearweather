
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-6 px-6 md:px-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
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
            <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-stone-800 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                <span>© 2025 30YearWeather Intelligence. All rights reserved.</span>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-white">Privacy</Link>
                    <Link href="/terms" className="hover:text-white">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
