"use client";

import { useEffect, useRef } from "react";

export function FloatingShapes() {
	// Refs for the follower DOM elements
	const follower1Ref = useRef<HTMLDivElement>(null);
	const follower2Ref = useRef<HTMLDivElement>(null);
	const follower3Ref = useRef<HTMLDivElement>(null);

	// Ref for current mouse position (updated by mousemove, doesn't trigger re-renders)
	const mousePosRef = useRef({ x: 0, y: 0 });

	// Animation frame request ID
	const requestRef = useRef<number>(0);

	useEffect(() => {
		// Update mouse position ref on move
		const handleMouseMove = (e: MouseEvent) => {
			mousePosRef.current = { x: e.clientX, y: e.clientY };
		};
		window.addEventListener("mousemove", handleMouseMove);

		// Followers' current positions (we'll animate these)
		const pos1 = { x: 0, y: 0 };
		const pos2 = { x: 0, y: 0 };
		const pos3 = { x: 0, y: 0 };

		// Animation loop
		const updateFollowers = () => {
			const target = mousePosRef.current;

			// Smoothly move each follower toward target with different speeds
			pos1.x += (target.x - pos1.x) * 0.03;
			pos1.y += (target.y - pos1.y) * 0.03;
			pos2.x += (target.x - pos2.x) * 0.02;
			pos2.y += (target.y - pos2.y) * 0.02;
			pos3.x += (target.x - pos3.x) * 0.01;
			pos3.y += (target.y - pos3.y) * 0.01;

			// Apply transforms directly to DOM elements
			if (follower1Ref.current) {
				follower1Ref.current.style.transform = `translate(${pos1.x}px, ${pos1.y}px) translate(-50%, -50%)`;
			}
			if (follower2Ref.current) {
				follower2Ref.current.style.transform = `translate(${pos2.x}px, ${pos2.y}px) translate(-50%, -50%)`;
			}
			if (follower3Ref.current) {
				follower3Ref.current.style.transform = `translate(${pos3.x}px, ${pos3.y}px) translate(-50%, -50%)`;
			}

			requestRef.current = requestAnimationFrame(updateFollowers);
		};

		requestRef.current = requestAnimationFrame(updateFollowers);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (requestRef.current) cancelAnimationFrame(requestRef.current);
		};
	}, []); // Empty dependency array – runs once on mount

	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
			{/* Background floating circles (unchanged) */}
			<div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-float" />
			<div
				className="absolute top-1/3 right-1/4 w-6 h-6 bg-primary/30 rounded-full animate-float"
				style={{ animationDelay: "1s" }}
			/>
			<div
				className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/30 rounded-full animate-float"
				style={{ animationDelay: "2s" }}
			/>
			<div
				className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-accent/30 rounded-full animate-float"
				style={{ animationDelay: "1.5s" }}
			/>
			<div
				className="absolute top-2/3 left-1/5 w-4 h-4 bg-accent/30 rounded-full animate-float"
				style={{ animationDelay: "0.5s" }}
			/>

			{/* Mouse followers – now with refs for direct DOM updates */}
			<div
				ref={follower1Ref}
				className="absolute w-3 h-3 bg-primary/50 rounded-full"
				style={{ transform: "translate(-50%, -50%)" }} // initial position at (0,0) relative to top-left
			/>
			<div
				ref={follower2Ref}
				className="absolute w-4 h-4 bg-destructive/40 rounded-full"
				style={{ transform: "translate(-50%, -50%)" }}
			/>
			<div
				ref={follower3Ref}
				className="absolute w-2 h-2 bg-primary/60 rounded-full"
				style={{ transform: "translate(-50%, -50%)" }}
			/>

			{/* Float animation */}
			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) translateX(-10px);
					}
					50% {
						transform: translateY(-30px) translateX(10px);
					}
				}
				.animate-float {
					animation: float 6s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}
