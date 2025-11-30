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

    const newJob = {
      title: this.title,
      company: this.company,
      location: this.location,
      type: this.type,
      description: this.description,
      salary: this.salary,
      postedBy: this.authService.currentUser()?.uid
    };

    const created = await this.jobService.create(newJob);
    if (created) {
      this.router.navigate(['/']);
    } else {
      this.error = "Failed to create job";
    }
  }
}
