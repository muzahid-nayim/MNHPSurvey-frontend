import { FloatingShapes } from "@/components/custom/floating-shapes";
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

export default function Features (){
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

	return (<>
	<section className="container mx-auto px-4 py-16">
		<FloatingShapes />
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
	</>)
}