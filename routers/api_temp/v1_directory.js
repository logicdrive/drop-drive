import Firebase_Service from "../../module/firebase_service.js"
import Wrap from "../../module/wrap.js"
import Params_Check from "../../module/params_check.js"

import UUID from "../../module/uuid.js"
import fs from "fs"
import { exec } from "child_process"

// 주어진 디렉토리에 대한 DATA URL을 반환받기 위해서(오버라이딩)
async function post_Router_Callback_Overide(req, res)
{
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.body, ["file_name", "work_dir_path"])

  const TEST_DATA_URL = `[TEST DATA URL] FILE_NAME : ${FILE_NAME} / WORK_DIR_PATH : ${WORK_DIR_PATH} / USER_AUTH : ${USER_AUTH}`

  const FOLDER_UUID = UUID.get_UUID()
  const DOWNLOAD_FOLDER_PATH = `./downloads/${FOLDER_UUID}`
  fs.mkdirSync(DOWNLOAD_FOLDER_PATH)

  await make_Directory_Recursively(DOWNLOAD_FOLDER_PATH, WORK_DIR_PATH, USER_AUTH)

  const ZIP_PATH = `./downloads/${FOLDER_UUID}.zip`
  await System.execute_Shell_Command(`cd ${DOWNLOAD_FOLDER_PATH};zip -r ../${FOLDER_UUID}.zip ./*`)

  const ZIP_DATA_BASE64 = fs.readFileSync(ZIP_PATH, {encoding: 'base64'})
  const ZIP_DATA_URL = "data:file/zip;base64," + ZIP_DATA_BASE64

  fs.rmSync(DOWNLOAD_FOLDER_PATH, {recursive: true, force: true})
  fs.rmSync(ZIP_PATH, {force: true})
  
  res.json({is_error:false, file_name: "file", data_url:ZIP_DATA_URL})
}

async function make_Directory_Recursively(download_folder_path, work_dir_path, user_auth) {
  const RESULT_TARGET_DIRECTORY_INFOS = await Firebase_Service.directory_File_Infos(work_dir_path, user_auth)
  if(RESULT_TARGET_DIRECTORY_INFOS.length == 0) return

  for(let sub_content_info of RESULT_TARGET_DIRECTORY_INFOS) {
    if(sub_content_info.type == "directory") {
      const DOWNLOAD_SUB_FOLDER_PATH = `${download_folder_path}/${sub_content_info.file_name}`
      const WORK_DIR_PATH = work_dir_path + sub_content_info.file_name + '/'
      fs.mkdirSync(DOWNLOAD_SUB_FOLDER_PATH)
      make_Directory_Recursively(DOWNLOAD_SUB_FOLDER_PATH, WORK_DIR_PATH, user_auth)
    }
    if(sub_content_info.type == "file") {
      const FILE_INFO = sub_content_info.file_name
      const [FILE_NAME, FILE_EXT] = FILE_INFO.split(".")
      const DATA_URL = await Firebase_Service.file_Data_URL(FILE_NAME, FILE_EXT, work_dir_path, user_auth)
      
      const FILE_CONTENT = atob(DATA_URL.split(',')[1])
      const DOWNLOAD_FILE_PATH = `${download_folder_path}/${FILE_INFO}`
      fs.writeFileSync(DOWNLOAD_FILE_PATH, FILE_CONTENT)
    }
  }
}

/** 시스템관련 명령어를 실행시킨기 위한 라이브러리 */
class System
{
  /** 주어진 쉘 커멘드를 실행시키기 위해서 */
  static execute_Shell_Command(shell_command)
  {
    return new Promise((resolve, reject) => {
      exec(shell_command, (error, stdout, stderr) => {
        if(error) reject(stderr)
        else resolve(stdout)
      })
    })
  }

  /** 서버 요청 과부화등을 방지하는 이유로 의도적으로 처리 속도를 조절하기 위해서 */
  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}        

post_Router_Callback_Overide = Wrap.Wrap_With_Try_Res_Promise(post_Router_Callback_Overide)

export default post_Router_Callback_Overide