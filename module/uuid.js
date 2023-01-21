import { v4 } from "uuid"

/** 일관성있는 UUID 생성을 위해서 */
class UUID
{
  /** UUIDv4을 기반으로 생성된 UUID를 반환시킴 */
  static get_UUID()
  {
    return v4()
  }
}

export default UUID