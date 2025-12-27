import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/Footer";
import SettingsContent from "./SettingsContent";

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your 30YearWeather account settings, home location, and preferences.",
};

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Header
                breadcrumb={{
                    label: "Settings",
                    href: "/",
                    sublabel: "Your Account"
                }}
            />

            <main className="flex-grow pt-20 md:pt-24 pb-12 px-4 w-full max-w-[1250px] mx-auto">
                <SettingsContent />
            </main>

            <Footer />
        </div>
    );
}
