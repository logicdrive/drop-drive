import express from "express"
import Firebase_Service from "../../../module/firebase_service.js"
import Wrap from "../../../module/wrap.js"
import Params_Check from "../../../module/params_check.js"
import post_Router_Callback_Overide from "../../api_temp/v1_directory.js"

// 주어진 디렉토리명과 경로를 기반으로 디렉토리를 생성시키기 위해서
async function put_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.body, ["file_name", "work_dir_path"])

  await Firebase_Service.create_Directory(FILE_NAME.toLowerCase(), WORK_DIR_PATH, USER_AUTH)
  res.json({is_error:false})
}
put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)

// 주어진 디렉토리에 들어있는 파일, 폴더 관련 내용을 반환받기 위해서
async function get_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.query, ["work_dir_path"])

  const FILE_INFOS = await Firebase_Service.directory_File_Infos(WORK_DIR_PATH, USER_AUTH)
  res.json({is_error:false, file_infos:FILE_INFOS})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

// 주어진 디렉토리에 대한 DATA URL을 반환받기 위해서
async function post_Router_callback(req, res)
{
  await post_Router_Callback_Overide(req, res)
}
post_Router_callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_callback)

// 주어진 디렉토리의 하위 디렉토리들을 연쇄적으로 삭제하고, 현재 디렉토리까지 완전하게 삭제시키기 위해서
async function delete_Router_callback(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME, work_dir_path:WORK_DIR_PATH}
    = Params_Check.Para_is_null_or_empty(req.query, ["file_name", "work_dir_path"])

  await Firebase_Service.delete_Directory_Recursively(FILE_NAME, WORK_DIR_PATH, USER_AUTH)
  res.json({is_error:false})
}
delete_Router_callback = Wrap.Wrap_With_Try_Res_Promise(delete_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)
router.post('/', post_Router_callback)
router.delete('/', delete_Router_callback)
export default router