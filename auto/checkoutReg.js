const shell = require('shelljs');
shellExec("npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/");
function shellExec(str, flag) {
  let code = shell.exec(str).code;
  console.log(str + ': '+ code);
  // console.warn(code);
  if(code && !flag){
    console.log('发布出错！！！！！');
    process.exit(1);
  }
}
process.exit(0);
