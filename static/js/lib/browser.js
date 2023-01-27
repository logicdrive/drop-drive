// 일관된 브라우저 동작을 지원하기 위한 라이브러리
class Browser
{
  /** 지정한 URL로 리다이렉트하기 위해서 */
  static redirect(url)
  {
    window.location.href = url
  }

  /** 지정된 DATA URL을 이용해서 파일을 다운받도록 만들기 위해서 */
  static download_File(data_url, file_name)
  {
    const A_ELEMENT = document.createElement('a')
    A_ELEMENT.href = data_url
    A_ELEMENT.download = file_name

    document.body.appendChild(A_ELEMENT)
    A_ELEMENT.click()
    document.body.removeChild(A_ELEMENT)
  }

  /** 지정된 키에 해당하는 URL 쿼리 문자열을 얻기 위해서 */
  static url_Query_Param(param_key)
  {
    return new URLSearchParams(location.search).get(param_key)
  }
}