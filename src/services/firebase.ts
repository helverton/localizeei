import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  //databaseURL:  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:  process.env.NEXT_PUBLIC_FIREBASE_APP_I
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { firebase, auth };



// "cards": {
//   ".indexOn": ["idx", "price", "make", "model"],
//   ".read": true,
//   ".write": true
// },
// "profiles": {
//   ".read": "auth.uid != null",
//   ".write": "auth.uid != null"
// },
// "visiteds": {
//   ".read": "auth.uid != null",
//   ".write": "auth.uid != null"
// }
