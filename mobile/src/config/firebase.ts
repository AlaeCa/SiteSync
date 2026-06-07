import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBT04fMtpbGtYTlmNk8uIusItXMF9RupsE",
  authDomain: "sitesync-1c42e.firebaseapp.com",
  projectId: "sitesync-1c42e",
  storageBucket: "sitesync-1c42e.firebasestorage.app",
  messagingSenderId: "4878729515",
  appId: "1:4878729515:web:6afb838258dc180e51056e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;