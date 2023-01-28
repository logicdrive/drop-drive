import express from "express"
import Wrap from "../../../module/wrap.js"

async function get_Router_callback(req, res)
{
  res.json({is_error:false, data_url:"", message:"[MOCK] 공유된 DATA URL을 반환시켜야함"})
}
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router