// 일관된 브라우저 동작을 지원하기 위한 라이브러리
class Browser
{
  /** 지정한 URL로 리다이렉트하기 위해서 */
  static redirect(url)
  {
    window.location.href = url
  }
}