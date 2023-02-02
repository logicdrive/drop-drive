import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"

// 주어진 디렉토리명과 경로를 기반으로 디렉토리를 생성시키기 위해서
async function put_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.body, ["file_name", "work_dir_path"])
  const {file_name:FILE_NAME, work_dir_path:WORK_DIR_PATH} = req.body
  
  const USER_AUTH = Firebase_Api.user_Auth()
  if(USER_AUTH == null) throw new Error("The user auth to use is not found !")

  console.log(`[MOCK] '${FILE_NAME}'의 이름을 가진 디렉토리가 '${WORK_DIR_PATH}'경로에 생성되기 위해서`)
  res.json({is_error:false})
}
put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)

// 현재 유저가 소유한 파일의 목록을 반환시키기 위해서
async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["work_dir_path"])
  const {work_dir_path:WORK_DIR_PATH} = req.query
  
  const USER_AUTH = Firebase_Api.user_Auth()
  if(USER_AUTH == null) throw new Error("The user auth to use is not found !")
  
  const QUERY_RESULT_META_DATAS = await Firebase_Api.query_To_Database(`app/${USER_AUTH}/file_meta_datas`, [["where", "type", "==", "file"], ["where", "path", "==", WORK_DIR_PATH]])
  const FILE_INFOS = QUERY_RESULT_META_DATAS.map((doc_result) => {
    return {file_name:doc_result.file_name + "." + doc_result.file_ext, created_time:doc_result.created_time}
  })
  
  res.json({is_error:false, file_infos:FILE_INFOS})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)
export default router