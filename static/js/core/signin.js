async function main()
{
  document.querySelector("#signin_form").onsubmit = on_Signin_Form_Submited
  document.querySelector("#google_login_btn").onclick = on_Google_Login_Btn_Clicked
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

/** 구글 계정을 이용한 로그인을 수행하기 위해서 */
async function on_Google_Login_Btn_Clicked(e)
{
  alert("[MOCK] 구글 로그인이 수행되어야 함")
  // Browser.redirect("/html/main.html")
}
on_Google_Login_Btn_Clicked = Wrap.Wrap_With_Try_Alert_Promise(on_Google_Login_Btn_Clicked)

main()