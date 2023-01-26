import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import UUID from "../../../module/uuid.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"
import Datetime from "../../../module/datetime.js"

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

/// 주어진 파일에 대한 DATA URL을 반환하기 위해서
async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_name"])
  const USER_AUTH = Firebase_Api.user_Auth()
  const [FILE_NAME, FILE_EXT] = req.query.file_name.split(".")

  const QRES = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if (QRES.length == 0) throw new Error("The file to download is not searched!")
  const FILE_UUID_TO_DOWNLOAD = QRES[0].file_uuid

  const DATA_URL = await Firebase_Api.string_data_From_Storage(`files/${FILE_UUID_TO_DOWNLOAD}`)
  res.json({ data_url: DATA_URL })
}

// 주어진 파일 오브젝트, 공유 데이터, 메타 데이터를 전부 삭제시키기 위해서
async function delete_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_name"])
  const USER_AUTH = Firebase_Api.user_Auth()
  const [FILE_NAME, FILE_EXT] = req.query.file_name.split(".")

  const QRES = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if(QRES.length == 0) throw new Error("The file to delete is not searched!")
  
  const FILE_UUID_TO_DELETE = QRES[0].file_uuid
  await Firebase_Api.delete_From_Storage(`files/${FILE_UUID_TO_DELETE}`)
  await Firebase_Api.delete_From_Database("share_auths", [["where", "file_uuid", "==", FILE_UUID_TO_DELETE]], false)
  await Firebase_Api.delete_From_Database("file_meta_datas", [["where", "file_uuid", "==", FILE_UUID_TO_DELETE]])
  
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