import http from "@/util/request.js";

// 登录
export function userLogin(params) {
	return http.request({
		url: 'user/login',
		method: 'get',
		params,
	})
}