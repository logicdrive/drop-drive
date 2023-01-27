async function main()
{
  const FILE_NAME = Browser.url_Query_Param('file_name')
  const DATA_URL = (await Rest_API.request_With_Error_Check(`/api/v1/file?file_name=${FILE_NAME}`, "GET")).data_url

  const FILE_CONTENT = atob(DATA_URL.split(',')[1])

  const ContentElement = document.createElement('div')
  ContentElement.innerText = FILE_CONTENT
  document.body.appendChild(ContentElement)
}
main = Wrap.Wrap_With_Try_Alert_Promise(main)

main()