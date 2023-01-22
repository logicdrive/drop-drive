import express from "express"
import { firebase_auth } from "../../../../module/firebase.js"
import Wrap from "../../../../module/wrap.js"

async function get_Router_callback(_, res)
{
  res.json({user_auth: (firebase_auth.currentUser) ? firebase_auth.currentUser.email : null})
}

get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)

export default router