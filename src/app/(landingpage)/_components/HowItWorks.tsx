import { ClipboardEdit, QrCode, LineChart } from "lucide-react";

const steps = [
	{
		step: "01",
		icon: ClipboardEdit,
		title: "Build",
		description:
			"Create questions, pick display mode, and set your survey preferences in minutes.",
	},
	{
		step: "02",
		icon: QrCode,
		title: "Share",
		description:
			"Send a link or generate a QR code so respondents can jump in instantly.",
	},
	{
		step: "03",
		icon: LineChart,
		title: "Analyze",
		description:
			"Watch live charts, dig into responses, and export CSV or PDF when you need them.",
	},
];

export default function HowItWorks() {
	return (
		<section className="container mx-auto px-4 py-16 sm:py-20">
			<div className="mx-auto max-w-6xl">
				<div className="mb-12 text-center sm:mb-16">
					<h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						How it works
					</h2>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						From blank page to clear insights in three simple steps.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
					{steps.map((item) => {
						const Icon = item.icon;
						return (
							<div
								key={item.step}
								className="relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/25"
							>
								<span className="mb-4 block text-xs font-semibold tracking-[0.16em] text-primary uppercase">
									Step {item.step}
								</span>
								<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-foreground">
									{item.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
									{item.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
