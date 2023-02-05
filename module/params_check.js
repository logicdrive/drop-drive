/** 전달되는 파라미터 딕셔너리의 유효성을 검증하기 위한 라이브러리 */
class Params_Check
{
  /** 주어진 params 에서 특정 para가 NULL이거나 빈문자열인 경우 예외를 일으키기 위해서
  * 
  * Para_is_null_or_empty(req.query, ["type", "keyword"])
  *
  * // req.query 에서 type이 null이거나 빈문자열인 경우, `The 'type' parameter is not exist!`라는 예외를 발생시킴
  */
  static Para_is_null_or_empty(params, para_infos_to_check)
  {
    const checked_Params = {}
    for(let para_info of para_infos_to_check)
    {
      if(params[para_info] == null || params[para_info].length == 0)
        throw new Error(`The '${para_info}' parameter is not exist!`)
      checked_Params[para_info] = params[para_info]
    }
    return checked_Params
  }

  /** 주어진 params 에서 특정 para가 특정 리스트들 중에 한 요소를 포함하고 있지 않은 경우 예외를 일으키기 위해서
  *
  * Para_is_contains(req, [["type", ["title", "image", "index"]]])
  *
  * // req.query 에서 type이 ["title", "image", "index"] 중에서 아무것도 속하지 않은 경우 `The 'type' parameter has unsuitable value !`라는 예외를 발생시킴
  */
  static Para_is_contains(params, para_infos_to_check)
  {
    for(let para_info of para_infos_to_check)
      if(!para_info[1].includes(params[para_info[0]]))
        throw new Error(`The '${para_info[0]}' parameter has unsuitable value !`)
  }
}

export default Params_Check