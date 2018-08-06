const shell = require('shelljs');

let version = undefined;
process.stdin.setEncoding('utf8');
console.log('请输入版本号:');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdin.emit('end');
    version = chunk;
    let _version = version.replace(/^beta/,'');
    shellExec('git checkout master');
    shellExec('git merge dev');
    console.log('开始发布版本v' + version);

    shellExec('git add -A');
    shellExec(`npm version ${_version} --message "[release] ${_version}"`);
    shellExec('git push origin master');
    shellExec(`git push origin refs/tags/v${version}`);
    shellExec('git checkout dev');
    shellExec('git rebase master');
    shellExec('git push origin dev');
    shellExec('npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/');
    if(/^beta/.exec(version)){
      shellExec('npm publish --tag beta');
    } else {
      shellExec('npm publish');
    }
    console.log('版本发布成功');
    // console.log("git checkout master:",shell.exec('git checkout master').code);
    // console.log("git merge dev:",shell.exec('git merge dev').code);

    // console.log("git add -A:",shell.exec('git add -A').code);
    // console.log(`npm version ${_version} --message "[release] ${_version}":`,shell.exec(`npm version ${_version} --message "[release] ${_version}"`).code);
    // console.log("git push origin master:",shell.exec('git push origin master').code);
    // console.log(`git push origin refs/tags/v${version}:`,shell.exec(`git push origin refs/tags/v${version}:`).code);
    // console.log("git checkout dev :",shell.exec('git checkout dev').code);
    // console.log("git rebase master:",shell.exec('git rebase master').code);
    // console.log("git push origin dev:",shell.exec('git push origin dev').code);
    // console.log("npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/:",shell.exec('npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/').code);
    // if(/^beta/.exec(version)){
    //   console.log("npm publish --tag beta:",shell.exec('npm publish --tag beta').code);
    // } else {
    //   console.log("npm publish:",shell.exec('npm publish').code);
    // }

    // git checkout master
    // git merge dev
    // console.log(shell)





    process.exit(0);
    // console.log(process);
    // process.stdout.write(`data: ${chunk}`);
  }
});
process.stdin.on('end', () => {
  process.stdout.write('end');
});
// shell.echo('hahahahahhahahahahhahaha');
// console.log(shell);
// var a = shell.read();
// shell.exec('read a');
// read('a');
// exit(1);

function shellExec(str) {
  let code = shell.exec(str).code;
  console.warn(str + ': '+ code);
  // console.warn(code);
  if(code){
    console.log('发布出错！！！！！');
    process.exit(0);
  }
}
