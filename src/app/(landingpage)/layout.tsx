import { Navbar } from "@/components/common/navigation";
import Footer from "./_components/Footer";

// frontend/src/app/(landingpage)/layout.tsx
export default function LandingPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
		<Navbar/>
			<main className="mx-auto w-full max-w-7xl">
				{children}
			</main>
			<Footer />
		</>
	);
}
