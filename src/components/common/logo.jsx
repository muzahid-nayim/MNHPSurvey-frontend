// components/Logo.jsx
import Link from "next/link";

const Logo = ({ showText = true, className = "" }) => {
	return (
		<Link href="/" className={`flex items-center justify-center gap-3 group ${className}`}>
			{/* Icon container with subtle background */}
			<div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-8 h-8"
				>
					{/* Bar chart background (light) */}
					<rect
						x="8"
						y="14"
						width="4"
						height="12"
						fill="var(--primary)"
						opacity="0.3"
						rx="1"
					/>
					<rect
						x="14"
						y="8"
						width="4"
						height="18"
						fill="var(--primary)"
						opacity="0.6"
						rx="1"
					/>
					<rect
						x="20"
						y="4"
						width="4"
						height="22"
						fill="var(--primary)"
						rx="1"
					/>

					{/* Checkmark overlay */}
					<path
						d="M26 10 L14 22 L8 16"
						stroke="var(--primary)"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					/>
				</svg>
			</div>

			{/* Text */}
			{showText && (
				<span className="font-bold text-xl tracking-tight sm:inline-block text-foreground">
					MNHP <span style={{ color: "var(--primary)" }}>Survey</span>
				</span>
			)}
			{/* <span className="font-bold text-xl tracking-tight sm:hidden text-foreground">
				MNHP
			</span> */}
		</Link>
	);
};

export default Logo;
