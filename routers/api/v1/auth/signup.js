import express from "express"
import { firebase_auth, firebase_store } from "../../../../module/firebase.js"
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

const router = express.Router()

router.post('/', (req, res) => {
  //현재사용자 객체 받아오기
  const auth = getAuth()
  const email = req.body.email
  const password1 = req.body.password1
  const password2 = req.body.password2
  const nickname = req.body.nickname
  const name = req.body.name

  const password = password1
  //확인 비밀번호가 서로 다를때
  if (password1 != password2)
    res.redirect("/html/login.html")

  createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) =>  {
    const user = userCredential.user
    const currentUser = {
        id : user.uid,
        email : email,
        nickname : nickname,
        name : name,
        emailVerified : user.emailVerified
    }
    await setDoc(doc(firebase_store, "users", currentUser.id), {
        name: currentUser.name,
        email: currentUser.email
    })
  })
  .catch((error) => {
    const errorCode = error.code
    const errorMessage = error.message
    if (errorCode == 'auth/weak-password') 
      alert('The password is too weak.')
  
    console.log(errorMessage[errorCode])
  })

  sendEmailVerification(auth.currentUser)
  .then(() => {
    console.log('email succesfully sent')
  })
  .catch((error) => {
    const errorCode = error.code
    const errorMessage = error.message
  
    console.log(errorMessage[errorCode])
  })

  //이메일 인증으로 회원가입
  const joinWithVerification = async (email, password) => {
    try {
      const auth = getAuth()
      await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(auth.currentUser)
    } catch (error) {
      const errorMessage = error.message;
      const code = error.code
      console.log(errorMessage[code])
    }
  }

  joinWithVerification(email, password)
  res.redirect("/html/login.html")
  //res.send('[MOCK] 회원가입 처리')
})

export default router