<template>
	<view>
		<headerVue @leftClick="leftClick"></headerVue>
		<view class="f8container">
			<view class="whiteContainer">
				<view class="account" v-for="(item, index) in accountList" :key="index">
					<view class="left">
						<image :src="item.path" mode=""></image>
					</view>
					<view class="right">
						<view class="texthead top">
							{{ item.name }}
						</view>
						<view class="table_th bottom">
							{{ item.value }}
						</view>
					</view>
				</view>
			</view>
			<view class="button table_th editpass" @click="edit">修改密码</view>
			<view class="head">
				<view class="title">{{ type == 3 ? '当前设备数量' : '设备管理' }}</view>
				<view class="button" @click="editAuth" :class="{ active: isedit }" v-if="type == 2">{{ isedit ? '确认修改' : '修改权限' }}</view>
			</view>
			<tableVue v-if="!isedit" @change="change" :list="list" :total="total" type="3">
				<template #head>
					<view class="head">
						<view>设备名称</view>
						<view>{{ type == 3 ? '设备编号' : '功率' }}</view>
						<view>{{ type == 3 ? '客户' : '在线情况' }}</view>
					</view>
				</template>
			</tableVue>
			<tableVue v-else :list.sync="list" type="4">
				<template #head>
					<view class="head">
						<view>设备名称</view>
						<view>设备编号</view>
					</view>
				</template>
			</tableVue>
		</view>
		<!-- 修改密码 -->
		<uni-popup ref="edit" type="dialog">
			<uni-popup-dialog title="修改密码" :before-close="true" borderRadius="20rpx" confirmText="确定" cancelText="取消" @close="close" @confirm="confirmEdit">
				<uv-form :model="form.accountInfo" :rules="rules" ref="form" labelWidth="150rpx">
					<uv-form-item label="旧密码" prop="password" borderBottom>
						<uv-input type="password" placeholder="请输入旧密码" v-model="form.accountInfo.password" border="none"></uv-input>
					</uv-form-item>
					<uv-form-item label="新密码" prop="secret" borderBottom>
						<uv-input type="password" placeholder="请输入新密码" v-model="form.accountInfo.secret" border="none"></uv-input>
					</uv-form-item>
					<uv-form-item label="确认密码" prop="newPassword" borderBottom>
						<uv-input type="password" placeholder="请再次输入新密码" v-model="form.accountInfo.newPassword" border="none"></uv-input>
					</uv-form-item>
				</uv-form>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import headerVue from '@/components/header.vue';
