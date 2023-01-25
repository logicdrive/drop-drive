async function main()
{
  
  function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
  }
  const FILE_NAME = searchParam('file_name')
  const DATA_URL = (await Rest_API.request_With_Error_Check(`/api/v1/file?file_name=${FILE_NAME}`, "GET")).download_url

  const FILE_CONTENT = atob(DATA_URL.split(',')[1])

  const ContentElement = document.createElement('div')
  document.body.appendChild(ContentElement)
  ContentElement.innerText = FILE_CONTENT
}

main = Wrap.Wrap_With_Try_Alert_Promise(main)
main()