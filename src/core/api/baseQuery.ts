// src/lib/api/baseQueryWithReauth.ts
import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, updateAccessToken } from "../store/slices/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
	? `${process.env.NEXT_PUBLIC_API_URL}/api/users`
	: "/api/users";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

/**
 * Raw base query – attaches Authorization header if access token exists
 */
const rawBaseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.accessToken;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

/**
 * Wrapper that intercepts 401 → refresh → retry
 */
export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	// 1. Original request
	let result = await rawBaseQuery(args, api, extraOptions);

	// 2. If 401 → try to refresh
	if (result.error?.status === 401) {
		const refreshToken = (api.getState() as RootState).auth.refreshToken;

		if (!refreshToken) {
			// No refresh token → force logout
			api.dispatch(logout());
			return result;
		}

		if (isRefreshing) {
			// If already refreshing, queue this request
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			})
				.then((token) => {
					// Retry original request with new token
					return rawBaseQuery(args, api, extraOptions);
				})
				.catch((err) => {
					return Promise.reject(err);
				});
		}

		isRefreshing = true;

		try {
			// 3. Call /token/refresh/
			const refreshResult = await rawBaseQuery(
				{
					url: "/token/refresh/",
					method: "POST",
					body: { refresh: refreshToken },
				},
				api,
				extraOptions
			);

			if (refreshResult.data) {
				const { access } = refreshResult.data as { access: string };
				// Update access token in Redux
				api.dispatch(updateAccessToken(access));

				// Process queue with new token
				processQueue(null, access);

				// 4. Retry original request with new access token
				result = await rawBaseQuery(args, api, extraOptions);
			} else {
				// Refresh failed → logout
				processQueue(refreshResult.error, null);
				api.dispatch(logout());
				return refreshResult;
			}
		} catch (err) {
			processQueue(err, null);
			api.dispatch(logout());
			return {
				error: {
					status: 401,
					data: { message: "Session expired. Please login again." },
				} as FetchBaseQueryError,
			};
		} finally {
			isRefreshing = false;
		}
	}

	return result;
};
