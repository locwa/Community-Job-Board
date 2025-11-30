import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
  writeBatch
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  jobs = signal<Job[]>([]);
  loading = signal(false);

  async initializeSampleData(): Promise<void> {
    try {
      const sampleJobs: Job[] = [
          { 
            title: 'Frontend Developer', 
            company: 'TechCorp', 
            location: 'Manila', 
            type: 'Full-time', 
            description: 'Develop and maintain UI components using Angular and modern web technologies.', 
            salary: '₱40,000 - ₱60,000',
            status: 'approved'
          },
          { 
            title: 'Backend Developer', 
            company: 'DevSolutions', 
            location: 'Cebu', 
            type: 'Full-time', 
            description: 'Build and optimize backend services using Node.js and database systems.', 
            salary: '₱45,000 - ₱70,000',
            status: 'approved'
          },
          { 
            title: 'UI/UX Designer', 
            company: 'Designify', 
            location: 'Remote', 
            type: 'Contract', 
            description: 'Create user-centered designs, wireframes, and prototypes for web and mobile apps.', 
            salary: '₱30,000 - ₱50,000',
            status: 'approved'
          },
          { 
            title: 'IT Support Specialist', 
            company: 'SysCare', 
            location: 'Davao', 
            type: 'Part-time', 
            description: 'Provide hardware and software technical support to clients and internal teams.', 
            salary: '₱18,000 - ₱25,000',
            status: 'approved'
          },
          { 
            title: 'Project Manager', 
            company: 'BuildRight', 
            location: 'Quezon City', 
            type: 'Full-time', 
            description: 'Oversee project timelines, client communication, and team coordination.', 
            salary: '₱60,000 - ₱90,000',
            status: 'approved'
          },
          { 
            title: 'Data Analyst', 
            company: 'InsightWorks', 
            location: 'Makati', 
            type: 'Full-time', 
            description: 'Analyze datasets, create dashboards, and provide data-driven insights for business decisions.', 
            salary: '₱40,000 - ₱65,000',
            status: 'approved'
          },
          { 
            title: 'QA Tester', 
            company: 'QualityPlus', 
            location: 'Remote', 
            type: 'Contract', 
            description: 'Test applications, report bugs, and ensure high product quality before release.', 
            salary: '₱25,000 - ₱40,000',
            status: 'approved'
          },
          { 
            title: 'Mobile App Developer', 
            company: 'AppWave', 
            location: 'Cebu', 
            type: 'Full-time', 
            description: 'Develop mobile applications using Flutter and maintain app store deployments.', 
            salary: '₱50,000 - ₱75,000',
            status: 'approved'
          },
          { 
            title: 'Network Administrator', 
            company: 'NetSecure', 
            location: 'Manila', 
            type: 'Full-time', 
            description: 'Maintain network infrastructure, monitor security, and troubleshoot connectivity issues.', 
            salary: '₱35,000 - ₱55,000',
            status: 'approved'
          },
          { 
            title: 'Content Writer', 
            company: 'CopyCraft', 
            location: 'Remote', 
            type: 'Part-time', 
            description: 'Write high-quality blog posts, technical documentation, and marketing content.', 
            salary: '₱15,000 - ₱25,000',
            status: 'approved'
          }
        ];

      const jobsCollection = collection(this.firestore, 'jobs');
      const snapshot = await getDocs(jobsCollection);
      
      if (snapshot.empty) {
        const batch = writeBatch(this.firestore);
        sampleJobs.forEach((job) => {
          const docRef = doc(collection(this.firestore, 'jobs'));
          batch.set(docRef, job);
        });
        await batch.commit();
        console.log('Sample job data added to Firestore');
      } else {
        console.log('Jobs already exist in Firestore');
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }

  async loadJobs(): Promise<void> {
    this.loading.set(true);
    try {
      const jobsCollection = collection(this.firestore, 'jobs');
      const q = query(jobsCollection, where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      
      const loadedJobs: Job[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Job, 'id'>
      }));
      
      this.jobs.set(loadedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      this.jobs.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  list(filter?: { title?: string; company?: string; location?: string; type?: string }): Job[] {
    const allJobs = this.jobs();
    if (!filter) return allJobs;
    
    return allJobs.filter(job => {
      const matchTitle = filter.title
        ? job.title.toLowerCase().includes(filter.title.toLowerCase())
        : true;

      const matchCompany = filter.company
        ? job.company.toLowerCase().includes(filter.company.toLowerCase())
        : true;

      const matchLocation = filter.location
        ? job.location.toLowerCase().includes(filter.location.toLowerCase())
        : true;

      const matchType = filter.type
        ? job.type.toLowerCase() === filter.type.toLowerCase()
        : true;

      return matchTitle && matchCompany && matchLocation && matchType;
    });
  }

  getById(id: string): Job | undefined {
    return this.jobs().find(j => j.id === id);
  }

  async create(job: Omit<Job, 'id'>): Promise<Job | null> {
    try {
      const jobsCollection = collection(this.firestore, 'jobs');
      const docRef = await addDoc(jobsCollection, {
        ...job,
        postedDate: new Date(),
        status: 'pending'
      });
      
      const newJob: Job = {
        id: docRef.id,
        ...job,
        postedDate: new Date(),
        status: 'pending'
      };
      
      const currentJobs = this.jobs();
      this.jobs.set([...currentJobs, newJob]);
      
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      return null;
    }
  }

  async update(id: string, updated: Partial<Job>): Promise<Job | null> {
    try {
      const jobDocRef = doc(this.firestore, 'jobs', id);
      await updateDoc(jobDocRef, updated);
      
      const currentJobs = this.jobs();
      const index = currentJobs.findIndex(j => j.id === id);
      if (index !== -1) {
        const updatedJob = { ...currentJobs[index], ...updated };
        const newJobs = [...currentJobs];
        newJobs[index] = updatedJob;
        this.jobs.set(newJobs);
        return updatedJob;
      }
      return null;
    } catch (error) {
      console.error('Error updating job:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const jobDocRef = doc(this.firestore, 'jobs', id);
      await deleteDoc(jobDocRef);
      
      const currentJobs = this.jobs();
      this.jobs.set(currentJobs.filter(j => j.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  }

  isJobSaved(jobId: string): boolean {
    const savedJobs = this.authService.userProfile()?.savedJobs || [];
    return savedJobs.includes(jobId);
  }

  async saveJob(jobId: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        savedJobs: arrayUnion(jobId)
      });
      
      const currentProfile = this.authService.userProfile();
      if (currentProfile) {
        const updatedSavedJobs = [...(currentProfile.savedJobs || []), jobId];
        this.authService.userProfile.set({
          ...currentProfile,
          savedJobs: updatedSavedJobs
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  }

  async unsaveJob(jobId: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        savedJobs: arrayRemove(jobId)
      });
      
      const currentProfile = this.authService.userProfile();
      if (currentProfile) {
        const updatedSavedJobs = (currentProfile.savedJobs || []).filter(id => id !== jobId);
        this.authService.userProfile.set({
          ...currentProfile,
          savedJobs: updatedSavedJobs
        });
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  }

  async toggleSaveJob(jobId: string): Promise<void> {
    if (this.isJobSaved(jobId)) {
      await this.unsaveJob(jobId);
    } else {
      await this.saveJob(jobId);
    }
  }
}
