async function main()
{
  if(await Rest_API.redirect_If_Not_Login()) return
  
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  if(WORK_DIR_PATH == null) 
  {
    Browser.redirect("/html/main.html?work_dir_path=/")
    return
  }
  document.querySelector("#directory_path").innerHTML = create_Work_Dir_Path_HTMLs(WORK_DIR_PATH).join("\n")
  
  await update_Greeting_Message()
  await update_Owned_File_Infos()
  
  document.querySelector("#owned_file_table").style.visibility = "visible"
  document.querySelector("#loading_page").remove()
  
  document.querySelector("#upload_file_form").onsubmit = on_Upload_File_Form_Submited
  document.querySelector("#make_directory_btn").onclick = on_Click_Make_Directory_Btn
  document.querySelector("#logout_btn").onclick = on_Click_Logout_Btn
  document.querySelector("#directory_to_back_btn").onclick = on_Click_Directory_To_Back_Btn
}

/** 디렉토리 경로들을 포함한 Html 코드 리스트를 생성시키기 위해서 */
function create_Work_Dir_Path_HTMLs(work_dir_path)
{
  const WORK_DIR_PATH_SP = work_dir_path.slice(1, -1).split("/")
  let maked_path = "/"
  let maked_paths = []
  for(let i=0; i<WORK_DIR_PATH_SP.length; i++)
  {
      maked_path = maked_path + WORK_DIR_PATH_SP[i] + "/"
      maked_paths.push(maked_path)
  }

  let directory_path_htmls = [`<a href="/html/main.html?work_dir_path=/">/</a>`]
  if(work_dir_path == "/") return directory_path_htmls
  
  for(let i=0; i<maked_paths.length; i++)
     directory_path_htmls.push([`<a class="pl-1" href="/html/main.html?work_dir_path=${maked_paths[i]}">${WORK_DIR_PATH_SP[i]}/</a>`])
  return directory_path_htmls
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
      return `<li class="list-group-item d-flex justify-content-between align-content-center">

    <div class="d-flex flex-row">
	    <img src="https://img.icons8.com/color/48/null/file.png" width="40" />
	    <div class="ml-2" file_name="${file_info.file_name}">
		    <h6 class="mb-0 text-black" ><a href="/html/file_info.html?file_name=${file_info.file_name}&work_dir_path=${WORK_DIR_PATH}">FILE : ${file_info.file_name}</a></h6>
		    <div class="about">
          <span class="text-info">${file_info.created_time}</span>
        </div>
	    </div>
    </div>
  
    <div class="btn-group dropright">
      <button class="btn btn-secondary dropdown-toggle dropdown-toggle-split" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false px-0">
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenu2" file_name="${file_info.file_name}">
        <button class="file_Index_Download_Btn dropdown-item">
          <img src="https://img.icons8.com/color/48/null/download--v1.png"/>
          Download
        </button>
        <button class="add_Auth_Btn dropdown-item">
          <img src="https://img.icons8.com/color/48/000000/add-user-group-man-man-skin-type-7.png"/>
          Add Auth
        </button>
        <button class="share_Link_Btn dropdown-item">
          <img src="https://img.icons8.com/color/48/null/share--v1.png"/>
          Share Link
        </button>
        <button class="file_Index_Delete_Btn dropdown-item">
          <img src="https://img.icons8.com/color/48/000000/trash--v1.png"/>
          Delete
        </button>
      </div>
    </div>
</li>`

    case "directory" :
      return `<li class="list-group-item d-flex justify-content-between align-content-center">

    <div class="d-flex flex-row">
	    <img src="https://img.icons8.com/color/100/000000/folder-invoices.png" width="40" />
	    <div class="ml-2" file_name="${file_info.file_name}">
		    <h6 class="mb-0 text-black" ><a href="/html/main.html?work_dir_path=${WORK_DIR_PATH+file_info.file_name+'/'}">DIRECTORY : ${file_info.file_name}</a></h6>
		    
	    </div>
    </div>
    <div file_name="${file_info.file_name}">
	    <button class="delete_Directory_Btn">Delete</button>
    </div>

</li>`
  }
}

/** 선택한 파일을 다운로드 받기 위해서 */
async function on_Click_File_Index_Download_Btn(e)
{
  const FILE_NAME = e.target.closest(".dropdown-menu").getAttribute("file_name")
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
  const FILE_NAME = e.target.closest(".dropdown-menu").getAttribute("file_name")
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
  const FILE_NAME = e.target.closest(".dropdown-menu").getAttribute("file_name")
  const SHARED_LINK = await Rest_API.get_Share_Link(FILE_NAME, WORK_DIR_PATH)

  Clipboard.write_Text(SHARED_LINK)
  alert("The shared link was coiped to clipboard !")
}
on_Click_Share_Link_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Share_Link_Btn)

/** 특정 파일을 삭제시키기 위해서 */
async function on_Click_file_Index_Delete_Btn(e)
{
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  const FILE_NAME = e.target.closest(".dropdown-menu").getAttribute("file_name")
  if(!confirm(`Do you want to delete the '${FILE_NAME}' file?`)) return

  console.log(FILE_NAME)
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

/** 주어진 디렉토리 명으로 현재 디렉토리에 새로운 디렉토리를 생성시키기 위해서 */
async function on_Click_Make_Directory_Btn(_)
{
  const DIRECTORY_NAME_TO_MAKE = prompt("Please input directory name to make")
  if(DIRECTORY_NAME_TO_MAKE == null || DIRECTORY_NAME_TO_MAKE.length == 0) return

  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  await Rest_API.make_Directory(DIRECTORY_NAME_TO_MAKE, WORK_DIR_PATH)

  alert(`The requested directory '${DIRECTORY_NAME_TO_MAKE}' was successfully created !`)
  await update_Owned_File_Infos()
}
on_Click_Make_Directory_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Make_Directory_Btn)

/** 주어진 디렉토리의 하위 디렉토리 및 파일들을 연쇄적으로 삭제하고, 현재 디렉토리까지 완전하게 삭제시키기 위해서 */
async function on_Click_Delete_Directory_Btn(e)
{
  const DIRECTORY_NAME_TO_DELETE = e.target.closest(".dropdown-menu").getAttribute("file_name")
  if(!confirm(`Do you want to delete the '${DIRECTORY_NAME_TO_DELETE}' directory?`)) return
  
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  await Rest_API.delete_Directory_Recursively(DIRECTORY_NAME_TO_DELETE, WORK_DIR_PATH)
  
  alert(`The '${DIRECTORY_NAME_TO_DELETE}' directory was successfully deleted !`)
  await update_Owned_File_Infos()
}
on_Click_Delete_Directory_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Delete_Directory_Btn)

/** 현재 유저 권한으로 로그아웃을 수행하기 위해서 */
async function on_Click_Logout_Btn(_)
{
  await Rest_API.logout()
  alert(`The logout process was Successfully completed !`)
  await Rest_API.redirect_If_Not_Login()
}
on_Click_Logout_Btn = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Logout_Btn)

/** 이전 디렉토리로 이동시키기 위해서 */
function on_Click_Directory_To_Back_Btn(_)
{
  const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')
  if(WORK_DIR_PATH == "/") return

  const LEFT_WORK_DIR = WORK_DIR_PATH.slice(0, WORK_DIR_PATH.length-1)
  const PREV_DIR = LEFT_WORK_DIR.slice(0, LEFT_WORK_DIR.lastIndexOf("/")+1)
  Browser.redirect(`/html/main.html?work_dir_path=${PREV_DIR}`)
}

main()