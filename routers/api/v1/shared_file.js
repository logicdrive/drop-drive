import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["file_share_id"])
  const USER_AUTH = Firebase_Api.user_Auth()
  if(USER_AUTH == null) throw new Error("The user auth to use is not found !")
  
  const {file_share_id:FILE_SHARE_ID} = req.query

  const QUERY_RESULT_SHARE_LINKS = await Firebase_Api.query_To_Database(`app/global/share_links`, [["where", "file_share_id", "==", FILE_SHARE_ID]])
  if(QUERY_RESULT_SHARE_LINKS.length == 0) throw new Error("The file id matched for given share link id is not searched !")
  const FILE_UUID = QUERY_RESULT_SHARE_LINKS[0].file_uuid
  const SHARE_FILE_AUTH = QUERY_RESULT_SHARE_LINKS[0].owner

  const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${SHARE_FILE_AUTH}/file_meta_datas`,  [["where", "file_uuid", "==", FILE_UUID]])
  if(QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file meta datas is not searched !")

  const QUERY_RESULT_SHARE_AUTHS = await Firebase_Api.query_To_Database(`app/${SHARE_FILE_AUTH}/share_auths`, [["where", "file_uuid", "==", FILE_UUID]])
  const FILE_SHARE_AUTHS = QUERY_RESULT_SHARE_AUTHS.map((doc_result) => doc_result.email_auth)

  if(!(USER_AUTH == SHARE_FILE_AUTH || FILE_SHARE_AUTHS.includes(USER_AUTH)))
    throw new Error("The user auth is not suitable !")

  const DATA_URL = await Firebase_Api.string_data_From_Storage(`${SHARE_FILE_AUTH}/${FILE_UUID}`)
  res.json({is_error:false, data_url:DATA_URL})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router