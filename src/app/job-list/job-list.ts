import { Component } from '@angular/core';
import { JobsService } from '../services/jobs-service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList {
  jobs:any = []
  jobTitleSearch = ""
  jobCompanySearch = ""
  jobLocationSearch = ""
  jobTypeSearch= ""

  filters:any = {
    title: "",
    company: "",
    location: "",
    type: ""
  }

  constructor(private jobService: JobsService) {}

  ngOnInit() {
    console.log(this.jobService.list());
    this.jobs = this.jobService.list()
  }

  searchJob(){
    this.filters = {
      title: this.jobTitleSearch,
      company: this.jobCompanySearch,
      location: this.jobLocationSearch,
      type: this.jobTypeSearch
    }
    this.jobs = this.jobService.list(this.filters)
    console.log(this.jobs)
  }
}
