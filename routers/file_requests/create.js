import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 파일 생성 처리')
})


export default router