// frontend/src/app/about/layout.tsx
export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="mx-auto w-full max-w-7xl">
				{children}
			</div>
		</>
	);
}
