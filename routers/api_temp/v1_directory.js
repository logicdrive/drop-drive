import Firebase_Service from "../../module/firebase_service.js"
import Wrap from "../../module/wrap.js"
import Params_Check from "../../module/params_check.js"

// 주어진 디렉토리에 대한 DATA URL을 반환받기 위해서(오버라이딩)
async function post_Router_Callback_Overide(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.body, ["file_name", "work_dir_path"])

  const TEST_DATA_URL = `[TEST DATA URL] FILE_NAME : ${FILE_NAME} / WORK_DIR_PATH : ${WORK_DIR_PATH} / USER_AUTH : ${USER_AUTH}`
  res.json({is_error:false, data_url:TEST_DATA_URL})
}
post_Router_Callback_Overide = Wrap.Wrap_With_Try_Res_Promise(post_Router_Callback_Overide)

export default post_Router_Callback_Overide