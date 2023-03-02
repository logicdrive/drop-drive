// 일관된 클립보드 상호작용을 위한 라이브러리
class Clipboard
{
  // 클립보드에 텍스트를 쓰기 위해서
  static write_Text(text)
  {
    console.log(`copied text : ${text}`)
    navigator.clipboard.writeText(text)
  }
}