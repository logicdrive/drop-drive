import Firebase_Api from "./firebase_api.js"
import UUID from "./uuid.js"
import Datetime from "./datetime.js"

/** 파이어베이스 관련 비지니스 서비스들을 일관되도록 관리하기 위해서 */
class Firebase_Service
{
  /** 파일 메타데이터 및 내용들을 업로드시키기 위해서 */
  static async upload_File(file_name, file_ext, file_url, work_dir_path, user_auth)
  { 
    const CURRENT_TIME_STR = Datetime.timezone_Date_Str()
    const FILE_UUID = UUID.get_UUID()
    await Firebase_Api.upload_To_Database(`app/${user_auth}/file_meta_datas`, {
      "file_name":file_name,
      "file_ext":file_ext,
      "file_uuid":FILE_UUID,
      "type":"file",
      "path":work_dir_path,
      "created_time":CURRENT_TIME_STR,
    })
    await Firebase_Api.upload_String_To_Storage(`${user_auth}/${FILE_UUID}`, file_url)
    return FILE_UUID
  }
}

export default Firebase_Service