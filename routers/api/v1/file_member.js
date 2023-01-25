import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Params_Check from "../../../module/params_check.js"
import Wrap from "../../../module/wrap.js"

async function put_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.body, ["file_name", "email_to_add"])
  
  const USER_AUTH = Firebase_Api.user_Auth()
  const {file_name:FILE_NAME_EXT, email_to_add:EMAIL_TO_ADD} = req.body
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.split(".")

  console.log(USER_AUTH, EMAIL_TO_ADD, FILE_NAME, FILE_EXT)

  res.send({is_error:false})
}

async function get_Router_callback(req, res)
{
  res.send('[MOCK] 특정 파일에 대한 접근 권한 계정 목록을 얻음')
}

put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)

export default router