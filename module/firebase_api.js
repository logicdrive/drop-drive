import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore"
import { getStorage, ref, uploadString, deleteObject } from "firebase/storage"

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
  /** 임시적으로 파이어베이스의 권한 오브젝트에 직접적으로 접근하기 위해서 */
  static get_Firebase_Object(object_name)
  {
    return {"APP":APP,
            "FIREBASE_AUTH":FIREBASE_AUTH, 
            "FIREBASE_STORE":FIREBASE_STORE, 
            "FIREBASE_STORAGE":FIREBASE_STORAGE}[object_name]
  }
  
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
    const QUERY_SNAP_SHOT = await Firebase_Api.query_To_Database_To_Get_QuerySnapShot(collection_path, querys)
    const DOC_RESULTS = QUERY_SNAP_SHOT.docs.map((doc) => doc.data())
    return DOC_RESULTS
  }

  /** 데이터베이스에서 검색된 Doc를 삭제시키기 위해서 */
  static async delete_From_Database(collection_path, querys)
  {
    const QUERY_SNAP_SHOT = await Firebase_Api.query_To_Database_To_Get_QuerySnapShot(collection_path, querys)
    if(QUERY_SNAP_SHOT.docs.length == 0) throw new Error("The file metadata to delete is not searched!")
    
    const DOC_ID_TO_DELETE = QUERY_SNAP_SHOT.docs[0].id
    await deleteDoc(doc(FIREBASE_STORE, collection_path, DOC_ID_TO_DELETE))
  }

  /** 데이터베이스에서 QuerySnapShot 객체를 얻기 위해서 */
  static async query_To_Database_To_Get_QuerySnapShot(collection_path, querys)
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
    return QUERY_SNAP_SHOT
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

  /** 특정 경로에 있는 스토리지 파일을 삭제시키기 위해서 */
  static async delete_From_Storage(storage_path)
  {
    const DELETE_REF = ref(FIREBASE_STORAGE, storage_path)
    if(DELETE_REF == null) throw new Error("The file content to delete is not searched!")
    await deleteObject(DELETE_REF)
  }

  /** 현재 가지고 있는 유저의 권한을 반환시키기 위해서
  *
  * ! 유저가 만약에 권한을 가지고 있지 않을 경우, null을 반환함
  */
  static user_Auth()
  {
    return (FIREBASE_AUTH.currentUser) ? FIREBASE_AUTH.currentUser.email : null
  }

  /** 유저에게 받은 정보를 기반으로 유저를 추가하기 위해서 */
  static async create_User(email, password)
  {
    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
  }

  /** 유저에게 받은 정보를 기반으로 로그인하기 위해서 */
  static async login(email, password)
  {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
  }
}

export default Firebase_Api