import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css',
})
export class CreateJob {

  // Form fields as signals
  title = signal('');
  company = signal('');
  location = signal('');
  type = signal('');
  description = signal('');
  salary = signal('');

  // Jobs list fetched from Firestore
  jobs: any[] = [];

  // Track editing job ID
  editingId = signal<string | null>(null);

  constructor(private firestore: Firestore, private router: Router) {
    // Load jobs from Firestore and update jobs array
    const jobCollection = collection(this.firestore, 'jobs');
    collectionData(jobCollection, { idField: 'id' }).subscribe(data => {
      this.jobs = data;
    });
  }

  // Reset form signals
  resetForm() {
    this.title.set('');
    this.company.set('');
    this.location.set('');
    this.type.set('');
    this.description.set('');
    this.salary.set('');
    this.editingId.set(null);
  }

  // Add or update job
  addJob() {
    const jobDetails = {
      title: this.title(),
      company: this.company(),
      location: this.location(),
      type: this.type(),
      description: this.description(),
      salary: this.salary(),
    };

    const jobCollection = collection(this.firestore, 'jobs');

    if (this.editingId()) {
      // Edit existing job
      const jobDoc = doc(this.firestore, `jobs/${this.editingId()}`);
      updateDoc(jobDoc, jobDetails);
      this.resetForm();
    } else {
      // Add new job
      addDoc(jobCollection, jobDetails);
      this.resetForm();
    }
  }

  // Start editing a job (fills form fields)
  startEditJob(job: any) {
    this.title.set(job.title);
    this.company.set(job.company);
    this.location.set(job.location);
    this.type.set(job.type);
    this.description.set(job.description);
    this.salary.set(job.salary);
    this.editingId.set(job.id);
  }

  // Delete a job
  deleteJob(id: string) {
    const jobDoc = doc(this.firestore, `jobs/${id}`);
    deleteDoc(jobDoc);
    if (this.editingId() === id) {
      this.resetForm();
    }
  }
}
