// src/app/providers.tsx
"use client";

import { store } from "@/core/store";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="min-h-screen" />;
	}

	return <Provider store={store}>{children}</Provider>;
}
