import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import UUID from "../../../module/uuid.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_name"])
  const USER_AUTH = Firebase_Api.user_Auth()
  const {file_name:FILE_NAME_EXT} = req.query
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.split(".")

  const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if (QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file to make a shared link is not searched!")
  const FILE_UUID = QUERY_RESULT_FILE_INFOS[0].file_uuid

  const QUERY_RESULT_SHARE_LINKS = await Firebase_Api.query_To_Database("share_links", [["where", "file_uuid", "==", FILE_UUID]])
  let file_share_id = ""
  if (QUERY_RESULT_SHARE_LINKS.length == 0)
  {
    file_share_id = UUID.get_UUID()
    await Firebase_Api.upload_To_Database("share_links", {
      "file_uuid":FILE_UUID,
      "file_share_id":file_share_id
    })
  }
  else
    file_share_id = QUERY_RESULT_SHARE_LINKS[0].file_share_id
  
  const SHARE_LINK = `https://${req.headers.host}/html/file_share.html?file_share_id=${file_share_id}`
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