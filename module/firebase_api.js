import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore"
import { getStorage, ref, uploadString } from "firebase/storage"

const FIREBASE_CONFIG = {
  apiKey: process.env['REACT_APP_API_KEY'],
  authDomain: "drop-drive-a0792.firebaseapp.com",
  projectId: "drop-drive-a0792",
  storageBucket: "drop-drive-a0792.appspot.com",
  messagingSenderId: "394414690934",
  appId: "1:394414690934:web:be42d848004334d0abc557"
}

const APP = initializeApp(FIREBASE_CONFIG)
const FIREBASE_AUTH = getAuth(APP)
const FIREBASE_STORE = getFirestore(APP)
const FIREBASE_STORAGE = getStorage(APP)

/** 파이어베이스 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Firebase_Api
{
  /** 파이어베이스의 Database에 Json형식의 데이터를 업로드시키기 위해서 
  *
  * upload_To_Database("file_meta_datas", {"text":"Hello, World !"})
  *
  * // "file_meta_datas" 라는 이름의 Collection 경로에 {"text":"Hello, World !"} 라는 Json 데이터를 저장시킴
  */
  static async upload_To_Database(collection_path, json_data)
  {
    await addDoc(collection(FIREBASE_STORE, collection_path), json_data)
  }

  /** 파이어베이스의 Database에 쿼리를 보내기 위해서
  *
  * query_To_Data("file_meta_datas", [["where", "owner", "==", "test"]])
  *
  * // "file_meta_datas" 라는 이름의 Collection 경로에 owner가 test와 매칭되는 Json 데이터 리스트를 반환시킴
  */
  static async query_To_Database(collection_path, querys)
  {
    let doc_querys = []
    for(let query of querys)
    {
        if(query.length != 4) throw new Error(`요청하는 쿼리의 길이가 일치하지 않습니다! : ${query}`)
        if(query[0] == "where") doc_querys.push(where(query[1], query[2], query[3]))
        else throw new Error(`요청하는 쿼리의 타입이 유효하지 않습니다! : ${query}`)
    }
    
    const DOC_QUERY = query(collection(FIREBASE_STORE, collection_path), ...doc_querys)
    const QUERY_SNAP_SHOT = await getDocs(DOC_QUERY)
    const DOC_RESULTS = QUERY_SNAP_SHOT.docs.map((doc) => doc.data())
    return DOC_RESULTS
  }

  /** 파이어베이스의 Storage에 String형식의 데이터를 업로드시키기 위해서 
  *
  * upload_String_To_Storage("file/data.txt", "Hello, World !")
  *
  * // "file/data.txt" 경로에 "Hello, World !"라는 문자열이 담긴 문서를 업로드시킴
  */
  static async upload_String_To_Storage(storage_path, string_to_upload)
  {
    uploadString(ref(FIREBASE_STORAGE, storage_path), string_to_upload)
  }
}

export default Firebase_Api