import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsService } from '../services/jobs-service';
import { AuthService } from '../services/auth.service';
import { Job } from '../models/job.model';

@Component({
  selector: 'app-employer-jobs',
  imports: [CommonModule],
  templateUrl: './employer-jobs.html',
  styleUrl: './employer-jobs.css'
})
export class EmployerJobs implements OnInit {
  private jobService = inject(JobsService);
  private authService = inject(AuthService);

  jobs: Job[] = [];
  loading = false;
  selectedJob: Job | null = null;

  async ngOnInit() {
    await this.loadEmployerJobs();
  }

  async loadEmployerJobs() {
    this.loading = true;
    const userId = this.authService.currentUser()?.uid;
    if (userId) {
      this.jobs = await this.jobService.getEmployerJobs(userId);
    }
    this.loading = false;
  }

  viewJob(job: Job) {
    this.selectedJob = job;
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'approved':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
