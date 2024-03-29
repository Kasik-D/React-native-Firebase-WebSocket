import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// получаем наши значения конфига
import { 
  REACT_APP_FIREBASE_API_KEY, 
  REACT_APP_FIREBASE_AUTH_DOMAIN, 
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
} from '@env'


console.log("REACT_APP_FIREBASE_API_KEY", REACT_APP_FIREBASE_API_KEY)

// Конфиг для подключения firebase 
const firebaseConfig = { 
    apiKey: REACT_APP_FIREBASE_API_KEY ,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN ,
    projectId: REACT_APP_FIREBASE_PROJECT_ID ,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    // measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID
  };


  const app = initializeApp(firebaseConfig)


 export const db = getFirestore() // Для работы с Firebase Firestore

 export const auth = getAuth(app)
 
