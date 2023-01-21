/** 함수들을 특정한 형식으로 감싸기 위해서 */
class Wrap
{
  /** 특정 함수를 Try~Catch~Alert 형태로 감싸기 위해서 */
  static Wrap_With_Try_Alert_Promise(async_callback)
  {
    return async (...args) => {
      try { await async_callback(...args) }
      catch(e) { alert(e) }
    }
  }   
}