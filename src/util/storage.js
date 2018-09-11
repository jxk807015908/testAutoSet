/**
 * Created by sl-c on 2018/03/25.
 * sessionStorage相关方法
 */
import {coerceBoolean} from '@/util/method.js';
import Cookies from 'js-cookie';

/**
 * 获取sessionitem，并解析
 * @param item
 * @returns {any}
 */
export function getSessionItem(item) {
  return JSON.parse(sessionStorage.getItem(item));
}

/**
 * 设置sessionitem，若值为空，则删除当前item
 * @param item
 * @param value
 */
export function setSessionItem(item, value) {
  if (coerceBoolean(value)) {
    sessionStorage.setItem(item, JSON.stringify(value));
  } else {
    deleteSessionItem(item);
  }
}

/**
 * 删除sessionitem
 * @param item
 */
export function deleteSessionItem(item) {
  sessionStorage.removeItem(item);
}

/**
 * 获取Cookiesitem，并解析
 * @param item
 * @returns {any}
 */
export function getCookiesItem(item) {
  let _value = Cookies.get(item);
  if (coerceBoolean(_value)) {
    try {
      return JSON.parse(_value);
    } catch (err) {
      return _value;
    }
  } else {
    return undefined;
  }
}

/**
 * 设置Cookiesitem，若值为空，则删除当前item
 * @param item
 * @param value
 */
export function setCookiesItem(item, value, options) {
  if (coerceBoolean(value)) {
    let _value = Object.prototype.toString.call(value) === '[object String]' ? value : JSON.stringify(value);
    Cookies.set(item, _value, options);
  } else {
    deleteCookiesItem(item);
  }
}

/**
 * 删除Cookiesitem
 * @param item
 */
export function deleteCookiesItem(item) {
  Cookies.remove(item);
}

/**
 * 删除Cookiesitem
 * @param item
 */
export function clearStorage() {
  console.log('----------------clearStorage------');
  sessionStorage.clear();
  Cookies.remove('checkedWarehouse');
  Cookies.remove('token');
  Cookies.remove('userName');
  Cookies.remove('company');
  Cookies.remove('province');
  Cookies.remove('city');
  // Cookies.remove('companyId');
}
