import Link from "next/link";
import { Globe2, LockKeyhole, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const accessTypes = [
	{
		icon: Globe2,
		title: "Public",
		subtitle: "Anonymous",
		description:
			"Anyone with the link can respond. Fast for open feedback and casual polls.",
	},
	{
		icon: UserCheck,
		title: "Login required",
		subtitle: "Authenticated",
		description:
			"Respondents sign in first so you know who answered without inviting a list.",
	},
	{
		icon: LockKeyhole,
		title: "Private",
		subtitle: "Invited only",
		description:
			"Limit access to allowed emails. Ideal for teams, classes, and closed groups.",
	},
];

export default function AccessTypes() {
	return (
		<section className="border-y border-border/40 bg-muted/20 py-16 sm:py-20">
			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center sm:mb-16">
						<h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Access that fits your audience
						</h2>
						<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
							Choose how open or restricted each survey should be
							— without rebuilding the whole form.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{accessTypes.map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.title}
									className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
								>
									<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Icon className="h-5 w-5" />
									</div>
									<p className="mb-1 text-xs font-medium tracking-wide text-primary uppercase">
										{item.subtitle}
									</p>
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

					<div className="mt-10 flex justify-center">
						<Button asChild size="lg" className="rounded-full px-8">
							<Link href="/dashboard/surveys/create">
								Create a survey
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
