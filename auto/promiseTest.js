const shell = require('shelljs');
function promiseShell(str, flag) {
  return new Promise((resolve) => {
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
getHashAndMsg().then(obj=>{
  console.error(obj)
});
