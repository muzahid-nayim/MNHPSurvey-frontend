import { Navbar } from "@/components/common/navigation";
import Footer from "../../components/common/Footer";

// frontend/src/app/(landingpage)/layout.tsx
export default function LandingPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full ">{children}</main>
			<Footer />
		</>
	);
}
