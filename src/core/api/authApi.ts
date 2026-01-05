// frontend/src/core/api/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { authBaseQuery } from "./baseQuery";


export interface User {
	id: string;
	username: string;
	email: string;
	first_name?: string;
	last_name?: string;
	is_email_verified: boolean;
	created_at: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
	user: User;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	password2: string;
	first_name?: string;
	last_name?: string;
}

export interface RegisterResponse {
	message: string;
	user: {
		id: string;
		username: string;
		email: string;
	};
}

export interface VerifyEmailRequest {
	token: string;
}

export interface ResendVerificationRequest {
	email: string;
}

export interface PasswordResetRequest {
	email: string;
}

export interface PasswordResetConfirmRequest {
	token: string;
	password: string;
	password2: string;
}

export interface ChangePasswordRequest {
	old_password: string;
	new_password: string;
	new_password2: string;
}

export interface DeleteAccountRequest {
	password: string;
}

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: authBaseQuery,
	tagTypes: ["User"],
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (credentials) => ({
				url: "/token/",
				method: "POST",
				body: credentials,
			}),
		}),
		refreshToken: builder.mutation<{ access: string }, void>({
			query: () => ({
				url: "/token/refresh/",
				method: "POST",
				body: {}, 
			}),
		}),
		register: builder.mutation<RegisterResponse, RegisterRequest>({
			query: (userData) => ({
				url: "/register/",
				method: "POST",
				body: userData,
			}),
		}),
		
		logout: builder.mutation<
			{ message: string },
			{ refresh_token: string }
		>({
			query: (body) => ({
				url: "/logout/",
				method: "POST",
				body,
			}),
		}),
		verifyEmail: builder.mutation<{ message: string }, VerifyEmailRequest>({
			query: (body) => ({
				url: "/verify-email/",
				method: "POST",
				body,
			}),
		}),
		resendVerification: builder.mutation<
			{ message: string },
			ResendVerificationRequest
		>({
			query: (body) => ({
				url: "/resend-verification/",
				method: "POST",
				body,
			}),
		}),
		passwordResetRequest: builder.mutation<
			{ message: string },
			PasswordResetRequest
		>({
			query: (body) => ({
				url: "/password-reset/",
				method: "POST",
				body,
			}),
		}),
		passwordResetConfirm: builder.mutation<
			{ message: string },
			PasswordResetConfirmRequest
		>({
			query: (body) => ({
				url: "/password-reset-confirm/",
				method: "POST",
				body,
			}),
		}),
		changePassword: builder.mutation<
			{ message: string },
			ChangePasswordRequest
		>({
			query: (body) => ({
				url: "/change-password/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["User"],
		}),
		getProfile: builder.query<User, void>({
			query: () => "/profile/",
			providesTags: ["User"],
			keepUnusedDataFor: 300,
		}),
		updateProfile: builder.mutation<User, Partial<User>>({
			query: (body) => ({
				url: "/profile/",
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["User"],
		}),
		deleteAccount: builder.mutation<
			{ message: string },
			DeleteAccountRequest
		>({
			query: (body) => ({
				url: "/delete-account/",
				method: "DELETE",
				body,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useRefreshTokenMutation,
	useLogoutMutation,
	useVerifyEmailMutation,
	useResendVerificationMutation,
	usePasswordResetRequestMutation,
	usePasswordResetConfirmMutation,
	useChangePasswordMutation,
	useGetProfileQuery,
	useUpdateProfileMutation,
	useDeleteAccountMutation,
} = authApi;
