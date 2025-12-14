// components/common/theme-toggle.tsx
"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
	const { setTheme, theme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Wait for component to mount to avoid hydration mismatch
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className="h-9 w-9">
				<Sun className="h-4 w-4" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	// Determine which icon to show based on current theme
	const getCurrentIcon = () => {
		if (theme === "system") {
			return <Monitor className="h-4 w-4" />;
		}
		if (resolvedTheme === "dark") {
			return <Moon className="h-4 w-4" />;
		}
		return <Sun className="h-4 w-4" />;
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					{getCurrentIcon()}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="z-[60]">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className={`flex items-center gap-2 cursor-pointer ${theme === "light" ? "bg-accent" : ""}`}
				>
					<Sun className="h-4 w-4" />
					<span>Light</span>
					{theme === "light" && <span className="ml-auto text-xs">✓</span>}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className={`flex items-center gap-2 cursor-pointer ${theme === "dark" ? "bg-accent" : ""}`}
				>
					<Moon className="h-4 w-4" />
					<span>Dark</span>
					{theme === "dark" && <span className="ml-auto text-xs">✓</span>}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className={`flex items-center gap-2 cursor-pointer ${theme === "system" ? "bg-accent" : ""}`}
				>
					<Monitor className="h-4 w-4" />
					<span>System</span>
					{theme === "system" && <span className="ml-auto text-xs">✓</span>}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}