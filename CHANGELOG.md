All notable changes to this project will be documented in this file.

## Versioning Rules

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version `X.0.0`: Increment for incompatible API changes or breaking changes.
- **MINOR** version `0.Y.0`: Increment for backward-compatible additions (new features, enhancements).
- **PATCH** version `0.0.Z`: Increment for backward-compatible bug fixes and documentation tweaks.
## [0.4.2] - 2026-03-1
### Fixed	
- Fixed lot of type and others issue during build.

## [0.4.1] - 2026-02-28
### Change
- change floating shape component.
- Inhance navigation section 
- inhanched hero section 
- inhanched theme toggle 
- inhance overall UI


## [0.4.1] - 2026-02-28

### Added

- **Reusable Response Details Component**
	- Created `ResponseDetailsTable.tsx` component for flexible data table usage
	- Auto-selects first question on page load
	- Can be easily moved or reused in other pages

### Fixed

- **Data Table Fixes**
	- Created missing `ResponseTableColumns.tsx` file
	- Fixed duplicate respondents in filtered results
	- Data table now correctly displays only responses for selected question

### Changed

- **Refactoring**
	- Extracted data table logic from responses page to `ResponseDetailsTable` component
	- Improved component organization for better maintainability

---

## [0.4.0] - 2026-02-25

### Added

- **Survey Response Charts & Analytics**
	- Added `ResponseBarChart.tsx` component for visualizing response counts and percentages
	- Added `ResponsePieChart.tsx` component for pie chart visualization
	- Implemented chart type toggle (Bar/Pie) in responses page
	- Added chart color coding for better visual distinction
	- Custom tooltip displays both count and percentage for options

### Changed

- **API Integration**
	- Updated `useGetResponsesQuery` to return aggregated statistics instead of raw response list
	- Response data now includes counts and percentages pre-calculated by backend
	- Simplified response data structure for easier visualization

- **UI/UX Improvements**
	- Enhanced responses page layout with better structure
	- Improved responsive design for all screen sizes
	- Added lucide-react icons for chart type buttons
	- Better visual hierarchy with cards and sections

### Technical

- Integrated Recharts library for professional chart visualizations
- Implemented responsive containers for all charts
- Custom tooltip rendering for enhanced data display
- Proper TypeScript typing for all chart components

## [0.4.0] - 2026-02-25

### Added

- Survey response analytics with bar and pie charts
- Chart type toggle functionality (Bar/Pie visualization)
- Added `ResponseBarChart.tsx` and `ResponsePieChart.tsx` components
- Added `AggregatedOption`, `AggregatedQuestion`, and `AggregatedSurveyResponse` types
- Added `CODE_STRUCTURE.md` frontend documentation

### Changed

- Updated `useGetResponsesQuery` to return aggregated statistics
- Enhanced responses page with statistics cards and responsive layout

## [0.3.4] - 2026-02-25

### Fixed

- Benefit from backend fix: Response data is now protected from deletion when questions/options are edited
- No frontend changes required - API now prevents dangerous cascading deletes

## [0.3.3] - 2026-2-24

### Fix

- fix some minor ui issue.

## [0.3.2] - 2026-2-22

### Added

- Added footer,hero,CTA component .
- Make logo for site.

### Changed

- Changed theme color to green
- Changed floating section component and add mouse following animation there .
- remove old logo and use new logo all over the place.

## [0.3.1] - 2026-2-20

### Changed

- Changed theme color to green. and fix some UI issue in survey list(action button overflowing)

### Added

- Added QR code option in a survey page to share survey link.
- Added QR code in survey list.

## [0.3.0] - 2026-2-19

### Added

- Added basic experimental QR code option to share survey link.

### Fixed

- Fix some minor issue.

## [0.2.1] - 2026-2-18

### Fixed

- Fix user registration with same uername in frontend.
- Fix some minor issue.

## [0.2.0] - 2026-1-05

### Added

- Added profile and profile settings pages with comprehensive user management
- Implemented RTK Query caching for user profile data (keepUnusedDataFor: 300s)

### Fixed

- Fixed logout infinite redirect loop in AuthProvider
- Fixed login looping issue with proper redirect state management
- Fixed few minor UI issues in profile components

### Changed

- Refactored UserAvatar as separate component in dashboard layout
- Moved email management section to dashboard settings page

## [0.1.12] - 2025-12-30

### Fixed

	Fixed question option not adding issue while editing question.

- Changed option format from string[] to {id?: string, text: string}[]
- Fixed initQuestionEdit to preserve option IDs during edit
- Updated submit handler to send option IDs for existing options
- Fixed add/remove/update option functions to work with new format
- Ensures backend can distinguish between new and existing options

## [0.1.11] - 2025-12-28

### Fixed

-fixed pagination issue on survey taking page.

### Added

- survey taker can edit question per page number.

### Changed

- cahged questioin per page input to select component.
- Chaned variable neme formData to formState all over the

## [0.1.10] - 2025-12-24

### Changed

- Move function to different component for individual survey page.

## [0.1.9] - 2025-12-15

### Fixed

