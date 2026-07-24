import { BarChart3, Download, QrCode, Shield } from "lucide-react";

const capabilities = [
	{
		icon: Shield,
		label: "3 access types",
		detail: "Public, login, or invite-only",
	},
	{
		icon: BarChart3,
		label: "Live charts",
		detail: "Bar and pie views per question",
	},
	{
		icon: Download,
		label: "CSV + PDF export",
		detail: "Download results when you need them",
	},
	{
		icon: QrCode,
		label: "QR sharing",
		detail: "Print or send a scannable link",
	},
];

export default function Status() {
	return (
		<section className="container mx-auto px-4 py-16 sm:py-20">
			<div className="mx-auto max-w-5xl">
				<div className="mb-10 text-center sm:mb-12">
					<h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Built-in capabilities
					</h2>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						Real tools that ship with every survey — no padding,
						no invented metrics.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
					{capabilities.map((item) => {
						const Icon = item.icon;
						return (
							<div
								key={item.label}
								className="rounded-2xl border border-border/60 bg-card/70 px-5 py-6 text-center backdrop-blur-sm"
							>
								<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<Icon className="h-5 w-5" />
								</div>
								<p className="text-base font-semibold text-foreground">
									{item.label}
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{item.detail}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
