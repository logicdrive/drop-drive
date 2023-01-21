import express from "express"
import { firebase_store } from "../../../module/firebase.js"
import { getDocs, collection, query, where } from "firebase/firestore"

const router = express.Router()


router.get('/', async (req, res) => {
    try
    { 
      const USER_AUTH = "Sin"

      const DOC_QUERY = query(collection(firebase_store, "file_meta_datas"), where("owner", "==", USER_AUTH))
      const QUERY_SNAP_SHOT = await getDocs(DOC_QUERY)
      const DOC_RESULTS = QUERY_SNAP_SHOT.docs.map((doc) => doc.data())
      const FILE_NAMES = DOC_RESULTS.map((doc_result) => doc_result.file_name + "." + doc_result.file_ext)
      
      return res.json({is_error:false, file_names:FILE_NAMES})
    }
    catch(e)
    {
      console.log(e)
      res.json({is_error:true, error_message:"Internal server error was occurred."})
    }
})

export default router