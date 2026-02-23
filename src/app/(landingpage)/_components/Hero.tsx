// components/Hero.jsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // adjust import path
import { ArrowRight } from "lucide-react";

const Hero = () => {
	return (
		<section className="relative container mx-auto px-4 py-24 overflow-hidden">
			{/* Animated background blobs */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
				<div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linear-to-br from-gradient-l to-gradient-r/10 to-gradient-r/10 rounded-full filter blur-3xl animate-pulse-slow" />
			</div>

			{/* Floating survey icons (decorative) */}
			<div className="absolute inset-0 -z-5 pointer-events-none">
				<svg
					className="absolute top-24 left-10 w-16 h-16 opacity-20 animate-float"
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
					className="absolute bottom-32 right-10 w-20 h-20 opacity-20 animate-float animation-delay-1000"
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
			<div className="relative max-w-4xl mx-auto text-center z-10">
				{/* Animated headline */}
				<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fade-in-up">
					Create Powerful Surveys in{" "}
					<span className="bg-linear-to-br from-gradient-l to-gradient-r to-gradient-r bg-clip-text text-transparent animate-gradient-x">
						Minutes
					</span>
				</h1>

				{/* Subheading with fade-in */}
				<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
					Professional survey platform with advanced analytics,
					flexible distribution, and comprehensive data export
					capabilities.
				</p>

				{/* Buttons with hover animation */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
					<Button asChild size="lg" className="gap-2 group">
						<Link href="/surveys/create">
							Create Survey
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/demo">View Demo</Link>
					</Button>
				</div>

				{/* Optional trust badge */}
				<p className="mt-8 text-sm text-muted-foreground/60 animate-fade-in-up animation-delay-900">
					✦ Trusted by 5,000+ teams ✦ No credit card required
				</p>
			</div>

			{/* Add animations */}
			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					50% {
						transform: translateY(-20px) rotate(2deg);
					}
				}
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes pulse-slow {
					0%,
					100% {
						opacity: 0.4;
						transform: scale(1);
					}
					50% {
						opacity: 0.7;
						transform: scale(1.05);
					}
				}
				@keyframes gradient-x {
					0%,
					100% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
				}
				.animate-float {
					animation: float 8s ease-in-out infinite;
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.8s ease-out forwards;
					opacity: 0; /* start invisible */
				}
				.animate-pulse-slow {
					animation: pulse-slow 6s ease-in-out infinite;
				}
				.animate-gradient-x {
					background-size: 200% 200%;
					animation: gradient-x 4s ease infinite;
				}
				.animation-delay-300 {
					animation-delay: 0.3s;
				}
				.animation-delay-600 {
					animation-delay: 0.6s;
				}
				.animation-delay-900 {
					animation-delay: 0.9s;
				}
				.animation-delay-1000 {
					animation-delay: 1s;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
			`}</style>
		</section>
	);
};

export default Hero;
