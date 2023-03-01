/** HTTP 요청처리를 간단하게하기 위한 라이브러리 */
class Request
{
  /** JSON 데이터를 요청하고, 그 결과를 JSON 형태로 받기 위해서 */
  static async JSON_Request(url, request_type, json_body={}, extra_header_infos={})
  {
    const RES_OBJ = await Request.request_Using_JSON(url, request_type, json_body, extra_header_infos)
    return (RES_OBJ.ok) ? RES_OBJ.json() : {is_error:true, status:RES_OBJ.status}
  }

  /** text/stream 형태의 SSE 통신 데이터관련 eventStream 객체를 얻기 위해서 */
  static async create_Event_Stream_JSON_Request(url, request_type, json_body={}, extra_header_infos={})
  {
    const RES_OBJ = await Request.request_Using_JSON(url, request_type, json_body, extra_header_infos)
    return (RES_OBJ.ok) ? RES_OBJ.body.getReader() : {is_error:true, status:RES_OBJ.status}
  }

  /** 주어진 eventStream 객체의 결과를 한번 얻어서 결과를 반환하기 위해서 */
  static async use_Event_Stream_Request(event_stream)
  {
     const CHUNK_DATA = await event_stream.read()    
     if(CHUNK_DATA.done) return {is_done:true, chunk_data:null}
     return {is_done:false, chunk_data:new TextDecoder().decode(CHUNK_DATA.value)} 
  }

  /** JSON 데이터로 서버에 요청하기 위해서 */
  static async request_Using_JSON(url, request_type, json_body, extra_header_infos)
  {
    const HTTP_REQUEST_TYPES = ["GET", "HEAD", "PUT", "POST", "DELETE", "TRACE", "CONNECT", "OPTIONS"]
    if(!HTTP_REQUEST_TYPES.includes(request_type.toUpperCase()))
      throw new Error("request_type에는 알맞은 HTTP 요청타입이 들어가야 합니다!")

    let request_infos = {
      method: request_type,
      headers: {"Content-Type": "application/json", ...extra_header_infos},
    }
    if(!["GET", "HEAD", "DELETE", "TRACE"].includes(request_type))
      request_infos.body = JSON.stringify(json_body)

    return fetch(url, request_infos)
  }
}