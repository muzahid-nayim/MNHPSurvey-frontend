import { Layers, LayoutList, SquareStack } from "lucide-react";

const modes = [
	{
		icon: SquareStack,
		title: "One at a time",
		description:
			"Guide respondents through each question like a focused form flow.",
	},
	{
		icon: LayoutList,
		title: "Show all",
		description:
			"Put every question on one page for quick, short surveys.",
	},
	{
		icon: Layers,
		title: "Paginated",
		description:
			"Split long surveys into pages so people don’t get overwhelmed.",
	},
];

export default function DisplayModes() {
	return (
		<section className="container mx-auto px-4 py-16 sm:py-20">
			<div className="mx-auto max-w-6xl">
				<div className="mb-12 text-center sm:mb-16">
					<h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Display modes that match the survey
					</h2>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						Control how questions appear — without changing your
						content.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{modes.map((mode) => {
						const Icon = mode.icon;
						return (
							<div
								key={mode.title}
								className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/25"
							>
								<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-foreground">
									{mode.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
									{mode.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
