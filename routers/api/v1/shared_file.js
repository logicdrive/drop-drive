import express from "express"
import Firebase_Service from "../../../module/firebase_service.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

// 공유된 파일 링크와 매칭되는 파일의 DATA URL을 얻기 위해서
async function get_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_share_id:FILE_SHARE_ID} = Params_Check.Para_is_null_or_empty(req.query, ["file_share_id"])

  const DATA_URL = await Firebase_Service.share_Data_URL(FILE_SHARE_ID, USER_AUTH)
  res.json({is_error:false, data_url:DATA_URL})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router