import express from "express"
import Firebase_Api from "../../../../module/firebase_api.js"
import Wrap from "../../../../module/wrap.js"
import Params_Check from "../../../../module/params_check.js"

// 사용자로부터 입력받은 정보의 유효성을 확인하고, 회원가입을 수행하기 위해서
async function post_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.body, ["email", "password", "password_retype"])
  const {email:EMAIL, password:PASSWORD, password_retype:PASSWORD_RETYPE} = req.body
  
  if(PASSWORD != PASSWORD_RETYPE) 
    throw new Error("Password do not match")

  await Firebase_Api.create_User(EMAIL, PASSWORD)
  res.json({is_error:false})
}

post_Router_callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.post('/', post_Router_callback)

export default router