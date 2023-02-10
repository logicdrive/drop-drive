async function main()
{
  const FILE_SHARE_ID = Browser.url_Query_Param('file_share_id')
  const OBJECT_DATA_INFO = await Rest_API.get_Share_File_Object_Data_Info(FILE_SHARE_ID)

  const FILE_NAME_SEL = document.querySelector("#file_name")
  const FILE_INFO_SEL = document.querySelector("#file_info")
  FILE_NAME_SEL.textContent = OBJECT_DATA_INFO.file_name
  
  await Element.add_Text_Content_By_Data_Url(FILE_INFO_SEL, OBJECT_DATA_INFO.data_url)
}
main = Wrap.Wrap_With_Try_Alert_Promise(main)

main()