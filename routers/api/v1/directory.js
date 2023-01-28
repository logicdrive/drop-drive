import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Wrap from "../../../module/wrap.js"

// 현재 유저가 소유한 파일의 목록을 반환시키기 위해서
async function get_Router_callback(_, res)
{
  const USER_AUTH = Firebase_Api.user_Auth()
  const QUERY_RESULT_META_DATAS = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH]])
  const FILE_INFOS = QUERY_RESULT_META_DATAS.map((doc_result) => {
    return {file_name:doc_result.file_name + "." + doc_result.file_ext, created_time:doc_result.created_time}
  })
  
  res.json({is_error:false, file_infos:FILE_INFOS})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router