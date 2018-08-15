// const shell = require('shelljs');
const nodeShell = require('./util/nodeShell');
// shellExec('git log');
getHashAndMsg();
function getHashAndMsg(){
  return new Promise(resolve => {
    nodeShell('git log', {}, (stdout)=>{
      let msg = stdout.match(/\n\n   [ \S]+\n\n/g).map(str=>str.replace(/\n\n/g, '').replace(/^    /, ''));
      let hash = stdout.match(/[0-9a-f]{40}/g);
      resolve({
        msg: msg,
        hash: hash
      })
    })
  })
}
// let _version = '1.2.22';
// shellExec(`npm version ${_version} --message "[release] ${_version}"`, false, ()=>{
//
// });
// shellExec('git tag -d v1.2.17');
// shellExec('git push origin :refs/tags/v1.2.17');

process.exit(0);


// function shellExec(str, flag, fn) {
//   let res = shell.exec(str,{silent:true});
//   let code = res.code;
//   let stdout = res.stdout;
//   // console.log(res);
//   // console.log(str + ': ' + code);
//   // console.warn(code);
//   if (code && !flag) {
//     console.log(res.stderr);
//     console.log('发布出错！！！！！');
//     process.exit(0);
//   }
//   fn && fn(stdout);
// }
