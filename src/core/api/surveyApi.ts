// src/core/api/surveyApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { surveyBaseQuery } from "./baseQuery";
import type {
	Survey,
	SurveyListItem,
	CreateSurveyRequest,
	Question,
	CreateQuestionRequest,
	QuestionOption,
	AllowedEmail,
	SurveyResponse,
	SubmitSurveyRequest,
	AggregatedSurveyResponse,
	QuestionResponsesData,
} from "@/types";

/**
 * Survey API
 * Handles all survey-related API calls using RTK Query
 */
export const surveyApi = createApi({
	reducerPath: "surveyApi",
	baseQuery: surveyBaseQuery,
	tagTypes: ["Survey", "Question", "Response"],
	endpoints: (builder) => ({
		// ==========================================
		// SURVEY ENDPOINTS
		// ==========================================

		/**
		 * Get all surveys created by logged-in user
		 */
		getSurveys: builder.query<SurveyListItem[], void>({
			query: () => "/",
			providesTags: ["Survey"],
		}),

		/**
		 * Get single survey with full details
		 */
		getSurvey: builder.query<Survey, string>({
			query: (id) => `/${id}/`,
			providesTags: ["Survey", "Question"],
		}),

		/**
		 * Create new survey
		 */
		createSurvey: builder.mutation<Survey, CreateSurveyRequest>({
			query: (data) => ({
				url: "/",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Survey"],
		}),

		/**
		 * Update survey
		 */
		updateSurvey: builder.mutation<
			Survey,
			{ id: string; data: Partial<CreateSurveyRequest> }
		>({
			query: ({ id, data }) => ({
				url: `/${id}/`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["Survey"],
		}),

		/**
		 * Delete survey
		 */
		deleteSurvey: builder.mutation<void, string>({
			query: (id) => ({
				url: `/${id}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Survey"],
		}),

		/**
		 * Update survey status (draft/active/closed)
		 */
		updateSurveyStatus: builder.mutation<
			{ message: string; status: string },
			{ id: string; status: string }
		>({
			query: ({ id, status }) => ({
				url: `/${id}/status/`,
				method: "POST",
				body: { status },
			}),
			invalidatesTags: ["Survey"],
		}),

		// ==========================================
		// QUESTION ENDPOINTS
		// ==========================================

		/**
		 * Get all questions in a survey
		 */
		getQuestions: builder.query<Question[], string>({
			query: (surveyId) => `/${surveyId}/questions/list/`,
			providesTags: ["Question"],
		}),

		/**
		 * Add question to survey
		 */
		createQuestion: builder.mutation<
			Question,
			{ surveyId: string; data: CreateQuestionRequest }
		>({
			query: ({ surveyId, data }) => ({
				url: `/${surveyId}/questions/`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Question", "Survey"],
		}),

		/**
		 * Update question
		 */
		updateQuestion: builder.mutation<
			Question,
			{
				surveyId: string;
				questionId: string;
				data: Partial<CreateQuestionRequest>;
			}
		>({
			query: ({ surveyId, questionId, data }) => ({
				url: `/${surveyId}/questions/${questionId}/`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["Question"],
		}),

		/**
		 * Delete question
		 */
		deleteQuestion: builder.mutation<
			void,
			{ surveyId: string; questionId: string }
		>({
			query: ({ surveyId, questionId }) => ({
				url: `/${surveyId}/questions/${questionId}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Question", "Survey"],
		}),

		// ==========================================
		// OPTION ENDPOINTS
		// ==========================================

		/**
		 * Add option to question
		 */
		createOption: builder.mutation<
			QuestionOption,
			{
				surveyId: string;
				questionId: string;
				data: { option_text: string; order: number };
			}
		>({
			query: ({ surveyId, questionId, data }) => ({
				url: `/${surveyId}/questions/${questionId}/options/`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Question"],
		}),

		/**
		 * Update option
		 */
		updateOption: builder.mutation<
			QuestionOption,
			{
				surveyId: string;
				questionId: string;
				optionId: string;
				data: { option_text: string };
			}
		>({
			query: ({ surveyId, questionId, optionId, data }) => ({
				url: `/${surveyId}/questions/${questionId}/options/${optionId}/`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["Question"],
		}),

		/**
		 * Delete option
		 */
		deleteOption: builder.mutation<
			void,
			{ surveyId: string; questionId: string; optionId: string }
		>({
			query: ({ surveyId, questionId, optionId }) => ({
				url: `/${surveyId}/questions/${questionId}/options/${optionId}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Question"],
		}),

		// ==========================================
		// ALLOWED EMAILS ENDPOINTS
		// ==========================================

		/**
		 * Get all allowed emails for current user
		 */
		getAllowedEmails: builder.query<AllowedEmail[], void>({
			query: () => "/allowed-emails/",
			providesTags: ["Survey"],
		}),

		/**
		 * Create new allowed email
		 */
		createAllowedEmail: builder.mutation<AllowedEmail, { email: string }>({
			query: (data) => ({
				url: "/allowed-emails/",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Survey"],
		}),

		/**
		 * Delete allowed email
		 */
		deleteAllowedEmail: builder.mutation<void, string>({
			query: (id) => ({
				url: `/allowed-emails/${id}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Survey"],
		}),

		/**
		 * Get allowed emails for a survey
		 */
		getSurveyAllowedEmails: builder.query<AllowedEmail[], string>({
			query: (surveyId) => `/${surveyId}/allowed-emails/`,
		}),

		/**
		 * Add allowed emails to survey
		 */
		addSurveyAllowedEmails: builder.mutation<
			{ message: string; allowed_emails: AllowedEmail[] },
			{ surveyId: string; allowed_email_ids: string[] }
		>({
			query: ({ surveyId, allowed_email_ids }) => ({
				url: `/${surveyId}/allowed-emails/`,
				method: "POST",
				body: { allowed_email_ids },
			}),
		}),

		/**
		 * Remove allowed email from survey
		 */
		removeSurveyAllowedEmail: builder.mutation<
			{ message: string },
			{ surveyId: string; allowed_email_id: string }
		>({
			query: ({ surveyId, allowed_email_id }) => ({
				url: `/${surveyId}/allowed-emails/`,
				method: "DELETE",
				body: { allowed_email_id },
			}),
		}),

		// ==========================================
		// RESPONSE ENDPOINTS
		// ==========================================

		/**
		 * Get all responses for survey (aggregated statistics)
		 */
		getResponses: builder.query<AggregatedSurveyResponse, string>({
			query: (surveyId) => `/${surveyId}/responses/`,
			providesTags: ["Response"],
		}),

		/**
		 * Get single response detail
		 */
		getResponse: builder.query<
			SurveyResponse,
			{ surveyId: string; responseId: string }
		>({
			query: ({ surveyId, responseId }) =>
				`/${surveyId}/responses/${responseId}/`,
		}),

		/**
		 * Get responses for specific question (for data table)
		 */
		getResponsesByQuestion: builder.query<
			QuestionResponsesData,
			{ surveyId: string; questionId: string }
		>({
			query: ({ surveyId, questionId }) =>
				`/${surveyId}/responses/detail/?question_id=${questionId}`,
			providesTags: ["Response"],
		}),

		/**
		 * Export survey responses as CSV or PDF.
		 * Uses queryFn so the Blob never enters Redux state (keeps it serializable).
		 */
		exportResponses: builder.mutation<
			{ success: true },
			{
				surveyId: string;
				format: "csv" | "pdf";
				filename: string;
				rowLimit?: number | null;
				includeSummary?: boolean;
				includeResponses?: boolean;
				chartStyle?: "none" | "bar" | "pie" | "both";
			}
		>({
			async queryFn(args, _api, _extraOptions, baseQuery) {
				const {
					surveyId,
					format,
					filename,
					rowLimit,
					includeSummary = true,
					includeResponses = true,
					chartStyle = "bar",
				} = args;

				const asError = (
					status: number,
					data: unknown,
				): { error: FetchBaseQueryError } => ({
					error: { status, data },
				});

				// build query string by hand — easier to read than nesting params
				const params = new URLSearchParams();
				params.set("export_format", format);
				params.set("include_summary", String(includeSummary));
				params.set("include_responses", String(includeResponses));
				params.set("chart_style", chartStyle);
				if (rowLimit != null && rowLimit > 0) {
					params.set("row_limit", String(rowLimit));
				}

				const result = await baseQuery({
					url: `/${surveyId}/responses/export/?${params.toString()}`,
					responseHandler: async (response) => {
						if (!response.ok) {
							const contentType =
								response.headers.get("content-type") || "";
							if (contentType.includes("application/json")) {
								return {
									ok: false as const,
									status: response.status,
									error: await response.json(),
								};
							}
							const text = await response.text();
							return {
								ok: false as const,
								status: response.status,
								error: {
									message:
										text.slice(0, 200) ||
										`Export failed (${response.status})`,
								},
							};
						}

						return {
							ok: true as const,
							blob: await response.blob(),
						};
					},
				});

				if (result.error) {
					const status =
						typeof result.error.status === "number"
							? result.error.status
							: 500;
					const data = result.error.data as
						| Blob
						| {
								ok?: false;
								status?: number;
								error?: unknown;
						  }
						| undefined;

					if (data instanceof Blob) {
						return asError(status, { message: "Export failed" });
					}

					if (
						data &&
						typeof data === "object" &&
						data.ok === false
					) {
						return asError(
							data.status ?? status,
							data.error ?? { message: "Export failed" },
						);
					}

					return asError(
						status,
						data ?? { message: "Export failed" },
					);
				}

				const payload = result.data as
					| { ok: true; blob: Blob }
					| {
							ok: false;
							status: number;
							error: unknown;
					  };

				if (!payload.ok) {
					return asError(
						payload.status,
						payload.error ?? { message: "Export failed" },
					);
				}

				const url = window.URL.createObjectURL(payload.blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				link.remove();
				window.URL.revokeObjectURL(url);

				return { data: { success: true as const } };
			},
		}),

		// ==========================================
		// PUBLIC ENDPOINTS (No auth required)
		// ==========================================

		/**
		 * Get survey for taking (public)
		 */
		getTakeSurvey: builder.query<
			Survey,
			{ surveyId: string; token?: string }
		>({
			query: ({ surveyId, token }) => ({
				url: `/take/${surveyId}/`,
				params: token ? { token } : undefined,
			}),
		}),

		/**
		 * Submit survey response (public)
		 */
		submitSurvey: builder.mutation<
			{ message: string; response_id: string },
			{ surveyId: string; data: SubmitSurveyRequest; token?: string }
		>({
			query: ({ surveyId, data, token }) => ({
				url: `/submit/${surveyId}/`,
				method: "POST",
				body: data,
				params: token ? { token } : undefined,
			}),
			invalidatesTags: ["Response"],
		}),
	}),
});

// Export hooks for usage in components
export const {
	useGetSurveysQuery,
	useGetSurveyQuery,
	useCreateSurveyMutation,
	useUpdateSurveyMutation,
	useDeleteSurveyMutation,
	useUpdateSurveyStatusMutation,
	useGetQuestionsQuery,
	useCreateQuestionMutation,
	useUpdateQuestionMutation,
	useDeleteQuestionMutation,
	useCreateOptionMutation,
	useUpdateOptionMutation,
	useDeleteOptionMutation,
	useGetAllowedEmailsQuery,
	useCreateAllowedEmailMutation,
	useDeleteAllowedEmailMutation,
	useGetSurveyAllowedEmailsQuery,
	useAddSurveyAllowedEmailsMutation,
	useRemoveSurveyAllowedEmailMutation,
	useGetResponsesQuery,
	useGetResponseQuery,
	useGetResponsesByQuestionQuery,
	useExportResponsesMutation,
	useGetTakeSurveyQuery,
	useSubmitSurveyMutation,
} = surveyApi;
