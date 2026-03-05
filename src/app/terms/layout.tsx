import Footer from "@/components/common/Footer";
import { Navbar } from "@/components/common/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms & Conditions",
};
// frontend/src/app/terms/layout.tsx
export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-7xl">{children}</main>
			<Footer/>
		</>
	);
}
