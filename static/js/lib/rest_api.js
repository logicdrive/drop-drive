/** 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Rest_API
{
  static NOT_LOGIN_REDIRECT_URL = "/html/signin.html"
  
  /** 유저가 로그인한 이메일을 반환시키기 위해서 */
  static async user_Email()
  {
    return (await Rest_API.request_With_Error_Check("/api/v1/auth/user_auth", "GET")).user_auth
  }

  /** 현재 로그인하지 않은 유저인 경우, 다른 URL로 리다이렉트시키기 위해서 */
  static async redirect_If_Not_Login()
  {
    const USER_EMAIL = await Rest_API.user_Email()
    if(USER_EMAIL == null)
    {
      Browser.redirect(Rest_API.NOT_LOGIN_REDIRECT_URL)
      return true
    }
    return false
  }

  /** 현재 유저가 소유하고있는 파일 목록을 반환시키기 위해서 */
  static async owned_File_Infos()
  {
    const REQ_RESULT = await Rest_API.request_With_Error_Check("/api/v1/directory?path=/", "GET")
    return REQ_RESULT.file_infos
  }

  /** 주어진 파일 오브젝트를 서버에 업로드시키기 위해서 */
  static async upload_File_Object(file_object)
  {
    const DATA_URL = await File.read_Data_Url(file_object)
    await Rest_API.request_With_Error_Check("/api/v1/file", "PUT", {
      file_name : file_object.name,
      file_url : DATA_URL
    })
    return file_object.name
  }

  /** 지정한 파일을 서버에서 완전히 삭제시키기 위해서 */
  static async delete_File_Object(file_name)
  {
    await Rest_API.request_With_Error_Check(`/api/v1/file?file_name=${file_name}`, "DELETE")
  }

  /** 유저로부터 얻은 정보를 기반으로 로그인을 수행하기 위해서 */
  static async signin(email, password)
  {
    await Rest_API.request_With_Error_Check("/api/v1/auth/signin", "POST", {
      email : email,
      password : password
    })
  }

  /** 유저로부터 얻은 정보를 기반으로 회원가입을 수행하기 위해서 */
  static async signup(email, password, password_retype)
  {
    await Rest_API.request_With_Error_Check("/api/v1/auth/signup", "POST", {
      email: email,
      password: password,
      password_retype: password_retype
    })
  }
  
  /** 서버 응답을 받기전에 에러여부를 확인해서 예외를 일으키기 위해서 */
  static async request_With_Error_Check(url, request_type, json_body={})
  {
    const REQ_RESULT = await Request.JSON_Request(url, request_type, json_body)
    if(REQ_RESULT.is_error)
      throw new Error(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.message}`)
    return REQ_RESULT
  }
}