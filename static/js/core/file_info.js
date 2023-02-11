let FILE_URL = ""
async function main() {
  const FILE_NAME = Browser.url_Query_Param('file_name')
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')

  const FILE_NAME_SEL = document.querySelector("#file_name")
  const FILE_INFO_SEL = document.querySelector("#file_info")
  FILE_NAME_SEL.textContent = FILE_NAME

  FILE_URL = await Rest_API.get_File_Object_Data_URL(FILE_NAME, WORK_DIR_PATH)
  await Element.add_Text_Content_By_Data_Url(FILE_INFO_SEL, FILE_URL)

  document.querySelector("#file_download_link").onclick = on_Click_File_Download_Link
}
main = Wrap.Wrap_With_Try_Alert_Promise(main)

async function on_Click_File_Download_Link()
{
  const FILE_NAME = Browser.url_Query_Param('file_name')
  
  await Browser.download_File(FILE_URL, FILE_NAME)
}
on_Click_File_Download_Link = Wrap.Wrap_With_Try_Alert_Promise(on_Click_File_Download_Link)

main()