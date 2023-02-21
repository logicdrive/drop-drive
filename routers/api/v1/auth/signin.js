import express from "express"
import Firebase_Api from "../../../../module/firebase_api.js"
import Wrap from "../../../../module/wrap.js"
import Params_Check from "../../../../module/params_check.js"

import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"

// 사용자로부터 받은 정보를 기반으로 로그인을 수행하기 위해서
async function post_Router_Callback(req, res)
{
  const {type:TYPE} = Params_Check.Para_is_null_or_empty(req.body, ["type"])
  const ACCEPT_TYPES = ["email", "google"]
  if(!ACCEPT_TYPES.includes(TYPE)) throw new Error("Passed login type was not accepted.")

  switch(TYPE)
  {
    case "email" :
      const {email:EMAIL, password:PASSWORD} = Params_Check.Para_is_null_or_empty(req.body, ["email", "password"])
      await Firebase_Api.login(EMAIL, PASSWORD)
      break

    case "google" :
      const {token:TOKEN} = Params_Check.Para_is_null_or_empty(req.body, ["token"])
      
      const FIREBASE_AUTH = Firebase_Api.get_Firebase_Object("FIREBASE_AUTH")
      const GOOGLE_CREDENTIAL = GoogleAuthProvider.credential(TOKEN)
      signInWithCredential(FIREBASE_AUTH, GOOGLE_CREDENTIAL)
      break
  }
  
  res.json({is_error:false})
}
post_Router_Callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_Callback)

const router = express.Router()
router.post('/', post_Router_Callback)
export default router