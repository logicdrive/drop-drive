async function main()
{
  document.querySelector("#signup_form").onsubmit = on_Signup_Form_Submited
}

/** 유저가 입력한 정보를 기반으로 회원가입을 수행하기 위해서 */
async function on_Signup_Form_Submited(e)
{
  e.preventDefault()

  const EMAIL = document.getElementById("email").value
  const PASSWORD = document.getElementById("password").value
  const PASSWORD_RETYPE = document.getElementById("password_retype").value
  await Rest_API.signup(EMAIL, PASSWORD, PASSWORD_RETYPE)

  Browser.redirect("/html/signin.html")
}
on_Signup_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Signup_Form_Submited)

main()