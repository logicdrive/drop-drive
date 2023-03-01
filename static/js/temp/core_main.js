/** 주어진 디렉토리를 .zip 형태로 다운받기 위해서(오버라이딩) */
async function on_Click_Download_Directory_Btn_Overide(e)
{
  const DIRECTORY_NAME_TO_DOWNLOAD = e.target.closest(".dropdown-menu").getAttribute("file_name")
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const READER = await Request.create_Event_Stream_JSON_Request("/api/v1/directory", "POST",  {
       file_name : DIRECTORY_NAME_TO_DOWNLOAD,
       work_dir_path : WORK_DIR_PATH
  })

  
  const SEL_PROGRESS_BAR_CONTAINER = e.target.closest("li").nextElementSibling
  const SEL_PROGRESS_BAR = SEL_PROGRESS_BAR_CONTAINER.children[0]
  SEL_PROGRESS_BAR_CONTAINER.style.display = "block"

  
  let chunk_data = ""
  const TOTAL_PROGRESS = Number((await Request.use_Event_Stream_Request(READER)).chunk_data)
  while(true)
  {
    const RES_DATA = await Request.use_Event_Stream_Request(READER)
    if(RES_DATA.is_done) {
      SEL_PROGRESS_BAR_CONTAINER.style.display = "none"
      SEL_PROGRESS_BAR.textContent = "0%"
      SEL_PROGRESS_BAR.style.width = "0%"
      break
    }
    
    chunk_data = RES_DATA.chunk_data
    if(!isNaN(Number(chunk_data))) {
      const CURRENT_PERCENTAGE = Math.floor(Number(chunk_data)/TOTAL_PROGRESS*100)
      SEL_PROGRESS_BAR.textContent = `${CURRENT_PERCENTAGE}%`
      SEL_PROGRESS_BAR.style.width = `${CURRENT_PERCENTAGE}%`
    } 
  }

  
  const ZIP_DATA_URL = chunk_data.split(" ")[1]
  await Browser.download_File(ZIP_DATA_URL, `${DIRECTORY_NAME_TO_DOWNLOAD}.zip`)
  return
}