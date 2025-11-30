import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService, Job } from '../services/jobs-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private jobsService = inject(JobsService);

  jobs = signal<Job[]>([]);
  selectedJob = signal<Job | null>(null);
  loading = signal(false);
  actionMessage = signal<{type: 'success' | 'error', text: string} | null>(null);

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading.set(true);
    this.jobs.set(this.jobsService.list());
    this.loading.set(false);
  }

  selectJob(job: Job) {
    this.selectedJob.set(job);
    this.actionMessage.set(null);
  }

  closeModal() {
    this.selectedJob.set(null);
    this.actionMessage.set(null);
  }

  approveJob(job: Job) {
    this.showMessage('success', `Job "${job.title}" has been approved.`);
    this.closeModal();
  }

  rejectJob(job: Job) {
    const confirmed = confirm(`Are you sure you want to reject "${job.title}"?`);
    if (confirmed) {
      this.jobsService.delete(job.id);
      this.loadJobs();
      this.showMessage('success', `Job "${job.title}" has been removed.`);
      this.closeModal();
    }
  }

  deleteJob(job: Job) {
    const confirmed = confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`);
    if (confirmed) {
      this.jobsService.delete(job.id);
      this.loadJobs();
      this.showMessage('success', `Job "${job.title}" has been deleted.`);
      this.closeModal();
    }
  }

  showMessage(type: 'success' | 'error', text: string) {
    this.actionMessage.set({ type, text });
    setTimeout(() => this.actionMessage.set(null), 3000);
  }
}
