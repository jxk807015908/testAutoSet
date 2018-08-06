const shell = require('shelljs');
// const child_process = require('child_process');
// var childProcess = child_process.exec("npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/");
// child_process.exit(0);
// childProcess.on('exit', function (code) {
//   console.log('子进程已退出，退出码 ' + code);
// });
let version = undefined;
process.stdin.setEncoding('utf8');
// console.log('请输入版本号:');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  // console.log(chunk.constructor);
  // if (/^(beta)?(\d+.\d+.\d+)$/.test(chunk)) {
    version = chunk;
    process.stdin.emit('end');
  // } else {
  //   console.error('请输入正确的版本号！！！')
  // }
});
process.stdin.on('end', () => {
  // shellExec('npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/');
  // shellExec('nrm use own');
  shellExec('npm config list');
  process.exit(0);
});

function shellExec(str, flag) {
  let code = shell.exec(str).code;
  console.log(str + ': '+ code);
  // console.warn(code);
  if(code && !flag){
    console.log('发布出错！！！！！');
    process.exit(0);
  }
}
