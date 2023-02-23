/** 주어진 디렉토리를 .zip 형태로 다운받기 위해서(오버라이딩) */
async function on_Click_Download_Directory_Btn_Overide(e)
{
  const DIRECTORY_NAME_TO_DOWNLOAD = e.target.closest(".dropdown-menu").getAttribute("file_name")
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')

  const REQ_RESULT = await Request.JSON_Request("/api/v1/directory", "POST", {
      file_name : DIRECTORY_NAME_TO_DOWNLOAD,
      work_dir_path : WORK_DIR_PATH
  })
  if(REQ_RESULT.is_error)
    throw new Error(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.message}`)
  const TITLE_NAME = REQ_RESULT.file_name
  const ZIP_DATA_URL = REQ_RESULT.data_url
  Download_Manager.download_Files(ZIP_DATA_URL, TITLE_NAME) 
}

/** 다운로드 UI 정보들을 일괄적으로 관리하기 위해서 */
class Download_Manager
{
  static _current_download_infos = []

  /** 주어진 웹툰 정보들을 기반으로 다운로드를 수행하기 위해서 */
  static async download_Files(ZIP_DATA_URL, title_name)
  {  
    const ZIP_NAME = Download_Manager._get_Download_Zip_Name(title_name)
    Download_Manager._add_To_Download_List(ZIP_NAME)

    await Browser.download_File(ZIP_DATA_URL, ZIP_NAME)
    
    Download_Manager._delete_From_Download_List(ZIP_NAME)
  }

  /** 주어진 타이틀 이름을 이용해서 사용할 zip 이름을 생성시키기 위해서 */
  static _get_Download_Zip_Name(title_name)
  {
    const ZIP_NAME = `${title_name}.zip`
    return ZIP_NAME
  }

  /** 다운로드 리스트에 다운로드시킬 파일명을 추가시키기 위해서 */
  static _add_To_Download_List(file_name)
  {
    Download_Manager._current_download_infos.push(file_name)
  }

  /** 다운로드 리스트에서 특정 파일명을 삭제시키기 위해서 */
  static _delete_From_Download_List(file_name)
  {
    Download_Manager._current_download_infos = Download_Manager._current_download_infos.filter((download_info) => download_info != file_name)
  }
}