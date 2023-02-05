import express from "express"
import Firebase_Service from "../../../module/firebase_service.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

/** 주어진 파일에 접근할 수 있는 공유링크를 생성하고 반환하기 위해서 */
async function get_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME_EXT, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.query, ["file_name", "work_dir_path"])
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.split(".")
  
  const SHARE_LINK = await Firebase_Service.make_Share_Link(FILE_NAME, FILE_EXT, WORK_DIR_PATH, USER_AUTH, req.headers.host)
  res.json({is_error:false, shared_link:SHARE_LINK})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router