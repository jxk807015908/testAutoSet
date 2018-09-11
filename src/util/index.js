
function HttpRequest() {
  let o = new Object();
  /**
   * 拦截器
   * @type {undefined}
   */
  o.interceptor = undefined;
  /**响应拦截器
   * @type {undefined}
   */
  o.responseInterceptor = undefined;
  /**
   * 错误拦截器
   * @type {undefined}
   */
  o.errorInterceptor = undefined;
  return o;
}
