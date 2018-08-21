const readline = require('readline');
const nodeShell = require('./util/nodeShell.js');
const {getAllBranchHashAndMsg, getRelative, checkIsSourceProject, checkCommit} = require('./util/common');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// rl.on('line', (line) => {
//   console.log(`Line from file: ${line}`);
// });
let version;
let branchName;
let _branchName;
let relative = getRelative();
const localToRemote = relative.localToRemote;
const remoteToLocal = relative.remoteToLocal;
// console.log(localToRemote);
let allBranchLeastCommit = getAllBranchHashAndMsg();
console.log('请输入你要发布的本地分支: ');
rl.on('line', (answer) => {
  let chunk = answer;
  // console.error(chunk);
  const input = chunk && chunk.replace(/\n$/, '');
  if (branchName === undefined) {
    _branchName = input;
    if (Object.keys(allBranchLeastCommit).includes(_branchName) && _branchName !== 'master') {
      branchName = _branchName;
      console.log('请输入版本')
    } else {
      _branchName !== 'master' && console.error('找不到该本地分支');
      _branchName === 'master' && console.error('不能选择master分支');
    }
  } else {
    if (/^(\d+.\d+.\d+)(-beta.\d+)?$/.test(input)) {
      version = input;
      console.log(branchName)
      console.log(version)
      console.log('开始发布')
    } else {
      console.error('请输入正确的版本号！！！');
    }
  }
});




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

// function getAllBranchHashAndMsg() {
//   return shellExec(`git branch -a -v`, {}, (std) => {
//     let branchArr = std.split('\n');
//     let hashObj = {};
//     branchArr.map(str=>{
//       let name = /[\S]+/.exec(str.replace(/^[*| ] /, ''));
//       let hash = /[0-9a-f]{7}/.exec(str);
//       name && (hashObj[name] = hash);
//       // console.log(name)
//       // console.log(hash)
//     });
//     // console.log(hashObj);
//     return hashObj;
//   });
// }
//
// function getRelative() {
//   return shellExec(`git branch -vv`, {}, (std) => {
//     let branchArr = std.split('\n');
//     let localToRemote = {};
//     let remoteToLocal = {};
//     branchArr.map(str=>{
//       if (str === '') {
//         return;
//       }
//       let str_noCommit;
//       let name = /[\S]+/.exec(str.replace(/^[*| ] /, ''));
//       let hash = /[0-9a-f]{7}/.exec(str);
//       shellExec(`git show ${hash}`, {}, (std)=>{
//         // console.log(std);
//         let res = /\n\n[\s\S]+\n\n/.exec(std)[0].replace(/\n\n/g, '').replace(/^ +/, '');
//         str_noCommit = str.replace(res, '');
//       });
//       // console.error(str_noCommit);
//       let _remote = /\[\S+\/\S+(:[\s\S]+)?\]/.exec(str_noCommit);
//       let remote = _remote && _remote[0].replace('[', '').replace(']', '').replace(/:[\s\S]+/, '').replace(/^\S+\//, '');
//       // let remote = _remote && ('remotes/' + _remote[0].replace('[', '').replace(']', ''));
//       // console.log(remote)
//       localToRemote[name] = remote;
//       remoteToLocal[remote] = name;
//       // localToRemote[name] = _remote && _remote[0].replace('[', '').replace(']', '').replace(/^\S+\//, '');
//       // remoteToLocal[_remote && _remote[0].replace('[', '').replace(']', '').replace(/^\S+\//, '')] = name;
//       // console.log(name)
//       // console.log(hash)
//     });
//     // console.log(hashObj);
//     return {remoteToLocal, localToRemote};
//   });
// }
//
// function getObjValue(obj, reg) {
//   let regExp = new RegExp(reg);
//   let arr = [];
//   Object.keys(obj).forEach(str=>{
//     regExp.test(str) && arr.push(str);
//   });
//   return arr;
// }
