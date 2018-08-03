const shell = require('shelljs');

let version = undefined;
process.stdin.setEncoding('utf8');
console.log('请输入版本号:');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    version = chunk;
    let _version = version.replace(/^beta/,'');
    console.log("git checkout master:",shell.exec('git checkout master').code);
    console.log("git merge dev:",shell.exec('git merge dev').code);
    console.log('开始发布版本v' + version);

    console.log("git add -A:",shell.exec('git add -A').code);
    console.log("npm version $VERSION --message \"[release] $_VERSION\":",shell.exec(`npm version ${_version} --message "[release] ${_version}"`).code);
    // console.log("git checkout master:",shell.exec('git checkout master').code);
    // console.log("git checkout master:",shell.exec('git checkout master').code);
    // console.log("git checkout master:",shell.exec('git checkout master').code);

    // git checkout master
    // git merge dev
    // console.log(shell)





    process.exit(0);
    // console.log(process);
    // process.stdout.write(`data: ${chunk}`);
  }
});
// process.stdin.on('end', () => {
//   process.stdout.write('end');
// });
// shell.echo('hahahahahhahahahahhahaha');
// console.log(shell);
// var a = shell.read();
// shell.exec('read a');
// read('a');
// exit(1);

