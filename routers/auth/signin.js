import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 로그인 처리')
})


export default router