import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 파일 목록 출력 처리')
})


export default router