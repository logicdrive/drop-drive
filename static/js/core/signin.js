async function main()
{
  document.querySelector("#signin_form").onsubmit = on_Signin_Form_Submited
  add_Google_Login_Btn()
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

/** 구글 로그인 버튼을 UI에 추가시키기 위해서 */
function add_Google_Login_Btn()
{
  window.onload = () => {
    google.accounts.id.initialize({
      client_id: "394414690934-jv6da4t0ninch1fd4rrmpt12lp977ujb.apps.googleusercontent.com",
      callback: on_Google_Login_Submited
    })
    google.accounts.id.renderButton(
      document.getElementById("google_login_btn"),
      { theme: "outline", size: "large" } 
    )
    google.accounts.id.prompt()
  }
}
add_Google_Login_Btn = Wrap.Wrap_With_Try_Alert_Promise(add_Google_Login_Btn)

/** 구글 계정을 이용한 로그인을 수행하기 위해서 */
async function on_Google_Login_Submited(google_User)
{ 
  await Rest_API.request_With_Error_Check("/api/v1/auth/signin", "POST", {
    type : "google",
    token : google_User.credential
  })
  
  Browser.redirect("/html/main.html")
}
on_Google_Login_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Google_Login_Submited)

main()