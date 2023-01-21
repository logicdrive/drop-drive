import express from "express"
import { firebase_store, firebase_storage } from "../../../module/firebase.js"
import { collection, addDoc } from "firebase/firestore"
import { v4 } from "uuid"
import { ref, uploadString } from "firebase/storage"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('[MOCK] 파일 다운로드 처리')
})

router.put('/', async (req, res) => {
    try
    { 
      const USER_AUTH = "Sin"
      const ACCEPT_FILE_EXTS = ["txt"]
      
      const [FILE_NAME, FILE_EXT] = req.body.file_name.toLowerCase().split(".")
      if(!ACCEPT_FILE_EXTS.includes(FILE_EXT))
      {
        res.json({is_error:true, error_message:"Passed file's extension was not accepted."})
        return
      }

      const FILE_UUID = v4()
      await addDoc(collection(firebase_store, "file_meta_datas"), {
        "file_name":FILE_NAME,
        "file_ext":FILE_EXT,
        "file_uuid":FILE_UUID,
        "owner":USER_AUTH
      })
      await uploadString(ref(firebase_storage, `files/${FILE_UUID}`), req.body.file_url)
      
      res.json({is_error:false, error_message:""})
    }
    catch(e)
    {
      console.log(e)
      res.json({is_error:true, error_message:"Internal server error was occurred."})
    }
})

router.delete('/', (req, res) => {
    res.send('[MOCK] 파일 삭제 처리')
})


export default router