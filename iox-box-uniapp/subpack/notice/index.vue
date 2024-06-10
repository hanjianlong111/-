<template>
	<view>
		<headerVue @leftClick="leftClick" :showNotice="showNotice"></headerVue>
		<view class="f8container">
			<view class="head table_head">
				<view class="title">提醒</view>
				<button class="button table_th" open-type="subscribe" @subscribe="sengMessage">订阅消息</button>
			</view>
			<view class="whiteContainer list" v-for="(item, index) in noticeList" :key="index">
				<view class="texthead">{{ item.filed }}</view>
				<view class="time">{{ formatTime(item.time) }}</view>
				<view class="texthead desc">{{ item.message }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import headerVue from '@/components/header.vue';
import { getAccountMessage, setMessage } from '@/api/account.js';
export default {
	data() {
		return {
			noticeList: [],
			showNotice: false
		};
	},
	onShow() {
		this.getAccountMessage();
	},
	components: {
		headerVue
	},
	methods: {
		leftClick() {
			uni.navigateBack();
		},
		getAccountMessage() {
			getAccountMessage().then((res) => {
				if (res.resultCode === 200) {
					this.noticeList = res.data;
				}
			});
		},
		formatTime(time) {
			return uni.$uv.date(time, 'yyyy年mm月dd日 hh时MM分ss秒');
		},
		sengMessage(e) {
			if (e.detail.errMsg == 'subscribeMessage:ok') {
				setMessage(['59KpVkKY7R_PeeLI3hmbYu1o4onihLOuS1euvWaIF8I']).then((res) => {});
			}
		}
	}
};
</script>

<style lang="scss">
.title {
	font-size: 32rpx;
}
.button {
	margin: 0;
	padding: 0;
}
.list {
	margin-top: 40rpx;
	padding: 20rpx;
	.texthead {
		color: #1c1c1e;
	}
	.time {
		color: #8e8e93;
		font-size: 18rpx;
	}
	.desc {
		font-size: 24rpx;
		font-weight: normal;
	}
}
</style>
