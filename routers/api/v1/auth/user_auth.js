import express from "express"
import Firebase_Api from "../../../../module/firebase_api.js"
import Wrap from "../../../../module/wrap.js"

// 현재 세션에서 사용자가 지닌 계정정보를 얻기 위해서
async function get_Router_callback(_, res)
{
  res.json({user_auth: Firebase_Api.user_Auth()})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router