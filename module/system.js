import { exec } from "child_process"

/** 시스템관련 명령어를 실행시킨기 위한 라이브러리 */
class System
{
  /** 주어진 쉘 커멘드를 실행시키기 위해서 */
  static execute_Shell_Command(shell_command)
  {
    return new Promise((resolve, reject) => {
      exec(shell_command, (error, stdout, stderr) => {
        if(error) reject(stderr)
        else resolve(stdout)
      })
    })
  }
} 

export default System