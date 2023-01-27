async function main()
{
  const FILE_NAME = Browser.url_Query_Param('file_name')
  const FILE_URL = await Rest_API.get_File_Object_Data_URL(FILE_NAME)
  await Element.add_Text_Content_By_Data_Url(document.body, FILE_URL)
}
main = Wrap.Wrap_With_Try_Alert_Promise(main)

main()