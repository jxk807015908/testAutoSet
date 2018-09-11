import axios from 'axios';
import {MessageBox, Message} from 'element-ui';
import {clearStorage} from '@/util/storage.js';
import {coerceBoolean} from '@/util/method.js';
import promiseControl from "@/util/promiseControl";

function onRespons(res) {
  if (!res.data.success) {
    switch (res.data.code) {
      case 880104:
        MessageBox.alert(res.data.msg, {
          confirmButtonText: '确定'
        }).then(() => {
          location.href = res.data.data;
          clearStorage();
        }).catch(() => {
          location.href = res.data.data;
          clearStorage();
        });
        break;
    }
    return res;
  } else {
    switch (res.data.code) {
      case 880706: // 盘点异常处理（操作盘点时）错误码
        Object.assign(res.data.data, {extendData: {code: res.data.code}});
        break;
    }
    return res;
  }
}

function onError(err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;
      case 401:
        err.message = '未授权，请登录';
        break;
      case 403:
        err.message = '拒绝访问';
        break;
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`;
        break;
      case 408:
        err.message = '请求超时';
        break;
      case 500:
        err.message = '服务器内部错误';
        break;
      case 501:
        err.message = '服务未实现';
        break;
      case 502:
        err.message = '网关错误';
        break;
      case 503:
        err.message = '服务不可用';
        break;
      case 504:
        err.message = '网关超时';
        break;
      case 505:
        err.message = 'HTTP版本不受支持';
        break;
      default:
        err.message = '连接出错';
    }
  }
  Message.error(err.message);
  // return Promise.reject(err);
}

/**
 * 循环传参对象，删除空字段
 * 移除值为‘’的数据
 * @param handleParam 新对象
 * @param param 原对象
 */
function loopParam(handleParam, param) {
  if (!coerceBoolean(param)) {
    return;
  }
  let keys = Object.keys(param);
  if (keys.length === 0) {
    return;
  }
  for (let i of keys) {
    if (Object.prototype.toString.call(param[i]) === '[object Object]') {
      handleParam[i] = {};
      loopParam(handleParam[i], param[i]);
    } else if (Object.prototype.toString.call(param[i]) === '[object Array]') {
      handleParam[i] = [];
      loopParam(handleParam[i], param[i]);
    } else if (param[i] !== '') {
      handleParam[i] = param[i];
    }
  }
}

// create an axios instance
const apiService = axios.create({
  // baseURL: '/djwmsservice' // api的base_url
  // timeout: 5000, // request timeout
});
// apiService.interceptors.response.use(res => onRespons(res), error => onError(error));
/**
 * 判断key值是否有效
 * @param key
 * @returns {*|boolean}
 */
const isAgingKey = (key) => {
  return (key && promiseControl.indexOf(key)) || key === undefined;
};
/**
 * 系统基础post请求
 * @param url 请求url
 * @param param 请求参数
 * @param callBack 请求后回调
 * @param controlFn 请求控制Fn
 * @param service 请求服务
 * @returns {Promise<any>}
 */
apiService.wmsPost = function (url, param, callBack, controlFn, service = '/djwmsservice') {
  url = service + url;
  let {key, keyState = false} = this;
  if (controlFn) {
    key = promiseControl.addItem(url);
    controlFn(key);
  }
  let afterPost = () => {
    keyState = isAgingKey(key);
    callBack && callBack();
    keyState && promiseControl.deleteItem(key);
  };
  return new Promise((resolve, reject) => {
    let handleParam = Object.prototype.toString.call(param) === '[object Array]' ? [] : {};
    loopParam(handleParam, param);
    apiService.post(url, handleParam).then(res => {
      afterPost();
      onRespons(res);
      try {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          keyState && Message.error(res.data.msg);
          reject(res.data.msg);
        }
      } catch (e) {
        console.error('-- 后端数据返回出错：' + e);
        reject(res);
      }
    }).catch(e => {
      afterPost();
      // then解析出错时，会被catch捕获
      keyState && onError(e);
      reject(e);
    });
  });
};
export default apiService;
