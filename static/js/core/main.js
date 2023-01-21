async function main_Process()
{
  const LOGIN_USER_EMAIL = await login_User_Email()
  if(LOGIN_USER_EMAIL == null)
  {
    window.location.href = "/html/login.html"
    return
  }

  document.querySelector("#greeting").innerText = `Hello, ${LOGIN_USER_EMAIL}!`
  Update_File_List()
}

// 유저가 로그인한 이메일을 반환시키기 위해서
async function login_User_Email()
{
  return (await Request.JSON_Request("/api/v1/auth/user_auth", "GET")).user_auth
}

async function Update_File_List()
{
  const OWNED_FILE_TABLE_SEL = document.querySelector("#owned_file_table")
  const FILE_NAMES = await Owned_File_Names()
  if(FILE_NAMES.length == 0) return

  const FILE_NAME_HTMLS = FILE_NAMES.map((file_name) => `<tr><td><div>${file_name}</div></td></tr>`)
  OWNED_FILE_TABLE_SEL.innerHTML = FILE_NAME_HTMLS.join("\n")
}

async function Owned_File_Names()
{
  const REQ_RESULT = await Request.JSON_Request("/api/v1/directory?path=/", "GET")

  if(REQ_RESULT.is_error)
  {
    alert(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.error_message}`)
    return []
  }
  return REQ_RESULT.file_names
}

document.querySelector("#add_file_form").addEventListener("submit", async (e) => {
    e.preventDefault()
  
    const INPUT_FILE_SEL = document.querySelector("#add_file_form input[type='file']")
    if(INPUT_FILE_SEL.files.length == 0)
    {
      alert("Please select a file to upload")
      return
    }

    const FILE_OBJ = INPUT_FILE_SEL.files[0]
    const DATA_URL = await read_Data_Url(FILE_OBJ)

    try
    {
      const REQ_RESULT = await Request.JSON_Request("/api/v1/file", "PUT", {
        file_name : FILE_OBJ.name,
        file_url : DATA_URL
      })

      if(REQ_RESULT.is_error)
        alert(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.error_message}`)
      else 
      {
        alert("The file was successfully uploaded !")
        Update_File_List()
      }
    }
    catch
    {
      alert("Sorry, Some error was happened while requesting to server...")
    }
})

// 파일 객체에 대한 URL 주소를 반환시키기 위해서
function read_Data_Url(data_file)
{
    return new Promise((resolve) => {
      const FILE_READER = new FileReader()
      FILE_READER.onloadend = (finish_event) => {
        resolve(finish_event.currentTarget.result)
      }
      FILE_READER.readAsDataURL(data_file)
    })
}

main_Process()