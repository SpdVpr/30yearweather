
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";

export const metadata = {
    title: "GDPR Compliance | 30YearWeather",
    description: "General Data Protection Regulation (GDPR) compliance information for 30YearWeather.",
};

export default function GDPRPage() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <Header
                breadcrumb={{
                    label: "GDPR Compliance",
                    href: "/",
                    sublabel: "Data Rights"
                }}
            />
            <div className="pt-16" />

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-serif font-bold mb-8">GDPR Compliance</h1>
                <div className="prose prose-stone max-w-none">
                    <p>We are a Data Controller of your information.</p>
                    <p>30YearWeather legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:</p>
                    <ul>
                        <li>30YearWeather needs to perform a contract with you</li>
                        <li>You have given 30YearWeather permission to do so</li>
                        <li>Processing your personal information is in 30YearWeather legitimate interests</li>
                        <li>30YearWeather needs to comply with the law</li>
                    </ul>

                    <p>30YearWeather will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>

                    <h2>Your Data Protection Rights</h2>
                    <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.</p>
                    <p>In certain circumstances, you have the following data protection rights:</p>
                    <ul>
                        <li>The right to access, update or to delete the information we have on you.</li>
                        <li>The right of rectification.</li>
                        <li>The right to object.</li>
                        <li>The right of restriction.</li>
                        <li>The right to data portability.</li>
                        <li>The right to withdraw consent.</li>
                    </ul>

                    <h2>Contact</h2>
                    <p>For any GDPR-related inquiries, please contact our Data Protection Officer at <strong>michalvesecky@gmail.com</strong>.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
