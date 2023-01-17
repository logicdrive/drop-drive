import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('특정 유저의 권한 여부를 반환')
})


export default router