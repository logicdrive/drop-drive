async function main()
{
  const FILE_SHARE_ID = Browser.url_Query_Param('file_share_id')
  const FILE_URL = await Rest_API.get_Share_File_Object_Data_URL(FILE_SHARE_ID)
  await Element.add_Text_Content_By_Data_Url(document.body, FILE_URL)
}
main = Wrap.Wrap_With_Try_Alert_Promise(main)

main()