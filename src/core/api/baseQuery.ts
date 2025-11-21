// frontend/src/core/api/baseQuery.ts
import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, updateAccessToken } from "../store/slices/authSlice";

/**
 * Base API URL from environment variable
 * Default: http://127.0.0.1:8000/api
 */
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL
	? `${process.env.NEXT_PUBLIC_API_URL}/api`
	: "http://127.0.0.1:8000/api";

/**
 * Auth API URL - for user authentication endpoints
 * Example: http://127.0.0.1:8000/api/users
 */
const AUTH_API_URL = `${BASE_API_URL}/users`;

/**
 * Survey API URL - for survey endpoints
 * Example: http://127.0.0.1:8000/api/surveys
 */
const SURVEY_API_URL = `${BASE_API_URL}/surveys`;

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
 * Create a base query with automatic token refresh
 * @param baseUrl - The base URL for the API (auth or survey)
 */
const createBaseQueryWithReauth = (
	baseUrl: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
	/**
	 * Raw base query – attaches Authorization header if access token exists
	 */
	const rawBaseQuery = fetchBaseQuery({
		baseUrl,
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
	return async (args, api, extraOptions) => {
		// 1. Original request
		let result = await rawBaseQuery(args, api, extraOptions);

		// 2. If 401 → try to refresh
		if (result.error?.status === 401) {
			const refreshToken = (api.getState() as RootState).auth
				.refreshToken;

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
					.then(() => {
						// Retry original request with new token
						return rawBaseQuery(args, api, extraOptions);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			isRefreshing = true;

			try {
				// 3. Call /token/refresh/ (always use AUTH_API_URL for token refresh)
				const refreshResult = await fetchBaseQuery({
					baseUrl: AUTH_API_URL,
				})(
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
						data: {
							message: "Session expired. Please login again.",
						},
					} as FetchBaseQueryError,
				};
			} finally {
				isRefreshing = false;
			}
		}

		return result;
	};
};

/**
 * Base query for Auth API (with token refresh)
 * Used by: authApi.ts
 */
export const authBaseQuery = createBaseQueryWithReauth(AUTH_API_URL);

/**
 * Base query for Survey API (with token refresh)
 * Used by: surveyApi.ts
 */
export const surveyBaseQuery = createBaseQueryWithReauth(SURVEY_API_URL);

/**
 * Generic base query (for backward compatibility)
 * Defaults to AUTH_API_URL
 */
export const baseQuery = authBaseQuery;

/**
 * Base query with reauth (for backward compatibility)
 * Same as authBaseQuery
 */
export const baseQueryWithReauth = authBaseQuery;
