// frontend/src/core/store/slices/authSlice.ts
import { User } from "@/core/api/authApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "../api/authApi";

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

// Load from session storage on client side only
if (typeof window !== "undefined") {
	try {
		const storedAuth = localStorage.getItem("auth");
		if (storedAuth) {
			const parsed = JSON.parse(storedAuth);
			Object.assign(initialState, parsed);

			// Verify the tokens are still valid by checking if they exist
			if (!parsed.accessToken || !parsed.refreshToken) {
				localStorage.removeItem("auth");
			}
		}
	} catch (e) {
		console.error("Failed to parse stored auth:", e);
		localStorage.removeItem("auth");
	}
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{
				user: User;
				accessToken: string;
				refreshToken: string;
			}>
		) => {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;

			// Save to session storage immediately
			if (typeof window !== "undefined") {
				localStorage.setItem(
					"auth",
					JSON.stringify({
						user: action.payload.user,
						accessToken: action.payload.accessToken,
						refreshToken: action.payload.refreshToken,
						isAuthenticated: true,
						loading: false,
						error: null,
					})
				);
			}
		},
		updateAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;

			// Update session storage
			if (typeof window !== "undefined" && state.isAuthenticated) {
				const storedAuth = localStorage.getItem("auth");
				if (storedAuth) {
					try {
						const parsed = JSON.parse(storedAuth);
						parsed.accessToken = action.payload;
						localStorage.setItem("auth", JSON.stringify(parsed));
					} catch (e) {
						console.error(
							"Failed to update access token in storage:",
							e
						);
					}
				}
			}
		},
		updateUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;

			// Update session storage
			if (typeof window !== "undefined" && state.isAuthenticated) {
				const storedAuth = localStorage.getItem("auth");
				if (storedAuth) {
					try {
						const parsed = JSON.parse(storedAuth);
						parsed.user = action.payload;
						localStorage.setItem("auth", JSON.stringify(parsed));
					} catch (e) {
						console.error("Failed to update user in storage:", e);
					}
				}
			}
		},
		logout: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;

			// Clear from session storage
			if (typeof window !== "undefined") {
				localStorage.removeItem("auth");
			}
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	setCredentials,
	updateAccessToken,
	updateUser,
	logout,
	setLoading,
	setError,
} = authSlice.actions;
export default authSlice.reducer;
