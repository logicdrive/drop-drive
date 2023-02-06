import express from "express"
import Firebase_Service from "../../../../module/firebase_service.js"
import Firebase_Api from "../../../../module/firebase_api.js"
import Wrap from "../../../../module/wrap.js"

// 사용자로부터 받은 정보를 기반으로 로그아웃을 수행하기 위해서
async function get_Router_callback(_, res)
{
  await Firebase_Service.check_User_Auth()
  await Firebase_Api.logout()
  res.json({is_error:false})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router