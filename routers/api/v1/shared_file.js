import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_share_id"])
  const USER_AUTH = Firebase_Api.user_Auth()
  if(USER_AUTH == null) throw new Error("The user auth to use is not found !")
  
  const {file_share_id:FILE_SHARE_ID} = req.query
  
  console.log(FILE_SHARE_ID)
  res.json({is_error:false, data_url:"data:text/plain;base64,VEVTVCAxCg=="})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router