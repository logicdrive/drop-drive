import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 특정 파일에 대한 접근 권한 계정 목록을 얻음')
})


export default router