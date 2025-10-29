import { Navbar } from "@/components/common/navigation";

// frontend/src/app/about/layout.tsx
export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-7xl">{children}</main>
		</>
	);
}
