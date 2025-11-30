import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
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

  async initializeEmployers(): Promise<void> {
    try {
      for (const employer of EMPLOYER_SEED_DATA) {
        try {
          const credential = await createUserWithEmailAndPassword(
            this.auth,
            employer.email,
            EMPLOYER_PASSWORD
          );

          const userProfile: UserProfile = {
            uid: credential.user.uid,
            email: employer.email,
            role: 'employer',
            company: employer.company,
            savedJobs: [],
            createdAt: new Date()
          };

          await setDoc(doc(this.firestore, 'users', credential.user.uid), userProfile);
          console.log(`✓ Created employer: ${employer.company}`);
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log(`✓ Employer exists: ${employer.company}`);
            // Update existing profile to include company field if missing
            const userQuery = (await getDocs(
              query(collection(this.firestore, 'users'), where('email', '==', employer.email))
            )).docs[0];
            if (userQuery) {
              await setDoc(doc(this.firestore, 'users', userQuery.id), { company: employer.company }, { merge: true });
              console.log(`✓ Updated employer company: ${employer.company}`);
            }
          } else {
            console.error(`✗ Error creating ${employer.company}:`, error.message);
          }
        }
      }
      
      await signOut(this.auth);
      console.log('%c=== EMPLOYER TEST ACCOUNTS ===', 'color: green; font-size: 14px; font-weight: bold;');
      console.log(`Password: ${EMPLOYER_PASSWORD}`);
      EMPLOYER_SEED_DATA.forEach(emp => console.log(`${emp.company}: ${emp.email}`));
    } catch (error) {
      console.error('Employer initialization error:', error);
    }
  }
}
