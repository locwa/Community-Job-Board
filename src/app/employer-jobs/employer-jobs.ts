import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../services/jobs-service';
import { AuthService } from '../services/auth.service';
import { Job } from '../models/job.model';

@Component({
  selector: 'app-employer-jobs',
  imports: [CommonModule, FormsModule],
  templateUrl: './employer-jobs.html',
  styleUrl: './employer-jobs.css'
})
export class EmployerJobs implements OnInit {
  private jobService = inject(JobsService);
  private authService = inject(AuthService);

  jobs: Job[] = [];
  loading = false;
  selectedJob: Job | null = null;
  editingJob: Job | null = null;
  isDeleting = false;
  isSaving = false;
  showDeleteConfirmModal = false;
  jobToDelete: string | null = null;

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
    this.editingJob = null;
  }

  startEdit(job: Job) {
    this.editingJob = { ...job };
  }

  cancelEdit() {
    this.editingJob = null;
  }

  async saveEdit() {
    if (!this.editingJob || !this.editingJob.id) return;
    
    this.isSaving = true;
    try {
      await this.jobService.update(this.editingJob.id, this.editingJob);
      await this.loadEmployerJobs();
      this.editingJob = null;
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
    } finally {
      this.isSaving = false;
    }
  }

  openDeleteConfirm(jobId: string | undefined) {
    if (!jobId) return;
    this.jobToDelete = jobId;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirmModal = false;
    this.jobToDelete = null;
  }

  async confirmDelete() {
    if (!this.jobToDelete) return;
    
    this.isDeleting = true;
    try {
      await this.jobService.delete(this.jobToDelete);
      await this.loadEmployerJobs();
      this.selectedJob = null;
      this.editingJob = null;
      this.showDeleteConfirmModal = false;
      this.jobToDelete = null;
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
      this.isDeleting = false;
    }
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
