
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Terms of Service | 30YearWeather",
    description: "Terms and conditions for using 30YearWeather.com.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <nav className="bg-white border-b border-stone-200 py-4 px-6 md:px-12">
                <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-serif font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-stone max-w-none">
                    <p>Welcome to 30YearWeather!</p>
                    <p>These terms and conditions outline the rules and regulations for the use of 30YearWeather's Website.</p>

                    <h2>1. Interpretation and Definitions</h2>
                    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                    <h2>2. Disclaimer</h2>
                    <p>The materials on 30YearWeather’s website are provided on an 'as is' basis. 30YearWeather makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    <p>Further, 30YearWeather does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site. Weather data is historical and based on averages; actual weather can vary significantly.</p>

                    <h2>3. Limitations</h2>
                    <p>In no event shall 30YearWeather or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on 30YearWeather’s website.</p>

                    <h2>Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at <strong>michalvesecky@gmail.com</strong>.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
