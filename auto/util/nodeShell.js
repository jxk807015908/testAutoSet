const shell = require('shelljs');
const DEFAULT_OPTION = {
  silent: true,
  codeMsg: true,
  ignoreErr: false
};

function nodeShell(str, option, fn, errFn) {
  let resOption = Object.assign({}, DEFAULT_OPTION, option);
  let { silent, ignoreErr, codeMsg } = resOption;
  let res = shell.exec(str, {silent, async: false});
  let code = res.code;
  let stdout = res.stdout;
  codeMsg && console.log(str + ': ' + code);
  // console.warn(code);
  if (code && !ignoreErr) {
    // console.log('发布出错！！！！！');
    console.log(res.stderr);
    return errFn && errFn();
    // resetArr.length !==0 && reset();
    // process.exit(0);
  }
  return code === 0 && fn && fn(stdout);
}
module.exports = nodeShell;
