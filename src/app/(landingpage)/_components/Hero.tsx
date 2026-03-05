"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	BarChart2,
	ClipboardList,
	ShieldCheck,
} from "lucide-react";

const badges = [
	{ icon: <ClipboardList className="w-3.5 h-3.5" />, label: "Easy to Build" },
	{
		icon: <BarChart2 className="w-3.5 h-3.5" />,
		label: "Real-Time Analytics",
	},
	{
		icon: <ShieldCheck className="w-3.5 h-3.5" />,
		label: "Private & Secure",
	},
];

const Hero = () => {
	return (
		<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-10">
			{/* ── Background mesh blobs ── */}
			<div className="absolute inset-0 -z-10 pointer-events-none">
				<div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[120px] animate-pulse-slow" />
				<div
					className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full filter blur-[140px] animate-pulse-slow"
					style={{ animationDelay: "2s" }}
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full filter blur-[100px]" />
			</div>

			{/* ── Subtle grid overlay ── */}
			<div
				className="absolute inset-0 -z-10 opacity-[0.03]"
				style={{
					backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* ── Main content ── */}
			<div className="relative max-w-4xl mx-auto text-center z-10">
				{/* Tag */}
				<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase mb-8 animate-fade-in-up">
					<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
					MNHP survey
				</div>

				{/* Headline */}
				<h1
					className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.05] animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					Build surveys.
					<br />
					<span className="bg-linear-to-br from-primary via-primary/80 to-accent bg-clip-text text-transparent">
						Get real answers.
					</span>
				</h1>

				{/* Subheading */}
				<p
					className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up"
					style={{ animationDelay: "0.2s" }}
				>
					A focused MNHP survey with flexible access control, multiple
					display modes, and instant response analytics — without the
					noise.
				</p>

				{/* Feature badges */}
				<div
					className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up"
					style={{ animationDelay: "0.3s" }}
				>
					{badges.map((b) => (
						<span
							key={b.label}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground font-medium"
						>
							<span className="text-primary">{b.icon}</span>
							{b.label}
						</span>
					))}
				</div>

				{/* CTA Buttons */}
				<div
					className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
					style={{ animationDelay: "0.4s" }}
				>
					<Button
						asChild
						size="lg"
						className="gap-2 group rounded-full px-8 font-semibold"
					>
						<Link href="/surveys/create">
							Create a Survey
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
				</div>

				{/* Trust line */}
				<p
					className="mt-8 text-xs text-muted-foreground/50 animate-fade-in-up"
					style={{ animationDelay: "0.5s" }}
				>
					No credit card required &nbsp;·&nbsp; Free to start
					&nbsp;·&nbsp; Your data stays yours
				</p>

				{/* ── Floating stat cards ── */}
				<div
					className="relative mt-20 animate-fade-in-up"
					style={{ animationDelay: "0.6s" }}
				>
					{/* Card strip */}
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						{[
							{
								value: "3",
								label: "Access Types",
								sub: "Public, Auth, Private",
							},
							{
								value: "∞",
								label: "Responses",
								sub: "No hard limits",
							},
							{
								value: "100%",
								label: "Data Control",
								sub: "Always yours",
							},
						].map((stat) => (
							<div
								key={stat.label}
								className="flex-1 min-w-[180px] max-w-[200px]  mx-auto sm:mx-0 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 text-left hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
							>
								<p className="text-3xl font-black text-primary mb-1">
									{stat.value}
								</p>
								<p className="text-sm font-semibold text-foreground">
									{stat.label}
								</p>
								<p className="text-xs text-muted-foreground mt-0.5">
									{stat.sub}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(24px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes pulse-slow {
					0%,
					100% {
						opacity: 0.6;
						transform: scale(1);
					}
					50% {
						opacity: 1;
						transform: scale(1.08);
					}
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.7s ease-out forwards;
					opacity: 0;
				}
				.animate-pulse-slow {
					animation: pulse-slow 8s ease-in-out infinite;
				}
			`}</style>
		</section>
	);
};

export default Hero;
