import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import UUID from "../../../module/uuid.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"
import Datetime from "../../../module/datetime.js"
import get_Router_Callback_Temp from "../../temp/file.js"

import { doc, getDocs, deleteDoc, collection, query, where } from "firebase/firestore"

// 주어진 파일의 메타데이터를 파이어베이스에, 파일 URL을 파이어스토어에 업로드시키기 위해서
async function put_Router_callback(req, res)
{  
  Params_Check.Para_is_null_or_empty(req.body, ["file_name", "file_url"])
  
  const USER_AUTH = Firebase_Api.user_Auth()
  const ACCEPT_FILE_EXTS = ["txt"]

  const {file_name:FILE_NAME_EXT, file_url:FILE_URL} = req.body
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.toLowerCase().split(".")
  if(!ACCEPT_FILE_EXTS.includes(FILE_EXT)) throw new Error("Passed file's extension was not accepted.")

  const CURRENT_TIME_STR = Datetime.timezone_Date_Str()
  const FILE_UUID = UUID.get_UUID()
  await Firebase_Api.upload_To_Database("file_meta_datas", {
    "file_name":FILE_NAME,
    "file_ext":FILE_EXT,
    "file_uuid":FILE_UUID,
    "owner":USER_AUTH,
    "created_time":CURRENT_TIME_STR
  })
  await Firebase_Api.upload_String_To_Storage(`files/${FILE_UUID}`, FILE_URL)
  
  res.json({is_error:false})
}

async function get_Router_callback(req, res)
{
  await get_Router_Callback_Temp(req, res)
}

async function delete_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_name"])
  const USER_AUTH = Firebase_Api.user_Auth()
  const [FILE_NAME, FILE_EXT] = req.query.file_name.split(".")

  // 삭제시킬 UUID 얻기 위해서
  const QRES = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if(QRES.length == 0) throw new Error("The file to delete is not searched!")
  const FILE_UUID_TO_DELETE = QRES[0].file_uuid
  
  await Firebase_Api.delete_From_Storage(`files/${FILE_UUID_TO_DELETE}`)

  // Database에서 삭제하기 위해서
  const FIREBASE_STORE = Firebase_Api.get_Firebase_Object("FIREBASE_STORE")
  const DOC_QUERY = query(collection(FIREBASE_STORE, "file_meta_datas"), where("file_uuid", "==", FILE_UUID_TO_DELETE))
  const QUERY_SNAP_SHOT = await getDocs(DOC_QUERY)
  if(QUERY_SNAP_SHOT.docs.length == 0) throw new Error("The file metadata to delete is not searched!")
  const DOC_ID_TO_DELETE = QUERY_SNAP_SHOT.docs[0].id
  await deleteDoc(doc(FIREBASE_STORE, "file_meta_datas", DOC_ID_TO_DELETE))
  
  res.json({is_error:false})
}

put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)
delete_Router_callback = Wrap.Wrap_With_Try_Res_Promise(delete_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)
router.delete('/', delete_Router_callback)

export default router