/** 함수들을 특정한 형식으로 감싸기 위해서 */
class Wrap
{
  /** 특정 함수를 Try ~ Catch ~ Res 형태로 감싸기 위해서 */
  static Wrap_With_Try_Res_Promise(async_callback)
  {
    return async (req, res) => {
      try { await async_callback(req, res) }
      catch(e) {
        console.log(e)
        res.json({is_error:true, message:e.message})
      }
    }
  }   
}

export default Wrap