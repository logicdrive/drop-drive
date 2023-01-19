import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('[MOCK] 파일 다운로드 처리')
})

router.post('/', (req, res) => {
    res.send('[MOCK] 파일 생성 처리')
})

router.delete('/', (req, res) => {
    res.send('[MOCK] 파일 삭제 처리')
})


export default router