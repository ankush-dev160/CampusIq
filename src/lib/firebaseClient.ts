/**
 * Firebase Client Integration for EduPulse AI
 * Configured for project: "details-of-student"
 *
 * Features:
 * - Direct official Firebase Web SDK (v10) dynamic browser loader
 * - Firestore Database operations (collections, documents, queries)
 * - Realtime Database operations
 * - Analytics initialization
 * - REST API fallback for maximum resilience
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDF5KErn3tXlj0tlbjKBfbHav3YfRHoK2U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "details-of-student.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://details-of-student-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "details-of-student",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "details-of-student.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "700388887499",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:700388887499:web:0c046f2a8ae7fc00aac44e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZCVQMHKLH9"
};

export interface FirebaseInstance {
  app: any;
  db: any;
  rtdb: any;
  analytics: any;
  firestoreOps: {
    doc: any;
    getDoc: any;
    setDoc: any;
    collection: any;
    getDocs: any;
    addDoc: any;
    updateDoc: any;
    deleteDoc: any;
    query: any;
    where: any;
  };
  rtdbOps: {
    ref: any;
    set: any;
    get: any;
    child: any;
    update: any;
  };
}

let firebaseInstancePromise: Promise<FirebaseInstance | null> | null = null;
let cachedInstance: FirebaseInstance | null = null;

/**
 * Loads and initializes Firebase JS SDK dynamically from Google CDN in browser
 */
