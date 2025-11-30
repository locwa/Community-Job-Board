# Community Job Board

## Overview
A community job board application built with Angular 20 and Firebase. This app allows users to view job listings, create job postings, and apply for jobs. The application uses Firebase Authentication, Firestore for data storage, and Bootstrap for styling.

**Current State:** Configured for Replit environment and ready to run. The Angular dev server is set up on port 5000 with proper host configuration for Replit's proxy environment.

## Recent Changes
- **2025-11-30**: Initial setup for Replit environment
  - Installed all npm dependencies
  - Configured Angular dev server for Replit (host: 0.0.0.0, port: 5000, allowedHosts: true)
  - Fixed Firebase configuration to use environment variables
  - Set up Angular Dev Server workflow
  - Configured static deployment with build output to dist/community-job-board/browser

## Project Architecture

### Frontend (Angular 20)
- **Framework**: Angular 20.3.13 with standalone components
- **Styling**: Bootstrap 5.3.8 + custom CSS
- **State Management**: RxJS 7.8.0
- **Build System**: Angular CLI with @angular/build

### Backend/Services
- **Firebase**: Used for authentication and Firestore database
- **Configuration**: Firebase config stored in `src/environments/environment.ts`

### Project Structure
```
src/
├── app/
│   ├── create-job/          # Component for creating new job postings
│   ├── job-application-modal/ # Modal for applying to jobs
│   ├── job-list/            # Component for displaying job listings
│   ├── services/
│   │   └── jobs-service.ts  # Service for job data operations
│   ├── app.config.ts        # Application configuration with Firebase
│   ├── app.routes.ts        # Routing configuration
│   └── app.ts               # Root component
├── environments/
│   └── environment.ts       # Environment configuration (Firebase credentials)
├── index.html
├── main.ts                  # Application entry point
└── styles.css               # Global styles

public/                      # Static assets
angular.json                 # Angular CLI configuration
package.json                 # Dependencies and scripts
```

### Key Components
1. **Job List Component**: Displays available job postings
2. **Create Job Component**: Form for creating new job listings
3. **Job Application Modal**: Modal dialog for applying to jobs
4. **Jobs Service**: Handles all job-related data operations with Firebase

### Dependencies
- Angular Core & Platform Browser
- Angular Router for navigation
- Angular Fire for Firebase integration
- Bootstrap for UI components
- RxJS for reactive programming

## Development

### Running Locally
The Angular dev server is configured to run automatically via the "Angular Dev Server" workflow. It runs on:
- Host: 0.0.0.0
- Port: 5000
- Auto-reload on file changes enabled

### Build Command
```bash
npm run build
```
Builds the application to `dist/community-job-board/browser/`

### Testing
```bash
npm test
```
Runs Karma test runner with Jasmine framework

## Deployment
Configured for static site deployment:
- Build command: `npm run build`
- Output directory: `dist/community-job-board/browser`
- Deployment type: Static

## Firebase Configuration
The app uses Firebase for:
- **Authentication**: User login/signup
- **Firestore**: Job listings and application data storage

Firebase configuration is stored in `src/environments/environment.ts` and includes:
- Project: community-appdev
- API Key and credentials for Firebase services

## Notes
- Analytics disabled in Angular CLI configuration
- Dev server configured with `allowedHosts: true` to work with Replit's proxy environment
- Bootstrap CSS included globally via angular.json styles configuration
