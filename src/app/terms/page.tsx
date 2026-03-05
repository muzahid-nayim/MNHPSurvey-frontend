// app/terms/page.tsx
import Link from "next/link";
import { FileText, Shield, Users, BarChart2, Lock, AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const lastUpdated = "March 4, 2026";

const sections = [
	{
		icon: FileText,
		title: "1. Acceptance of Terms",
		content: `By accessing or using MNHP Survey ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service. These terms apply to all users including survey creators and respondents.`,
	},
	{
		icon: Users,
		title: "2. User Accounts",
		content: `You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. MNHP Survey reserves the right to suspend or terminate accounts that violate these terms.`,
	},
	{
		icon: BarChart2,
		title: "3. Survey Types & Access",
		content: `MNHP Survey supports three types of surveys:\n\n• Public Anonymous — Anyone can respond without logging in. Responses are tracked by IP address to prevent duplicates.\n\n• Public Authenticated — Only logged-in users can respond. Identity is verified through their account.\n\n• Private Invited — Only users whose email addresses have been explicitly added by the survey creator can access and respond.`,
	},
	{
		icon: Shield,
		title: "4. Acceptable Use",
		content: `You agree not to use MNHP Survey to create surveys that are unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. You may not use the Service to collect sensitive personal data without proper disclosure to respondents. Surveys that violate applicable laws or third-party rights will be removed.`,
	},
	{
		icon: Lock,
		title: "5. Data & Privacy",
		content: `We collect and store data necessary to operate the Service including account information, survey content, and response data. Response data is owned by the survey creator. We do not sell personal data to third parties. Anonymous surveys collect IP addresses solely to prevent duplicate submissions. Please refer to our Privacy Policy for full details on data handling.`,
	},
	{
		icon: BarChart2,
		title: "6. Survey Responses",
		content: `Each user may submit only one response per survey unless the survey creator explicitly enables multiple responses. Attempting to bypass this restriction through VPNs, multiple accounts, or other means is prohibited. Submitted responses cannot be edited or deleted by the respondent after submission.`,
	},
	{
		icon: FileText,
		title: "7. Intellectual Property",
		content: `You retain ownership of all survey content and data you create. By using the Service, you grant MNHP Survey a limited license to store and process your content solely to provide the Service. You may not reproduce, distribute, or create derivative works from any part of the MNHP Survey platform without written permission.`,
	},
	{
		icon: AlertTriangle,
		title: "8. Disclaimers & Limitation of Liability",
		content: `MNHP Survey is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. To the maximum extent permitted by law, MNHP Survey shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.`,
	},
	{
		icon: FileText,
		title: "9. Modifications to Terms",
		content: `We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will make reasonable efforts to notify users of significant changes via email or in-app notification.`,
	},
	{
		icon: Mail,
		title: "10. Contact",
		content: `If you have questions about these Terms, please contact us at support@mnhpsurvey.com.`,
	},
];

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero */}
			<div className="border-b border-border/50 bg-muted/20">
				<div className="container mx-auto px-4 py-16 max-w-4xl text-center">
					<div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
						<FileText className="h-4 w-4" />
						Legal Document
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Terms & Conditions
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Please read these terms carefully before using MNHP Survey. They govern your use of our platform as a survey creator or respondent.
					</p>
					<p className="text-sm text-muted-foreground mt-6">
						Last updated: <span className="font-medium text-foreground">{lastUpdated}</span>
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-12 max-w-4xl">
				<div className="space-y-6">
					{sections.map((section, index) => {
						const Icon = section.icon;
						return (
							<Card key={index} className="border border-border/50">
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
											<Icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h2 className="text-lg font-semibold text-foreground mb-3">
												{section.title}
											</h2>
											<div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
												{section.content}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Footer note */}
				<div className="mt-12 p-6 rounded-xl bg-muted/30 border border-border/50 text-center">
					<p className="text-sm text-muted-foreground">
						By using MNHP Survey, you acknowledge that you have read and understood these Terms and Conditions.
					</p>
					{/* <div className="flex justify-center gap-6 mt-4 text-sm">
						<Link href="/terms" className="text-primary hover:underline">
							Privacy Policy
						</Link>
						<Link href="/cookies" className="text-primary hover:underline">
							Cookie Policy
						</Link>
						<Link href="/contact" className="text-primary hover:underline">
							Contact Us
						</Link>
					</div> */}
				</div>
			</div>
		</div>
	);
}