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
}