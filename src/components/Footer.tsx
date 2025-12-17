
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-12 px-6 md:px-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div>
                    <h4 className="text-white text-2xl font-serif font-bold mb-6">30YearWeather.</h4>
                    <p className="max-w-xs leading-relaxed text-sm">
                        Making meteorology accessible for long-term planning. Because averages lie, but data doesn't.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Product</span>
                        <Link href="/#cities" className="hover:text-white transition-colors">Destinations</Link>
                        <Link href="/#methodology" className="hover:text-white transition-colors">Methodology</Link>
                        <Link href="/api-docs" className="hover:text-white transition-colors">API Access</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Company</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold mb-1">Contact</span>
                        <a href="mailto:michalvesecky@gmail.com" className="hover:text-white transition-colors">michalvesecky@gmail.com</a>
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
