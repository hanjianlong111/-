import http from "@/util/request.js";

// 设备管理分页
export function getDevicePage(params) {
	return http.request({
		url: 'bind/getDevice',
		method: 'get',
		params,
	})
}

// 获取设备详情
export function getDeviceData(params) {
	return http.request({
		url: 'bind/getDeviceData',
		method: 'get',
		params,
	})
}

// 超级管理员设备入库
export function superAdminAddDevice(params) {
	return http.request({
		url: 'bind/addDevice',
		method: 'get',
		params,
	})
}

// 客户主账号设备激活
export function adminAddDevice(params) {
	return http.request({
		url: 'bind/deviceInit',
		method: 'get',
		params,
	})
}

// 账号详情获取从账号设备列表
export function getaccountDevice(params) {
	return http.request({
		url: 'bind/getDeviceDetails',
		method: 'get',
		params,
	})
}

// 账号详情获取主账号设备列表
export function getaccountDeviceAdmin(params) {
	return http.request({
		url: 'bind/getDeviceForPermission2',
		method: 'get',
		params,
	})
}

// 获取设备按钮数据
export function getDeviceButtons(params) {
	return http.request({
		url: 'bind/getDeviceButtons',
		method: 'get',
		params,
	})
}

// 设备按钮操作
export function deviceButtonOperation(params) {
	return http.request({
		url: 'bind/DeviceOperation',
		method: 'get',
		params,
	})
}

// 获取图表参数
export function getDeviceEchart(params) {
	return http.request({
		url: 'bind/getdevice485Setting',
		method: 'get',
		params,
	})
}

// 获取自定义参数
export function getCustomFields(params) {
	return http.request({
		url: 'bind/getCustomFields',
		method: 'get',
		params,
	})
}

// 获取子账号权限表格数据
export function getLastDevices(params) {
	return http.request({
		url: 'bind/getPermissionByDevices',
		method: 'get',
		params,
	})
}

// 设置按钮数据
export function setDevicesButtons(data) {
	return http.request({
		url: 'bind/setDeviceButtons',
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		data,
	})
}

// 设置图表参数
export function setDeviceFields(data, code) {
	return http.request({
		url: 'bind/device485Setting?deviceCode=' + code,
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		data
	})
}

// 设置自定义参数
export function setCustomFields(data) {
	return http.request({
		url: 'bind/setCustomFields',
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		data
	})
}

// 修改子账号设备权限
export function changePermission(data, name) {
	return http.request({
		url: 'user/ChangeDevicePermission?name=' + name,
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		data
	})
}

// 修改设备名称
export function updateName(params) {
	return http.request({
		url: 'bind/ChangeName',
		method: 'post',
		params,
	})
}