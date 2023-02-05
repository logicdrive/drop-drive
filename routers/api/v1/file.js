import express from "express"
import Firebase_Service from "../../../module/firebase_service.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

// 주어진 파일의 메타데이터를 파이어베이스에, 파일 URL을 파이어스토어에 업로드시키기 위해서
async function put_Router_callback(req, res)
{  
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME_EXT, file_url:FILE_URL, work_dir_path:WORK_DIR_PATH}
    = Params_Check.Para_is_null_or_empty(req.body, ["file_name", "file_url", "work_dir_path"])
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.toLowerCase().split(".")
  
  const ACCEPT_FILE_EXTS = ["txt"]
  if(!ACCEPT_FILE_EXTS.includes(FILE_EXT)) throw new Error("Passed file's extension was not accepted.")

  await Firebase_Service.upload_File(FILE_NAME, FILE_EXT, FILE_URL, WORK_DIR_PATH, USER_AUTH)  
  res.json({is_error:false})
}
put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)

/// 주어진 파일에 대한 DATA URL을 반환하기 위해서
async function get_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME_EXT, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.query, ["file_name", "work_dir_path"])
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.toLowerCase().split(".")

  const DATA_URL = await Firebase_Service.file_Data_URL(FILE_NAME, FILE_EXT, WORK_DIR_PATH, USER_AUTH)
  res.json({is_error:false, data_url:DATA_URL})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

// 주어진 파일 오브젝트, 공유 데이터, 메타 데이터를 전부 삭제시키기 위해서
async function delete_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME_EXT, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.query, ["file_name", "work_dir_path"])
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.toLowerCase().split(".")

  await Firebase_Service.delete_File(FILE_NAME, FILE_EXT, WORK_DIR_PATH, USER_AUTH)
  res.json({is_error:false})
}
delete_Router_callback = Wrap.Wrap_With_Try_Res_Promise(delete_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)
router.delete('/', delete_Router_callback)
export default router