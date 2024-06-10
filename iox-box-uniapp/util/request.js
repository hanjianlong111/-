import {
	cache
} from '../util/index.js'
const BASE_URL = 'https://juki.net.cn/';
const TIME_OUT = 30000;
class Request {
	constructor() {
		this.#initRequest();
		this.#requestInterceptors();
		this.#responseInterceptors();
	}
	// 初始化全局配置
	#initRequest() {
		// 初始化请求配置
		uni.$uv.http.setConfig((config) => {
			/* config 为默认全局配置*/
			config.baseURL = BASE_URL;
			config.timeoutt = TIME_OUT;
			// config.header["Content-Type"] = "application/json";
			config.custom = {
				auth: true
			};
			return config;
		});
	}
	// 请求拦截
	#requestInterceptors() {
		uni.$uv.http.interceptors.request.use(
			(config) => {
				config.data = config.data || {};
				if (config?.custom?.auth) {
					config.header.Authorization = cache('access_token')
				}
				if (config?.custom?.formData) {
					config.header["Content-Type"] = "application/x-www-form-urlencoded";
				}
				return config;
			},
			(config) => {
				return Promise.reject(config);
			}
		);
	}
	// 响应拦截
	#responseInterceptors() {
		uni.$uv.http.interceptors.response.use(
			(response) => {
				console.log("responseInterceptors:SUCCESS", response);
				const data = response.data;
				// 自定义参数
				// const custom = response.config?.custom;
				// if (data.code !== 200) {
				//   // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
				//   if (custom.toast !== false) {
				//     uni.$uv.toast(data.msg || data.message);
				//   }

				//   // 如果需要catch返回，则进行reject
				//   if (custom?.catch) {
				//     return Promise.reject(data);
				//   } else {
				//     // 否则返回一个pending中的promise，请求不会进入catch中
				//     return new Promise(() => {});
				//   }
				// }
				return data || {};
			},
			(response) => {
				console.log("响应拦截:ERROR", response, "---", response.config?.custom?.auth);
				if (response.config?.custom?.auth && response.statusCode === 401) {
					// 备注缓存不清
					uni.removeStorageSync('access_token')
					uni.removeStorageSync('permission')
					uni.removeStorageSync('permissionName')
					uni.navigateTo({
						url: "/pages/login/index",
					});
				}
				// 对响应错误做点什么 （statusCode !== 200）
				return Promise.resolve(response.data);
			}
		);
	}
	request(config) {
		return uni.$uv.http.request(config);
	}
}
export default new Request();