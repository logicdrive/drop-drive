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

  /** 주어진 데이터 URL에서 텍스트 데이터를 추출해서 주어진 부모 엘리먼트에 그 내용을 추가시키기 위해서 */
  static add_Text_Content_By_Data_Url(parent_element, data_url)
  {
    const FILE_CONTENT = atob(data_url.split(',')[1])
    const CONTENT_ELEMENT = document.createElement('div')
    CONTENT_ELEMENT.innerText = FILE_CONTENT
    parent_element.appendChild(CONTENT_ELEMENT)
  }
}