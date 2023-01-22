async function main()
{
  document.querySelector("#signin_form").onsubmit = on_Signin_Form_Submited
}

/** 유저가 입력한 정보를 기반으로 로그인을 수행하기 위해서 */
async function on_Signin_Form_Submited(e)
{
  e.preventDefault()
  
  const RES = await try_Login()
  if(RES.is_error) {
    alert(RES.message)
    return
  }

  Browser.redirect("/html/main.html")
}

async function try_Login() {
  const email = document.getElementById("signin_email").value
  const password = document.getElementById("password").value
  
  return (await Request.JSON_Request("/api/v1/auth/signin", "POST", {
    email : email,
    password : password
  }))
}

on_Signin_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Signin_Form_Submited)

main()