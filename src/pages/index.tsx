import React, { useState, useEffect } from "react";
import { provider, auth} from "./firebase";
import { signInWithPopup} from 'firebase/auth';
import Body from "./Body";
import { FcGoogle } from "react-icons/fc";
import firebase from 'firebase/compat/app';
import { Dispatch, SetStateAction } from 'react';
import { Console } from "console";

interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  uid: string | null;
  imagem?: string | null;
}

export default function Home() {
  const [login, setLogin] = useState<User | null>(null);

  useEffect(() => {
    // Sistema de login permanente
    auth.onAuthStateChanged((val) => {
      if (val) {
        setLogin({
          email: val.email,
          displayName: val.displayName,
          photoURL: val.photoURL,
          uid: val.uid
        });
      } else {
        setLogin(null);
      }
    });
  }, []);
  
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
          const user = result.user;
          setLogin((prevLogin) => ({ 
            ...prevLogin,
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,            
          }));

      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <main>
      {login ?

      <div>  
      <Body login={login ? { uid: login.uid!, imagem: login.photoURL!  } : null} 
      setLogin={setLogin as React
      .Dispatch<React.SetStateAction<{ uid: string; email?: string | null | undefined; displayName?: string | null | undefined; 
      photoURL?: string | null; imagem?: string | null | undefined; } | null>>} />

          
      </div>
        :
        <main className="h-screen bg-black flex items-center justify-center z-20 ">
        <div className="w-96 h-96 flex items-center justify-center rounded-lg z-20 flex flex-col"
        style={{backgroundColor:'#f7f9fc'}}
        >

          <h1 className="text-2xl"
         style={{position: 'absolute', top:'300px'}}
          >Clone do goolge drive</h1>

          <h2
          className="w-80 break-all"
          style={{position: 'absolute', top:'400px'}}
          >Você não está cadastrado. Use a sua conta do google para usar o clone do goolge drive
            
          </h2>

          <button className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded-full w-30"
             style={{position: 'absolute', top:'500px'}}
           onClick={handleLogin}>Logar com o <div className="ml-2 bg-white rounded-full text-xl"><FcGoogle/></div></button>

        </div>
        </main>
      }
    </main>
  );
}
