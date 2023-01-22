async function main()
{
  document.querySelector("#signup_form").onsubmit = on_Signup_Form_Submited
}

/** 유저가 입력한 정보를 기반으로 회원가입을 수행하기 위해서 */
async function on_Signup_Form_Submited(e)
{
  e.preventDefault()

  const RES = await try_Signup()
  if(RES.is_error) {
    alert(RES.message)
    return
  }

  Browser.redirect("/html/signin.html")
}

async function try_Signup() {
  const email = document.getElementById("new_email").value
  const password = document.getElementById("new_pw_1").value
  const password_retype = document.getElementById("new_pw_2").value

  return (await Request.JSON_Request("/api/v1/auth/signup", "POST", {
    email: email,
    password: password,
    password_retype: password_retype
  }))
}

on_Signup_Form_Submited = Wrap.Wrap_With_Try_Alert_Promise(on_Signup_Form_Submited)

main()