import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 특정 유저에게 파일의 접근 권한을 추가하는 처리')
})


export default router