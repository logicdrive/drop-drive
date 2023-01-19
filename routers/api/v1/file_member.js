import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('[MOCK] 특정 파일에 대한 접근 권한 계정 목록을 얻음')
})

router.post('/', (req, res) => {
    res.send('[MOCK] 특정 유저에게 파일의 접근 권한을 추가하는 처리')
})


export default router