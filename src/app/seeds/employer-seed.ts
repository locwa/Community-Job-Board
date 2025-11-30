import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, getDocs, query, where, updateDoc, Timestamp } from '@angular/fire/firestore';
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
    await this.migrateOldJobs();
    await this.fixPostedByEmails();
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

  private async fixPostedByEmails(): Promise<void> {
    try {
      const jobsCollection = collection(this.firestore, 'jobs');
      const snapshot = await getDocs(jobsCollection);
      
      let fixedCount = 0;
      const usersCollection = collection(this.firestore, 'users');
      
      // Create a cache to avoid repeated queries
      const emailToUidCache: { [email: string]: string } = {};
      
      for (const jobDoc of snapshot.docs) {
        const data = jobDoc.data();
        const postedBy = data['postedBy'];
        
        // Check if postedBy is an email instead of a UID
        if (postedBy && postedBy.includes('@')) {
          const email = postedBy;
          
          // Check cache first
          let userId = emailToUidCache[email];
          
          // If not in cache, query Firestore
          if (!userId) {
            const userQuery = query(usersCollection, where('email', '==', email));
            const userSnapshot = await getDocs(userQuery);
            
            if (userSnapshot.docs.length > 0) {
              userId = userSnapshot.docs[0].id;
              emailToUidCache[email] = userId;
            }
          }
          
          // Update job with UID if found
          if (userId) {
            await updateDoc(doc(this.firestore, 'jobs', jobDoc.id), {
              postedBy: userId
            });
            console.log(`[Fix postedBy] Job ${jobDoc.id}: ${email} → ${userId}`);
            fixedCount++;
          } else {
            console.warn(`[Fix postedBy] Could not find UID for email: ${email}`);
          }
        }
      }
      
      if (fixedCount > 0) {
        console.log(`%c✓ Fixed ${fixedCount} jobs with email postedBy`, 'color: blue; font-weight: bold;');
      } else {
        console.log('[Fix postedBy] No jobs needed fixing');
      }
    } catch (error) {
      console.error('Fix postedBy error:', error);
    }
  }

  private async migrateOldJobs(): Promise<void> {
    try {
      const jobsCollection = collection(this.firestore, 'jobs');
      const snapshot = await getDocs(jobsCollection);
      
      let migratedCount = 0;
      const usersCollection = collection(this.firestore, 'users');
      
      // Get the first employer's UID for default assignments
      const firstEmployerQuery = query(usersCollection, where('email', '==', EMPLOYER_SEED_DATA[0].email));
      const firstEmployerSnapshot = await getDocs(firstEmployerQuery);
      const defaultEmployerId = firstEmployerSnapshot.docs.length > 0 ? firstEmployerSnapshot.docs[0].id : EMPLOYER_SEED_DATA[0].email;
      
      for (const jobDoc of snapshot.docs) {
        const data = jobDoc.data();
        const needsUpdate: any = {};
        
        // Add missing postedBy field (default to first employer UID)
        if (!data['postedBy']) {
          needsUpdate.postedBy = defaultEmployerId;
          console.log(`[Migration] Added postedBy to job ${jobDoc.id}`);
        }
        
        // Ensure status field exists (default to 'approved' for old jobs)
        if (!data['status']) {
          needsUpdate.status = 'approved';
          console.log(`[Migration] Added status to job ${jobDoc.id}`);
        }
        
        // Ensure company field exists
        if (!data['company'] && data['company_name']) {
          needsUpdate.company = data['company_name'];
          console.log(`[Migration] Added company (from company_name) to job ${jobDoc.id}`);
        } else if (!data['company']) {
          needsUpdate.company = 'Unknown Company';
          console.log(`[Migration] Added default company to job ${jobDoc.id}`);
        }
        
        // Convert postedDate to Timestamp if needed
        if (data['postedDate'] && !(data['postedDate'] instanceof Timestamp) && !data['postedDate']?.toDate) {
          if (typeof data['postedDate'] === 'string') {
            needsUpdate.postedDate = Timestamp.fromDate(new Date(data['postedDate']));
          } else if (data['postedDate']?.seconds) {
            // Already in Firestore Timestamp format, but verify structure
            needsUpdate.postedDate = Timestamp.fromDate(new Date(data['postedDate'].seconds * 1000));
          }
          console.log(`[Migration] Converted postedDate to Timestamp for job ${jobDoc.id}`);
        } else if (!data['postedDate']) {
          needsUpdate.postedDate = Timestamp.now();
          console.log(`[Migration] Added default postedDate to job ${jobDoc.id}`);
        }
        
        // Update job if any fields were missing
        if (Object.keys(needsUpdate).length > 0) {
          await updateDoc(doc(this.firestore, 'jobs', jobDoc.id), needsUpdate);
          migratedCount++;
        }
      }
      
      if (migratedCount > 0) {
        console.log(`%c✓ Migrated ${migratedCount} jobs to current format`, 'color: green; font-weight: bold;');
      }
    } catch (error) {
      console.error('Job migration error:', error);
    }
  }
}
