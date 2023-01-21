/** 전달되는 파라미터 딕셔너리의 유효성을 검증하기 위한 라이브러리 */
class Params_Check
{
  /** 주어진 params 에서 특정 para가 NULL인 경우 예외를 일으키기 위해서
  * 
  * Para_is_null(req.query, ["type", "keyword"])
  *
  * // req.query 에서 type이 null인 경우, `'type'관련 파라미터가 전달되지 않았습니다 !`라는 예외를 발생시킴
  */
  static Para_is_null(params, para_infos_to_check)
  {
    for(let para_info of para_infos_to_check)
      if(params[para_info] == null)
        throw new Error(`'${para_info}'관련 파라미터가 전달되지 않았습니다 !`)
  }

  /** 주어진 params 에서 특정 para가 특정 리스트들 중에 한 요소를 포함하고 있지 않은 경우 예외를 일으키기 위해서
  *
  * Para_is_contatins(req, [["type", ["title", "image", "index"]]])
  *
  * // req.query 에서 type이 ["title", "image", "index"] 중에서 아무것도 속하지 않은 경우 `'type'관련 파라미터가 적합하지 않은 요소를 가지고 있습니다!`라는 예외를 발생시킴
  */
  static Para_is_contatins(params, para_infos_to_check)
  {
    for(let para_info of para_infos_to_check)
      if(!para_info[1].includes(params[para_info[0]]))
        throw new Error(`'${para_info[0]}'관련 파라미터가 적합하지 않은 요소를 가지고 있습니다!`)
  }
}

export default Params_Check