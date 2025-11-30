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
}
