import Firebase_Api from "./firebase_api.js"
import UUID from "./uuid.js"
import Datetime from "./datetime.js"

/** 파이어베이스 관련 비지니스 서비스들을 일관되도록 관리하기 위해서 */
class Firebase_Service
{
  /** 현재 유저가 권한을 가지고 있는지 확인하기 위해서 */
  static async check_User_Auth()
  {
    const USER_AUTH = Firebase_Api.user_Auth()
    if(USER_AUTH == null) throw new Error("The user auth to use is not found !")
    return USER_AUTH
  }
  
  /** 파일 메타데이터 및 내용들을 업로드시키기 위해서 */
  static async upload_File(file_name, file_ext, file_url, work_dir_path, user_auth)
  { 
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`,  [["where", "type", "==", "file"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", file_name], ["where", "file_ext", "==", file_ext]])
    if (QUERY_RESULT_FILE_INFOS.length != 0) throw new Error("The same file name is exist in current working directory !")
    
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

  /** 주어진 파일과 관련된 모든 요소(메타데이터, 공유링크, 공유권한, DATA URL)들을 삭제시키기 위해서 */
  static async delete_File(file_name, file_ext, work_dir_path, user_auth)
  {
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`, [["where", "type", "==", "file"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", file_name], ["where", "file_ext", "==", file_ext]])
    if(QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file to delete is not searched!")
    const FILE_UUID_TO_DELETE = QUERY_RESULT_FILE_INFOS[0].file_uuid
    
    await Firebase_Api.delete_From_Storage(`${user_auth}/${FILE_UUID_TO_DELETE}`)
    await Firebase_Api.delete_From_Database(`app/global/share_links`, [["where", "file_uuid", "==", FILE_UUID_TO_DELETE]], false)
    await Firebase_Api.delete_From_Database(`app/${user_auth}/share_auths`, [["where", "file_uuid", "==", FILE_UUID_TO_DELETE]], false)
    await Firebase_Api.delete_From_Database(`app/${user_auth}/file_meta_datas`, [["where", "file_uuid", "==", FILE_UUID_TO_DELETE]])
  }

  /** 주어진 디렉토리명과 경로를 기반으로 디렉토리를 생성시키기 위해서 */
  static async create_Directory(file_name, work_dir_path, user_auth)
  {
    const QUERY_RESULT_DIR_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`,  [["where", "type", "==", "directory"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", file_name]])
    if (QUERY_RESULT_DIR_INFOS.length != 0) throw new Error("The same directory name is exist in current working directory !")
    
    const CURRENT_TIME_STR = Datetime.timezone_Date_Str()
    const FILE_UUID = UUID.get_UUID()
    await Firebase_Api.upload_To_Database(`app/${user_auth}/file_meta_datas`, {
      "file_name":file_name,
      "file_ext":"",
      "file_uuid":FILE_UUID,
      "type":"directory",
      "path":work_dir_path,
      "created_time":CURRENT_TIME_STR,
    })
    return FILE_UUID
  }

  /** 주어진 디렉토리에 들어있는 파일, 폴더 관련 내용을 반환받기 위해서 */
  static async directory_File_Infos(work_dir_path, user_auth)
  {
    const QUERY_RESULT_META_DATAS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`, [["where", "path", "==", work_dir_path]])

    let file_infos_dic = {"file":[], "directory":[]}
    QUERY_RESULT_META_DATAS.forEach((doc_result) => {
      switch(doc_result.type)
      {
        case "file" :
          file_infos_dic.file.push({file_name:doc_result.file_name + "." + doc_result.file_ext, type:doc_result.type, created_time:doc_result.created_time})
          return
        case "directory" :
          file_infos_dic.directory.push({file_name:doc_result.file_name, type:doc_result.type, created_time:doc_result.created_time})
          return
      }
    })
    return [...file_infos_dic.directory.sort((info_a, info_b) => info_a.file_name.localeCompare(info_b.file_name)), 
            ...file_infos_dic.file.sort((info_a, info_b) => info_a.file_name.localeCompare(info_b.file_name))]
  }

  /** 주어진 디렉토리의 하위 디렉토리 및 파일들을 연쇄적으로 삭제하고, 현재 디렉토리까지 완전하게 삭제시키기 위해서 */
  static async delete_Directory_Recursively(directory_name, work_dir_path, user_auth)
  {
    const QUERY_RESULT_TARGET_DIRECTORY_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`, [["where", "type", "==", "directory"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", directory_name]])
    if(QUERY_RESULT_TARGET_DIRECTORY_INFOS.length == 0) return
    const TARGET_DIRECTORY_UUID = QUERY_RESULT_TARGET_DIRECTORY_INFOS[0].file_uuid
  
    const TARGET_DIRECTORY_WORK_DIR_PATH = work_dir_path + directory_name + "/"
    const QUERY_RESULT_SUB_DIRECTORY_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`, [["where", "type", "==", "directory"], ["where", "path", "==", TARGET_DIRECTORY_WORK_DIR_PATH]])
    for(let sub_directory_info of QUERY_RESULT_SUB_DIRECTORY_INFOS)
      await Firebase_Service.delete_Directory_Recursively(sub_directory_info.file_name, TARGET_DIRECTORY_WORK_DIR_PATH, user_auth)
    
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`, [["where", "type", "==", "file"], ["where", "path", "==", TARGET_DIRECTORY_WORK_DIR_PATH]])
    for(let file_info of QUERY_RESULT_FILE_INFOS)
      await Firebase_Service.delete_File(file_info.file_name, file_info.file_ext, TARGET_DIRECTORY_WORK_DIR_PATH, user_auth)
    
    await Firebase_Api.delete_From_Database(`app/${user_auth}/file_meta_datas`, [["where", "file_uuid", "==", TARGET_DIRECTORY_UUID]])
  }

  /** 특정 파일에 대해서 다른 유저에게 접근 권한을 할당시키기 위해서 */
  static async add_Share_Auth_To_File(file_name, file_ext, work_dir_path, email_to_add, user_auth)
  {
    if(user_auth == email_to_add) throw new Error("The yourself email is automately to share link auth!")
  
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`,  [["where", "type", "==", "file"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", file_name], ["where", "file_ext", "==", file_ext]])
    if(QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file to add auth is not searched!")
    const FILE_UUID = QUERY_RESULT_FILE_INFOS[0].file_uuid
    
    const QUERY_RESULT_SHARE_AUTHS = await Firebase_Api.query_To_Database(`app/${user_auth}/share_auths`, [["where", "file_uuid", "==", FILE_UUID], ["where", "email_auth", "==", email_to_add]])
    if(QUERY_RESULT_SHARE_AUTHS.length != 0) throw new Error("The email auth to add is already added!")
  
    await Firebase_Api.upload_To_Database(`app/${user_auth}/share_auths`, {
      "file_uuid":FILE_UUID,
      "email_auth":email_to_add
    })
  }

  /** 공유된 파일 링크와 매칭되는 파일의 DATA URL을 얻기 위해서 */
  static async share_Data_URL(file_share_id, user_auth)
  {
    const QUERY_RESULT_SHARE_LINKS = await Firebase_Api.query_To_Database(`app/global/share_links`, [["where", "file_share_id", "==", file_share_id]])
    if(QUERY_RESULT_SHARE_LINKS.length == 0) throw new Error("The file id matched for given share link id is not searched !")
    const FILE_UUID = QUERY_RESULT_SHARE_LINKS[0].file_uuid
    const SHARE_FILE_AUTH = QUERY_RESULT_SHARE_LINKS[0].owner
  
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${SHARE_FILE_AUTH}/file_meta_datas`,  [["where", "file_uuid", "==", FILE_UUID]])
    if(QUERY_RESULT_FILE_INFOS.length == 0) throw new Error("The file meta datas is not searched !")
  
    const QUERY_RESULT_SHARE_AUTHS = await Firebase_Api.query_To_Database(`app/${SHARE_FILE_AUTH}/share_auths`, [["where", "file_uuid", "==", FILE_UUID]])
    const FILE_SHARE_AUTHS = QUERY_RESULT_SHARE_AUTHS.map((doc_result) => doc_result.email_auth)
  
    if(!(user_auth == SHARE_FILE_AUTH || FILE_SHARE_AUTHS.includes(user_auth)))
      throw new Error("The user auth is not suitable !")
  
    const DATA_URL = await Firebase_Api.string_data_From_Storage(`${SHARE_FILE_AUTH}/${FILE_UUID}`)
    return DATA_URL
  }

  /** 주어진 파일에 접근할 수 있는 공유링크를 생성하고 반환하기 위해서(이미 존재할 경우 존재하는 공유 링크 반환) */
  static async make_Share_Link(file_name, file_ext, work_dir_path, user_auth, host_name)
  {
    const QUERY_RESULT_FILE_INFOS = await Firebase_Api.query_To_Database(`app/${user_auth}/file_meta_datas`,  [["where", "type", "==", "file"], ["where", "path", "==", work_dir_path], ["where", "file_name", "==", file_name], ["where", "file_ext", "==", file_ext]])
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
        "owner":user_auth
      })
    }
    else
      file_share_id = QUERY_RESULT_SHARE_LINKS[0].file_share_id
    
    const SHARE_LINK = `https://${host_name}/html/file_share.html?file_share_id=${file_share_id}`
    return SHARE_LINK
  }
}

export default Firebase_Service