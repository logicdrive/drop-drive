import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 회원가입 처리')
})


export default router