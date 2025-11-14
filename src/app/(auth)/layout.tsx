import { Navbar } from "@/components/common/navigation";

// src/app/(auth)/layout.tsx
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main className="min-h-screen flex items-center justify-center p-4">
				{children}
			</main>
		</>
	);
}
