const GoToSignup = () => {
    window.location.href = "/html/signup.html"
    return
}

document.querySelector("#signin_form").onsubmit = async (evt) => {
  evt.preventDefault()
  
  const e = await try_Login()
  if(e) {
    alert(e)
    return
  }
  
  window.location.href = "/html/main.html"
}

// 로그인 에러 보여주기
async function try_Login() {
  const email = document.getElementById("signin_email").value
  const password = document.getElementById("password").value
  
  return (await Request.JSON_Request("/api/v1/auth/signin", "POST", {
    email : email,
    password : password
  })).error_code
}