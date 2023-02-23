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
  
  const ZIP_DATA_URL = REQ_RESULT.data_url
  await Browser.download_File(ZIP_DATA_URL, `${DIRECTORY_NAME_TO_DOWNLOAD}.zip`)
}