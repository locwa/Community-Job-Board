import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { JobsService } from '../services/jobs-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-job',
  imports: [
    FormsModule
  ],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css',
})
export class CreateJob {
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

  constructor() {
    const profile = this.authService.userProfile();
    if (profile?.company) {
      this.company = profile.company;
    }
  }

  async addJob(){
    this.error = "";
    
    if (!this.title || !this.company || !this.location || !this.type || !this.description || !this.salary) {
      this.error = "Please fill in all fields";
      return;
    }

    const userId = this.authService.currentUser()?.uid;
    if (!userId) {
      this.error = "User not authenticated";
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
      }
    } catch (err) {
      console.error("Error creating job:", err);
      this.error = "Error creating job: " + (err instanceof Error ? err.message : String(err));
    }
  }
}
