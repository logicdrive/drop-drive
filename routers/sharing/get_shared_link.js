import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 특정 파일에 대한 공유링크를 생성하고, 건네주는 처리')
})


export default router