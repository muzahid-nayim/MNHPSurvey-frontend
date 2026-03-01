"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => setMounted(true), []);

	if (!mounted)
		return (
			<div className="h-10 w-[120px] rounded-full border border-border bg-muted animate-pulse" />
		);

	return (
		<ToggleGroup
			type="single"
			value={theme}
			onValueChange={(val) => val && setTheme(val)}
			// Removed p-1, kept rounded-full, added overflow-hidden to contain circles (optional)
			className="flex items-center h-8 rounded-full border border-border bg-muted gap-0 overflow-hidden"
		>
			<ToggleGroupItem
				value="light"
				className="
		  w-7 h-7 p-0 flex items-center justify-center
		  data-[state=on]:bg-background data-[state=on]:shadow-md
		  data-[state=on]:text-amber-400
		  text-muted-foreground hover:text-amber-400
		  transition-all duration-200 data-[state=on]:rounded-full
		"
			>
				<Sun
					className="w-3.5 h-3.5 transition-all duration-200"
					style={{
						filter:
							theme === "light"
								? "drop-shadow(0 0 6px rgba(251,191,36,0.9))"
								: "none",
					}}
				/>
				<span className="sr-only">Light</span>
			</ToggleGroupItem>

			<ToggleGroupItem
				value="system"
				className="
		  w-7 h-7 p-0 flex items-center justify-center
		  data-[state=on]:bg-background data-[state=on]:shadow-md
		  data-[state=on]:text-blue-400
		  text-muted-foreground hover:text-blue-400
		  transition-all duration-200 data-[state=on]:rounded-full
		"
			>
				<Monitor
					className="w-3.5 h-3.5 transition-all duration-200"
					style={{
						filter:
							theme === "system"
								? "drop-shadow(0 0 6px rgba(96,165,250,0.9))"
								: "none",
					}}
				/>
				<span className="sr-only">System</span>
			</ToggleGroupItem>

			<ToggleGroupItem
				value="dark"
				className="
		  w-7 h-7 p-0 flex items-center justify-center
		  data-[state=on]:bg-background data-[state=on]:shadow-md
		  data-[state=on]:text-violet-400
		  text-muted-foreground hover:text-violet-400
		  transition-all duration-200 data-[state=on]:rounded-full
		"
			>
				<Moon
					className="w-3.5 h-3.5 transition-all duration-200"
					style={{
						filter:
							theme === "dark"
								? "drop-shadow(0 0 6px rgba(167,139,250,0.9))"
								: "none",
					}}
				/>
				<span className="sr-only">Dark</span>
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
