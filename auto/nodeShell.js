const shell = require('shelljs');
let version = undefined;
process.stdin.setEncoding('utf8');
console.log('请输入版本号:');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  const input = chunk && chunk.replace(/\n$/, '');
  if (/^(beta)?(\d+.\d+.\d+)$/.test(input)) {
    version = chunk;
    process.stdin.emit('end');
  } else {
    console.error('请输入正确的版本号！！！')
  }
});
process.stdin.on('end', () => {
  let _version = version.replace(/^beta/,'');
  console.log('开始发布版本v' + version);
  shellExec('git checkout master');
  shellExec('git merge dev');
  shellExec('git add -A');
  shellExec(`git commit -m "[build] ${_version}"`, true);
  shellExec(`npm version ${_version} --message "[release] ${_version}"`);
  shellExec('git push origin master');
  shellExec(`git push origin refs/tags/v${version}`);
  shellExec('git checkout dev');
  shellExec('git rebase master');
  shellExec('git push origin dev');
  // shellExec('npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/');
  // shellExec('nrm use own');
  // shellExec('npm config list');
  if(/^beta/.test(version)){
    shellExec('npm publish --tag beta');
  } else {
    shellExec('npm publish');
  }
  console.log('版本发布成功');
  process.exit(0);
});

function shellExec(str, flag) {
  let code = shell.exec(str).code;
  console.log(str + ': '+ code);
  if(code && !flag){
    console.log('发布出错！！！！！');
    process.exit(0);
  }
}
