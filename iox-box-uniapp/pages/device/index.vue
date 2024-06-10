<template>
	<view>
		<headerVue :showPay="showPay"></headerVue>
		<view class="f8container">
			<uv-input v-model="form.deviceName" placeholder="请输入设备名称" border="surround"></uv-input>
			<uv-row gutter="10" customStyle="margin: 40rpx 0">
				<uv-col span="6">
					<uni-data-select placeholder="运行状态" v-model="form.isRunning" :localdata="statusList"></uni-data-select>
				</uv-col>
				<uv-col span="3">
					<uv-button text="搜索" @click="search" :customStyle="{ backgroundColor: '#527FF4', color: '#FFFFFF' }"></uv-button>
				</uv-col>
				<uv-col span="3">
					<uv-button @click="reset" text="重置"></uv-button>
				</uv-col>
			</uv-row>
			<uv-skeletons :loading="loading" :skeleton="skeleton"></uv-skeletons>
			<tableVue v-if="!loading" @change="change" :list="list" :total="total" type="1">
				<template #head>
					<view class="head">
						<view>设备名称</view>
						<view>设备编号</view>
						<view>运行状态</view>
					</view>
				</template>
			</tableVue>
		</view>
		<tabBottom :index="0"></tabBottom>
	</view>
</template>

<script>
import { getDevicePage } from '@/api/device.js';
import headerVue from '@/components/header.vue';
import tabBottom from '@/components/tabbar.vue';
import tableVue from '@/components/table.vue';
export default {
	data() {
		return {
			list: [],
			total: 0,
			loading: true,
			showPay: true,
			skeleton: [
				{
					type: 'line',
					num: 3,
					gap: '20rpx'
				}
			],
			form: {
				deviceName: '',
				current: 1,
				size: 10,
				isRunning: null
			},
			interval: null,
			statusList: [
				{
					value: 1,
					text: '停止'
				},
				{
					value: 2,
					text: '启动'
				},
				{
					value: 3,
					text: '故障'
				}
			]
		};
	},
	components: {
		headerVue,
		tabBottom,
		tableVue
	},
	onShow() {
		this.interval = setInterval(() => {
			this.getDevicePage();
		}, 3000);
	},
	onUnload() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	},
	methods: {
		getDevicePage() {
			getDevicePage(this.form)
				.then((res) => {
					if (res.resultCode === 200) {
						this.list = res.data.result;
						this.total = res.data.total;
					} else {
						uni.showToast({
							icon: 'error',
							title: '请求失败'
						});
						this.list = [];
						this.total = 0;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		search() {
			this.getDevicePage();
		},
		reset() {
			this.form = {
				deviceName: '',
				current: 1,
				size: 10,
				isRunning: null
			};
			this.getDevicePage();
		},
		change(e) {
			this.form.current = e;
			this.getDevicePage();
		}
	}
};
</script>

<style lang="scss">
.uvicon-arrow-left {
	display: none !important;
}
</style>
