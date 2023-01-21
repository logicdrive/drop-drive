import express from "express"
import Wrap from "../../../module/wrap.js"

async function put_Router_callback(req, res)
{
    res.send('[MOCK] 특정 파일에 대한 공유링크를 생성하는 처리')
}

async function get_Router_callback(req, res)
{
  res.send('[MOCK] 특정 파일에 대한 공유링크를 얻는 처리')
}

async function delete_Router_callback(req, res)
{
  res.send('[MOCK] 특정 파일에 대한 공유링크를 제거하는 처리')
}

put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)
delete_Router_callback = Wrap.Wrap_With_Try_Res_Promise(delete_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)
router.delete('/', delete_Router_callback)

export default router