<template>
	<view>
		<uv-navbar title=" " placeholder @leftClick="leftClick">
			<template v-slot:right v-if="type != 3">
				<uv-notice-bar :text="text"></uv-notice-bar>
			</template>
		</uv-navbar>
		<view class="head_container">
			<view class="left">
				<image src="@/static/Avatar.png" mode=""></image>
			</view>
			<view class="mid">
				<view class="texthead">
					Hello,
					<text style="color: #1d1d20">{{ name }}</text>
				</view>
				<view class="accountType">{{ accountType }}</view>
			</view>
			<view class="pay img" @click="goPay" v-if="type == 2 && showPay">
				<image src="@/static/Group 2932.png" mode=""></image>
			</view>
			<view class="notice img" v-if="showNotice" @click="goNotice">
				<image src="@/static/Group 2906.png" mode=""></image>
			</view>
			<view class="account" v-if="showAccount">
				<view class="add img" @click="addAccount">
					<image src="@/static/Group 2914.png" mode=""></image>
				</view>
				<view class="img" @click="goAccount" v-if="type == 2">
					<image src="@/static/Group 2913.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAccountMessage } from '@/api/account.js';
import { getCache } from '@/util/index.js';
export default {
	name: 'header',
	data() {
		return {
			text: ''
		};
	},
	props: {
		showPay: {
			type: Boolean,
			default: false
		},
		showNotice: {
			type: Boolean,
			default: true
		},
		showAccount: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		type() {
			return getCache('permission');
		},
		name() {
			return getCache('permissionName');
		},
		accountType() {
			let type = getCache('permission');
			if (type == 3) {
				return '超级管理员';
			} else if (type == 2) {
				return '账号管理员';
			} else {
				return '设备管理员';
			}
		}
	},
	mounted() {
		getAccountMessage().then((res) => {
			if (res.resultCode === 200) {
				this.text = res.data
					.map((item) => {
						return item.message;
					})
					.join('。');
			}
		});
	},
	methods: {
		goNotice() {
			uni.navigateTo({
				url: '/subpack/notice/index'
			});
		},
		goPay() {
			uni.navigateTo({
				url: '/subpack/pay/index'
			});
		},
		addAccount() {
			uni.navigateTo({
				url: '/subpack/account/add'
			});
		},
		goAccount() {
			uni.navigateTo({
				url: '/subpack/account/index'
			});
		},
		leftClick() {
			this.$emit('leftClick');
		}
	}
};
</script>

<style lang="scss">
.head_container {
	display: flex;
	padding: 0 40rpx;
	position: relative;
	align-items: center;
	.left {
		width: 76rpx;
		height: 76rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.mid {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		.accountType {
			color: #8e8e93;
			font-size: 26rpx;
		}
	}
	.pay {
		position: absolute;
		right: 140rpx;
	}
	.notice {
		position: absolute;
		right: 30rpx;
	}
	.account {
		display: flex;
		position: absolute;
		right: 30rpx;
	}
	.add {
		margin-right: 40rpx;
	}
	.img {
		width: 69rpx;
		height: 69rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
