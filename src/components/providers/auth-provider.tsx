// src/components/providers/auth-provider.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/core/store";
import { useRefreshTokenMutation } from "@/core/api/authApi";
import { LoadingSpinner } from "../ui/loading-spinner";
import { logout, setLoading } from "@/core/store/slices/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const dispatch = useDispatch();

	const { accessToken, refreshToken, isAuthenticated, loading } = useSelector(
		(state: RootState) => state.auth
	);

	const [isRehydrating, setIsRehydrating] = useState(true);
	const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
	const redirectedRef = useRef(false); // ← Prevent redirect loops

	const [refreshTokenMutation, { isLoading: refreshTokenLoading }] =
		useRefreshTokenMutation();

	// Handle initial authentication rehydration
	useEffect(() => {
		const rehydrateAuth = async () => {
			dispatch(setLoading(true));
			setIsRehydrating(true);

			try {
				if (typeof window !== "undefined") {
					const storedAuth = localStorage.getItem("auth");

					if (storedAuth) {
						try {
							const parsed = JSON.parse(storedAuth);

							// If we have tokens but no user profile, try to refresh
							if (
								parsed.accessToken &&
								parsed.refreshToken &&
								!parsed.user
							) {
								try {
									const result =
										await refreshTokenMutation().unwrap();
									// The baseQueryWithReauth should handle updating the access token
								} catch (refreshError) {
									console.error(
										"Token refresh failed during rehydration:",
										refreshError
									);
									dispatch(logout());
									localStorage.removeItem("auth");
								}
							}
						} catch (parseError) {
							console.error(
								"Failed to parse stored auth during rehydration:",
								parseError
							);
							dispatch(logout());
							localStorage.removeItem("auth");
						}
					}
				}
			} finally {
				setIsRehydrating(false);
				setHasCheckedAuth(true);
				dispatch(setLoading(false));
			}
		};

		if (!hasCheckedAuth) {
			rehydrateAuth();
		}
	}, [dispatch, hasCheckedAuth, refreshTokenMutation]);

	// Handle authentication redirects - with loop prevention
	useEffect(() => {
		if (
			isRehydrating ||
			loading ||
			refreshTokenLoading ||
			!hasCheckedAuth
		) {
			return;
		}

		const protectedRoutes = [
			"/dashboard",
			"/surveys",
			"/profile",
			"/create-survey",
		];
		const isProtectedRoute = protectedRoutes.some((route) =>
			pathname.startsWith(route)
		);
		const isAuthRoute = [
			"/login",
			"/register",
			"/verify-email",
			"/forgot-password",
			"/reset-password",
		].includes(pathname);
		const isPublicRoute = [
			"/public",
			"/verify-email",
			"/reset-password",
		].some((route) => pathname.startsWith(route));

		// Redirect unauthenticated users from protected routes
		if (!isAuthenticated && !isPublicRoute && isProtectedRoute) {
			// Only redirect once - prevent infinite loops
			if (!redirectedRef.current) {
				redirectedRef.current = true;
				const redirect =
					pathname !== "/login" ? pathname : "/dashboard";
				router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
			}
			return;
		}

		// Redirect authenticated users from auth routes to dashboard
		if (isAuthenticated && isAuthRoute) {
			// Only redirect once
			if (!redirectedRef.current) {
				redirectedRef.current = true;
				const redirect = searchParams.get("redirect") || "/dashboard";
				router.push(redirect);
			}
			return;
		}

		// Reset redirect flag when user is on appropriate page
		// (authenticated on protected/public routes, or unauthenticated on auth routes)
		if (
			(isAuthenticated && (isProtectedRoute || isPublicRoute)) ||
			(!isAuthenticated && (isAuthRoute || isPublicRoute))
		) {
			redirectedRef.current = false;
		}
	}, [
		isAuthenticated,
		isRehydrating,
		loading,
		refreshTokenLoading,
		hasCheckedAuth,
		pathname,
		router,
		dispatch,
		searchParams,
	]);

	// Show loading spinner while rehydrating or checking auth
	if (isRehydrating || loading || refreshTokenLoading || !hasCheckedAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return children;
}
