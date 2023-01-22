import express from "express"
import Wrap from "../../../module/wrap.js"

async function put_Router_callback(req, res)
{
    res.send('[MOCK] 특정 유저에게 파일의 접근 권한을 추가하는 처리')
}

async function get_Router_callback(req, res)
{
  res.send('[MOCK] 특정 파일에 대한 접근 권한 계정 목록을 얻음')
}

put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)

export default router