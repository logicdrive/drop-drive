async function main()
{
  if(await Rest_API.redirect_If_Not_Login()) return
  await update_Greeting_Message()
  await update_Owned_File_Infos()
  document.querySelector("#upload_file_form").onsubmit = on_Upload_File_Form_Submited
}

/** 환영 인사관련 UI를 업데이트시키기 위해서 */
async function update_Greeting_Message()
{
  const USER_EMAIL = await Rest_API.user_Email()
  document.querySelector("#greeting").innerText = `Hello, ${USER_EMAIL}!`
}

/** 현재 유저가 소유하고 있는 파일 목록을 출력시키기위해서 */ 
async function update_Owned_File_Infos()
{
  const OWNED_FILE_TABLE_SEL = document.querySelector("#owned_file_table")
  
  const FILE_INFOS = await Rest_API.owned_File_Infos()
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
}

function make_HTML_File_Index_HTML(file_info)
{
  return `<tr><td><div>
<a href="/html/file_info.html?file_name=${file_info.file_name}" target="_blank">${file_info.file_name}</a>
<button class="file_Index_Download_Btn">Download</button>
<button class="add_Auth_Btn">Add Auth</button>
<button class="share_Link_Btn">Share Link</button>
<button class="file_Index_Delete_Btn">Delete</button>
<p>created time : ${file_info.created_time}</p>
</div></td></tr>`
}

async function on_Click_File_Index_Download_Btn(e)
{
  await on_Click_File_Index_Download_Btn_Temp(e)
}

async function on_Click_Add_Auth_Btn(e)
{
  const FILE_NAME = e.path[1].querySelector("a").textContent
  
  const EMAIL_TO_ADD = prompt("Input user email to accept share link auth")
  if(EMAIL_TO_ADD == null || EMAIL_TO_ADD.length == 0) return

  await Rest_API.request_With_Error_Check("/api/v1/file_member", "PUT", {
    file_name:FILE_NAME,
    email_to_add:EMAIL_TO_ADD
  })
  alert(`The share link auth was successfully added !`)
}

async function on_Click_Share_Link_Btn(e)
{
  const FILE_NAME = e.path[1].querySelector("a").textContent
  alert(`[MOCK] ${FILE_NAME}에 대한 공유 링크 생성 요청 및 표시가 이루어져야함`)
}

async function on_Click_file_Index_Delete_Btn(e)
{
  const FILE_NAME = e.path[1].querySelector("a").textContent
  if(!confirm(`Do you want to delete the '${FILE_NAME}' file?`)) return

  await Rest_API.delete_File_Object(FILE_NAME)
  alert(`The '${FILE_NAME}' file was successfully deleted !`)
  await update_Owned_File_Infos()
}

/** 유저가 선택한 파일을 서버에 업로드시키기위해서 */
async function on_Upload_File_Form_Submited(e)
{
  e.preventDefault()

  const INPUT_FILE_SEL = document.querySelector("#upload_file_form input[type='file']")
  if(INPUT_FILE_SEL.files.length == 0) throw new Error("Please select a file to upload")

  const UPLOADED_FILE_NAME = await Rest_API.upload_File_Object(INPUT_FILE_SEL.files[0])
  alert(`The requested file '${UPLOADED_FILE_NAME}' was successfully uploaded !`)
  await update_Owned_File_Infos()
}

update_Greeting_Message = Wrap.Wrap_With_Try_Alert_Promise(update_Greeting_Message)
update_Owned_File_Infos = Wrap.Wrap_With_Try_Alert_Promise(update_Owned_File_Infos)
on_Click_File_Index_Download_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_File_Index_Download_Btn)
on_Click_Add_Auth_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Add_Auth_Btn)
on_Click_Share_Link_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Share_Link_Btn)
on_Click_file_Index_Delete_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_file_Index_Delete_Btn)
on_Upload_File_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Upload_File_Form_Submited)
main()