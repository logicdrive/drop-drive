import util from "util"
import express from "express"
import glob from "glob"

const PORT = 80

// EXPRESS APP에 라우터들을 등록하고 포트 개방을 하기 위해서
async function main()
{
    const app = express()
  
    add_External_Routers_To_App(app)
    await add_Api_Routers_To_App(app)
  
    app.get('/', (req, res) => { 
      res.send('Hello World!!')
    })
  
    app.listen(PORT, () => console.log(`웹 서버가 ${PORT} 포트에서 가동됨`))    
}

// Express 앱에 외부 라이브러리 라우터를 부착하기 위해서
function add_External_Routers_To_App(app)
{
    app.use(express.static('static')) // 정적 파일에 대한 직접 접근 경로 생성
}

// Express 앱에 routers/api 이하의 REST API 경로 라우터를 부착하기 위해서
async function add_Api_Routers_To_App(app)
{
    const ROUTER_API_PATHS = await util.promisify(glob)("./routers/api/**/*.js")
    for(let router_api_path of ROUTER_API_PATHS)
    {
        const API_URL_PATH = router_api_path.replace("./routers", "").replace(".js", "")
        const API_ROUTER = (await import(router_api_path)).default
        app.use(API_URL_PATH, API_ROUTER)
    }
}

main()