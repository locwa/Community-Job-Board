export interface Applicant {
  userId: string;
  email: string;
  appliedAt: Date;
  name?: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string;
  postedBy?: string;
  postedDate?: Date;
  status?: 'approved' | 'pending' | 'rejected';
  applicants?: Applicant[];
}
