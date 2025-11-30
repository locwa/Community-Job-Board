import { Routes } from '@angular/router';
import { JobList } from './job-list/job-list';
import { CreateJob } from './create-job/create-job';
import { Login } from './login/login';

export const routes: Routes = [
  {path: "", component: JobList},
  {path: "job-list", component: JobList},
  {path: "create-job", component: CreateJob},
  {path: "login", component: Login}
];
