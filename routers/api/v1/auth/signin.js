import express from "express"
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"

const router = express.Router()

router.post('/', (req, res) => {

  const auth = getAuth()
  const email = req.body.email
  const password = req.body.password

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      //console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorMessage[errorCode])
    })
  
  const login = async (email, password) => {
    try {
      const auth = getAuth()
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const { stsTokenManager, uid } = user
      setAuthInfo({ uid, email, authToken: stsTokenManager })
      
    } catch ({ code, message }) {
      const errorCode = error.code
      const errorMessage = error.message
      alert(errorMessage[code])
    }
  }

  // const logout = async () => {
  //   const isLogOut = window.confirm(authMessage['auth/logout-confirm']);
  //   if (!isLogOut) return;

  //   try {
  //     const auth = getAuth();
  //     await signOut(auth);
  //     setAuthInfo(initialState);
  //     navigate('/');
  //   } catch ({ code, message }) {
  //     alert(errorMessage[code]);
  //   }
  // };

  res.send('[MOCK] 로그인 처리')
})

export default router