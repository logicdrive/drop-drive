/** 주어진 디렉토리를 .zip 형태로 다운받기 위해서(오버라이딩) */
async function on_Click_Download_Directory_Btn_Overide(e)
{
  const READER = await Request_Test.create_Event_Stream_JSON_Request("/api/v1/directory", "POST",  {
       file_name : "TEST_FILE_NAME",
       work_dir_path : "TEST_WORK_DIR"
  })
  console.log(READER)

  let total_res_data = ""
  while(true)
  {
     const RES_DATA = await Request_Test.use_Event_Stream_Request(READER)
     if(RES_DATA.is_done) break

     console.log(RES_DATA.chunk_data)
     total_res_data += RES_DATA.chunk_data
  }
  console.log(total_res_data)
  
  return
  
  // const DIRECTORY_NAME_TO_DOWNLOAD = e.target.closest(".dropdown-menu").getAttribute("file_name")
  // const WORK_DIR_PATH = Browser.url_Query_Param('work_dir_path')

  // const REQ_RESULT = await Request.JSON_Request("/api/v1/directory", "POST", {
  //     file_name : DIRECTORY_NAME_TO_DOWNLOAD,
  //     work_dir_path : WORK_DIR_PATH
  // })
  // if(REQ_RESULT.is_error)
  //   throw new Error(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.message}`)
  
  // const ZIP_DATA_URL = REQ_RESULT.data_url
  // await Browser.download_File(ZIP_DATA_URL, `${DIRECTORY_NAME_TO_DOWNLOAD}.zip`)
}

class Request_Test
{
  /** JSON 데이터를 요청하고, 그 결과를 JSON 형태로 받기 위해서 */
  static async JSON_Request(url, request_type, json_body={}, extra_header_infos={})
  {
    const RES_OBJ = await Request_Test.request_Using_JSON(url, request_type, json_body, extra_header_infos)
    return (RES_OBJ.ok) ? RES_OBJ.json() : {is_error:true, status:RES_OBJ.status}
  }

  /** text/stream 형태의 SSE 통신 데이터관련 eventStream 객체를 얻기 위해서 */
  static async create_Event_Stream_JSON_Request(url, request_type, json_body={}, extra_header_infos={})
  {
    const RES_OBJ = await Request_Test.request_Using_JSON(url, request_type, json_body, extra_header_infos)
    return (RES_OBJ.ok) ? RES_OBJ.body.getReader() : {is_error:true, status:RES_OBJ.status}
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

  /** 주어진 eventStream 객체의 결과를 한번 얻어서 결과를 반환하기 위해서 */
  static async use_Event_Stream_Request(event_stream)
  {
     const CHUNK_DATA = await event_stream.read()
     if(CHUNK_DATA.done) return {is_done:true, chunk_data:null}
     return {is_done:false, chunk_data:new TextDecoder().decode(CHUNK_DATA.value)} 
  }
}