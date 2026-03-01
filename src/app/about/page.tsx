"use client";

import { FloatingShapes } from "@/components/custom/floating-shapes";
import { ClipboardList, BarChart2, ShieldCheck, Users } from "lucide-react";

// import { FloatingShapes } from "@/components/floating-shapes";

const stats = [
	{ value: "3", label: "Survey Types" },
	{ value: "∞", label: "Responses" },
	{ value: "100%", label: "Data Yours" },
];


const features = [
	{
		icon: <ClipboardList className="w-6 h-6" />,
		title: "Flexible Survey Builder",
		description:
			"Create surveys with single-choice or multiple-choice questions. Control display mode — one question at a time, all at once, or paginated.",
	},
	{
		icon: <BarChart2 className="w-6 h-6" />,
		title: "Real-Time Analytics",
		description:
			"See response counts, percentages per option, and aggregated statistics the moment someone submits. Built for clarity, not complexity.",
	},
	{
		icon: <Users className="w-6 h-6" />,
		title: "Access Control",
		description:
			"Choose who can respond — public anonymous, login required, or private invited only. Every survey, fully under your control.",
	},
	{
		icon: <ShieldCheck className="w-6 h-6" />,
		title: "Secure & Private",
		description:
			"Your survey data belongs to you. Respondent identity is tracked only when you choose. Anonymous responses stay anonymous.",
	},
];

const howItWorks = [
	{ step: "01", title: "Create", description: "Build your survey with questions and options. Set access type and display mode." },
	{ step: "02", title: "Share", description: "Publish your survey and share the link with your audience — public or private." },
	{ step: "03", title: "Collect", description: "Responses come in. Track completion in real time as people submit." },
	{ step: "04", title: "Analyze", description: "View aggregated stats — counts, percentages, and who responded." },
];

export default function AboutPage() {
	return (
		<div className="relative min-h-screen bg-background text-foreground overflow-hidden">
			<FloatingShapes />

			{/* ── Hero ── */}
			<section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
				<span className="inline-block mb-5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase">
					About SurveyApp
				</span>

				<h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
					Surveys that are{" "}
					<span className="text-primary">simple</span> to build,{" "}
					<span className="text-primary">powerful</span> to analyze.
				</h1>

				<p className="mt-6 text-muted-foreground text-lg max-w-xl leading-relaxed">
					A clean, focused survey platform built for people who want real insights
					without the bloat. No unnecessary features — just what matters.
				</p>

				{/* Stats Row */}
				<div className="mt-14 flex gap-12 sm:gap-20">
					{stats.map((s) => (
						<div key={s.label} className="flex flex-col items-center">
							<span className="text-4xl font-bold text-primary">{s.value}</span>
							<span className="mt-1 text-xs text-muted-foreground tracking-wide uppercase">{s.label}</span>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="relative z-10 max-w-5xl mx-auto px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Mission ── */}
			<section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
				<h2 className="text-2xl sm:text-3xl font-bold mb-5">Why we built this</h2>
				<p className="text-muted-foreground text-base leading-relaxed">
					Most survey tools are either too simple or too overwhelming. We built
					SurveyApp to sit in the middle — enough power to get real data, simple
					enough that anyone can use it without a tutorial. Whether you're collecting
					feedback, running a poll, or researching your audience, SurveyApp gets out
					of your way and lets the data speak.
				</p>
			</section>

			{/* ── Features ── */}
			<section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
				<h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">What it does</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{features.map((f) => (
						<div
							key={f.title}
							className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
						>
							<div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
								{f.icon}
							</div>
							<h3 className="font-semibold text-base mb-2">{f.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="relative z-10 max-w-5xl mx-auto px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── How It Works ── */}
			<section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
				<h2 className="text-2xl sm:text-3xl font-bold text-center mb-14">How it works</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{howItWorks.map((item, i) => (
						<div key={item.step} className="relative flex flex-col">
							{/* connector line */}
							{i < howItWorks.length - 1 && (
								<div className="hidden lg:block absolute top-5 left-[calc(100%-12px)] w-full h-px bg-border z-0" />
							)}
							<span className="text-4xl font-black text-primary/15 mb-3 leading-none">{item.step}</span>
							<h3 className="font-semibold text-base mb-1">{item.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="relative z-10 max-w-2xl mx-auto px-6 pb-28 text-center">
				<div className="rounded-2xl border border-primary/20 bg-primary/5 p-10">
					<h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to start?</h2>
					<p className="text-muted-foreground text-sm mb-7">
						Create your first survey in under a minute. No credit card, no setup, no noise.
					</p>
					<a
						href="/register"
						className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
					>
						Get Started Free
					</a>
				</div>
			</section>
		</div>
	);
}