import tableVue from '@/components/table.vue';
import { getAccountDetail, changeSecret } from '@/api/account.js';
import { getaccountDeviceAdmin, getaccountDevice, getLastDevices, changePermission } from '@/api/device.js';
import { getCache } from '@/util/index.js';
export default {
	data() {
		return {
			accountList: [
				{
					path: '../../static/Icon.png',
					name: '账号名称',
					value: ''
				},
				{
					path: '../../static/Icon (1).png',
					name: '账号',
					value: ''
				},
				{
					path: '../../static/Group 2912.png',
					name: '备注',
					value: ''
				},
				{
					path: '../../static/Icon (2).png',
					name: '密码',
					value: ''
				}
			],
			lastSecret: '',
			isedit: false,
			total: 0,
			list: [],
			form: {
				accountInfo: {
					name: '',
					password: '',
					secret: '',
					newPassword: ''
				}
			},
			deviceForm: {
				Name: '',
				current: 1,
				size: 10
			},
			rules: {
				password: [
					{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							if (value !== this.lastSecret) callback(new Error('旧密码错误'));
							else callback();
						},
						trigger: 'blur'
					}
				],
				secret: [
					{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					},
					{
						pattern: /^[0-9a-zA-Z]*$/g,
						transform(value) {
							return String(value);
						},
						message: '只能包含字母或数字'
					},
					{
						min: 6,
						max: 20,
						message: '长度在6-20个字符之间'
					}
				],
				newPassword: [
					{
						required: true,
						message: '请再次输入新密码',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							if (value !== this.form.accountInfo.secret) callback(new Error('两次密码不一致'));
							else callback();
						},
						trigger: 'blur'
					}
				]
			}
		};
	},
	computed: {
		type() {
			return getCache('permission');
		}
	},
	components: {
		headerVue,
		tableVue
	},
	onReady() {
		this.$refs.form.setRules(this.rules);
	},
	onLoad(options) {
		if (options.name) {
			this.form.accountInfo.name = options.name;
			getAccountDetail({ Name: options.name }).then((res) => {
				if (res.resultCode === 200) {
					this.lastSecret = res.data.secret;
					res.data.secret = res.data.secret
						.split('')
						.map((item) => '*')
						.join('');
					let desc = getCache('descObj')[options.name] || '';
					let list = [res.data.name, res.data.phone, desc, res.data.secret];
					this.accountList.forEach((item, index) => {
						item.value = list[index];
					});
					this.getPage();
				} else {
					uni.showToast({
						icon: 'error',
						title: '权限不足'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				}
			});
		}
	},
	methods: {
		leftClick() {
			uni.navigateBack();
		},
		edit() {
			this.$refs.edit.open();
		},
		editAuth() {
			this.isedit = !this.isedit;
			if (this.isedit) {
				getLastDevices({ name: this.form.accountInfo.name }).then((res) => {
					if (res.resultCode === 200) {
						this.list = res.data;
					}
				});
			} else {
				this.list = this.list
					.map((item) => {
						if ((item.hasPermission && item.click) || (!item.hasPermission && !item.click)) {
							return item.deviceCode;
						}
					})
					.filter((ite) => ite);
				if (this.list.length) {
					changePermission(this.list, this.form.accountInfo.name).then((res) => {
						if (res.resultCode === 200) {
							uni.showToast({
								title: '修改成功'
							});
						} else {
							uni.showToast({
								icon: 'error',
								title: '修改失败'
							});
						}
					});
				}
				this.getPage();
			}
		},
		getPage() {
			this.deviceForm.Name = this.form.accountInfo.name;
			if (this.type == 2) {
				delete this.deviceForm.Name;
			}
			const flag = this.type == 3 ? getaccountDeviceAdmin(this.deviceForm) : getaccountDevice(this.deviceForm);
			flag.then((res) => {
				if (res.resultCode === 200) {
					if (res.data.records) {
						this.list = res.data.records;
						this.total = res.data.total;
					} else {
						this.list = res.data[0];
						this.total = res.data[1].total;
					}
				}
			});
		},
		change(e) {
			this.deviceForm.current = e;
			this.getPage();
		},
		close() {
			this.$refs.form.clearValidate();
			this.form.accountInfo.secret = '';
			this.form.accountInfo.newPassword = '';
			this.form.accountInfo.password = '';
			this.$refs.edit.close();
		},
		confirmEdit() {
			this.$refs.form
				.validate()
				.then((res) => {
					delete this.form.accountInfo.password;
					delete this.form.accountInfo.newPassword;
					changeSecret(this.form.accountInfo)
						.then((res) => {
							if (res.resultCode === 200) {
								uni.showToast({
									title: '修改成功'
								});
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/login/index'
									});
								}, 1000);
							}
						})
						.finally(() => {
							this.close();
						});
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss">
.whiteContainer {
	padding: 20rpx;
	.account {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		.left {
			width: 62rpx;
			height: 62rpx;
			margin-right: 20rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.right {
			.top {
				color: #1c1c1e;
			}
			.bottom {
				color: #636366;
			}
		}
	}
	.account:last-child {
		margin-bottom: 0;
	}
}
.editpass {
	position: absolute;
	background-color: #f8f8f8;
	right: 8%;
	top: 42%;
}
.uni-dialog-title {
	display: flex !important;
}
.uv-form-item__body__right__message {
	margin-left: 78px !important;
}
.title {
	margin: 40rpx 0;
	font-size: 32rpx;
	font-weight: bold;
	color: #1c1c1e;
}
.button {
	color: #333333;
	font-size: 22rpx;
}
.active {
	color: #527ff4;
}
</style>
