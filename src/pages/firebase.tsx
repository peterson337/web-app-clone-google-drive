import React from 'react';
import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import {getMetadata} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBIXTorQ8iixOwN4qm2xmawWatHVkVZTU",
    authDomain: "clono--do--drive.firebaseapp.com",
    projectId: "clono--do--drive",
    storageBucket: "clono--do--drive.appspot.com",
    messagingSenderId: "332099605918",
    appId: "1:332099605918:web:4ed8bad8306be1939af28f",
    measurementId: "G-L6Y24YQWEW"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const storage = getStorage(app);

    export{db, provider, auth, storage, getMetadata};

    const Firebase = () => {
        return null;
      };
      
      export default Firebase;