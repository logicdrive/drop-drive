async function on_Click_File_Index_Download_Btn_Temp(e)
{
  const FILE_NAME = e.path[1].querySelector("a").textContent
  if(!confirm(`Do you want to download the '${FILE_NAME}' file?`)) return
  
  const DOWNLOADED_FILE_URL = (await Rest_API.request_With_Error_Check(`/api/v1/file?file_name=${FILE_NAME}`, "GET")).download_url
  console.log(DOWNLOADED_FILE_URL)
  
  //파일 다운로드를 받기 위하여 
  const anchorElement = document.createElement('a')
  document.body.appendChild(anchorElement)
  anchorElement.download = FILE_NAME
  anchorElement.href = DOWNLOADED_FILE_URL
  anchorElement.click()
  document.body.removeChild(anchorElement)
  
  alert(`The '${FILE_NAME}' file was successfully downloaded !`)
}