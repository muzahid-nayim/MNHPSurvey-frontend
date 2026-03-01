// app/page.tsx

import CTA from "./_components/Cta";
import Hero from "./_components/Hero";
import Status from "./_components/Status";
import Footer from "../../components/common/Footer";
import Features from "./_components/Features";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20">
			{/* Hero Section */}
			<Hero />

			{/* Features Section */}
			<Features />

			<Status />

			<CTA />

			{/* Footer */}
		</div>
	);
}
