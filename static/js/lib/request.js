/** HTTP 요청처리를 간단하게하기 위한 라이브러리 */
class Request
{
  /** 특정 HTTP 요청 형태에 대해서 JSON Body로 요청하고, JSON 형태로 데이터를 받기 위해서 */
  static async JSON_Request(url, request_type, json_body={})
  {
    const HTTP_REQUEST_TYPES = ["GET", "HEAD", "PUT", "POST", "DELETE", "TRACE", "CONNECT", "OPTIONS"]
    if(!HTTP_REQUEST_TYPES.includes(request_type.toUpperCase()))
      throw new Error("request_type에는 알맞은 HTTP 요청타입이 들어가야 합니다!")

    let request_infos = {
      method: request_type,
      headers: { "Content-Type": "application/json" }
    }
    if(!["GET", "HEAD", "DELETE", "TRACE"].includes(request_type))
      request_infos.body = JSON.stringify(json_body)

    return (await fetch(url, request_infos)).json()
  }
}