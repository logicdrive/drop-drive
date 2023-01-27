/** 파일과 관련된 처리를 도와주기 위한 라이브러리 */
class File
{
  /** 파일 객체에 대한 URL 주소를 반환시키기 위해서 */
  static read_Data_Url(data_file)
  {
    return new Promise((resolve) => {
      const FILE_READER = new FileReader()
      FILE_READER.onloadend = (finish_event) => {
        resolve(finish_event.currentTarget.result)
      }
      FILE_READER.readAsDataURL(data_file)
    })
  }
}