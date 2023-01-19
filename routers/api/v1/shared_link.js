import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('[MOCK] 특정 파일에 대한 공유링크를 얻는 처리')
})

router.post('/', (req, res) => {
    res.send('[MOCK] 특정 파일에 대한 공유링크를 생성하는 처리')
})

router.delete('/', (req, res) => {
    res.send('[MOCK] 특정 파일에 대한 공유링크를 제거하는 처리')
})


export default router