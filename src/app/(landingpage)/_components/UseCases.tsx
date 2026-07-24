import { Building2, GraduationCap, Mic2, UsersRound } from "lucide-react";

const uses = [
	{
		icon: GraduationCap,
		title: "Classes & workshops",
		description: "Collect feedback after sessions with invite-only access.",
	},
	{
		icon: Building2,
		title: "Teams & workplaces",
		description: "Run internal polls with login-required responses.",
	},
	{
		icon: Mic2,
		title: "Events & booths",
		description: "Share a QR code so attendees can respond on the spot.",
	},
	{
		icon: UsersRound,
		title: "Open feedback",
		description: "Publish a public link when you want broad, fast input.",
	},
];

export default function UseCases() {
	return (
		<section className="border-y border-border/40 bg-muted/15 py-16 sm:py-20">
			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center sm:mb-16">
						<h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Made for real survey moments
						</h2>
						<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
							Whether you need a quick poll or a controlled
							audience, MNHP Survey stays simple.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
						{uses.map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.title}
									className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
								>
									<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Icon className="h-5 w-5" />
									</div>
									<h3 className="mb-1.5 text-base font-semibold text-foreground">
										{item.title}
									</h3>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
