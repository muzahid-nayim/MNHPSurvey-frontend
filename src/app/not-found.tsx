// app/not-found.tsx
import { Navbar } from "@/components/common/navigation";
import { FloatingShapes } from "@/components/custom/floating-shapes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Search, Mail } from "lucide-react";
import Link from "next/link";
import Footer from "../components/common/Footer";

export default function NotFound() {
	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-linear-to-br from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-4">
				<div className="container max-w-4xl mx-auto">
					<FloatingShapes />
					<div className="text-center">
						{/* Animated 404 Number */}
						<div className="relative mb-8">
							<div className="text-9xl md:text-[12rem] font-bold bg-linear-to-br from-gradient-l to-gradient-r  bg-clip-text text-transparent opacity-90">
								404
							</div>
							<div className="absolute inset-0 text-9xl md:text-[12rem] font-bold bg-linear-to-br from-gradient-l to-gradient-r  bg-clip-text text-transparent opacity-20 blur-xl">
								404
							</div>
						</div>

						{/* Main Message */}
						<Card className="border border-border/50 bg-card/50 backdrop-blur-sm max-w-2xl mx-auto mb-8">
							<CardContent className="p-8">
								<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
									Page Lost in the Digital Void
								</h1>
								<p className="text-lg text-muted-foreground mb-6 leading-relaxed">
									The survey page you&apos;re looking for
									seems to have gone missing. It might have
									been deleted, moved, or never existed in the
									first place.
								</p>

								{/* Action Buttons */}
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button asChild size="lg" className="gap-2">
										<Link href="/">
											<Home className="h-4 w-4" />
											Back to Home
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										size="lg"
										className="gap-2"
									>
										<Link href="/surveys">
											<Search className="h-4 w-4" />
											Browse Surveys
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Help Section */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
							<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
								<CardContent className="p-6 text-center">
									<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
										<Search className="h-6 w-6 text-primary" />
									</div>
									<h3 className="font-semibold text-foreground mb-2">
										Check the URL
									</h3>
									<p className="text-sm text-muted-foreground">
										Make sure you typed the correct address
										without typos.
									</p>
								</CardContent>
							</Card>

							<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
								<CardContent className="p-6 text-center">
									<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
										<Home className="h-6 w-6 text-primary" />
									</div>
									<h3 className="font-semibold text-foreground mb-2">
										Navigate Home
									</h3>
									<p className="text-sm text-muted-foreground">
										Return to the homepage and browse from
										there.
									</p>
								</CardContent>
							</Card>

							<Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
								<CardContent className="p-6 text-center">
									<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
										<Mail className="h-6 w-6 text-primary" />
									</div>
									<h3 className="font-semibold text-foreground mb-2">
										Get Help
									</h3>
									<p className="text-sm text-muted-foreground">
										Contact support if you believe this is
										an error.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
