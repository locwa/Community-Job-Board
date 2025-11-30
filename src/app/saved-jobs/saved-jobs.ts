import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JobsService, Job } from '../services/jobs-service';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.css'
})
export class SavedJobs implements OnInit {
  private authService = inject(AuthService);
  private jobsService = inject(JobsService);

  savedJobs = signal<Job[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadSavedJobs();
  }

  loadSavedJobs() {
    this.loading.set(true);
    const savedJobIds = this.authService.userProfile()?.savedJobs || [];
    const allJobs = this.jobsService.list();
    const saved = allJobs.filter(job => savedJobIds.includes(job.id.toString()));
    this.savedJobs.set(saved);
    this.loading.set(false);
  }

  async removeSavedJob(jobId: number) {
    await this.jobsService.unsaveJob(jobId.toString());
    this.loadSavedJobs();
  }
}
