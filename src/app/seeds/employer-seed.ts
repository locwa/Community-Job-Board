import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDocs, collection, query, where, setDoc } from '@angular/fire/firestore';
import { UserProfile } from '../models/user.model';

export const EMPLOYER_SEED_DATA = [
  { email: 'techcorp@example.com', company: 'TechCorp' },
  { email: 'devsolutions@example.com', company: 'DevSolutions' },
  { email: 'designify@example.com', company: 'Designify' },
  { email: 'syscare@example.com', company: 'SysCare' },
  { email: 'buildright@example.com', company: 'BuildRight' },
  { email: 'insightworks@example.com', company: 'InsightWorks' },
  { email: 'qualityplus@example.com', company: 'QualityPlus' },
  { email: 'appwave@example.com', company: 'AppWave' },
  { email: 'netsecure@example.com', company: 'NetSecure' },
  { email: 'copycraft@example.com', company: 'CopyCraft' }
];

const EMPLOYER_PASSWORD = 'Employer123!';

@Injectable({ providedIn: 'root' })
export class EmployerSeedService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);

  async initializeEmployers(): Promise<void> {
    try {
      for (const employer of EMPLOYER_SEED_DATA) {
        const existingUser = await this.findUserByEmail(employer.email);
        
        if (!existingUser) {
          try {
            const credential = await this.ngZone.run(async () => {
              return await createUserWithEmailAndPassword(
                this.auth,
                employer.email,
                EMPLOYER_PASSWORD
              );
            });

            const userProfile: UserProfile = {
              uid: credential.user.uid,
              email: employer.email,
              role: 'employer',
              savedJobs: [],
              createdAt: new Date()
            };

            await setDoc(doc(this.firestore, 'users', credential.user.uid), userProfile);
            console.log(`✓ Created employer: ${employer.company} - Email: ${employer.email}`);
          } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
              console.log(`✓ Employer already exists: ${employer.company}`);
            } else {
              console.log(`Note: ${employer.company} account status checked`);
            }
          }
        }
      }
      console.log('%c=== EMPLOYER TEST ACCOUNTS ===', 'color: green; font-size: 14px; font-weight: bold;');
      console.log(`Password for all employers: ${EMPLOYER_PASSWORD}`);
      EMPLOYER_SEED_DATA.forEach(emp => {
        console.log(`${emp.company}: ${emp.email}`);
      });
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
