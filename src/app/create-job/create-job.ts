import { Component, inject, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobsService } from '../services/jobs-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EMPLOYER_SEED_DATA } from '../seeds/employer-seed';

@Component({
  selector: 'app-create-job',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css',
})
export class CreateJob implements OnInit {
  private jobService = inject(JobsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  title: string = "";
  company: string = "";
  location: string = "";
  type: string = "";
  description: string = "";
  salary: string = "";
  error: string = "";
  showConfirmModal = false;
  isSubmitting = false;

  ngOnInit() {
    // Get company from user profile or derive from email
    const profile = this.authService.userProfile();
    if (profile?.company) {
      this.company = profile.company;
    } else if (profile?.email) {
      // Derive company from email based on seed data
      const employer = EMPLOYER_SEED_DATA.find(emp => emp.email === profile.email);
      if (employer) {
        this.company = employer.company;
      }
    }
    console.log("Company loaded:", this.company);
  }

  openConfirmModal() {
    this.error = "";
    
    // Validate user-editable fields
    if (!this.title || !this.location || !this.type || !this.description || !this.salary) {
      this.error = "Please fill in all fields";
      return;
    }

    // Ensure company is set from profile
    const profile = this.authService.userProfile();
    if (profile?.company) {
      this.company = profile.company;
      console.log("Company set to:", this.company);
    } else {
      console.warn("Company not found in profile:", profile);
    }

    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  async confirmCreateJob(){
    this.isSubmitting = true;
    this.error = "";
    
    const userId = this.authService.currentUser()?.uid;
    if (!userId) {
      this.error = "User not authenticated";
      this.isSubmitting = false;
      return;
    }

    const newJob = {
      title: this.title,
      company: this.company,
      location: this.location,
      type: this.type,
      description: this.description,
      salary: this.salary,
      postedBy: userId
    };

    try {
      const created = await this.jobService.create(newJob);
      if (created) {
        console.log("Job created successfully:", created);
        this.router.navigate(['/employer-jobs']);
      } else {
        this.error = "Failed to create job";
        this.isSubmitting = false;
      }
    } catch (err) {
      console.error("Error creating job:", err);
      this.error = "Error creating job: " + (err instanceof Error ? err.message : String(err));
      this.isSubmitting = false;
    }
  }
}
