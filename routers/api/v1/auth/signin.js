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
    res.redirect("/html/main.html")
  }
  catch(e)
  {
    console.log(e)
    res.json({is_error:true})
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
})

export default router