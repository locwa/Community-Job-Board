import { Component, inject } from '@angular/core';
import { JobsService, Job } from '../services/jobs-service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList {
  private jobService = inject(JobsService);
  authService = inject(AuthService);

  jobs: Job[] = [];
  jobTitleSearch = "";
  jobLocationSearch = "";

  jobDetails: Job | null = null;

  filters = {
    title: "",
    company: "",
    location: "",
    type: ""
  };

  ngOnInit() {
    this.jobs = this.jobService.list();
  }

  searchJob() {
    this.filters = {
      title: this.jobTitleSearch,
      company: "",
      location: this.jobLocationSearch,
      type: ""
    };
    this.jobs = this.jobService.list(this.filters);
  }

  viewJob(id: number) {
    this.jobDetails = this.jobs.find((job: Job) => job.id === id) || null;
  }

  isJobSaved(jobId: number): boolean {
    return this.jobService.isJobSaved(jobId.toString());
  }

  async toggleSaveJob(jobId: number, event: Event) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      return;
    }
    await this.jobService.toggleSaveJob(jobId.toString());
  }

  canSaveJobs(): boolean {
    return this.authService.isLoggedIn() && this.authService.isApplicant();
  }
}
