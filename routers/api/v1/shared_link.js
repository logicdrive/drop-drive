import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import UUID from "../../../module/uuid.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

/** 주어진 파일에 접근할 수 있는 공유링크를 생성하고 반환하기 위해서 */
async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_name", "work_dir_path"])
  const USER_AUTH = Firebase_Api.user_Auth()
  if(USER_AUTH == null) throw new Error("The user auth to use is not found !")
  
  const {file_name:FILE_NAME_EXT, work_dir_path:WORK_DIR_PATH} = req.query
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.split(".")

  const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${USER_AUTH}/file_meta_datas`,  [["where", "type", "==", "file"], ["where", "path", "==", WORK_DIR_PATH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if (QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file to make a shared link is not searched!")
  const FILE_UUID = QUERY_RESULT_FILE_INFOS[0].file_uuid

  const QUERY_RESULT_SHARE_LINKS = await Firebase_Api.query_To_Database(`app/global/share_links`, [["where", "file_uuid", "==", FILE_UUID]])
  let file_share_id = ""
  if (QUERY_RESULT_SHARE_LINKS.length == 0)
  {
    file_share_id = UUID.get_UUID()
    await Firebase_Api.upload_To_Database(`app/global/share_links`, {
      "file_uuid":FILE_UUID,
      "file_share_id":file_share_id,
      "owner":USER_AUTH
    })
  }
  else
    file_share_id = QUERY_RESULT_SHARE_LINKS[0].file_share_id
  
  const SHARE_LINK = `https://${req.headers.host}/html/file_share.html?file_share_id=${file_share_id}`
  res.json({is_error:false, shared_link:SHARE_LINK})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router