// app/page.tsx

import CTA from "./_components/Cta";
import Hero from "./_components/Hero";
import Status from "./_components/Status";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import AccessTypes from "./_components/AccessTypes";
import DisplayModes from "./_components/DisplayModes";
import UseCases from "./_components/UseCases";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20">
			<Hero />
			<Features />
			<HowItWorks />
			<AccessTypes />
			<DisplayModes />
			<UseCases />
			<Status />
			<CTA />
		</div>
	);
}
