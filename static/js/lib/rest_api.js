/** 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Rest_API
{
  static NOT_LOGIN_REDIRECT_URL = "/html/login.html"
  
  /** 유저가 로그인한 이메일을 반환시키기 위해서 */
  static async user_Email()
  {
    return (await Request.JSON_Request("/api/v1/auth/user_auth", "GET")).user_auth
  }

  /** 현재 로그인하지 않은 유저인 경우, 다른 URL로 리다이렉트시키기 위해서 */
  static async redirect_If_Not_Login()
  {
    const USER_EMAIL = await Rest_API.user_Email()
    if(USER_EMAIL == null)
    {
      window.location.href = Rest_API.NOT_LOGIN_REDIRECT_URL
      return true
    }
    return false
  }

  /** 현재 유저가 소유하고있는 파일 목록을 반환시키기 위해서 */
  static async owned_File_Names()
  {
    const REQ_RESULT = await Request.JSON_Request("/api/v1/directory?path=/", "GET")
    if(REQ_RESULT.is_error)
      throw new Error(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.error_message}`)
    return REQ_RESULT.file_names
  }

  /** 주어진 파일 오브젝트를 서버에 업로드시키기 위해서 */
  static async upload_File_Object(file_object)
  {
    const DATA_URL = await File.read_Data_Url(file_object)
    const REQ_RESULT = await Request.JSON_Request("/api/v1/file", "PUT", {
      file_name : file_object.name,
      file_url : DATA_URL
    })
    
    if(REQ_RESULT.is_error)
      throw new Error(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.error_message}`)
    return file_object.name
  }
}