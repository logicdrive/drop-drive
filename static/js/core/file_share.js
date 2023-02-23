let OBJECT_DATA_INFO = null
async function main()
{
  const FILE_SHARE_ID = Browser.url_Query_Param('file_share_id')
  OBJECT_DATA_INFO = await Rest_API.get_Share_File_Object_Data_Info(FILE_SHARE_ID)

  const FILE_NAME_SEL = document.querySelector("#file_name")
  const FILE_INFO_SEL = document.querySelector("#file_info")
  FILE_NAME_SEL.textContent = OBJECT_DATA_INFO.file_name

  Element.add_Content_By_Data_Url(FILE_INFO_SEL, OBJECT_DATA_INFO.data_url)

  
  document.querySelector("#file_download_link").onclick = on_Click_File_Download_Link

  document.querySelector("#main_page").style.visibility = "visible"
  document.querySelector("#loading_page").remove()
}
main = Wrap.Wrap_With_Try_Alert_Promise(main)

async function on_Click_File_Download_Link()
{
  await Browser.download_File(OBJECT_DATA_INFO.data_url, OBJECT_DATA_INFO.file_name)
}
on_Click_File_Download_Link = Wrap.Wrap_With_Try_Alert_Promise(on_Click_File_Download_Link)

main()