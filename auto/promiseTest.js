const shell = require('shelljs');
const shellExec = require('./util/nodeShell');
function promiseShell(str, flag) {
  return new Promise(resolve => {
    let res = shell.exec(str,{silent:true});
    let code = res.code;
    let stdout = res.stdout;
    console.log(str + ': ' + code);
    // console.warn(code);
    if (code && !flag) {
      // console.log('发布出错！！！！！');
      console.log(res.stderr);
      reset();
      process.exit(0);
    }
    resolve(stdout);
  })
}
// function shellExec(str, flag, fn) {
//   let res = shell.exec(str,{silent:true});
//   let code = res.code;
//   let stdout = res.stdout;
//   console.log(str + ': ' + code);
//   // console.warn(code);
//   if (code && !flag) {
//     // console.log('发布出错！！！！！');
//     console.log(res.stderr);
//     reset();
//     process.exit(0);
//   }
//   code === 0 && fn && fn(stdout);
// }
function reset(){
  console.log('正在回退，请勿退出。');
  console.log(resetArr);
  resetArr.reverse().forEach(str=>{
    shellExec(str, true)
  })
}

function getHashAndMsg(){
  return promiseShell('git log', false).then((stdout)=>{
    let msg = stdout.match(/\n\n   [ \S]+\n\n/g).map(str=>str.replace(/\n\n/g, '').replace(/^    /, ''));
    let hash = stdout.match(/[0-9a-f]{40}/g);
    return {
      msg: msg,
      hash: hash
    };
  })
}

promiseShell('git log',false).then(()=>{
  getHashAndMsg().then(obj=>{
    console.error(obj)
  });
});

