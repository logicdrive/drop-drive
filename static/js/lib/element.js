/** 엘리먼트들을 조작하기 위한 라이브러리 */
class Element
{
  /** 특정 엘리먼트들에게 onclick 이벤트들을 추가시키기 위해서 */
  static add_On_Click_Trigger(css_selector, trigger_event)
  {
    Object.values(document.querySelectorAll(css_selector)).forEach((sel) => {
        sel.onclick = trigger_event
    })
  }

  /** 주어진 데이터 URL에서 적절한 유형을 추출해서 알맞은 형태로 부모 엘리먼트에 추가시키기 위해서 */
  static add_Content_By_Data_Url(parent_element, data_url)
  {
    // 내부 내용이 없을 경우, 별도로 처리하기 위해서
    if(data_url == "data:")
    {
      const CONTENT_ELEMENT = document.createElement('div')
      CONTENT_ELEMENT.innerText = "There's no content in this file !"
      parent_element.appendChild(CONTENT_ELEMENT)
      return
    }
    
    const FILE_TYPE = data_url.split("/")[0].split(":")[1]
    switch(FILE_TYPE)
    {
      case "text" :      
        Element.add_Text_Content_By_Data_Url(parent_element, data_url)
        break
  
      case "image" :
        Element.add_Image_Content_By_Data_Url(parent_element, data_url)
        break

      default :
        throw new Error("There is no suitable file type to show !")
    }
  }

  /** 주어진 데이터 URL에서 텍스트 데이터를 추출해서 주어진 부모 엘리먼트에 그 내용을 추가시키기 위해서 */
  static add_Text_Content_By_Data_Url(parent_element, data_url)
  {
    const FILE_CONTENT = atob(data_url.split(',')[1])
    const CONTENT_ELEMENT = document.createElement('div')
    CONTENT_ELEMENT.innerText = FILE_CONTENT
    parent_element.appendChild(CONTENT_ELEMENT)
  }

  /** 주어진 데이터 URL로 이미지를 표시시키기는 태그를 부모 엘리먼트에 추가시키기 위해서 */
  static add_Image_Content_By_Data_Url(parent_element, data_url)
  {
    const IMAGE_ELEMENT = document.createElement('image')
    IMAGE_ELEMENT.setAttribute("src", data_url)
    parent_element.appendChild(IMAGE_ELEMENT)
    document.body.innerHTML += ""
  }
}