// frontend/src/components/common/Footer.tsx
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-card border-t border-border">
			<div className="container mx-auto px-4 py-8 md:py-12">
				{/* Main row: brand + links */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					{/* Brand */}
					<div className="text-center md:text-left">
						<Link href="/" className="inline-block mb-2">
							<span className="font-bold text-2xl tracking-tight text-foreground">
								MNHP{" "}
								<span className="text-primary">Survey</span>
							</span>
						</Link>
						<p className="text-sm text-muted-foreground max-w-sm">
							Simple, powerful surveys for modern teams.
						</p>
					</div>

					{/* Links */}
					<div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
						<Link
							href="/features"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Features
						</Link>
						{/* <Link
							href="/pricing"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Pricing
						</Link> */}
						<Link
							href="/about"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							About
						</Link>
						{/* <Link
							href="/blog"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Blog
						</Link> */}
						<Link
							href="/contact"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Contact
						</Link>
					</div>

					{/* Social icons */}
					<div className="flex space-x-4">
						<a
							href="https://www.facebook.com/Muzahid.Nayim"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Facebook className="h-5 w-5" />
							<span className="sr-only">Facebook</span>
						</a>
						{/* <a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Twitter className="h-5 w-5" />
							<span className="sr-only">Twitter</span>
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Linkedin className="h-5 w-5" />
							<span className="sr-only">LinkedIn</span>
						</a> */}
						<a
							href="https://github.com/muzahid-nayim"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Github className="h-5 w-5" />
							<span className="sr-only">GitHub</span>
						</a>
					</div>
				</div>

				{/* Bottom bar with copyright and legal links */}
				<div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground">
					<p>
						© {new Date().getFullYear()} <Link className="underline text-primary" href={"https://github.com/muzahid-nayim"} >Muzahidul Islam</Link>. Built as a portfolio project.
					</p>
					<div className="flex gap-4 mt-2 sm:mt-0">
						<Link
							href="/terms"
							className="hover:text-primary transition-colors"
						>
							Terms
						</Link>
						<Link
							href="/terms"
							className="hover:text-primary transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/cookies"
							className="hover:text-primary transition-colors"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
