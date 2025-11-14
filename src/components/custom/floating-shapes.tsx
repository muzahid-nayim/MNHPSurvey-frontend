"use client";

import { useEffect, useState } from "react";

export function FloatingShapes() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
			{/* Floating circles */}
			<div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/20 rounded-full animate-float"></div>
			<div
				className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400/20 rounded-full animate-float"
				style={{ animationDelay: "1s" }}
			></div>
			<div
				className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400/15 rounded-full animate-float"
				style={{ animationDelay: "2s" }}
			></div>
		</div>
	);
}
