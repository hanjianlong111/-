<template>
	<view>
		<headerVue @leftClick="leftClick"></headerVue>
		<view class="f8container">
			<view v-if="pathType == 'login'" class="table_head">首次登录需绑定手机号并修改初始密码</view>
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
			<view :style="{ top: top }" class="button table_th" @click="edit">修改密码</view>
		</view>
		<!-- 修改密码 -->
		<uni-popup ref="edit" type="dialog">
			<uni-popup-dialog title="修改密码" :before-close="true" borderRadius="20rpx" confirmText="确定" cancelText="取消" @close="close" @confirm="confirmEdit">
				<uv-form :model="form.accountInfo" :rules="rules" ref="form" labelWidth="150rpx">
					<uv-form-item label="手机号" prop="phone" borderBottom>
						<uv-input placeholder="请输入手机号" v-model="form.accountInfo.phone" border="none"></uv-input>
					</uv-form-item>
					<uv-form-item label="验证码" prop="CheckedCode" borderBottom>
						<uv-input placeholder="请输入验证码" v-model="form.accountInfo.CheckedCode" border="none">
							<template v-slot:suffix>
								<uv-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"></uv-code>
								<uv-button @click="getCode" :text="tips" type="success" size="mini"></uv-button>
							</template>
						</uv-input>
					</uv-form-item>
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
		<uv-toast ref="toast"></uv-toast>
	</view>
</template>

<script>
import { getCache } from '@/util/index.js';
import headerVue from '@/components/header.vue';
import { getAccountDetail, changePhoneAndSecret, changePUser, getPhoneCode } from '@/api/account.js';
export default {
	data() {
		return {
			form: {
				accountInfo: {
					name: '',
					CheckedCode: '',
					phone: '',
					secret: '',
					password: '',
					newPassword: ''
				}
			},
			lastSecret: '',
			tips: '',
			pathType: '',
			rules: {
				phone: [
					{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							var reg = /^1[3456789]\d{9}$/;
							if (!reg.test(value)) callback(new Error('手机号格式错误'));
							else callback();
						},
						trigger: 'blur'
					}
				],
				CheckedCode: [
					{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}
				],
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
			},
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
					path: '../../static/Icon (2).png',
					name: '密码',
					value: ''
				}
			]
		};
	},
	components: {
		headerVue
	},
	onReady() {
		this.$refs.form.setRules(this.rules);
	},
	onLoad(options) {
		this.pathType = options.type;
		getAccountDetail({ Name: this.name }).then((res) => {
			if (res.resultCode === 200) {
				this.lastSecret = res.data.secret;
				res.data.secret = res.data.secret
					.split('')
					.map((item) => '*')
					.join('');
				let list = [res.data.name, res.data.phone, res.data.secret];
				this.accountList.forEach((item, index) => {
					item.value = list[index];
				});
			}
		});
	},
	computed: {
		top() {
			if (this.pathType == 'login') {
				return '40%';
			} else {
				return '36%';
			}
		},
		name() {
			return getCache('permissionName');
		}
	},
	methods: {
		codeChange(text) {
			this.tips = text;
		},
		getCode() {
			this.$refs.form.validateField('phone', (e) => {
				if (!e.length) {
					if (this.$refs.uCode.canGetCode) {
						getPhoneCode({ name: this.name, phone: this.form.accountInfo.phone }).then((res) => {});
						setTimeout(() => {
							uni.showToast({
								title: '验证码已发送'
							});
							this.$refs.uCode.start();
						}, 2000);
					} else {
						uni.showToast({
							icon: 'error',
							title: '请稍后再试'
						});
					}
				}
			});
		},
		leftClick() {
			uni.navigateBack();
		},
		edit() {
			this.$refs.edit.open();
		},
		close() {
			this.$refs.form.clearValidate();
			this.form.accountInfo.CheckedCode = '';
			this.form.accountInfo.secret = '';
			this.form.accountInfo.newPassword = '';
			this.form.accountInfo.phone = '';
			this.form.accountInfo.password = '';
			this.$refs.edit.close();
		},
		confirmEdit() {
			this.$refs.form
				.validate()
				.then((res) => {
					delete this.form.accountInfo.password;
					delete this.form.accountInfo.newPassword;
					this.form.accountInfo.name = this.name;
					const flag = this.pathType == 'login' ? changePhoneAndSecret(this.form.accountInfo) : changePUser(this.form.accountInfo);
					flag.then((res) => {
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
					}).finally(() => {
						this.close();
					});
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss">
.f8container {
	border-radius: 40rpx;
	.table_head {
		margin-top: 40rpx;
	}
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
	.button {
		position: absolute;
		background-color: #f8f8f8;
		right: 8%;
	}
}
.uni-dialog-title {
	display: flex !important;
}
.uv-form-item__body__right__message {
	margin-left: 78px !important;
}
.uv-button--mini {
	height: 22px !important;
	font-size: 10px !important;
	min-width: 50px !important;
	padding: 0px 8px !important;
	border-radius: 3px !important;
}
</style>
