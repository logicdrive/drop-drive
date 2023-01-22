async function main()
{
  document.querySelector("#signin_form").onsubmit = on_Signin_Form_Submited
}

/** 유저가 입력한 정보를 기반으로 로그인을 수행하기 위해서 */
async function on_Signin_Form_Submited(e)
{
  e.preventDefault()

  const EMAIL = document.getElementById("signin_email").value
  const PASSWORD = document.getElementById("password").value
  await Rest_API.signin(EMAIL, PASSWORD)

  Browser.redirect("/html/main.html")
}

on_Signin_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Signin_Form_Submited)
main()