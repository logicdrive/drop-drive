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

  /** 주어진 정보에 매칭하는 DATA URL을 반환시킴 */
  static async file_Data_URL(file_name, file_ext, work_dir_path, user_auth)
  {
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`,  [["where", "type", "==", "file"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", file_name], ["where", "file_ext", "==", file_ext]])
    if (QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file to download is not searched!")
    const FILE_UUID_TO_DOWNLOAD = QUERY_RESULT_FILE_INFOS[0].file_uuid
    const DATA_URL = await Firebase_Api.string_data_From_Storage(`${user_auth}/${FILE_UUID_TO_DOWNLOAD}`)
    return DATA_URL
  }
}

export default Firebase_Service