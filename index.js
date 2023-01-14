import express from "express"
import firebase from "./module/firebase.js"


console.log(firebase)
const app = express()


const PORT = 80


app.use(express.static('static'))

app.get('/', (req, res) => { 
  res.send('Hello World!!')
})

app.listen(PORT, () => console.log(`웹 서버가 ${PORT} 포트에서 가동됨`))