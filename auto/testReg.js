const shell = require('shelljs');
shellExec('git tag -d v1.2.17');
shellExec('git push origin :refs/tags/v1.2.17');

process.exit(0);

function shellExec(str, flag) {
  let code = shell.exec(str).code;
  console.log(str + ': ' + code);
  // console.warn(code);
  if (code && !flag) {
    console.log('发布出错！！！！！');
    process.exit(0);
  }
}
