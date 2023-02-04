async function main()
{
  if(await Rest_API.redirect_If_Not_Login()) return
  
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  if(WORK_DIR_PATH == null) 
  {
    Browser.redirect("/html/main.html?work_dir_path=/")
    return
  }
  
  await update_Greeting_Message()
  await update_Owned_File_Infos()
  document.querySelector("#upload_file_form").onsubmit = on_Upload_File_Form_Submited
  document.querySelector("#make_directory_btn").onclick = on_Click_Make_Directory_Btn
}

/** 환영 인사관련 UI를 업데이트시키기 위해서 */
async function update_Greeting_Message()
{
  const USER_EMAIL = await Rest_API.user_Email()
  document.querySelector("#greeting").innerText = `Hello, ${USER_EMAIL}!`
}
update_Greeting_Message = Wrap.Wrap_With_Try_Alert_Promise(update_Greeting_Message)

/** 현재 유저가 소유하고 있는 파일 목록을 출력시키기위해서 */ 
async function update_Owned_File_Infos()
{
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const OWNED_FILE_TABLE_SEL = document.querySelector("#owned_file_table")
  
  const FILE_INFOS = await Rest_API.owned_File_Infos(WORK_DIR_PATH)
  if(FILE_INFOS.length == 0)
  {
    OWNED_FILE_TABLE_SEL.innerHTML = ""
    return
  }
  
  const FILE_INDEX_HTMLS = FILE_INFOS.map((file_info) => make_HTML_File_Index_HTML(file_info))
  OWNED_FILE_TABLE_SEL.innerHTML = FILE_INDEX_HTMLS.join("\n")

  Element.add_On_Click_Trigger("button.file_Index_Download_Btn", on_Click_File_Index_Download_Btn)
  Element.add_On_Click_Trigger("button.add_Auth_Btn", on_Click_Add_Auth_Btn)
  Element.add_On_Click_Trigger("button.share_Link_Btn", on_Click_Share_Link_Btn)
  Element.add_On_Click_Trigger("button.file_Index_Delete_Btn", on_Click_file_Index_Delete_Btn)
  Element.add_On_Click_Trigger("button.delete_Directory_Btn", on_Click_Delete_Directory_Btn)
}
update_Owned_File_Infos = Wrap.Wrap_With_Try_Alert_Promise(update_Owned_File_Infos)

function make_HTML_File_Index_HTML(file_info)
{
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')

  switch(file_info.type)
  {
    case "file" :      
      return `<tr><td><div file_name=${file_info.file_name}>
    <a href="/html/file_info.html?file_name=${file_info.file_name}&work_dir_path=${WORK_DIR_PATH}" target="_blank">FILE : ${file_info.file_name}</a>
    <button class="file_Index_Download_Btn">Download</button>
    <button class="add_Auth_Btn">Add Auth</button>
    <button class="share_Link_Btn">Share Link</button>
    <button class="file_Index_Delete_Btn">Delete</button>
    <p>created time : ${file_info.created_time}</p>
    </div></td></tr>`

    case "directory" :
      return `<tr><td><div file_name=${file_info.file_name}>
      <a href="/html/main.html?work_dir_path=${WORK_DIR_PATH+file_info.file_name+'/'}">DIRECTORY : ${file_info.file_name}</a>
      <button class="delete_Directory_Btn">Delete</button>
      </div></td></tr>`
  }
}

/** 선택한 파일을 다운로드 받기 위해서 */
async function on_Click_File_Index_Download_Btn(e)
{
  const FILE_NAME = e.target.parentElement.getAttribute("file_name")
  if(!confirm(`Do you want to download the '${FILE_NAME}' file?`)) return

  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const FILE_URL = await Rest_API.get_File_Object_Data_URL(FILE_NAME, WORK_DIR_PATH)
  await Browser.download_File(FILE_URL, FILE_NAME)
  alert(`The '${FILE_NAME}' file was successfully downloaded !`)
}
on_Click_File_Index_Download_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_File_Index_Download_Btn)

