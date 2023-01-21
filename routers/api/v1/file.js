import express from "express"
import { v4 } from "uuid"
import { ref, uploadString } from "firebase/storage"
import { collection, addDoc } from "firebase/firestore"
import { firebase_store, firebase_storage } from "../../../module/firebase.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

async function put_Router_callback(req, res)
{
  const USER_AUTH = "Sin"
  const ACCEPT_FILE_EXTS = ["txt"]
  
  Params_Check.Para_is_null(req.body, ["file_name", "file_url"])
  
  const [FILE_NAME, FILE_EXT] = req.body.file_name.toLowerCase().split(".")
  if(!ACCEPT_FILE_EXTS.includes(FILE_EXT)) throw new Error("Passed file's extension was not accepted.")

  const FILE_UUID = v4()
  await addDoc(collection(firebase_store, "file_meta_datas"), {
    "file_name":FILE_NAME,
    "file_ext":FILE_EXT,
    "file_uuid":FILE_UUID,
    "owner":USER_AUTH
  })
  await uploadString(ref(firebase_storage, `files/${FILE_UUID}`), req.body.file_url)
  
  res.json({is_error:false})
}

async function get_Router_callback(req, res)
{
  res.send('[MOCK] 파일 다운로드 처리')
}

async function delete_Router_callback(req, res)
{
  res.send('[MOCK] 파일 삭제 처리')
}

put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)
delete_Router_callback = Wrap.Wrap_With_Try_Res_Promise(delete_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)
router.delete('/', delete_Router_callback)

export default router