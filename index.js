import express from "express"

import routers_auth_signin from "./routers/auth/signin.js"
import routers_auth_signup from "./routers/auth/signup.js"

import routers_file_requests_create from "./routers/file_requests/create.js"
import routers_file_requests_list from "./routers/file_requests/list.js"

import routers_files_delete from "./routers/files/delete.js"
import routers_files_download from "./routers/files/download.js"

import routers_sharing_add_file_member from "./routers/sharing/add_file_member.js"
import routers_sharing_get_file_member from "./routers/sharing/get_file_member.js"
import routers_sharing_get_shared_link from "./routers/sharing/get_shared_link.js"


const app = express()
const PORT = 80


app.use(express.static('static'))


app.use('/auth/signin', routers_auth_signin)
app.use('/auth/signup', routers_auth_signup)

app.use('/file_requests/create', routers_file_requests_create)
app.use('/file_requests/list', routers_file_requests_list)

app.use('/files/delete', routers_files_delete)
app.use('/files/download', routers_files_download)

app.use('/sharing/add_file_member', routers_sharing_add_file_member)
app.use('/sharing/get_file_member', routers_sharing_get_file_member)
app.use('/sharing/get_shared_link', routers_sharing_get_shared_link)


app.get('/', (req, res) => { 
  res.send('Hello World!!')
})

app.listen(PORT, () => console.log(`웹 서버가 ${PORT} 포트에서 가동됨`))