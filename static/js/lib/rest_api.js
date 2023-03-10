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
  static async owned_File_Infos(work_dir_path)
  {
    const REQ_RESULT = await Rest_API.request_With_Error_Check(`/api/v1/directory?work_dir_path=${work_dir_path}`, "GET")
    return REQ_RESULT.file_infos
  }

  /** 주어진 파일 오브젝트를 서버에 업로드시키기 위해서 */
  static async upload_File_Object(file_object, work_dir_path)
  {
    const DATA_URL = await File.read_Data_Url(file_object)
    await Rest_API.request_With_Error_Check("/api/v1/file", "PUT", {
      file_name : file_object.name,
      file_url : DATA_URL,
      work_dir_path : work_dir_path
    })
    return file_object.name
  }

  /** 지정된 파일에 대한 DATA URL을 얻기 위해서 */
  static async get_File_Object_Data_URL(file_name, work_dir_path)
  {
    return (await Rest_API.request_With_Error_Check(`/api/v1/file?file_name=${file_name}&work_dir_path=${work_dir_path}`, "GET")).data_url
  }

  /** 공유된 파일에 대한 정보(DATA URL, 파일명)를 얻기 위해서 */
  static async get_Share_File_Object_Data_Info(share_file_uuid)
  {
     const OBJECT_DATA_INFO = (await Rest_API.request_With_Error_Check(`/api/v1/shared_file?file_share_id=${share_file_uuid}`, "GET"))
    return {data_url:OBJECT_DATA_INFO.data_url, file_name:OBJECT_DATA_INFO.file_name}
  }

  /** 지정한 파일을 서버에서 완전히 삭제시키기 위해서 */
  static async delete_File_Object(file_name, work_dir_path)
  {
    await Rest_API.request_With_Error_Check(`/api/v1/file?file_name=${file_name}&work_dir_path=${work_dir_path}`, "DELETE")
  }

  /** 특정 이메일에 지정한 파일에 대한 공유 권한을 부여하기 위해서 */
  static async add_Share_Auth(file_name, work_dir_path, email_to_add)
  {
    await Rest_API.request_With_Error_Check("/api/v1/file_member", "PUT", {
      file_name:file_name,
      work_dir_path:work_dir_path,
      email_to_add:email_to_add
    })
  }

  /** 특정 파일에 대한 공유 링크를 생성하고, 반환하기 위해서 */
  static async get_Share_Link(file_name, work_dir_path)
  {
    return (await Rest_API.request_With_Error_Check(`/api/v1/shared_link?file_name=${file_name}&work_dir_path=${work_dir_path}`, "GET")).shared_link
  }

  /** 특정 경로에 디렉토리를 생성시키기 위해서 */
  static async make_Directory(directory_name, work_dir_path)
  {
    await Rest_API.request_With_Error_Check("/api/v1/directory", "PUT", {
      file_name : directory_name,
      work_dir_path : work_dir_path
    })
  }

  /** 주어진 디렉토리의 하위 디렉토리 및 파일들을 연쇄적으로 삭제하고, 현재 디렉토리까지 완전하게 삭제시키기 위해서 */
  static async delete_Directory_Recursively(directory_name, work_dir_path)
  {
      await Rest_API.request_With_Error_Check(`/api/v1/directory?file_name=${directory_name}&work_dir_path=${work_dir_path}`, "DELETE")
  }

  /** 유저로부터 얻은 정보를 기반으로 로그인을 수행하기 위해서 */
  static async signin(email, password)
  {
    await Rest_API.request_With_Error_Check("/api/v1/auth/signin", "POST", {
      email : email,
      password : password,
      type : "email"
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

  /** 현재 유저 권한으로 로그아웃을 수행하기 위해서 */
  static async logout()
  {
    await Rest_API.request_With_Error_Check("/api/v1/auth/logout", "GET")
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