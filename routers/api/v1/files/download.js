import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 파일 다운로드 처리')
})


export default router