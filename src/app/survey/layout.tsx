import Footer from "@/components/common/Footer";
import { Navbar } from "@/components/common/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Survey",
};
export default function SurveyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-6xl p-3 py-10">{children}</main>
			<Footer/>
		</>
	);
}
