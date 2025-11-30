import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDocs, collection, query, where, setDoc } from '@angular/fire/firestore';
import { UserProfile } from '../models/user.model';

export const EMPLOYER_SEED_DATA = [
  { uid: 'employer-techcorp', email: 'techcorp@example.com', company: 'TechCorp' },
  { uid: 'employer-devsolutions', email: 'devsolutions@example.com', company: 'DevSolutions' },
  { uid: 'employer-designify', email: 'designify@example.com', company: 'Designify' },
  { uid: 'employer-syscare', email: 'syscare@example.com', company: 'SysCare' },
  { uid: 'employer-buildright', email: 'buildright@example.com', company: 'BuildRight' },
  { uid: 'employer-insightworks', email: 'insightworks@example.com', company: 'InsightWorks' },
  { uid: 'employer-qualityplus', email: 'qualityplus@example.com', company: 'QualityPlus' },
  { uid: 'employer-appwave', email: 'appwave@example.com', company: 'AppWave' },
  { uid: 'employer-netsecure', email: 'netsecure@example.com', company: 'NetSecure' },
  { uid: 'employer-copycraft', email: 'copycraft@example.com', company: 'CopyCraft' }
];

@Injectable({ providedIn: 'root' })
export class EmployerSeedService {
  private firestore = inject(Firestore);

  async initializeEmployers(): Promise<void> {
    try {
      for (const employer of EMPLOYER_SEED_DATA) {
        const existingUser = await this.findUserByEmail(employer.email);
        
        if (!existingUser) {
          const userProfile: UserProfile = {
            uid: employer.uid,
            email: employer.email,
            role: 'employer',
            savedJobs: [],
            createdAt: new Date()
          };

          await setDoc(doc(this.firestore, 'users', employer.uid), userProfile);
          console.log(`Created employer profile: ${employer.company}`);
        }
      }
    } catch (error) {
      console.log('Employer initialization complete');
    }
  }

  private async findUserByEmail(email: string): Promise<any> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data();
    } catch (error) {
      return null;
    }
  }
}
