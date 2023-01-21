import express from "express"
import { firebase_auth } from "../../../../module/firebase.js"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"

const router = express.Router()

router.post('/', async (req, res) => {
  //현재사용자 객체 받아오기
  const EMAIL = req.body.email
  const PASSWORD = req.body.password
  const PASSWORD_RETYPE = req.body.password_retype

  // TODO : PASSWORD_RETYPE 쓰기
  
  //이메일 인증으로 회원가입
  try
  {
    await createUserWithEmailAndPassword(firebase_auth, EMAIL, PASSWORD)
    await sendEmailVerification(firebase_auth.currentUser)
    res.json({error_code:null})
  }
  catch(e)
  {
    console.log(e)
    res.json({error_code:e.code})
  }
})

export default router