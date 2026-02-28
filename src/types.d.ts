// frontend/src/types.d.ts

// ============================================
// SURVEY TYPES
// ============================================

export type AccessType =
	| "public_anonymous"
	| "public_authenticated"
	| "private_invited";
export type DisplayMode = "one_by_one" | "show_all" | "paginated";
export type SurveyStatus = "draft" | "active" | "closed";
export type QuestionType = "single_choice" | "multiple_choice";

export interface QuestionOption {
	id: string;
	option_text: string;
	order: number;
	created_at: string;
}

export interface Question {
	id: string;
	question_text: string;
	question_type: QuestionType;
	order: number;
	is_required: boolean;
	options: QuestionOption[];
	created_at: string;
}

export interface Survey {
	id: string;
	title: string;
	description: string;
	access_type: AccessType;
	display_mode: DisplayMode;
	questions_per_page: number;
	status: SurveyStatus;
	allow_multiple_responses: boolean;
	show_progress_bar: boolean;
	owner_username: string;
	questions?: Question[];
	created_at: string;
	updated_at: string;
}

export interface SurveyListItem {
	id: string;
	title: string;
	description: string;
	access_type: AccessType;
	display_mode: DisplayMode;
	status: SurveyStatus;
	owner_username: string;
	question_count: number;
	response_count: number;
	created_at: string;
}

export interface CreateSurveyRequest {
	title: string;
	description?: string;
	access_type: AccessType;
	display_mode: DisplayMode;
	questions_per_page?: number;
	allow_multiple_responses?: boolean;
	show_progress_bar?: boolean;
}

export interface CreateQuestionRequest {
	question_text: string;
	question_type: QuestionType;
	order: number;
	is_required: boolean;
	options: {
		option_text: string;
		order: number;
	}[];
}

export interface SurveyInvitation {
	id: string;
	survey: string;
	survey_title: string;
	email: string;
	token: string;
	status: string;
	sent_at: string;
}

export interface AllowedEmail {
	id: string;
	email: string;
	created_at: string;
}

export interface AnswerSelection {
	id: string;
	selected_option: string;
	option_text: string;
}

export interface Answer {
	id: string;
	question: string;
	question_text: string;
	selections: AnswerSelection[];
	created_at: string;
}

export interface SurveyResponse {
	id: string;
	survey: string;
	respondent_email: string;
	started_at: string;
	completed_at: string;
	is_complete: boolean;
	answers: Answer[];
}

export interface SubmitSurveyRequest {
	answers: {
		question_id: string;
		selected_options: string[];
	}[];
}

// ============================================
// AGGREGATED RESPONSE TYPES (For Charts)
// ============================================

export interface AggregatedOption {
	id: string;
	option_text: string;
	count: number;
	percentage: number;
}

export interface AggregatedQuestion {
	id: string;
	question_text: string;
	question_type: QuestionType;
	total_answers: number;
	options: AggregatedOption[];
}

export interface AggregatedSurveyResponse {
	survey_id: string;
	survey_title: string;
	total_responses: number;
	questions: AggregatedQuestion[];
}
// ============================================
// DATA TABLE RESPONSE TYPES
// ============================================

export interface ResponseTableRow {
	id: string;
	sn: number;
	email: string;
	respondent_name?: string;
	selected_options: string;
	submitted_at: string;
}

export interface QuestionResponsesData {
	question_id: string;
	question_text: string;
	question_type: QuestionType;
	total_responses: number;
	responses: ResponseTableRow[];
}
