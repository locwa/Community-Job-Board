export type UserRole = 'admin' | 'employer' | 'applicant';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  savedJobs?: string[];
  createdAt: Date;
}
