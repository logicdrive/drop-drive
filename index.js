import express from "express"
import { firebase_auth, firebase_store, firebase_storage } from "./module/firebase.js"

const app = express()


const PORT = 80


app.use(express.static('static'))

app.get('/', (req, res) => { 
  res.send('Hello World!!')
})

app.listen(PORT, () => console.log(`웹 서버가 ${PORT} 포트에서 가동됨`))