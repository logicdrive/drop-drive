import express from "express"
import Firebase_Service from "../../../module/firebase_service.js"
import Params_Check from "../../../module/params_check.js"
import Wrap from "../../../module/wrap.js"

// 특정 파일에 대해서 다른 유저에게 접근 권한을 할당시키기 위해서
async function put_Router_Callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME_EXT, work_dir_path:WORK_DIR_PATH, email_to_add:EMAIL_TO_ADD} 
    = Params_Check.Para_is_null_or_empty(req.body, ["file_name", "work_dir_path", "email_to_add"])
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.split(".")

  await Firebase_Service.add_Share_Auth_To_File(FILE_NAME, FILE_EXT, WORK_DIR_PATH, EMAIL_TO_ADD, USER_AUTH)
  res.send({is_error:false})
}
put_Router_Callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_Callback)

const router = express.Router()
router.put('/', put_Router_Callback)
export default router