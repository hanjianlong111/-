import http from "@/util/request.js";

// 账号管理分页
export function getAccountPage(params) {
	return http.request({
		url: 'user/getAccounts',
		method: 'get',
		params,
	})
}

// 获取子账号详情
export function getAccountDetail(params) {
	return http.request({
		url: 'user/getAccount',
		method: 'get',
		params,
	})
}

// 新增客户主账号
export function addAdminAccount(params) {
	return http.request({
		url: 'user/ManagerAdd',
		method: 'get',
		params,
	})
}

// 新增客户子账号
export function addAccount(params) {
	return http.request({
		url: 'user/add',
		method: 'get',
		params,
	})
}

// 获取账户消息
export function getAccountMessage(params) {
	return http.request({
		url: 'bind/getAccountMessage',
		method: 'get',
		params,
	})
}

// 解密手机号
export function getUserPhoneNumber(params) {
	return http.request({
		url: 'user/getUserPhoneNumber',
		method: 'get',
		params,
	})
}

// 用户第一次登陆绑定手机号并修改密码
export function changePhoneAndSecret(data) {
	return http.request({
		url: 'user/changeSecretAndPhone',
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		data,
	})
}

// 发送验证码
export function getPhoneCode(params) {
	return http.request({
		url: 'user/getCode',
		method: 'get',
		params,
	})
}

// 修改下级账号密码
export function changeSecret(params) {
	return http.request({
		url: 'user/changedSlaveUser',
		method: 'post',
		params,
	})
}

// 修改本账号密码
export function changePUser(params) {
	return http.request({
		url: 'user/changedUser',
		method: 'post',
		params,
	})
}

// 发送code给服务端
export function sendCode(params) {
	return http.request({
		url: 'user/getOpenID',
		method: 'get',
		params,
	})
}

// 订阅消息
export function setMessage(data) {
	return http.request({
		url: 'user/setTemplateID',
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		data,
	})
}