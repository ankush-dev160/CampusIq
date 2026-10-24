/**
 * Firebase & Firestore Database Integration for EduPulse AI
 *
 * Configured for project: "details-of-student"
 * Includes Cloud Firestore, Realtime Database, and Analytics.
 */

// Configuration provided for "details-of-student"
export const firebaseConfig = {
  apiKey: "AIzaSyDF5KErn3tXlj0tlbjKBfbHav3YfRHoK2U",
  authDomain: "details-of-student.firebaseapp.com",
  databaseURL: "https://details-of-student-default-rtdb.firebaseio.com",
  projectId: "details-of-student",
  storageBucket: "details-of-student.firebasestorage.app",
  messagingSenderId: "700388887499",
  appId: "1:700388887499:web:0c046f2a8ae7fc00aac44e",
  measurementId: "G-ZCVQMHKLH9"
};

// Re-export full suite of client database helpers and adapters
export {
  getFirebase,
  getFirestoreDoc,
  setFirestoreDoc,
  getFirestoreCollection,
  getRealtimeValue,
  setRealtimeValue,
  saveStudentToFirestore,
  saveTestAttemptToFirestore,
  saveQuestionToFirestore,
  checkFirebaseConnection,
  type FirebaseInstance,
} from './firebaseClient';
