
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";

export const metadata = {
    title: "Privacy Policy | 30YearWeather",
    description: "Privacy Policy for 30YearWeather.com regarding data collection and usage.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <Header
                breadcrumb={{
                    label: "Privacy Policy",
                    href: "/",
                    sublabel: "Data & Privacy"
                }}
            />
            <div className="pt-16" />

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-stone max-w-none">
                    <p>Last updated: December 17, 2024</p>
                    <p>At 30YearWeather, accesible from https://30yearweather.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by 30YearWeather and how we use it.</p>

                    <h2>Log Files</h2>
                    <p>30YearWeather follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

                    <h2>Cookies and Web Beacons</h2>
                    <p>Like any other website, 30YearWeather uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

                    <h2>Google DoubleClick DART Cookie</h2>
                    <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet.</p>

                    <h2>Contact Information</h2>
                    <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>michalvesecky@gmail.com</strong>.</p>
                </div>
            </main>
            <Footer />
        </div >
    );
}
