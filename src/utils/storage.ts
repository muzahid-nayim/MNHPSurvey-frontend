// utils/storage.ts
const KEY = "auth";

export const loadAuth = () => {
	if (typeof window === "undefined") return null;
	try {
		return JSON.parse(localStorage.getItem(KEY) || "");
	} catch {
		return null;
	}
};

export const saveAuth = (data: unknown) => {
	if (typeof window === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(data));
};

export const clearAuth = () => {
	if (typeof window === "undefined") return;
	localStorage.removeItem(KEY);
};
