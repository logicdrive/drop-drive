import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
    res.send('[MOCK] 파일 다운로드 처리')
})

router.put('/', (req, res) => {
    try
    {
      console.log(req.body)
      res.json({is_error:false})
    }
    catch(e)
    {
      console.log(e)
      res.json({is_error:true})
    }
})

router.delete('/', (req, res) => {
    res.send('[MOCK] 파일 삭제 처리')
})


export default router