- Fixed copy to clipboard issue in SurveyHeader component
- make survey page card reusable
- Fixed email is not adding in edit survey section
- Fixed auth issue (logged out automatically after some time by deleteing auth key and value from localstorage)

### Added

- Show warning if survey is draft or inactive in survey page
- Update toster
- show exact issue in card in survey page

## [0.1.8] - 2025-12-11

### Fixed

- fixed theme toggle button issue .

## [0.1.7] - 2025-12-10

### Fixed

- fixed sheet releted issue by adding SheetHeader and SheetTitle components.

### Changed

- Change white theme color to little offwhite

## [0.1.6] - 2025-12-10

### Fixed

- moved ManageAllowedEmails component to a dialog
- Fix some ui issues

## [0.1.5] - 2025-12-09

### Added

- Private survey email management system (AllowedEmail model)
- ManageAllowedEmails component for user profile to manage allowed emails
- SurveyInvitationManager component for survey-specific email access control
- Email selection during private survey creation
- Email access verification for private survey responses
- Professional documentation with section markers and inline comments
- Survey creation form with shadcn Select components (replaced raw HTML selects)

### Fixed

- Survey page dark mode styling consistency
- Response display card styling in responses page

### Changed

- Replaced HTML select elements with shadcn Select components for consistency
- Enhanced survey creation form with professional section markers and comments
- Updated API types (removed SurveyInvitation, added AllowedEmail)
- Improved form validation and error handling with toast notifications
- Refactored survey creation with better state organization and comments
- Updated surveyApi RTK Query endpoints for email management

## [0.1.4] - 2025-12-03

### Added

- Enhanced dialog and form styling for better UX
- Improved global CSS styling

### Fixed

- Option editing background color styling in dark mode
- Input field focus/hover states
- Dropdown select styling for dark mode
- QuestionForm component type safety improvements

### Changed

- Updated QuestionsList component with better dark mode support
- Enhanced SurveyEditForm styling and behavior
- Refactored survey listing page layout
- Updated TypeScript configuration for better type checking
- Updated package dependencies and lock file
- Backend URL routing formatting consistency (tabs instead of spaces)

## [0.1.3] - 2025-12-03

### Added

- Modular survey editing components
- Question and option management (CRUD)
- Survey status transitions
- Active survey editing capability

### Fixed

- Edit question button not working
- Input field dark mode styling
- Dropdown theme support

### Changed

- Refactored survey edit page into modular components
- Inlined state management directly into page component

## [0.1.2] - 2025-11-21

### Added

- Implemented basic survey creation system (public and login-required surveys).
- Added initial logic flow for survey visibility and participation.

### Changed

- Switched authentication persistence from `sessionStorage` to `localStorage`.
- Updated auth slice to correctly rehydrate authentication state after reload.

### Fixed

- Minor UI and logic issues in the updated survey and auth modules.

## [0.1.1] - 2025-11-16

### Fixed

- fixed some minor bugs and change some structure.

## [0.1.0] - 2025-11-14

### Added

- **Redux Toolkit Integration**
	- Complete Redux store configuration with persistence
	- Auth slice for managing authentication state
	- RTK Query API for backend communication
	- Automatic token refresh and reauthentication logic

- **Authentication System**
	- Complete login page with professional UI and form validation
	- User registration page with password strength indicator
	- Email verification flow with resend functionality
	- Password reset (forgot password) workflow
	- Change password functionality for authenticated users
	- Protected routes and authentication guards

- **Professional UI Components**
	- Theme system with light/dark mode support
	- Theme toggle component with system preference detection
	- Glass morphism design across all pages
	- Responsive navigation with mobile sidebar
	- Professional 404 error page

- **Dashboard & Layout**
	- Protected dashboard layout with sidebar navigation
	- User profile display in sidebar
	- Mobile-responsive design with sheet navigation
	- Professional branding (MNHPSurvey) throughout

- **Form Handling & UX**
	- Form validation with real-time feedback
	- Loading states and error handling
	- Password visibility toggles
	- Professional alert and notification system

### Enhanced

- **Home Page**
	- Complete theme support (dark/light modes)
	- Enhanced feature showcase with icons
	- Professional statistics section
	- Improved call-to-action sections

- **Navigation**
	- Responsive navigation bar with mobile menu
	- Theme-aware styling throughout
	- Professional logo and branding
	- User authentication state display

### Technical Improvements

- **State Management**
	- Redux middleware for API calls
	- Automatic token refresh interceptor
	- Persistent authentication state
	- Optimized re-renders with proper selectors

- **Performance**
	- Code splitting with React Suspense
	- Optimized bundle size
	- Efficient reauthentication flows
	- Responsive image loading

## [0.0.1] - 2025-11-1

### Added

- Initial project setup with Next.js and TypeScript.
- Created `frontend` project structure with separate folders for components, pages, and styles.
- Implement Shadcn ui and create basic home page layout.

## [Unreleased] - 2025-11-1

### Added

- Initial project setup with Django and Django Rest Framework.
- Created `backend` project structure with separate settings for development and production.
- Configured PostgreSQL database connection.
- Implemented basic user authentication and admin panel.
