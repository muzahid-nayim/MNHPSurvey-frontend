// src/core/store/slices/surveySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Survey, Question } from "@/types";

/**
 * Survey Slice
 * Manages local survey state (current survey being edited, etc.)
 */

interface SurveyState {
	currentSurvey: Survey | null;
	isCreating: boolean;
	selectedQuestionId: string | null;
}

const initialState: SurveyState = {
	currentSurvey: null,
	isCreating: false,
	selectedQuestionId: null,
};

const surveySlice = createSlice({
	name: "survey",
	initialState,
	reducers: {
		setCurrentSurvey: (state, action: PayloadAction<Survey | null>) => {
			state.currentSurvey = action.payload;
		},
		setIsCreating: (state, action: PayloadAction<boolean>) => {
			state.isCreating = action.payload;
		},
		setSelectedQuestionId: (
			state,
			action: PayloadAction<string | null>
		) => {
			state.selectedQuestionId = action.payload;
		},
		clearSurveyState: (state) => {
			state.currentSurvey = null;
			state.isCreating = false;
			state.selectedQuestionId = null;
		},
	},
});

export const {
	setCurrentSurvey,
	setIsCreating,
	setSelectedQuestionId,
	clearSurveyState,
} = surveySlice.actions;

export default surveySlice.reducer;
