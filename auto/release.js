const nodeShell = require('./util/nodeShell');
let resetArr = [];
// shellExec('git status', {}, (std) => {
//   if (std.indexOf('modified:') !== -1) {
//     console.error('请先将本地修改的内容提交！！！');
//     process.exit(0);
//   }
// });
let version;
let branchName;
let _branchName;
let relative = getRelative();
const localToRemote = relative.localToRemote;
const remoteToLocal = relative.remoteToLocal;
// console.log(localToRemote);
let allBranchLeastCommit = getAllBranchHashAndMsg();
process.stdin.setEncoding('utf8');
console.log('请输入你要发布的本地分支:');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  const input = chunk && chunk.replace(/\n$/, '');
  if (branchName === undefined) {
    _branchName = input;
    process.stdin.emit('end');
  } else {
    if (/^(\d+.\d+.\d+)(-beta.\d)?$/.test(input)) {
      version = input;
      process.stdin.emit('end');
    } else {
      console.error('请输入正确的版本号！！！');
    }
  }

});
process.stdin.on('end', () => {
  if (branchName === undefined) {
    if (Object.keys(allBranchLeastCommit).includes(_branchName) && _branchName !== 'master') {
      branchName = _branchName;
      console.log('请输入版本号')
    } else {
      _branchName !== 'master' && console.error('找不到该本地分支');
      _branchName === 'master' && console.error('不能选择master分支');
    }
  } else {
    release()
  }
});

function release() {
  const remoteBranchName = localToRemote[branchName]; //有前缀:remotes/
  const localMasterBranchName = remoteToLocal['master']; //有前缀:remotes/
  if(!localMasterBranchName || !remoteBranchName) {
    console.log('localToRemote', localToRemote);
    console.log('localToRemote', branchName);
    console.log('localToRemote', remoteToLocal);
    console.error('找不到分支');
    process.exit(0);
  }
  console.log('开始发布版本v' + version);
  // let allBranchLeastCommit = getRemoteBranchHashAndMsg();
  let remoteMasterName = getObjValue(allBranchLeastCommit, 'remotes/\\S+/master')[0];
  // let remoteDevName = getObjValue(allBranchLeastCommit, `remotes/\\S+/${branchName}`)[0];
  // let localDevName = getObjValue(allBranchLeastCommit, branchName)[0];
  shellExec(`git checkout ${localMasterBranchName}`, {}, () => {
    resetArr.push(`git checkout ${branchName}`);
  });
  shellExec(`git merge ${branchName}`, {}, () => {
    resetArr.push(`git push origin ${localMasterBranchName}:master --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit[remoteMasterName]}`);
  });
  shellExec('git add -A');
  shellExec(`git commit -m "[build] ${version}"`, {ignoreErr: true});
  shellExec(`npm version ${version} --message "[release] ${version}"`);
  shellExec(`git push origin ${localMasterBranchName}:master`);
  shellExec(`git push origin refs/tags/v${version}`, {}, () => {
    resetArr.push(`git push origin :refs/tags/v${version}`);
    resetArr.push(`git tag -d v${version}`);
  });
  shellExec(`git checkout ${branchName}`, {}, () => {
    resetArr.push(`git checkout ${localMasterBranchName}`);
  });
  shellExec(`git rebase ${localMasterBranchName}`);
  shellExec(`git push origin ${branchName}:${remoteBranchName}`, {}, ()=>{
    resetArr.push(`git reset --hard ${allBranchLeastCommit[branchName]}`);
    resetArr.push(`git push origin ${branchName} --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit[branchName]}`);
  });
  if (/^(\d+.\d+.\d+)$/.test(version)) {
    shellExec('npm publish');
  } else {
    shellExec('npm publish --tag beta');
  }
  console.log('版本发布成功');
  process.exit(0);
}

function shellExec(str, option, fn) {
  return nodeShell(str, option, fn, ()=>{
    resetArr.length !== 0 && reset();
    process.exit(0);
  });
}

function reset() {
  console.log('正在回退，请勿退出。');
  // console.log(resetArr);
  resetArr.reverse().forEach(str => {
    shellExec(str, {ignoreErr: true});
  });
  console.log('回退完成');
}

function getAllBranchHashAndMsg() {
  return shellExec(`git branch -a -v`, {}, (std) => {
    let branchArr = std.split('\n');
    let hashObj = {};
    branchArr.map(str=>{
      let name = /[\S]+/.exec(str.replace(/^[*| ] /, ''));
      let hash = /[0-9a-f]{7}/.exec(str);
      name && (hashObj[name] = hash);
      // console.log(name)
      // console.log(hash)
    });
    // console.log(hashObj);
    return hashObj;
  });
}

function getRelative() {
  return shellExec(`git branch -vv`, {}, (std) => {
    let branchArr = std.split('\n');
    let localToRemote = {};
    let remoteToLocal = {};
    branchArr.map(str=>{
      if (str === '') {
        return;
      }
      let str_noCommit;
      let name = /[\S]+/.exec(str.replace(/^[*| ] /, ''));
      let hash = /[0-9a-f]{7}/.exec(str);
      shellExec(`git show ${hash}`, {}, (std)=>{
        // console.log(std);
        let res = /\n\n[\s\S]+\n\n/.exec(std)[0].replace(/\n\n/g, '').replace(/^ +/, '');
        str_noCommit = str.replace(res, '');
      });
      let _remote = /\[\S+\/\S+\]/.exec(str_noCommit);
      let remote = _remote && ('remotes/' + _remote[0].replace('[', '').replace(']', ''));
      // console.log(remote)
      localToRemote[name] = _remote && _remote[0].replace('[', '').replace(']', '').replace(/^\S+\//, '');
      remoteToLocal[_remote && _remote[0].replace('[', '').replace(']', '').replace(/^\S+\//, '')] = name;
      // console.log(name)
      // console.log(hash)
    });
    // console.log(hashObj);
    return {remoteToLocal, localToRemote};
  });
}

function getObjValue(obj, reg) {
  let regExp = new RegExp(reg);
  let arr = [];
  Object.keys(obj).forEach(str=>{
    regExp.test(str) && arr.push(str);
  });
  return arr;
}
