const shell = require('shelljs');
// const package = require('../package.json');
// const oldVersion = package.version;
let resetArr = [];
// let allBranchLeastCommit = getRemoteBranchHashAndMsg();
shellExec('git status', false, (std) => {
  if (std.indexOf('modified:') !== -1) {
    console.error('请先将本地修改的内容提交！！！');
    process.exit(0);
  }
});
let version;
// let masterCommitObj;
// let devCommitObj;
process.stdin.setEncoding('utf8');
console.log('请输入版本号:');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  const input = chunk && chunk.replace(/\n$/, '');
  if (/^(\d+.\d+.\d+)(-beta.\d)?$/.test(input)) {
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
    // masterCommitObj = getHashAndMsg('master');
    // devCommitObj = getHashAndMsg('dev');
  });
  shellExec('git merge dev', false, () => {
    // resetArr.push(`git merge master`);
  });
  let allBranchLeastCommit = getRemoteBranchHashAndMsg();
  shellExec('git add -A');
  shellExec(`git commit -m "[build] ${version}"`, true, () => {
    // console.error(masterCommitObj);
    // let index = masterCommitObj.msg.findIndex(str=> str === `[build] ${_version}`);
    // index !== -1 && resetArr.push(`git push origin master --force`);
    // index !== -1 && resetArr.push(`git reset --hard ${masterCommitObj.hash[index+1]}`);

    // resetArr.push(`git push origin master --force`);
    // resetArr.push(`git reset --hard ${masterCommitObj.hash[0]}`);

    resetArr.push(`git push origin master --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit['remotes/origin/master']}`);
  });
  shellExec(`npm version ${version} --message "[release] ${version}"`, false, () => {
    // let obj = getHashAndMsg('master');
    // let index = obj.msg.findIndex(str=> str === `[release] ${_version}`);
    // console.error('index', index);
    // index !== -1 && resetArr.push(`git push origin master --force`);
    // index !== -1 && resetArr.push(`git reset --hard ${obj.hash[index+1]}`);

    // resetArr.push(`git push origin master --force`);
    // resetArr.push(`git reset --hard ${masterCommitObj.hash[0]}`);

    resetArr.push(`git push origin master --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit['remotes/origin/master']}`);
  });
  shellExec('git push origin master');
  shellExec(`git push origin refs/tags/v${version}`, false, () => {
    resetArr.push(`git push origin :refs/tags/v${version}`);
    resetArr.push(`git tag -d v${version}`)
  });
  shellExec('git checkout dev', false, () => {
    resetArr.push(`git checkout master`)
  });
  shellExec('git rebase master');
  shellExec('git push origin dev', false, ()=>{
    // let obj = getHashAndMsg('dev');
    // let _index = obj.msg.findIndex(str=> str === `[build] ${_version}`);
    // let index = _index !== -1 ? _index : obj.msg.findIndex(str=> str === `[release] ${_version}`);
    // index !== -1 && resetArr.push(`git reset --hard ${devCommitObj.hash[index + 0]}`);
    // index !== -1 && resetArr.push(`git push origin dev --force`);
    // index !== -1 && resetArr.push(`git reset --hard ${obj.hash[index + 1]}`);

    resetArr.push(`git reset --hard ${allBranchLeastCommit['dev']}`);
    resetArr.push(`git push origin dev --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit['remotes/origin/dev']}`);
  });
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
  // console.log(resetArr);
  resetArr.reverse().forEach(str => {
    shellExec(str, true)
  })
}

// function getHashAndMsg(branch) {
//   let _branch = branch || '';
//   return shellExec(`git log ${_branch}`, false, (stdout) => {
//     let msg = stdout.match(/\n\n   [ \S]+\n\n/g).map(str => str.replace(/\n\n/g, '').replace(/^    /, ''));
//     let hash = stdout.match(/[0-9a-f]{40}/g);
//     return {
//       msg: msg,
//       hash: hash
//     };
//   })
// }

function getRemoteBranchHashAndMsg() {
  return shellExec(`git branch -a -v`, false, (std) => {
    let branchArr = std.split('\n');
    let hashObj = {};
    branchArr.map(str=>{
      let name = /[\S]+/.exec(str.replace(/^[*| ] /, ''));
      let hash = /[0-9a-f]{7}/.exec(str);
      name && (hashObj[name] = hash);
      // console.log(name)
      // console.log(hash)
    });
    return hashObj;
  })
}
