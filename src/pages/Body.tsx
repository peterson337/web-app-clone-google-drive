import React,{useState, useEffect} from "react";
import styles from "../styles/HomeLogin.module.css";
import { AiOutlinePlus, AiFillFolder, AiFillFile} from 'react-icons/ai';
import {BsFillImageFill} from "react-icons/bs";
import {TbPdf} from "react-icons/tb";
import {MdVideoLibrary} from "react-icons/md";
import { getFirestore, collection, addDoc, onSnapshot, doc, getDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { db} from "./firebase";

interface Props {
  login: {
    uid: string;
    imagem: string;
  } | null;
  setLogin: React.Dispatch<React.SetStateAction<{
    uid: string;
    email?: string | null | undefined;
    displayName?: string | null | undefined;
    photoURL?: string | null;
    imagem?: string | null | undefined;
  } | null>> | ((value: React.SetStateAction<{
    uid: string;
    email?: string | null | undefined;
    displayName?: string | null | undefined;
    photoURL?: string | null;
    imagem?: string | null | undefined;
  } | null>, callback?: () => void) => void);
}

const Body = (props: Props) => {  
  const [progress, setProgress] = useState<number>(0);
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  
  
  const storage = getStorage();
  const firestore = getFirestore();

  useEffect(() => {
    if (props.login && props.login.uid) {
      const unsubscribe = onSnapshot(collection(db, "documentos", props.login.uid, "file"),
       (querySnapshot) => {   
        const docs: Array<any> = [];
        querySnapshot.forEach((doc) => {
          docs.push(doc.data());
        });
        setArquivos(docs);
      }); 
      return () => unsubscribe();
    }
  }, [props.login]);

  const fazerUploadArquivo = (uid: string) => {
    const arquivoElement = (document.querySelector('[name=arquivo]') as HTMLInputElement)?.files?.[0];
    const arquivo = arquivoElement ? arquivoElement.name : '';
    
    if (arquivoElement) {
      const storageRef = ref(storage, 'documentos/' + uid + '/file/' + arquivo);
      const uploadTask = uploadBytesResumable(storageRef, arquivoElement);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progressTemp = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressTemp);
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Upload completed successfully, now get download URL and save to Firestore
          const metadataRef = ref(storage, 'documentos/' + uid + '/file/' + arquivo);
          getDownloadURL(metadataRef).then((url) => {
            addDoc(collection(firestore, 'documentos', uid, 'file'), {
              arquivo: url,
              nome: arquivoElement.name,
              tipo_arquivo: arquivoElement.type 
            })
            .then(() => {
              alert(arquivoElement.name + 'Upload realizado com sucesso!');
              setProgress(0);
            })
            .catch((error) => {
              console.log(error);
            });
          });
        }
      );
    } else {
      console.log('Nenhum arquivo selecionado.');
    }
  };
  

  const sair = () => {
    props.setLogin(null);
}

const abrirModal = () => {
  setModal(true)
}

const closeModal = () => {
      setModal(false);
    
  }
  
   const [maxLength, setMaxLength] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMaxLength(20);
      } else {
        setMaxLength(100);
      }
    };
    handleResize();
//?   O evento resize é um evento JavaScript que é acionado quando o tamanho da janela do 
//?   navegador é alterado.
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [maxLength]); 

  return (
    <main className="h-screen bg-gray-50">
    <div className={styles.body}>
    <div className={styles.header}>
      <div className={styles.header__logo}>
      <img src="//ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" 
      /> <span>Drive</span> 
      </div>

      <div className={styles.header__pesquisa}>
        <input type="text" placeholder="Pesquisar no drive"  maxLength={maxLength} />
        <div className={styles.search}></div>
      </div>

      <div className={styles.header__user}>
     <button onClick={abrirModal}>  
     <img src={props.login?.imagem} 
     className={styles.image}/>
     </button>
      </div>

    </div>

      <div className={styles.main}>

      <div className={styles.main__sidebar}>
          
          <form>
            <label htmlFor="arquivo" className={styles.main__btnfileSelect}> 
            <AiOutlinePlus/>&nbsp;&nbsp;&nbsp;Novo</label>
            <input onChange={() => fazerUploadArquivo(props.login?.uid || '')} 
            id="arquivo" type="file" name="arquivo" 
            className={styles.hiddenInput} />
          </form>

          <div className={styles.main__folders}>
              <div className={styles.main__folderMeuDrive}>
                    <AiFillFolder/><span>Meu drive</span>
                    </div>
                    <div className={styles.boxFile}>
  {
    arquivos.map(function(data, index) {
      if (data.tipo_arquivo === "video/mp4") {
        return (
          <div className={styles.boxFileSingle} key={index}>
            <div style={{color:"green"}} className={styles.iconsDownload}>
              <MdVideoLibrary/> 
            </div>
            <a href={data.arquivo}
             className = 'text-green-500 hover:text-red-500 hover:underline font-bold'
              >
              {data.nome}
            </a>
          </div>  
        )
      } else if(data.tipo_arquivo === "application/pdf"){
        return (
          <div className={styles.boxFileSingle} key={index}>
            <div style={{color:"red"}} className={styles.iconsDownload}>
            <TbPdf/> 
            </div>
            <a className='text-red-500 hover:text-sky-500/100 hover:underline font-bold'
             href={data.arquivo}>
              {data.nome}
            </a>
          </div>  
          /* 
          hover:bg-blue-200
          */
        )
      } else  if(data.tipo_arquivo === "image/png") {
        return (
          <div className={styles.boxFileSingle} key={index}>
            <div style={{color:"rgb(0, 132, 255)"}} className={styles.iconsDownload}>
            <BsFillImageFill/> 
            </div>
            <a className={styles.boxFileSingleLink} href={data.arquivo}>
              {data.nome}
            </a>
          </div>  
        )
      } else{
        return(
          <div className={styles.boxFileSingle} key={index}>
          <div style={{color:"black"}} className={styles.iconsDownload}>
          <AiFillFile/> 
          </div>
          <a href={data.arquivo}
          className = 'text-black-500 hover:text-red-500 hover:underline font-bold' 
          >
            {data.nome}
          </a>
        </div>  
        )
      }                          
    })
  }                          
</div>               
                    {
                      progress > 0?
                      <div>
                        <label htmlFor="file">Downloading progress:
                        </label> <br />
                        <progress className={styles.progress}  id="file" value={progress} max='1'>{progress}%</progress>
                      </div>
                      :
                      <div></div>
                    }
              </div>
          </div>

      </div>

      <div className={styles.main__content}>
            <div className={styles.mainTopoText}>
              <h2>Meu drive</h2> 
            </div>
      </div>

        

        {
          modal?
          <div className="h-48 w-80 rounded-lg absolute top-20 right-0 mr-4 shadow-2xl" 
          style={{backgroundColor:'#f7f9fc'}}>
            <div style={{backgroundColor:'white'} }>
            <button className="absolute right-0 mr-3" onClick={closeModal}>X</button>
            <button 
            className="absolute bottom-0 bg-red-500 text-white font-bold py-2 px-4
             rounded rounded-full mb-3 ml-3" 
            onClick={sair}>Deslogar</button>
            </div>
            </div>
          :
          <div></div>
        }
      </div>
      </main>
  )
}


export default Body