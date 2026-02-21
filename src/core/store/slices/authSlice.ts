import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/core/api/authApi";
import { loadAuth, saveAuth, clearAuth } from "@/utils/storage";

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

// Empty/clean initial state
const cleanInitialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

// Load persisted auth state on boot, or use clean state
const initialState: AuthState = loadAuth() ?? cleanInitialState;

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
			const payload = {
				user: action.payload.user,
				accessToken: action.payload.accessToken,
				refreshToken: action.payload.refreshToken,
				isAuthenticated: true,
				loading: false,
				error: null,
			};
			Object.assign(state, payload);
			saveAuth(payload); // <- WRITE
		},

		updateAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
			saveAuth(state); // <- WRITE
		},

		updateUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			saveAuth(state); // <- WRITE
		},

		logout: (state) => {
			Object.assign(state, cleanInitialState);
			clearAuth(); // <- CLEAR
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
			saveAuth(state); // <- optional, keeps loading flag too
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
			saveAuth(state);
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
