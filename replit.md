# Community Job Board

## Overview
A community job board application built with Angular 20 and Firebase. This app allows users to view job listings, create job postings, and apply for jobs. The application uses Firebase Authentication, Firestore for data storage, and Bootstrap for styling.

**Current State:** Configured for Replit environment with role-based user accounts (admin, employer, applicant).

## User Roles
- **Admin**: Can moderate job listings (view, approve, reject, delete jobs)
- **Employer**: Can create and manage job postings
- **Applicant**: Can browse jobs, save jobs for later, and apply to positions

## Recent Changes
- **2025-11-30**: Added employer jobs page and role-based routing
  - Created "My Jobs" page for employers to view their posted jobs
  - Added `getEmployerJobs()` method to JobsService to query jobs by employer ID
  - Root route (/) now redirects employers to create-job and applicants to job-list
  - Added navigation link "My Jobs" in navbar for employers/admins
  - Jobs display with status badge (pending/approved/rejected)

- **2025-11-30**: Enhanced employer experience
  - Hidden "Find Jobs" navigation link for employers (only visible for applicants/unauthenticated users)
  - Company field in create-job form auto-populated with employer's company and disabled for editing
  - Added `company` field to UserProfile to store employer company name
  - Updated employer seed service to set company on profile creation

- **2025-11-30**: Integrated Firestore and added employer accounts
  - Refactored JobsService to use Firestore instead of in-memory data
  - Removed hardcoded sample data array - jobs now load from Firestore
  - Created employer seed service with 10 employer accounts (one per company)
  - Employer profiles automatically created on app initialization
  - All jobs now persist in Firestore with status (approved/pending)

- **2025-11-30**: Implemented role-based account system
  - Added three user roles: admin, employer, applicant
  - User profiles stored in Firestore with role information
  - Registration form allows choosing between Job Seeker and Employer roles
  - Route guards protect pages based on user role
  - Navigation shows role-specific links
  - Saved Jobs feature for applicants
  - Admin Dashboard for job moderation

- **2025-11-30**: Added Login/Registration functionality
  - Created AuthService for Firebase authentication (login, register, logout)
  - Built Login component with email/password form and mode toggle
  - Added /login route and updated navigation with Login/Logout buttons
  - User email displays in navbar when logged in
  - Proper error handling with user-friendly messages

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
- **State Management**: RxJS 7.8.0, Angular Signals
- **Build System**: Angular CLI with @angular/build

### Backend/Services
- **Firebase**: Used for authentication and Firestore database
- **Configuration**: Firebase config stored in `src/environments/environment.ts`

### Project Structure
```
src/
├── app/
│   ├── admin/               # Admin dashboard for job moderation
│   │   ├── admin-dashboard.ts
│   │   ├── admin-dashboard.html
│   │   └── admin-dashboard.css
│   ├── create-job/          # Component for creating new job postings (employers only)
│   ├── guards/              # Route guards for role-based access
│   │   ├── auth.guard.ts    # Protects routes requiring authentication
│   │   └── role.guard.ts    # Role-based guards (employer, admin)
│   ├── job-application-modal/ # Modal for applying to jobs
│   ├── job-list/            # Component for displaying job listings
│   ├── login/               # Login/Registration component with role selection
│   │   ├── login.ts
│   │   ├── login.html
│   │   └── login.css
│   ├── models/              # TypeScript interfaces
│   │   ├── user.model.ts    # UserProfile and UserRole types
│   │   └── job.model.ts     # Job interface
│   ├── saved-jobs/          # Saved jobs page for applicants
│   │   ├── saved-jobs.ts
│   │   ├── saved-jobs.html
│   │   └── saved-jobs.css
│   ├── seeds/               # Data seeding for initialization
│   │   └── employer-seed.ts # Creates initial employer accounts
│   ├── services/
│   │   ├── auth.service.ts  # Firebase authentication with role management
│   │   └── jobs-service.ts  # Firestore job operations + save/unsave jobs
│   ├── app.config.ts        # Application configuration with Firebase
│   ├── app.routes.ts        # Routing configuration with guards
│   └── app.ts               # Root component with role-based navigation
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
1. **Job List Component**: Displays available job postings with save functionality for applicants
2. **Create Job Component**: Form for creating new job listings (employers/admins only)
3. **Job Application Modal**: Modal dialog for applying to jobs
4. **Login Component**: Handles user login and registration with role selection
5. **Saved Jobs Component**: Shows saved jobs for applicants
6. **Admin Dashboard**: Moderation interface for admins
7. **Auth Service**: Firebase authentication with role management
8. **Jobs Service**: Job CRUD operations + save/unsave functionality

### Route Guards
- **authGuard**: Requires user to be logged in
- **employerGuard**: Requires employer or admin role
- **adminGuard**: Requires admin role

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
- **Authentication**: User login/signup with email/password
- **Firestore**: User profiles with roles, saved jobs, job listings

Firebase collections:
- `users`: User profiles with uid, email, role, savedJobs, createdAt
- `jobs`: Job listings with title, company, location, type, description, salary, status, postedBy, postedDate

Test Accounts:
To test the app, simply register new accounts using the Sign Up page:
- As a **Job Seeker**: Register and select "Job Seeker" role to browse, save, and apply to jobs
- As an **Employer**: Register and select "Employer" role to post and manage jobs
- As an **Admin**: Contact developer to grant admin role (set role to 'admin' in Firestore users collection)

Firebase configuration is stored in `src/environments/environment.ts` and includes:
- Project: community-appdev
- API Key and credentials for Firebase services

## How to Use

### For Job Seekers:
1. Click "Sign Up" on the login page
2. Enter email and password
3. Select "Job Seeker" role
4. Browse available jobs, save favorites, or apply

### For Employers:
1. Click "Sign Up" on the login page
2. Enter email and password
3. Select "Employer" role
4. Click "Post a Job" to create new job listings
5. Jobs start in "pending" status until approved by admin

### For Admin:
- Access admin dashboard to approve/reject/delete job listings
- To become admin: set `role: 'admin'` in Firestore users collection

## Notes
- Analytics disabled in Angular CLI configuration
- Dev server configured with `allowedHosts: true` to work with Replit's proxy environment
- Bootstrap CSS included globally via angular.json styles configuration
- Route guards wait for Firebase auth state to prevent redirect issues on page refresh
- All data persists in Firestore database
