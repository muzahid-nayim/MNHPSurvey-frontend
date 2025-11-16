
---

## 📝 `CHANGELOG.md`

This file documents all notable changes to your project. Here's a template based on Semantic Versioning:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## Versioning Rules

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version `X.0.0`: Increment for incompatible API changes or breaking changes.
- **MINOR** version `0.Y.0`: Increment for backward-compatible additions (new features, enhancements).
- **PATCH** version `0.0.Z`: Increment for backward-compatible bug fixes and documentation tweaks.

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

---