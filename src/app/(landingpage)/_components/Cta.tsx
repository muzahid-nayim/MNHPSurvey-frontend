"use client";
import Link from "next/link";
const CTA = () => {
	return (
		<section className="relative py-16 md:py-24 overflow-hidden bg-card/10 backdrop-blur-sm">
			{/* Decorative background elements */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
				<div className="absolute bottom-0 right-0 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
			</div>

			{/* Poll icon pattern (subtle) */}
			<div className="absolute inset-0 opacity-5 pointer-events-none">
				<svg
					className="absolute top-10 left-10 w-24 h-24"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x="4"
						y="12"
						width="4"
						height="16"
						fill="var(--primary)"
						rx="1"
					/>
					<rect
						x="12"
						y="6"
						width="4"
						height="22"
						fill="var(--primary)"
						rx="1"
					/>
					<rect
						x="20"
						y="2"
						width="4"
						height="26"
						fill="var(--primary)"
						rx="1"
					/>
					<path
						d="M28 8 L16 20 L10 14"
						stroke="var(--primary)"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
				</svg>
				<svg
					className="absolute bottom-10 right-10 w-32 h-32 rotate-12"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x="4"
						y="12"
						width="4"
						height="16"
						fill="var(--primary)"
						rx="1"
					/>
					<rect
						x="12"
						y="6"
						width="4"
						height="22"
						fill="var(--primary)"
						rx="1"
					/>
					<rect
						x="20"
						y="2"
						width="4"
						height="26"
						fill="var(--primary)"
						rx="1"
					/>
					<path
						d="M28 8 L16 20 L10 14"
						stroke="var(--primary)"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
				</svg>
			</div>

			{/* Main content */}
			<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
					Ready to create your first survey?
				</h2>
				<p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
					Join thousands of teams using MNHP Survey to gather
					insights, run polls, and make data-driven decisions — all in
					minutes.
				</p>

				{/* Buttons */}
				<div className="mt-8 md:mt-10 flex flex-wrap gap-4 justify-center">
					<Link
						href="/signup"
						className="px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary/90 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						Get Started Free
					</Link>
					<Link
						href="/about"
						className="px-8 py-4 bg-transparent text-primary font-semibold rounded-full border-2 border-primary hover:bg-primary/10 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						Learn More
					</Link>
				</div>
			</div>

			{/* Add animation keyframes if not already in global CSS */}
			<style jsx>{`
				@keyframes blob {
					0% {
						transform: translate(0px, 0px) scale(1);
					}
					33% {
						transform: translate(30px, -50px) scale(1.1);
					}
					66% {
						transform: translate(-20px, 20px) scale(0.9);
					}
					100% {
						transform: translate(0px, 0px) scale(1);
					}
				}
				.animate-blob {
					animation: blob 10s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
			`}</style>
		</section>
	);
};

export default CTA;
