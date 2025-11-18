import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { JobsService } from '../services/jobs-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-job',
  imports: [
    FormsModule
  ],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css',
})
export class CreateJob {
  title: string = "";
  company: string = "";
  location: string= "";
  type: string = "";
  description: string = "";
  salary: string = "";

  jobDetails:any = []

  constructor(private jobService : JobsService, private router : Router) {
  }

  addJob(){
    this.jobDetails = {
      title: this.title,
      company: this.company,
      location: this.location,
      type: this.type,
      description: this.description,
      salary: this.salary,
    }
    this.jobService.create(this.jobDetails)
    this.router.navigate(['/'])
  }
}
