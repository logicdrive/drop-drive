import Firebase_Api from "../../module/firebase_api.js"
import Params_Check from "../../module/params_check.js"
import { ref, getStream } from "firebase/storage"

function read_Storage_Data(storage_ref)
{
  return new Promise((resolve) => {
    const RS = getStream(storage_ref)
    RS.on('readable', () => {
      resolve(RS.read())
    })
  })    
}

async function get_Router_Callback_Temp(req, res) {
  Params_Check.Para_is_null_or_empty(req.query, ["file_name"])
  const USER_AUTH = Firebase_Api.user_Auth()
  const [FILE_NAME, FILE_EXT] = req.query.file_name.split(".")

  // 다운로드할 UUID 얻기 위해서
  const QRES = await Firebase_Api.query_To_Database("file_meta_datas", [["where", "owner", "==", USER_AUTH], ["where", "file_name", "==", FILE_NAME], ["where", "file_ext", "==", FILE_EXT]])
  if (QRES.length == 0) throw new Error("The file to download is not searched!")
  const FILE_UUID_TO_DOWNLOAD = QRES[0].file_uuid

  // Storage에서 다운로드 받기 위해서
  const FIREBASE_STORAGE = Firebase_Api.get_Firebase_Object("FIREBASE_STORAGE")
  const DOWNLOAD_REF = ref(FIREBASE_STORAGE, `files/${FILE_UUID_TO_DOWNLOAD}`)
  if (DOWNLOAD_REF == null) throw new Error("The file content to download is not searched!")

  const RAW_DATA = await read_Storage_Data(DOWNLOAD_REF)
  const DOWNLOAD_URL = RAW_DATA.toString()
  res.json({ data_url: DOWNLOAD_URL })
}

export default get_Router_Callback_Temp