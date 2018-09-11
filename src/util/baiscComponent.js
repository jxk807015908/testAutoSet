import promiseControl from "@/util/promiseControl";
import axiosApi from "@/util/axiosApi.js";

export default {
  destroyed() {
    promiseControl.deleteItems(this.promiseURLs);
  },
  deactivated() {
    promiseControl.deleteItems(this.promiseURLs);
  },
  methods: {
    /**
     * 组件内post请求
     * @param url 必传
     * @param param 必传
     * @param callback
     * @param service
     * @returns {Promise<any>|*}
     */
    post: function (url, param, callback, service = '/djwmsservice') {
      let controlPromis = function (key) {
        // promiseControl.addItem(key);
        if (!this.promiseURLs) {
          this.promiseURLs = [];
        }
        this.promiseURLs.push(key);
      }.bind(this);
      return axiosApi.wmsPost(url, param, callback, controlPromis, service);
    }
  }
};
