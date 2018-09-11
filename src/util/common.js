import {MessageBox} from 'element-ui';
import {coerceBoolean} from './method';
//yyyy为年 MM为月 dd为日 HH为小时 mm为分钟 ss为秒
export const timeFormat = (time, format) => {
  let _time = time;
  if (!coerceBoolean(_time)) return '';
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/g.test(_time)) { //‘2018-08-21 15:28:00’这种格式ie浏览器不兼容
    _time = _time.replace('-', '/');
  }
  let t = new Date(_time);
  let y = t.getFullYear();
  let M = t.getMonth() + 1;
  if (M < 10) M = '0' + M;
  let d = t.getDate();
  if (d < 10) d = '0' + d;
  let H = t.getHours();
  if (H < 10) H = '0' + H;
  let m = t.getMinutes();
  if (m < 10) m = '0' + m;
  let s = t.getSeconds();
  if (s < 10) s = '0' + s;
  return format.replace(/yyyy/, y).replace(/MM/, M).replace(/dd/, d).replace(/HH/, H).replace(/mm/, m).replace(/ss/, s);
};
//时间
export const formatDate = function (now) { //年-月-日-时-分-秒
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  //let arr = [month, date, hour, minute, second];
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
};
//打印
// export const one_print = (content) => {
//   let iframe = document.createElement('IFRAME');
//   let doc = null;
//   iframe.setAttribute('style', 'display:none;');
//   document.body.appendChild(iframe);
//   doc = iframe.contentWindow.document;
//   doc.write(content);
//   doc.close();
//   iframe.contentWindow.focus();
//   iframe.contentWindow.print();
//   document.body.removeChild(iframe);
// };
//数字金额转换中文大写
export const changeMoney = (n) => {
  let fraction = ['角', '分'];
  let digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  let unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  let head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};
//弹出提示框
export const tipBox = (txt, fn1, fn2) => {
  MessageBox.confirm(txt, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        if (fn1 && fn1.constructor === Function) {
          let oldConfirmButtonText = instance.confirmButtonText;
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '执行中...';
          let result = fn1();
          // console.log(result);
          // console.log(Promise);
          if (result && typeof result.then === 'function') {
            result.then(() => {
              done();
              instance.confirmButtonLoading = false;
            }).catch(() => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = oldConfirmButtonText;
            });
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        } else {
        }
      } else {
        done();
      }
    }
  }).then(() => {
    // fn1 && fn1.constructor === Function && fn1();
  }).catch(() => {
    fn2 && fn2.constructor === Function && fn2();
  });
};
//获取提货员状态
export const getPickerStatus = (n) => {
  switch (parseInt(n, 10)) {
    case 1:
      return '空闲';
    case 2:
      return '忙碌';
    case 3:
      return '休息';
    default:
      return '';
  }
};
//获取装车台状态
export const getEntStatus = (n) => {
  switch (parseInt(n, 10)) {
    case 1:
      return '使用中';
    case 2:
      return '空闲';
    default:
      return '状态有误';
  }
};
//获取订单状态
export const getOrderStatus = (n) => {
  switch (parseInt(n, 10)) {
    case 3:
      return '待入库';
    case 21:
      return '部分入库';
    case 4:
      return '已入库';
    case 23:
      return '已配货';
    case 24:
      return '已提货';
    case 25:
      return '已装车';
    case 26:
      return '已发车';
    default:
      return '状态有误';
  }
};
// 判断订单是否能操作
export const JUDGE_ABLE = (data) => {
  return data.splitOrder ? !['22'].includes(data.orderStatus) : !['22', '21'].includes(data.orderStatus);
};

export const getStyle = (obj, attr) => {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return getComputedStyle(obj, null)[attr];//放null参数的那个地方放false也可以，只要带一个参数，值您任意，高兴就好。
  }
};
//盘点模块正在修改暂不删除该方法
export const suspendScroll = (outerBox, innerBox, warp) => {
  if (!outerBox || !innerBox) return;
  let scroll = suspendScrollInit(outerBox, innerBox);
  //console.log(scroll)
  scroll && warp.addEventListener('scroll', scroll);
  //scroll&&(window.onscroll=scroll);
  window.addEventListener('resize', () => {
    suspendScrollInit(outerBox, innerBox);
  });
};
export const suspendScrollInit = (outerBox, innerBox) => {
  // console.log('----------------------')
  // console.log(innerBox.offsetWidth)
  // console.log(outerBox.offsetWidth)
  // console.log('-----------------------')
  if (innerBox.offsetWidth <= outerBox.offsetWidth) {
    //消除table隐藏部分字段时产生的影响
    let scrollBox = outerBox.getElementsByClassName('scroll-box')[0];
    scrollBox && scrollBox.parentNode.removeChild(scrollBox);
    return;
  }
  let scrollBox = outerBox.getElementsByClassName('scroll-box')[0];
  let myScroll;
  if (scrollBox) {
    myScroll = scrollBox.getElementsByTagName('div')[0];
  } else {
    scrollBox = document.createElement('div');
    scrollBox.className = 'scroll-box';
    myScroll = document.createElement('div');
    scrollBox.appendChild(myScroll);
    outerBox.appendChild(scrollBox);
  }
  scrollBox.onscroll = () => {
    //innerBox.style.left = '-' + scrollBox.scrollLeft + 'px';
    if (!(scrollBox.style.position === 'fixed')) {
      scrollBox.style.left = scrollBox.scrollLeft + 'px';
    }
    outerBox.scrollLeft = scrollBox.scrollLeft;
  };
  //滚动条的宽度=table的宽度
  myScroll.style.width = innerBox.offsetWidth + 'px';
  scrollBox.style.width = outerBox.offsetWidth + 'px';
  // console.log(scrollBox.style.width)
  // console.log(myScroll.style.width)
  //scrollBox.scrollLeft = -parseFloat(innerBox.style.left);
  let tableScroll = () => {
    //缓存页面的滚动事件都会监听到，所以要排除非当前页的滚动条的滚动事件
    if (!document.getElementsByClassName('scroll-box')[0]) return;
    if (!document.getElementsByClassName(scrollBox.className)[0]) return;
    if (document.getElementsByClassName(scrollBox.className)[0] !== scrollBox) return;
    let nowTop = document.body.offsetHeight - outerBox.getBoundingClientRect().top;
    scrollBox.style.position = (nowTop < outerBox.offsetHeight && nowTop > 40) ? 'fixed' : 'absolute';
    if (scrollBox.style.position === 'fixed') {
      scrollBox.style.left = 'auto';
    } else {
      scrollBox.style.left = outerBox.scrollLeft + 'px';
    }
  };
  tableScroll();
  return tableScroll;
};
//深度遍历
export const deepDelete = (obj, keyList) => {
  for (let key in obj) {
    if (obj.constructor === Object && keyList.includes(key)) {
      delete obj[key];
      continue;
    }
    obj[key] && (obj[key].constructor === Array || obj[key].constructor === Object) && deepDelete(obj[key], keyList);
  }
};

export const insertAfter = (newElement, targetElement) => {
  let parent = targetElement.parentNode;
  // 如果最后的节点是目标元素，则直接添加
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    //如果不是，则插入在目标元素的下一个兄弟节点 的前面
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};
