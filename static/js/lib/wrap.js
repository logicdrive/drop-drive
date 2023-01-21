/** 함수들을 특정한 형식으로 감싸기 위해서 */
class Wrap
{
  /** 특정 함수를 Try~Alert 형태로 감싸기 위해서 */
  static async Wrap_Try_Alert_Promise(async_callback)
  {
    try {
      await async_callback()
    }
    catch(e) {
      alert(e)
    }
  }   
}