module.exports = {
  test: process.argv.includes('-t'), //开发脚本时使用
  origin: 'origin',
  npmPublishUrl: 'http://192.168.0.236:8081/repository/djcpsnpm-host/',
  isNeedNpmPublish: process.argv.includes('-p'),
  sourceProjectUrl: 'https://github.com/jxk807015908/testAutoSet.git',
  isDirectRelease: process.argv.includes('-d'),
  shellOption: {
    codeMsg: true
  }
};
