const GoToSignup = () => {
    window.location.href = "/html/signup.html"
    return
}

document.querySelector("#login_form").onsubmit = async (evt) => {
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
  const email = document.getElementById("login_email").value
  const password = document.getElementById("password").value
  
  return (await Request.JSON_Request("/api/v1/auth/signin", "POST", {
    email : email,
    password : password
  })).error_code
}

class Request {
  static async JSON_Request(url, request_type, json_body = {}) {
    const HTTP_REQUEST_TYPES = ["GET", "HEAD", "PUT", "POST", "DELETE", "TRACE", "CONNECT", "OPTIONS"]
    if (!HTTP_REQUEST_TYPES.includes(request_type.toUpperCase()))
      throw new Error("request_type에는 알맞은 HTTP 요청타입이 들어가야 합니다!")

    let request_infos = {
      method: request_type,
      headers: { "Content-Type": "application/json" }
    }
    if (!["GET", "HEAD", "DELETE", "TRACE"].includes(request_type))
      request_infos.body = JSON.stringify(json_body)

    return (await fetch(url, request_infos)).json()
  }
}