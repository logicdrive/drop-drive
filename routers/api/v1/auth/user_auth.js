import express from "express"
import { firebase_auth } from "../../../../module/firebase.js"

const router = express.Router()


router.get('/', (req, res) => {
    // console.log(firebase_auth.currentUser) // 로그인한 유저명을 얻기
    res.json({user_auth:"SIN"}) // 현재 유저가 가지고 있는 권한을 반환 [MOCK]
})


export default router