import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('[MOCK] 특정 디렉터리의 파일 목록 출력 처리')
})

export default router