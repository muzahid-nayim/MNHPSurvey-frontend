// src/app/auth/verify-email-sent/page.tsx
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Home, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailSentPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "your email";

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted p-4">
			<Card className="w-full max-w-md shadow-lg border">
				<CardHeader className="text-center space-y-2">
					<div className="flex justify-center mb-2">
						<div className="rounded-full bg-primary/10 p-4">
							<Mail className="h-10 w-10 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl">Check Your Email</CardTitle>
					<CardDescription>
						We&apos;ve sent a verification link to{" "}
						<span className="font-medium text-foreground">
							{email}
						</span>
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="text-sm text-muted-foreground space-y-2">
						<p>To complete your registration:</p>
						<ol className="list-decimal list-inside space-y-1 ml-2">
							<li>Open the email we sent you</li>
							<li>Click the verification link</li>
							<li>Return here to log in</li>
						</ol>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col space-y-3">
					<Link href="/login" className="w-full">
						<Button className="w-full gap-2">
							<LogIn className="h-4 w-4" />
							Go to Login
						</Button>
					</Link>

					<Link href="/" className="w-full">
						<Button variant="outline" className="w-full gap-2">
							<Home className="h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
