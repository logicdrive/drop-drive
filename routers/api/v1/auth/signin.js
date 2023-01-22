import express from "express"
import Firebase_Api from "../../../../module/firebase_api.js"
import Wrap from "../../../../module/wrap.js"
import Params_Check from "../../../../module/params_check.js"

// 사용자로부터 받은 정보를 기반으로 로그인을 수행하기 위해서
async function post_Router_callback(req, res)
{
  Params_Check.Para_is_null(req.body, ["email", "password"])
  const {email:EMAIL, password:PASSWORD} = req.body

  await Firebase_Api.login(EMAIL, PASSWORD)
  res.json({is_error:false})
}

post_Router_callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.post('/', post_Router_callback)

export default router