/** 주어진 디렉토리를 .zip 형태로 다운받기 위해서(오버라이딩) */
async function on_Click_Download_Directory_Btn_Overide(e)
{
  const DIRECTORY_NAME_TO_DOWNLOAD = e.target.closest(".dropdown-menu").getAttribute("file_name")
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  
  alert(`[MOCK] 주어진 디렉토리인 '${WORK_DIR_PATH}${DIRECTORY_NAME_TO_DOWNLOAD}'의 전체 내용을 .zip로 다운받아야 함`)   
}