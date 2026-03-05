// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Flip, ToastContainer } from "react-toastify";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://mnhp-survey.vercel.app"),
	title: {
		default: "MNHP Survey",
		template: "%s | MNHP Survey", 
	},
	description: "Simple, powerful surveys for modern teams.",
	openGraph: {
		siteName: "MNHP Survey",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ReduxProvider>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="colored"
						transition={Flip}
					/>
					<ThemeProvider>
						<AuthProvider>{children}</AuthProvider>
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
