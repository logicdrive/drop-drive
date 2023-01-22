const GoToSignIn = () => {
  window.location.href = "/html/signin.html"
  return
}

document.querySelector("#signup_form").onsubmit = async (evt) => {
  evt.preventDefault()

  const e = await try_Signup()
  if (e) {
    alert(e)
    return
  }
  
  window.location.href = "/html/signin.html"
  
}

// 회원가입 에러 보여주기
async function try_Signup() {
  const email = document.getElementById("new_email").value
  const password = document.getElementById("new_pw_1").value
  const password_retype = document.getElementById("new_pw_2").value

  return (await Request.JSON_Request("/api/v1/auth/signup", "POST", {
    email: email,
    password: password,
    password_retype: password_retype
  })).error_code
}