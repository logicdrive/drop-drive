import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Wrap from "../../../module/wrap.js"

async function get_Router_callback(_, res)
{
  const USER_AUTH = "Sin"

  const DOC_RESULTS = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH]])
  const FILE_NAMES = DOC_RESULTS.map((doc_result) => doc_result.file_name + "." + doc_result.file_ext)
  
  return res.json({is_error:false, file_names:FILE_NAMES})
}

get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)

export default router