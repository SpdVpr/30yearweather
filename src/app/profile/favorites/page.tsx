import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/Footer";
import FavoritesContent from "./FavoritesContent";

export const metadata: Metadata = {
    title: "My Favorites",
    description: "View and manage your favorite cities on 30YearWeather.",
};

export default function FavoritesPage() {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Header
                breadcrumb={{
                    label: "My Favorites",
                    href: "/",
                    sublabel: "Saved Cities"
                }}
            />

            <main className="flex-grow pt-20 md:pt-24 pb-12 px-4 w-full max-w-[1250px] mx-auto">
                <FavoritesContent />
            </main>

            <Footer />
        </div>
    );
}
