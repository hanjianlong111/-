<template>
	<view>
		<headerVue @leftClick="leftClick"></headerVue>
		<view class="f8container">
			<view class="whiteContainer">
				<uv-form :model="form.accountInfo" :rules="rules" ref="form">
					<view class="account">
						<view class="left">
							<image src="@/static/Icon.png" mode=""></image>
						</view>
						<view class="right">
							<view class="texthead top">账号名称</view>
							<view class="bottom">
								<uv-form-item prop="name">
									<uv-input placeholder="请输入" v-model="form.accountInfo.name" border="none"></uv-input>
								</uv-form-item>
							</view>
						</view>
					</view>
					<view class="account" v-if="type == 3">
						<view class="left">
							<image src="@/static/Group 2912.png" mode=""></image>
						</view>
						<view class="right">
							<view class="texthead top">批次</view>
							<view class="bottom">
								<uv-form-item prop="batch">
									<uv-input placeholder="请输入" v-model="form.accountInfo.batch" border="none"></uv-input>
								</uv-form-item>
							</view>
						</view>
					</view>
					<view class="account">
						<view class="left">
							<image src="@/static/Icon (2).png" mode=""></image>
						</view>
						<view class="right">
							<view class="texthead top">密码</view>
							<view class="bottom">
								<uv-form-item prop="secret">
									<uv-input type="password" placeholder="请输入" v-model="form.accountInfo.secret" border="none"></uv-input>
								</uv-form-item>
							</view>
						</view>
					</view>
					<view class="account">
						<view class="left">
							<image src="@/static/Icon (2).png" mode=""></image>
						</view>
						<view class="right">
							<view class="texthead top">确认密码</view>
							<view class="bottom">
								<uv-form-item prop="password">
									<uv-input type="password" placeholder="请输入" v-model="form.accountInfo.password" border="none"></uv-input>
								</uv-form-item>
							</view>
						</view>
					</view>
				</uv-form>
			</view>
			<button class="btn" @click="submit" :loading="loading">确认</button>
		</view>
	</view>
</template>

<script>
import headerVue from '@/components/header.vue';
import { addAdminAccount, addAccount } from '@/api/account.js';
export default {
	data() {
		return {
			form: {
				accountInfo: {
					name: '',
					secret: '',
					batch: '',
					password: ''
				}
			},
			loading: false,
			rules: {
				name: [
					{
						required: true,
						message: '请输入',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 20,
						message: '长度在6-20个字符之间'
					}
				],
				batch: {
					required: true,
					message: '请输入',
					trigger: 'blur'
				},
				secret: [
					{
						required: true,
						message: '请输入',
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
				password: [
					{
						required: true,
						message: '请输入',
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
	components: {
		headerVue
	},
	onReady() {
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		leftClick() {
			uni.navigateBack();
		},
		submit() {
			this.$refs.form
				.validate()
				.then(() => {
					if (this.type == 2) {
						delete this.form.accountInfo.batch;
					}
					delete this.form.accountInfo.password;
					this.loading = true;
					const flag = this.type == 3 ? addAdminAccount(this.form.accountInfo) : addAccount(this.form.accountInfo);
					flag.then((res) => {
						if (res.resultCode === 200) {
							uni.showToast({
								title: '新增成功'
							});
							setTimeout(() => {
								uni.navigateBack();
							}, 1000);
						} else {
							uni.showToast({
								icon: 'error',
								title: '新增失败'
							});
						}
					}).finally(() => {
						this.loading = false;
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
	.whiteContainer {
		padding: 20rpx;
		.account {
			display: flex;
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
				}
			}
		}
		.account:last-child {
			margin-bottom: 0;
		}
	}
	.btn {
		margin-top: 40rpx;
	}
}
.uv-form-item__body {
	padding: 0 !important;
}
.uv-input__content__prefix-icon {
	margin-right: 0 !important;
}
.uv-form-item__body__right__message {
	margin-left: 0 !important;
}
</style>
