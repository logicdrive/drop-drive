import express from "express"
import { firebase_auth } from "../../../../module/firebase.js"
import { signInWithEmailAndPassword } from "firebase/auth"

const router = express.Router()

router.post('/', async (req, res) => {
  const EMAIL = req.body.email
  const PASSWORD = req.body.password

  try
  {
    await signInWithEmailAndPassword(firebase_auth, EMAIL, PASSWORD)
    res.json({error_code:null})
  }
  catch(e)
  {
    console.log(e)
    res.json({error_code:e.code})
  }
})

export default router