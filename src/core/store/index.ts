// frontend/src/core/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "@/core/store/slices/authSlice";
import { authApi } from "../api/authApi";
import { surveyApi } from '../api/surveyApi';
import surveyReducer from './slices/surveySlice';


export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[surveyApi.reducerPath]: surveyApi.reducer,
		auth: authReducer,
		survey: surveyReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					"auth/setCredentials",
					"auth/updateAccessToken",
				],
				ignoredPaths: ["auth.user"],
			},
		}).concat(authApi.middleware, surveyApi.middleware),
	devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
