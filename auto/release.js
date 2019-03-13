const nodeShell = require('./util/nodeShell');
const config = require('./util/config');
const {checkIsSourceProject, checkCommit, getRelative, getAllBranchHashAndMsg, getObjValue, checkNpmPublishUrl} = require('./util/common');
const ora = require('ora');
const inquirer = require('inquirer');
const package = require('../package.json');
// console.error('isDirectRelease', config.isDirectRelease);
// console.error('isNeedNpmPublish', config.isNeedNpmPublish);
let resetArr = [];
!config.test && beforeRelease();
let relative = getRelative();
// console.log('getRelative', getRelative);
const localToRemote = relative.localToRemote;
const remoteToLocal = relative.remoteToLocal;
const HEAD = relative.HEAD;
let allBranchLeastCommit = getAllBranchHashAndMsg();

inquirer.prompt([{
  //提问类型
  type: 'input',
  //key
  name: 'branch',
  //问题（提示信息）
  message: '请输入你要发布的本地分支',
  //默认值
  default: HEAD,
  //输入校验
  validate: (val) => {
    if (Object.keys(localToRemote).includes(val)) {
      return true;
    }
    return false;
  }
}, {
  //提问类型
  type: 'input',
  //key
  name: 'version',
  //问题（提示信息）
  message: '请输入版本号',
  //默认值
  default: getDefaultVersion(package&&package.version),
  //输入校验
  validate: (val) => {
    if (/^(\d+.\d+.\d+)(-beta.\d+)?$/.test(val)) {
      return true;
    }
    return false;
  }
}]).then(answers=>{
  const { branch, version } = answers;
  let spinner = ora('开始发布版本v' + version);
  spinner.start();
  !config.isDirectRelease && releaseGit(branch, version);
  config.isDirectRelease && directReleaseGit(branch, version);
  publishNpm(version);
  spinner.stop();
  console.log('版本发布成功');
  process.exit(0);
});

function releaseGit(branchName, version) {
  const remoteBranchName = localToRemote[branchName]; //无前缀:remotes/${origin}
  const localMasterBranchName = remoteToLocal['master']; //无前缀:remotes/${origin}
  let remoteMasterName = getObjValue(allBranchLeastCommit, 'remotes/\\S+/master')[0];
  let remoteBranchNameHaveBehand = getObjValue(allBranchLeastCommit, `remotes/\\S+/${remoteBranchName}`)[0];
  if (!localMasterBranchName || !remoteBranchName || !remoteMasterName || !remoteBranchNameHaveBehand) {
    console.error('找不到分支');
    process.exit(0);
  }
  // console.log('开始发布版本v' + version);
  // let allBranchLeastCommit = getRemoteBranchHashAndMsg();
  // let localDevName = getObjValue(allBranchLeastCommit, branchName)[0];
  shellExec(`git checkout ${localMasterBranchName}`, {}, () => {
    resetArr.push(`git checkout ${branchName}`);
  });
  shellExec(`git merge ${branchName}`, {}, () => {
    resetArr.push(`git push ${config.origin} ${localMasterBranchName}:master --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit[remoteMasterName]}`);
  });
  shellExec('git add -A');
  shellExec(`git commit -m "[build] ${version}"`, {ignoreErr: true});
  shellExec(`npm version ${version} --message "[release] ${version}"`);
  shellExec(`git push ${config.origin} ${localMasterBranchName}:master`);
  shellExec(`git push ${config.origin} refs/tags/v${version}`, {}, () => {
    resetArr.push(`git push ${config.origin} :refs/tags/v${version}`);
    resetArr.push(`git tag -d v${version}`);
  });
  shellExec(`git checkout ${branchName}`, {}, () => {
    resetArr.push(`git checkout ${localMasterBranchName}`);
  });
  shellExec(`git rebase ${localMasterBranchName}`);
  shellExec(`git push ${config.origin} ${branchName}:${remoteBranchName}`, {}, ()=>{
    resetArr.push(`git reset --hard ${allBranchLeastCommit[branchName]}`);
    resetArr.push(`git push ${config.origin} ${branchName}:${remoteBranchName} --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit[remoteBranchNameHaveBehand]}`);
  });
}

function directReleaseGit(branchName, version) {
  const remoteBranchName = localToRemote[branchName]; //无前缀:remotes/${origin}
  // const localMasterBranchName = remoteToLocal['master']; //无前缀:remotes/${origin}
  // let remoteMasterName = getObjValue(allBranchLeastCommit, 'remotes/\\S+/master')[0];
  let remoteBranchNameHaveBehand = getObjValue(allBranchLeastCommit, `remotes/\\S+/${remoteBranchName}`)[0];
  if (!remoteBranchName || !remoteBranchNameHaveBehand) {
    console.error('找不到分支');
    process.exit(0);
  }
  // console.log('开始发布版本v' + version);
  shellExec(`git checkout ${branchName}`);
  shellExec(`npm version ${version} --message "[release] ${version}"`, {}, ()=>{
    resetArr.push(`git reset --hard ${allBranchLeastCommit[branchName]}`);
    resetArr.push(`git push ${config.origin} ${branchName}:${remoteBranchName} --force`);
    resetArr.push(`git reset --hard ${allBranchLeastCommit[remoteBranchNameHaveBehand]}`);
  });
  shellExec(`git push ${config.origin} ${branchName}:${remoteBranchName}`);
  shellExec(`git push ${config.origin} refs/tags/v${version}`);
}

function publishNpm(v) {
  if (config.isNeedNpmPublish) {
    if (/^(\d+.\d+.\d+)$/.test(v)) {
      shellExec('npm publish');
    } else {
      shellExec('npm publish --tag beta');
    }
  }
}

function beforeRelease() {
  let flag;
  flag = checkIsSourceProject(config.sourceProjectUrl) && checkCommit() && !(config.isNeedNpmPublish && !checkNpmPublishUrl(config.npmPublishUrl));
  if (!flag) {
    process.exit(0);
  }
}

function getDefaultVersion(v) {
  if (v) {
    let split = v.split('.');
    let length = split.length;
    split[length - 1] = Number(split[length - 1]) + 1;
    return split.join('.');
  }
}

function shellExec(str, option, fn) {
  return nodeShell(str, Object.assign({}, config.shellOption, option), fn, ()=>{
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

