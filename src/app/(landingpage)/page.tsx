// app/page.tsx
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ArrowRight,
	BarChart3,
	QrCode,
	Download,
	Smartphone,
	Users,
	Shield,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	const features = [
		{
			icon: <BarChart3 className="h-6 w-6" />,
			title: "Advanced Analytics",
			description:
				"Visualize survey results with interactive charts and graphs",
		},
		{
			icon: <QrCode className="h-6 w-6" />,
			title: "QR Code Integration",
			description: "Generate QR codes for easy survey distribution",
		},
		{
			icon: <Download className="h-6 w-6" />,
			title: "Export Data",
			description: "Download results in CSV or PDF formats",
		},
		{
			icon: <Smartphone className="h-6 w-6" />,
			title: "Mobile Ready",
			description: "Responsive design with future mobile app support",
		},
		{
			icon: <Users className="h-6 w-6" />,
			title: "Audience Management",
			description: "Reach respondents via public links or email invites",
		},
		{
			icon: <Shield className="h-6 w-6" />,
			title: "Privacy Controls",
			description: "Choose between anonymous or identity-based surveys",
		},
	];

	return (
		<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20">
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-24">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
						Create Powerful Surveys in{" "}
						<span className="bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Minutes
						</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
						Professional survey platform with advanced analytics,
						flexible distribution, and comprehensive data export
						capabilities.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" className="gap-2">
							<Link href="/surveys/create">
								Create Survey
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/demo">View Demo</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-foreground mb-4">
							Everything You Need for Effective Surveys
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							From creation to analysis, our platform provides all
							the tools for gathering meaningful insights.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20"
							>
								<CardHeader className="flex flex-row items-center space-y-0 pb-4">
									<div className="mr-4 p-2 bg-primary/10 rounded-lg text-primary">
										{feature.icon}
									</div>
									<div className="space-y-1">
										<CardTitle className="text-xl text-foreground">
											{feature.title}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base text-muted-foreground">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								10K+
							</div>
							<div className="text-sm text-muted-foreground">
								Surveys Created
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								500K+
							</div>
							<div className="text-sm text-muted-foreground">
								Responses
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								99.9%
							</div>
							<div className="text-sm text-muted-foreground">
								Uptime
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								4.8/5
							</div>
							<div className="text-sm text-muted-foreground">
								User Rating
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="max-w-3xl mx-auto text-center">
					<Card className="border-0 shadow-xl bg-linear-to-br from-blue-600 to-purple-600 text-white dark:from-blue-700 dark:to-purple-800">
						<CardContent className="p-12">
							<h3 className="text-2xl md:text-3xl font-bold mb-4">
								Ready to Get Started?
							</h3>
							<p className="text-blue-100 dark:text-blue-200 mb-6 text-lg">
								Join thousands of users creating effective
								surveys today.
							</p>
							<Button
								asChild
								size="lg"
								variant="secondary"
								className="gap-2 bg-white text-blue-600 hover:bg-white/90"
							>
								<Link href="/surveys/create">
									Create Your First Survey
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border/50 mt-16">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center space-x-2 mb-4 md:mb-0">
							<div className="flex items-center justify-center w-6 h-6 bg-linear-to-br from-blue-600 to-purple-600 rounded-md">
								<Smartphone className="h-3 w-3 text-white" />
							</div>
							<span className="font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
								MNHPSurvey
							</span>
						</div>
						<div className="text-sm text-muted-foreground">
							© 2024 MNHPSurvey. All rights reserved.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
