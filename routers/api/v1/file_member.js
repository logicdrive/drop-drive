import express from "express"
import Firebase_Api from "../../../module/firebase_api.js"
import Params_Check from "../../../module/params_check.js"
import Wrap from "../../../module/wrap.js"

async function put_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.body, ["file_name", "email_to_add"])
  
  const USER_AUTH = Firebase_Api.user_Auth()
  const {file_name:FILE_NAME_EXT, email_to_add:EMAIL_TO_ADD} = req.body
  const [FILE_NAME, FILE_EXT] = FILE_NAME_EXT.split(".")

  if(USER_AUTH == EMAIL_TO_ADD) throw new Error("The yourself email is automately to share link auth!")

  const Q_FILE_META_DATA = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if(Q_FILE_META_DATA.length == 0) throw new Error("The file to add auth is not searched!")
  const FILE_UUID = Q_FILE_META_DATA[0].file_uuid
  
  const QRES = await Firebase_Api.query_To_Database("share_auths", [["where", "file_uuid", "==", FILE_UUID], ["where", "email_auth", "==", EMAIL_TO_ADD]])
  if(QRES.length != 0) throw new Error("The email auth to add is already added!")

  await Firebase_Api.upload_To_Database("share_auths", {
    "file_uuid":FILE_UUID,
    "email_auth":EMAIL_TO_ADD
  })
  res.send({is_error:false})
}

async function get_Router_callback(req, res)
{
  res.send('[MOCK] 특정 파일에 대한 접근 권한 계정 목록을 얻음')
}

put_Router_callback = Wrap.Wrap_With_Try_Res_Promise(put_Router_callback)
get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.put('/', put_Router_callback)
router.get('/', get_Router_callback)

export default router