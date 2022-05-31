import {initializeApp} from 'firebase/app';

import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBg_DQFQf6SMnyfpgabtx3xO3eZhckPBTY",
  authDomain: "letmeask-625c7.firebaseapp.com",
  databaseURL: "https://letmeask-625c7-default-rtdb.firebaseio.com",
  projectId: "letmeask-625c7",
  storageBucket: "letmeask-625c7.appspot.com",
  messagingSenderId: "192503896303",
  appId: "1:192503896303:web:92307e9691826c27f4a31a"
};

initializeApp(firebaseConfig);

const auth = getAuth()
const database = getDatabase();

export {auth, database}