console.log('compatible---------------------');
let userAgent = navigator.userAgent; //获取用户端的Web浏览器版本号
let userAgentIndex = userAgent.indexOf("MSIE"); //检测特殊字符串"MSIE"的位置，因为IE的版本信息中总是会有MSIE的存在，这是共性
let browserVersion = parseInt(
  userAgent.substring(
    userAgentIndex + 5,
    userAgent.indexOf(";", userAgentIndex)
  ), 10
);
console.log(userAgent);
console.log(userAgentIndex);
console.log(browserVersion);
if (browserVersion < 10 && browserVersion) {
  // let userAgentIndex = userAgent.includes("Chrome");
  // if (userAgentIndex) {
  let head = document.getElementsByTagName('HEAD').item(0);
  let style = document.createElement('link');
  style.href = './static/css/compatible.css';
  style.rel = 'stylesheet';
  style.type = 'text/css';
  head.appendChild(style);
  let divElement = document.createElement('div');
  divElement.id = 'compatible';

  divElement.innerHTML =
    '<div class="suppport_title">您目前使用的浏览器版本过低</div>' +
    '<div class="suppport_title">为了给您更好的用户体验,请升级至 IE10 以上</div>' +
    '<div class="suppport_sub_title">建议您使用以下浏览器</div>' +
    '<div class="browser">' +
    '<a href="http://w.wens.com.cn/static/slibs/download/browser/Google32.zip">' +
    '<img src="static/image/chrome.png" width="170" height="170" />' +
    '</a>' +
    '<a href="http://w.wens.com.cn/static/slibs/download/browser/Firefox.zip">' +
    '<img src="static/image/firefox.png" width="170" height="170" />' +
    '</a>' +
    '</div>';
alert(1);
  setTimeout(function () {
    document.body.appendChild(divElement);
  }, 0);
}
