import express from "express"

import routers_auth_signin from "./routers/api/v1/auth/signin.js"
import routers_auth_signup from "./routers/api/v1/auth/signup.js"

import routers_file_requests_create from "./routers/api/v1/file_requests/create.js"
import routers_file_requests_list from "./routers/api/v1/file_requests/list.js"

import routers_files_delete from "./routers/api/v1/files/delete.js"
import routers_files_download from "./routers/api/v1/files/download.js"

import routers_sharing_add_file_member from "./routers/api/v1/sharing/add_file_member.js"
import routers_sharing_get_file_member from "./routers/api/v1/sharing/get_file_member.js"
import routers_sharing_get_shared_link from "./routers/api/v1/sharing/get_shared_link.js"


const app = express()
const PORT = 80


app.use(express.static('static'))


app.use('/api/v1/auth/signin', routers_auth_signin)
app.use('/api/v1/auth/signup', routers_auth_signup)

app.use('/api/v1/file_requests/create', routers_file_requests_create)
app.use('/api/v1/file_requests/list', routers_file_requests_list)

app.use('/api/v1/files/delete', routers_files_delete)
app.use('/api/v1/files/download', routers_files_download)

app.use('/api/v1/sharing/add_file_member', routers_sharing_add_file_member)
app.use('/api/v1/sharing/get_file_member', routers_sharing_get_file_member)
app.use('/api/v1/sharing/get_shared_link', routers_sharing_get_shared_link)


app.get('/', (req, res) => { 
  res.send('Hello World!!')
})

app.listen(PORT, () => console.log(`웹 서버가 ${PORT} 포트에서 가동됨`))