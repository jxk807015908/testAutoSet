const shell = require('shelljs');
const package = require('../package.json');
const oldVersion = package.version;
let resetArr = [];
shellExec('git status', false, (std) => {
  if (std.indexOf('modified:') !== -1) {
    console.error('请先将本地修改的内容提交！！！');
    process.exit(0);
  }
});
let version = undefined;
process.stdin.setEncoding('utf8');
console.log('请输入版本号:');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  const input = chunk && chunk.replace(/\n$/, '');
  if (/^(beta)?(\d+.\d+.\d+)$/.test(input)) {
    version = input;
    process.stdin.emit('end');
  } else {
    console.error('请输入正确的版本号！！！')
  }
});
process.stdin.on('end', () => {
  let _version = version.replace(/^beta/, '');
  console.log('开始发布版本v' + version);
  shellExec('git checkout master', false, () => {
    resetArr.push(`git checkout dev`);
  });
  shellExec('git merge dev', false, () => {
    // resetArr.push(`git merge master`);
  });
  shellExec('git add -A');
  shellExec(`git commit -m "[build] ${_version}"`, true, () => {
    let obj = getHashAndMsg();
    console.error(obj);
    let index = obj.msg.findIndex(str=> str === `[build] ${_version}`);
    index !== -1 && resetArr.push(`git push origin master --force`);
    index !== -1 && resetArr.push(`git reset --hard ${obj.hash[index]}`);
  });
  shellExec(`npm version ${_version} --message "[release] ${_version}"`, false, () => {
    let obj = getHashAndMsg();
    let index = obj.msg.findIndex(str=> str === `[release] ${_version}`);
    console.error('index', index);
    index !== -1 && resetArr.push(`git reset --hard ${obj.hash[index]}`);
  });
  shellExec('git push origin master');
  shellExec(`git push origin refs/tags/v${_version}`, false, () => {
    resetArr.push(`git push origin :refs/tags/v${_version}`);
    resetArr.push(`git tag -d v${_version}`)
  });
  shellExec('git checkout dev', false, () => {
    resetArr.push(`git checkout master`)
  });
  shellExec('git rebase master');
  shellExec('git push origin dev');
  // shellExec('npm config set registry http://192.168.0.236:8081/repository/djcpsnpm-host/');
  // shellExec('nrm use own');
  // shellExec('npm config list');
  if (/^beta/.test(version)) {
    shellExec('npm publish --tag beta');
  } else {
    shellExec('npm publish');
  }
  console.log('版本发布成功');
  process.exit(0);
});
// function promiseShell(str, flag) {
//   return new Promise(resolve => {
//     let res = shell.exec(str,{silent:true});
//     let code = res.code;
//     let stdout = res.stdout;
//     console.log(str + ': ' + code);
//     // console.warn(code);
//     if (code && !flag) {
//       // console.log('发布出错！！！！！');
//       console.log(res.stderr);
//       reset();
//       process.exit(0);
//     }
//     resolve(stdout);
//   })
// }
function shellExec(str, flag, fn) {
  let res = shell.exec(str, {silent: true});
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
  return code === 0 && fn && fn(stdout);
}

function reset() {
  console.log('正在回退，请勿退出。');
  console.log(resetArr);
  resetArr.reverse().forEach(str => {
    shellExec(str, true)
  })
}

function getHashAndMsg() {
  return shellExec('git log', false, (stdout) => {
    let msg = stdout.match(/\n\n   [ \S]+\n\n/g).map(str => str.replace(/\n\n/g, '').replace(/^    /, ''));
    let hash = stdout.match(/[0-9a-f]{40}/g);
    return {
      msg: msg,
      hash: hash
    };
  })
}
