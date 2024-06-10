<template>
	<view class="page">
		<headerVue @leftClick="leftClick"></headerVue>
		<view class="texthead payhead">当前充值设备账号：</view>
		<uv-input :customStyle="customStyle" v-model="account" placeholder="请输入充值账号" border="surround"></uv-input>
		<view class="f8container">
			<view class="texthead">当前设备数量：{{ num }}台</view>
			<view class="paycontainer">
				<view class="texthead payitem" :class="{ active: currentIndex == index }" @click="payClick(index)" v-for="(item, index) in paylist" :key="index">{{ item }}</view>
			</view>
		</view>
		<button class="btn" @click="submit" :loading="loading">确定充值</button>
	</view>
</template>
<script>
import headerVue from '@/components/header.vue';
export default {
	data() {
		return {
			customStyle: {
				borderColor: '#527ff4 !important'
			},
			num: 10,
			currentIndex: 0,
			loading: false,
			paylist: ['1年', '2年', '3年', '5年', '10年', '15年']
		};
	},
	components: {
		headerVue
	},
	methods: {
		leftClick() {
			uni.navigateBack();
		},
		payClick(index) {
			this.currentIndex = index;
		},
		submit() {}
	}
};
</script>

<style lang="scss">
.page {
	padding: 0 30rpx;
}
.payhead {
	margin: 40rpx 0;
}
.head_container {
	padding: 0 !important;
}
.uv-input {
	background-color: #f8f8f8 !important;
	border-radius: 20rpx !important;
}
.f8container {
	border-radius: 20rpx;
	.texthead {
		color: #000000;
		margin-bottom: 0;
	}
	.paycontainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.payitem {
			margin-bottom: 0;
			margin-top: 40rpx;
			width: 180rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			border-radius: 24rpx;
			color: #000000;
			background-color: #ffffff;
		}
		.active {
			border: 1rpx solid #527ff4;
		}
	}
}
.btn {
	margin-top: 40rpx;
}
</style>
