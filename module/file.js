import fs from "fs"

/** 파일 시스템 관련 처리를 위한 라이브러리 */
class File
{
  /** DATA URL을 파일 형태로 저장시키기 위해서 */
  static async write_File_From_Data_Url(data_url, file_path) {    
    const BLOB_DATA = File.data_url_to_blob(data_url)
    const ARRAY_BUFFER_DATA = await BLOB_DATA.arrayBuffer()
    const BUFFER_DATA = Buffer.from(ARRAY_BUFFER_DATA)
    
    fs.writeFileSync(file_path, BUFFER_DATA)
  }

  /** DATA URL을 Blob 오브젝트로 변환시키기 위해서 */
  static data_url_to_blob(data_url)
  {
    const DATA_URL_SP = data_url.split(',')

    const MIME_TYPE = DATA_URL_SP[0].match(/:(.*?);/)[1]
    const FILE_CONTENT = atob(DATA_URL_SP[1])

    let file_content_index = FILE_CONTENT.length
    let u8arr = new Uint8Array(file_content_index)
    while(file_content_index--) {
        u8arr[file_content_index] = FILE_CONTENT.charCodeAt(file_content_index)
    }

    return new Blob([u8arr], {type:MIME_TYPE})
  }
}

export default File