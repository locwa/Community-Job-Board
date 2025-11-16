import { Routes } from '@angular/router';
import { JobList } from './job-list/job-list';
import { CreateJob } from './create-job/create-job';

export const routes: Routes = [
  {path: "", component: JobList},
  {path: "job-list", component: JobList},
  {path: "create-job", component: CreateJob}
];
