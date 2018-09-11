/**
 * Created by sl-c on 2018/03/25.
 * 常用方法
 */
/**
 * boolean转化
 * @param value
 * @returns {boolean}
 */
export function coerceBoolean(value) {
  return value !== null && value !== undefined && `${value}` !== 'false' && `${value}` !== 'NaN' && `${value}` !== '';
}

/**
 * 判断当前object是否存在指定key
 * @param obj
 * @param key
 * @returns {*|boolean}
 */
export function hasOwnProperty_wms(obj, key) {
  return obj && obj.hasOwnProperty(key);
}

/**
 * 判断数组是否有值
 * @param value
 * @returns {boolean}
 */
export function hasValue_arr(value) {
  if (value) {
    if (value.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * 数组内元素交换
 * @param arr
 * @param index1
 * @param index2
 */
export function swapItems(arr, index1, index2) {
  if (index1 !== index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  }
  // return arr;
}

/**
 * 当前序号的数组内元素，与前一个元素交换
 * @param arr
 * @param $index
 */
export function upRecord(arr, $index) {
  if ($index === 0) {
    return;
  }
  this.swapItems(arr, $index, $index - 1);
}

/**
 * 当前序号的数组内元素，与下一个元素交换
 * @param arr
 * @param $index
 */
export function downRecord(arr, $index) {
  if ($index === arr.length - 1) {
    return;
  }
  this.swapItems(arr, $index, $index + 1);
}

/**
 * 将后台返回数据中的null || undefined转化成 ''
 * @param dataSource
 */
export function dealDataSource(dataSource) {
  for (let item of dataSource) {
    for (let key of Object.keys(item)) {
      // if (/(undefined|null)/g.test(item[key])) {
      if (item[key] === null) {
        item[key] = '';
      }
    }
  }
}

/**
 * 判断是否为json，待改进
 * @param str
 * @returns {boolean}
 */
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      return obj && typeof obj === 'object';
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!');
  return false;
}

/**
 * 找出两个数组的差集
 * @param arr1
 * @param arr2
 * @param key
 * @returns {Array}
 */
export function differenceSet_Arr(arr1, arr2, key) {
  let result = [];
  let map = {};
  const setMap = key ? (item) => {
    map[item[key]] = true;
  } : (item) => {
    map[item] = true;
  };
  const getMapitem = key ? (item) => {
    return map[item[key]];
  } : (item) => {
    return map[item];
  };
  for (let i = 0, len = arr1.length; i < len; i++) {
    setMap(arr1[i]);
  }
  for (let i = 0, len = arr2.length; i < len; i++) {
    if (!getMapitem(arr2[i])) {
      result.push(arr2[i]);
    }
  }
  return result;
}

/**
 * 根据对象的属性寻找对象数组中的对象
 * @param {*} array   传入对象数组
 * @param {*} key     对象属性键
 * @param {*} val     对象属性值
 * @returns {object}
 */
function array_find(array, key, val) {
  return array.find(find_fn(key, val));
}

function find_fn(key, val) {
  return item => item[key] === val;
}

/**
 * 根据对象的属性对对象数组进行排序
 * @param {*} array         传入对象数组
 * @param {*} key           对象属性键
 * @param {true} isForward     是否正向排序，默认正向
 */
function array_sort(array, key, isForward = true) {
  return array.sort(sort_fn(key, isForward));
}

function sort_fn(key, isForward) {
  return isForward ? (a, b) => a[key] - b[key] : (a, b) => b[key] - a[key];
}

/**
 * 新建component时，继承基础的component 待优化
 * @param obj_1
 * @param obj_2
 */
export function assignComponent(obj_1, obj_2) {
  Object.assign(obj_1.methods, obj_2.methods);
  let result = Object.assign({}, obj_1);
  result.destroyed = function () {
    obj_1.destroyed && (obj_1.destroyed.bind(this))();
    obj_2.destroyed && (obj_2.destroyed.bind(this))();
  };
  result.deactivated = function () {
    obj_1.deactivated && (obj_1.deactivated.bind(this))();
    obj_2.deactivated && (obj_2.deactivated.bind(this))();
  };
  return result;
}

const methods = {
  'coerceBoolean': coerceBoolean,
  'hasValue_arr': hasValue_arr,
  'swapItems': swapItems,
  'upRecord': upRecord,
  'downRecord': downRecord,
  'dealDataSource': dealDataSource,
  'differenceSet_Arr': differenceSet_Arr,
  'isJSON': isJSON,
  'hasOwnProperty_wms': hasOwnProperty_wms,
  'array_find': array_find,
  'array_sort': array_sort,
  'assignComponent': assignComponent
};
export default methods;

