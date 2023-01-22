async function main()
{
  if(await Rest_API.redirect_If_Not_Login()) return
  await update_Greeting_Message()
  await update_Owned_File_Names()
  document.querySelector("#upload_file_form").onsubmit = on_Upload_File_Form_Submited
}

/** 환영 인사관련 UI를 업데이트시키기 위해서 */
async function update_Greeting_Message()
{
  const USER_EMAIL = await Rest_API.user_Email()
  document.querySelector("#greeting").innerText = `Hello, ${USER_EMAIL}!`
}

/** 현재 유저가 소유하고 있는 파일 목록을 출력시키기위해서 */ 
async function update_Owned_File_Names()
{
  const FILE_NAMES = await Rest_API.owned_File_Names()
  if(FILE_NAMES.length == 0) return
  
  const OWNED_FILE_TABLE_SEL = document.querySelector("#owned_file_table")
  const FILE_INDEX_HTMLS = FILE_NAMES.map((file_name) => make_HTML_File_Index_HTML(file_name))
  OWNED_FILE_TABLE_SEL.innerHTML = FILE_INDEX_HTMLS.join("\n")

  Element.add_On_Click_Trigger("button.file_Index_Download_Btn", on_Click_Download_File_Index)
}

function make_HTML_File_Index_HTML(file_name)
{
  return `<tr><td><div>
<a href="/html/file_info.html?file_name=${file_name}" target="_blank">${file_name}</a>
<button class="file_Index_Download_Btn">Download</button>
</div></td></tr>`
}

async function on_Click_Download_File_Index(e)
{
  const FILE_NAME = e.path[1].querySelector("a").textContent
  alert(`[MOCK] ${FILE_NAME}에 대한 다운로드 요청이 이루어져야함`)
}

/** 유저가 선택한 파일을 서버에 업로드시키기위해서 */
async function on_Upload_File_Form_Submited(e)
{
  e.preventDefault()

  const INPUT_FILE_SEL = document.querySelector("#upload_file_form input[type='file']")
  if(INPUT_FILE_SEL.files.length == 0) throw new Error("Please select a file to upload")

  const UPLOADED_FILE_NAME = await Rest_API.upload_File_Object(INPUT_FILE_SEL.files[0])
  alert(`The requested file '${UPLOADED_FILE_NAME}' was successfully uploaded !`)
  await update_Owned_File_Names()
}

update_Owned_File_Names = Wrap.Wrap_With_Try_Alert_Promise(update_Owned_File_Names)
on_Upload_File_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Upload_File_Form_Submited)

main()