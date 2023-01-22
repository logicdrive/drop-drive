import express from "express"
import { firebase_auth } from "../../../../module/firebase.js"
import Wrap from "../../../../module/wrap.js"
import Params_Check from "../../../../module/params_check.js"
import { signInWithEmailAndPassword } from "firebase/auth"

async function post_Router_callback(req, res)
{
  Params_Check.Para_is_null(req.body, ["email", "password"])
  const {email:EMAIL, password:PASSWORD} = req.body

  try {
    await signInWithEmailAndPassword(firebase_auth, EMAIL, PASSWORD)
    res.json({is_error:false})
  } catch(e) { throw new Error(e.code) }
}

post_Router_callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.post('/', post_Router_callback)

export default router