export async function getFirebase(): Promise<FirebaseInstance | null> {
  if (typeof window === 'undefined') return null;
  if (cachedInstance) return cachedInstance;

  if (!firebaseInstancePromise) {
    firebaseInstancePromise = (async () => {
      try {
        // Dynamically import official Firebase modules
        const appUrl: string = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
        const firestoreUrl: string = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
        const rtdbUrl: string = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';
        const analyticsUrl: string = 'https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js';

        const [appModule, firestoreModule, rtdbModule, analyticsModule] = await Promise.all([
          import(/* @vite-ignore */ appUrl),
          import(/* @vite-ignore */ firestoreUrl),
          import(/* @vite-ignore */ rtdbUrl),
          import(/* @vite-ignore */ analyticsUrl),
        ]);

        const app = appModule.initializeApp(firebaseConfig);
        const db = firestoreModule.getFirestore(app);
        const rtdb = rtdbModule.getDatabase(app);

        let analytics: any = null;
        try {
          const supported = await analyticsModule.isSupported();
          if (supported) {
            analytics = analyticsModule.getAnalytics(app);
          }
        } catch (e) {
          console.warn('Firebase Analytics not supported in current environment:', e);
        }

        const instance: FirebaseInstance = {
          app,
          db,
          rtdb,
          analytics,
          firestoreOps: {
            doc: firestoreModule.doc,
            getDoc: firestoreModule.getDoc,
            setDoc: firestoreModule.setDoc,
            collection: firestoreModule.collection,
            getDocs: firestoreModule.getDocs,
            addDoc: firestoreModule.addDoc,
            updateDoc: firestoreModule.updateDoc,
            deleteDoc: firestoreModule.deleteDoc,
            query: firestoreModule.query,
            where: firestoreModule.where,
          },
          rtdbOps: {
            ref: rtdbModule.ref,
            set: rtdbModule.set,
            get: rtdbModule.get,
            child: rtdbModule.child,
            update: rtdbModule.update,
          }
        };

        cachedInstance = instance;
        console.log('✓ Firebase SDK initialized successfully (details-of-student)');
        return instance;
      } catch (err) {
        console.warn('Firebase dynamic module loading error (will use REST fallback):', err);
        return null;
      }
    })();
  }

  return firebaseInstancePromise;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIRESTORE REST API CONVERTERS (Universal fallback)
// ─────────────────────────────────────────────────────────────────────────────

function toFirestoreFields(obj: any): any {
  if (obj === null || obj === undefined) return { nullValue: null };
  if (typeof obj === 'string') return { stringValue: obj };
  if (typeof obj === 'number') {
    return Number.isInteger(obj) ? { integerValue: String(obj) } : { doubleValue: obj };
  }
  if (typeof obj === 'boolean') return { booleanValue: obj };
  if (Array.isArray(obj)) {
    return { arrayValue: { values: obj.map(toFirestoreFields) } };
  }
  if (typeof obj === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      fields[k] = toFirestoreFields(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(obj) };
}

function fromFirestoreFields(fields: Record<string, any>): any {
  if (!fields) return {};
  const res: Record<string, any> = {};
  for (const [key, valObj] of Object.entries(fields)) {
    res[key] = decodeFirestoreValue(valObj);
  }
  return res;
}

function decodeFirestoreValue(valObj: any): any {
  if (!valObj) return null;
  if ('stringValue' in valObj) return valObj.stringValue;
  if ('integerValue' in valObj) return parseInt(valObj.integerValue, 10);
  if ('doubleValue' in valObj) return parseFloat(valObj.doubleValue);
  if ('booleanValue' in valObj) return valObj.booleanValue;
  if ('nullValue' in valObj) return null;
  if ('arrayValue' in valObj) {
    return (valObj.arrayValue.values || []).map(decodeFirestoreValue);
  }
  if ('mapValue' in valObj) {
    return fromFirestoreFields(valObj.mapValue.fields);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// HIGH-LEVEL FIRESTORE API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets a document from Firestore by collection name and document ID
 */
export async function getFirestoreDoc<T = any>(collectionName: string, docId: string): Promise<T | null> {
  const fb = await getFirebase();
  if (fb) {
    try {
      const { doc, getDoc } = fb.firestoreOps;
      const docRef = doc(fb.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (err: any) {
      console.warn(`Firestore SDK getDoc error (${collectionName}/${docId}):`, err.message);
    }
  }

  // REST API Fallback
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}/${docId}?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return { id: docId, ...fromFirestoreFields(data.fields) } as T;
  } catch (err) {
    console.warn(`Firestore REST get error for ${collectionName}/${docId}:`, err);
    return null;
  }
}

/**
 * Saves/updates a document in Firestore by collection name and document ID
 */
export async function setFirestoreDoc(collectionName: string, docId: string, data: any): Promise<boolean> {
  const cleanData = { ...data, updatedAt: new Date().toISOString() };

  const fb = await getFirebase();
  if (fb) {
    try {
      const { doc, setDoc } = fb.firestoreOps;
      const docRef = doc(fb.db, collectionName, docId);
      await setDoc(docRef, cleanData, { merge: true });
      return true;
    } catch (err: any) {
      console.warn(`Firestore SDK setDoc error (${collectionName}/${docId}):`, err.message);
    }
  }

  // REST API Fallback
  try {
    const fields = toFirestoreFields(cleanData).mapValue.fields;
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}/${docId}?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
    return res.ok;
  } catch (err) {
    console.warn(`Firestore REST set error for ${collectionName}/${docId}:`, err);
    return false;
  }
}

/**
 * Queries all documents in a Firestore collection
 */
export async function getFirestoreCollection<T = any>(collectionName: string): Promise<T[]> {
  const fb = await getFirebase();
  if (fb) {
    try {
      const { collection, getDocs } = fb.firestoreOps;
      const colRef = collection(fb.db, collectionName);
      const snapshot = await getDocs(colRef);
      const docs: T[] = [];
      snapshot.forEach((d: any) => docs.push({ id: d.id, ...d.data() } as T));
      return docs;
    } catch (err: any) {
      console.warn(`Firestore SDK getDocs error (${collectionName}):`, err.message);
    }
  }

  // REST API Fallback
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map((d: any) => {
      const parts = d.name.split('/');
      const id = parts[parts.length - 1];
      return { id, ...fromFirestoreFields(d.fields) } as T;
    });
  } catch (err) {
    console.warn(`Firestore REST collection error for ${collectionName}:`, err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REALTIME DATABASE API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads data from Firebase Realtime Database
 */
export async function getRealtimeValue<T = any>(path: string): Promise<T | null> {
  const fb = await getFirebase();
  if (fb) {
    try {
      const { ref, get } = fb.rtdbOps;
      const dbRef = ref(fb.rtdb, path);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val() as T;
      }
      return null;
    } catch (err: any) {
      console.warn(`RTDB SDK get error (${path}):`, err.message);
    }
  }

  // REST Fallback
  try {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${firebaseConfig.databaseURL}/${cleanPath}.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`RTDB REST error for ${path}:`, err);
    return null;
  }
}

/**
 * Sets data at a path in Firebase Realtime Database
 */
export async function setRealtimeValue(path: string, data: any): Promise<boolean> {
  const fb = await getFirebase();
  if (fb) {
    try {
      const { ref, set } = fb.rtdbOps;
      const dbRef = ref(fb.rtdb, path);
      await set(dbRef, data);
      return true;
    } catch (err: any) {
      console.warn(`RTDB SDK set error (${path}):`, err.message);
    }
  }

  // REST Fallback
  try {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${firebaseConfig.databaseURL}/${cleanPath}.json`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.warn(`RTDB REST set error for ${path}:`, err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE APP ADAPTERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Saves a student's profile to Firestore ("students" collection)
 */
export async function saveStudentToFirestore(student: any): Promise<boolean> {
  const id = student.roll_no || student.student_id || student.id;
  if (!id) return false;
  return await setFirestoreDoc('students', id, student);
}

/**
 * Saves a skill test attempt to Firestore ("test_attempts" collection)
 */
export async function saveTestAttemptToFirestore(attempt: any): Promise<boolean> {
  if (!attempt.attemptId) return false;
  return await setFirestoreDoc('test_attempts', attempt.attemptId, attempt);
}

/**
 * Saves a placement question to Firestore ("question_bank" collection)
 */
export async function saveQuestionToFirestore(question: any): Promise<boolean> {
  if (!question.id) return false;
  return await setFirestoreDoc('question_bank', question.id, question);
}

/**
 * Checks connection health to Firebase and provides clear diagnostic info
 */
export async function checkFirebaseConnection(): Promise<{
  configured: boolean;
  sdkLoaded: boolean;
  projectId: string;
  databaseURL: string;
  firestoreAccessible: boolean;
  rtdbAccessible: boolean;
  message: string;
}> {
  const result = {
    configured: Boolean(firebaseConfig.projectId && firebaseConfig.apiKey),
    sdkLoaded: false,
    projectId: firebaseConfig.projectId,
    databaseURL: firebaseConfig.databaseURL,
    firestoreAccessible: false,
    rtdbAccessible: false,
    message: ''
  };

  const fb = await getFirebase();
  result.sdkLoaded = Boolean(fb);

  // Test Firestore REST reachability
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/health_check?key=${firebaseConfig.apiKey}`
    );
    if (res.status === 200 || res.status === 404) {
      result.firestoreAccessible = true;
    } else if (res.status === 403) {
      const d = await res.json().catch(() => ({}));
      if (d.error?.message?.includes('Cloud Firestore API has not been used')) {
        result.message = 'Cloud Firestore API needs to be enabled in Google Cloud Console.';
      } else {
        result.message = 'Firestore permission denied (check Firestore security rules).';
      }
    }
  } catch (err: any) {
    result.message = err.message || 'Network error reaching Firestore';
  }

  // Test RTDB reachability
  try {
    const res = await fetch(`${firebaseConfig.databaseURL}/health_check.json`);
    if (res.status === 200 || res.status === 404) {
      result.rtdbAccessible = true;
    }
  } catch {
    // Ignore
  }

  return result;
}
