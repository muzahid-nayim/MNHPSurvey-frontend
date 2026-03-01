"use client";

export function FloatingShapes() {
	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

			{/* ── Checkmark / tick icon ── */}
			<svg
				className="absolute top-[8%] left-[6%] w-10 h-10 text-primary/20"
				style={{ animation: "floatA 7s ease-in-out infinite" }}
				viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
			>
				<polyline points="20 6 9 17 4 12" />
			</svg>

			{/* ── Radio button circle ── */}
			<svg
				className="absolute top-[15%] right-[8%] w-12 h-12 text-accent/25"
				style={{ animation: "floatB 9s ease-in-out infinite" }}
				viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
			>
				<circle cx="12" cy="12" r="9" />
				<circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.5" />
			</svg>

			{/* ── Bar chart (responses) ── */}
			<svg
				className="absolute top-[55%] left-[4%] w-12 h-12 text-primary/20"
				style={{ animation: "floatA 8s ease-in-out infinite 1s" }}
				viewBox="0 0 24 24" fill="currentColor"
			>
				<rect x="3" y="12" width="4" height="9" rx="1" />
				<rect x="10" y="7" width="4" height="14" rx="1" />
				<rect x="17" y="3" width="4" height="18" rx="1" />
			</svg>

			{/* ── Clipboard / form ── */}
			<svg
				className="absolute bottom-[12%] right-[6%] w-11 h-11 text-primary/15"
				style={{ animation: "floatB 10s ease-in-out infinite 0.5s" }}
				viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
			>
				<path d="M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1z" />
				<rect x="4" y="4" width="16" height="18" rx="2" />
				<line x1="8" y1="10" x2="16" y2="10" />
				<line x1="8" y1="14" x2="16" y2="14" />
				<line x1="8" y1="18" x2="12" y2="18" />
			</svg>

			{/* ── Checkbox square ── */}
			<svg
				className="absolute bottom-[30%] left-[10%] w-8 h-8 text-accent/20"
				style={{ animation: "floatA 6s ease-in-out infinite 2s" }}
				viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
			>
				<rect x="3" y="3" width="18" height="18" rx="3" />
				<polyline points="7 12 10 15 17 9" />
			</svg>

			{/* ── Pie chart ── */}
			<svg
				className="absolute top-[35%] right-[5%] w-10 h-10 text-primary/20"
				style={{ animation: "floatB 11s ease-in-out infinite 1.5s" }}
				viewBox="0 0 24 24" fill="currentColor"
			>
				<path d="M12 2a10 10 0 0 1 10 10H12V2z" opacity="0.6" />
				<path d="M12 12h10a10 10 0 1 1-10-10v10z" opacity="0.3" />
			</svg>

			{/* ── Small dots (decorative) ── */}
			<div
				className="absolute top-[45%] left-[20%] w-2 h-2 rounded-full bg-primary/25"
				style={{ animation: "floatA 5s ease-in-out infinite 0.8s" }}
			/>
			<div
				className="absolute top-[70%] right-[18%] w-3 h-3 rounded-full bg-accent/20"
				style={{ animation: "floatB 7s ease-in-out infinite 1.2s" }}
			/>
			<div
				className="absolute top-[20%] left-[40%] w-2 h-2 rounded-full bg-primary/20"
				style={{ animation: "floatA 9s ease-in-out infinite 3s" }}
			/>

			{/* ── Send / submit arrow ── */}
			<svg
				className="absolute bottom-[18%] left-[30%] w-9 h-9 text-primary/15"
				style={{ animation: "floatB 8s ease-in-out infinite 2.5s" }}
				viewBox="0 0 24 24" fill="currentColor"
			>
				<path d="M2 12L22 2L12 22L10 13L2 12Z" />
			</svg>

			<style jsx>{`
				@keyframes floatA {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					33%       { transform: translateY(-18px) rotate(4deg); }
					66%       { transform: translateY(-8px) rotate(-3deg); }
				}
				@keyframes floatB {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					40%       { transform: translateY(-22px) rotate(-5deg); }
					70%       { transform: translateY(-10px) rotate(3deg); }
				}
			`}</style>
		</div>
	);
}