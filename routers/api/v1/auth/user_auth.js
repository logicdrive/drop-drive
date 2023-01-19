import express from "express"
import { firebase_auth } from "../../../../module/firebase.js"

const router = express.Router()

router.get('/', (_, res) => {
    res.json({user_auth: (firebase_auth.currentUser) ? firebase_auth.currentUser.email : null})
})

export default router