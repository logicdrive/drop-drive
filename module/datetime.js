import moment from "moment"
import moment_timezone from "moment-timezone"

/** 시각을 구하는데에 일관성을 보장하기 위한 라이브러리 */
class Datetime
{
  /** 특정한 Timezone에 대한 지정한 시간형식의 문자열을 얻기 위해서 */
  static timezone_Date_Str(time_format="YYYY-MM-DD HH:mm:ss", timezone="Asia/Seoul")
  {
    moment.tz.setDefault(timezone)
    return moment().format(time_format)
  }
}

export default Datetime