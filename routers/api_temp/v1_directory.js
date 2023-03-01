import Firebase_Service from "../../module/firebase_service.js"
import Wrap from "../../module/wrap.js"
import Params_Check from "../../module/params_check.js"

import UUID from "../../module/uuid.js"
import System from "../../module/system.js"
import fs from "fs"

// 주어진 디렉토리에 대한 DATA URL을 반환받기 위해서(오버라이딩)
async function post_Router_Callback_Overide(req, res)
{    
  const USER_AUTH = await Firebase_Service.check_User_Auth()
  const {file_name:FILE_NAME, work_dir_path:WORK_DIR_PATH} 
    = Params_Check.Para_is_null_or_empty(req.body, ["file_name", "work_dir_path"])

  
  const download_target = new Download_Manager()
  await download_target.count_SubContents_Recursively(WORK_DIR_PATH + FILE_NAME + "/", USER_AUTH)

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.write(`${download_target.total}`)

  
  const IntervalId = setInterval(()=> {
    res.write(`${download_target.current_progress}`)
  }, 500)

  
  await download_target.download_folder(USER_AUTH, FILE_NAME, WORK_DIR_PATH)

  clearInterval(IntervalId)
  
  res.write(`zip_data_url: ${download_target.ZIP_DATA_URL}\n`)
  res.end()
}

class Download_Manager {
  constructor() {
    this.total = 0
    this.current_progress = 0
    this.ZIP_DATA_URL = ""
  }

  async download_folder(USER_AUTH, FILE_NAME, WORK_DIR_PATH) {
    const FOLDER_UUID = UUID.get_UUID()
    const DOWNLOAD_FOLDER_PATH = `./downloads/${FOLDER_UUID}`
    fs.mkdirSync(DOWNLOAD_FOLDER_PATH)

    await this.make_Directory_Recursively(DOWNLOAD_FOLDER_PATH, WORK_DIR_PATH + FILE_NAME + "/", USER_AUTH)

    const ZIP_PATH = `./downloads/${FOLDER_UUID}.zip`
    await System.execute_Shell_Command(`cd ${DOWNLOAD_FOLDER_PATH};zip -r ../${FOLDER_UUID}.zip ./*`)
  
    const ZIP_DATA_BASE64 = fs.readFileSync(ZIP_PATH, {encoding: 'base64'})
    this.ZIP_DATA_URL = "data:file/zip;base64," + ZIP_DATA_BASE64
    
    fs.rmSync(DOWNLOAD_FOLDER_PATH, {recursive: true, force: true})
    fs.rmSync(ZIP_PATH, {force: true})
  }

  async count_SubContents_Recursively(work_dir_path, user_auth) {
    const RESULT_TARGET_DIRECTORY_INFOS = await Firebase_Service.directory_File_Infos(work_dir_path, user_auth)
    this.total += RESULT_TARGET_DIRECTORY_INFOS.length
    for(let sub_content_info of RESULT_TARGET_DIRECTORY_INFOS) {
      if(sub_content_info.type == "directory") {
        const WORK_DIR_PATH = work_dir_path + sub_content_info.file_name + '/'
        await this.count_SubContents_Recursively(WORK_DIR_PATH, user_auth)
      }
    }
  }

  async make_Directory_Recursively(download_folder_path, work_dir_path, user_auth) {
    const RESULT_TARGET_DIRECTORY_INFOS = await Firebase_Service.directory_File_Infos(work_dir_path, user_auth)
    if(RESULT_TARGET_DIRECTORY_INFOS.length == 0) return
    for(let sub_content_info of RESULT_TARGET_DIRECTORY_INFOS) {
      this.current_progress++;
      if(sub_content_info.type == "directory") {
        const DOWNLOAD_SUB_FOLDER_PATH = `${download_folder_path}/${sub_content_info.file_name}`
        const WORK_DIR_PATH = work_dir_path + sub_content_info.file_name + '/'
        fs.mkdirSync(DOWNLOAD_SUB_FOLDER_PATH)
        await this.make_Directory_Recursively(DOWNLOAD_SUB_FOLDER_PATH, WORK_DIR_PATH, user_auth)
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
}

post_Router_Callback_Overide = Wrap.Wrap_With_Try_Res_Promise(post_Router_Callback_Overide)

export default post_Router_Callback_Overide