import express from "express"
import { firebase_store } from "../../../module/firebase.js"
import { collection, addDoc } from "firebase/firestore"
import { v4 } from "uuid"

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

      await addDoc(collection(firebase_store, "file_meta_datas"), {
        "file_name":FILE_NAME,
        "file_ext":FILE_EXT,
        "file_uuid":v4(),
        "owner":USER_AUTH
      })
      
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