/** 특정 파일에 공유 권한을 추가시키기 위해서 */
async function on_Click_Add_Auth_Btn(e)
{
  const FILE_NAME = e.target.parentElement.getAttribute("file_name")
  const EMAIL_TO_ADD = prompt("Input user email to accept share link auth")
  if(EMAIL_TO_ADD == null || EMAIL_TO_ADD.length == 0) return

  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  await Rest_API.add_Share_Auth(FILE_NAME, WORK_DIR_PATH, EMAIL_TO_ADD)
  alert(`The share link auth was successfully added !`)
}
on_Click_Add_Auth_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Add_Auth_Btn)

/** 공유링크를 생성시키고, 링크를 클립보드에 복사시키기 위해서 */
async function on_Click_Share_Link_Btn(e)
{
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const FILE_NAME = e.target.parentElement.getAttribute("file_name")
  const SHARED_LINK = await Rest_API.get_Share_Link(FILE_NAME, WORK_DIR_PATH)
  
  Clipboard.write_Text(SHARED_LINK)
  alert("The shared link was coiped to clipboard !")
}
on_Click_Share_Link_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Share_Link_Btn)

/** 특정 파일을 삭제시키기 위해서 */
async function on_Click_file_Index_Delete_Btn(e)
{
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const FILE_NAME = e.target.parentElement.getAttribute("file_name")
  if(!confirm(`Do you want to delete the '${FILE_NAME}' file?`)) return

  await Rest_API.delete_File_Object(FILE_NAME, WORK_DIR_PATH)
  alert(`The '${FILE_NAME}' file was successfully deleted !`)
  await update_Owned_File_Infos()
}
on_Click_file_Index_Delete_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_file_Index_Delete_Btn)

/** 유저가 선택한 파일을 서버에 업로드시키기위해서 */
async function on_Upload_File_Form_Submited(e)
{
  e.preventDefault()

  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const INPUT_FILE_SEL = document.querySelector("#upload_file_form input[type='file']")
  if(INPUT_FILE_SEL.files.length == 0) throw new Error("Please select a file to upload")

  const UPLOADED_FILE_NAME = await Rest_API.upload_File_Object(INPUT_FILE_SEL.files[0], WORK_DIR_PATH)
  alert(`The requested file '${UPLOADED_FILE_NAME}' was successfully uploaded !`)
  await update_Owned_File_Infos()
}
on_Upload_File_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Upload_File_Form_Submited)

async function on_Click_Make_Directory_Btn(_)
{
  const DIRECTORY_NAME_TO_MAKE = prompt("Please input directory name to make")
  if(DIRECTORY_NAME_TO_MAKE == null || DIRECTORY_NAME_TO_MAKE.length == 0) return

  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  await Rest_API.request_With_Error_Check("/api/v1/directory", "PUT", {
    file_name : DIRECTORY_NAME_TO_MAKE,
    work_dir_path : WORK_DIR_PATH
  })

  alert(`The requested directory '${DIRECTORY_NAME_TO_MAKE}' was successfully created !`)
  await update_Owned_File_Infos()
}
on_Click_Make_Directory_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Make_Directory_Btn)

async function on_Click_Delete_Directory_Btn(e)
{
  const FILE_NAME = e.target.parentElement.getAttribute("file_name")
  if(!confirm(`Do you want to delete the '${FILE_NAME}' directory?`)) return
  
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  await Rest_API.request_With_Error_Check(`/api/v1/directory?file_name=${FILE_NAME}&work_dir_path=${WORK_DIR_PATH}`, "DELETE")
  
  alert(`The '${FILE_NAME}' directory was successfully deleted !`)
  await update_Owned_File_Infos()
}
on_Click_Delete_Directory_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Delete_Directory_Btn)

main()