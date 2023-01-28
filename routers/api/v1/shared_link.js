import express from "express"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_name"])
  const {file_name:FILE_NAME} = req.query

  const FILE_SHARE_ID = "abcde-fghi-jkl"
  const SHARE_LINK = `https://${req.headers.host}/html/file_share.html?file_share_id=${FILE_SHARE_ID}`
  res.json({is_error:false, shared_link:SHARE_LINK})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

async function delete_Router_callback(req, res)
{
  res.send('[MOCK] 특정 파일에 대한 공유링크를 제거하는 처리')
}
delete_Router_callback = Wrap.Wrap_With_Try_Res_Promise(delete_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
router.delete('/', delete_Router_callback)
export default router