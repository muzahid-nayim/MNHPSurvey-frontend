// frontend/src/core/theme-config.ts
export const themeConfig = {
	colors: {
		primary: "oklch(0.21 0.034 264.665)",
		primaryDark: "oklch(0.928 0.006 264.531)",
		accent: "oklch(0.646 0.222 41.116)",
		background: "oklch(1 0 0)",
		backgroundDark: "oklch(0.13 0.028 261.692)",
	},

	// Theme names for the toggle
	themes: {
		light: "light",
		dark: "dark",
		system: "system",
	},
} as const;

export type Theme = keyof typeof themeConfig.themes;
