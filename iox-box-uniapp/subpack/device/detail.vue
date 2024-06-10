<template>
	<view>
		<headerVue @leftClick="leftClick"></headerVue>
		<view class="f8container">
			<view class="whiteContainer">
				<view class="head">
					<view class="text">{{ deviceInfo.deviceName }}{{ deviceInfo.tag }}</view>
					<view class="button" @click="forceOption">强制启停</view>
				</view>
				<view class="table_head">当前状态</view>
				<view class="container">
					<view class="statusItem" :class="deviceInfo.status == item.status ? bgcolor[deviceInfo.status] : ''" v-for="(item, index) in list" :key="index">
						<view class="img">
							<image :src="item.imgPath[deviceInfo.status]" mode=""></image>
						</view>
						<view>{{ item.name }}</view>
					</view>
				</view>
			</view>
			<view class="head mt">
				<view class="text">{{ deviceInfo.deviceName }}{{ deviceInfo.tag }}</view>
				<view class="img" @click="edit">
					<image src="@/static/Group 2925.png" mode=""></image>
				</view>
			</view>
			<view class="desc">设备编号：{{ deviceInfo.deviceCode }}</view>
			<view class="echartContainer">
				<view class="echartItem" v-for="(item, index) in echartList" :key="index">
					<view class="top">
						<view class="left">
							{{ item.type }}
						</view>
						<view class="right">
							<view class="num">
								{{ item.num }}
							</view>
							<view class="unit">
								{{ item.unit }}
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="circle">
							{{ index + 1 }}
						</view>
						<view class="name">
							{{ item.name }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 修改设备名称 -->
		<uni-popup ref="edit" type="dialog">
			<uni-popup-dialog borderRadius="20rpx" confirmText="确定" cancelText="取消" @confirm="confirmEdit">
				<uv-input v-model="value" placeholder="请输入设备名称" border="surround"></uv-input>
			</uni-popup-dialog>
		</uni-popup>
		<!-- 强制启停 -->
		<uv-popup ref="popup" @maskClick="maskClick" :safeAreaInsetBottom="false" mode="center">
			<view class="btnStatus" :class="{ active: currentIndex == index }" @click="btnClick(item, index)" v-for="(item, index) in btnsList" :key="index">{{ item.name }}</view>
		</uv-popup>
		<!-- 启停操作 -->
		<uni-popup ref="optionPopup" type="dialog">
			<uni-popup-dialog borderRadius="20rpx" confirmText="确定" cancelText="取消" :content="content" @close="closeOption" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import { getDeviceData, getDeviceButtons, deviceButtonOperation, updateName } from '@/api/device.js';
import headerVue from '@/components/header.vue';
export default {
	data() {
		return {
			deviceInfo: {
				deviceName: '',
				tag: '',
				deviceCode: '',
				status: 4
			},
			bgcolor: {
				1: 'stop',
				2: 'open',
				3: 'fault'
			},
			list: [
				{
					name: '停止',
					status: 1,
					imgPath: {
						1: '../../static/stop_active.png',
						2: '../../static/stop.png',
						3: '../../static/stop.png',
						4: '../../static/stop.png'
					}
				},
				{
					name: '启动',
					status: 2,
					imgPath: {
						1: '../../static/open.png',
						2: '../../static/open_active.png',
						3: '../../static/open.png',
						4: '../../static/open.png'
					}
				},
				{
					name: '故障',
					status: 3,
					imgPath: {
						1: '../../static/fault.png',
						2: '../../static/fault.png',
						3: '../../static/fault_active.png',
						4: '../../static/fault.png'
					}
				}
			],
			currentIndex: null,
			content: '',
			obj: {},
			value: '',
			btnsList: [
				{
					name: '启动1',
					deviceOutput: '',
					status: null,
					num: 1
				},
				{
					name: '停止1',
					deviceOutput: '',
					status: null,
					num: 0
				},
				{
					name: '启动2',
					deviceOutput: '',
					status: null,
					num: 1
				},
				{
					name: '停止2',
					deviceOutput: '',
					status: null,
					num: 0
				},
				{
					name: '启动3',
					deviceOutput: '',
					status: null,
					num: 1
				},
				{
					name: '停止3',
					deviceOutput: '',
					status: null,
					num: 0
				},
				{
					name: '启动4',
					deviceOutput: '',
					status: null,
					num: 1
				},
				{
					name: '停止4',
					deviceOutput: '',
					status: null,
					num: 0
				},
				{
					name: '启动5',
					deviceOutput: '',
					status: null,
					num: 1
				},
				{
					name: '停止5',
					deviceOutput: '',
					status: null,
					num: 0
				},
				{
					name: '接通',
					deviceOutput: '',
					status: null,
					num: 1
				},
				{
					name: '断开',
					deviceOutput: '',
					status: null,
					num: 0
				}
			],
			interval: null,
			echartList: [
				{
					name: 'A相电压',
					type: 'ua',
					unit: 'V',
					num: null,
					enname: 'PhaseAVoltage'
				},
				{
					name: 'B相电压',
					type: 'ub',
					unit: 'V',
					num: null,
					enname: 'PhaseBVoltage'
				},
				{
					name: 'C相电压',
					type: 'uc',
					unit: 'V',
					num: null,
					enname: 'PhaseCVoltage'
				},
				{
					name: 'A相电流',
					type: 'ia',
					unit: 'A',
					num: null,
					enname: 'PhaseACurrent'
				},
				{
					name: 'B相电流',
					type: 'ib',
					unit: 'A',
					num: null,
					enname: 'PhaseBCurrent'
				},
				{
					name: 'C相电流',
					type: 'ic',
					unit: 'A',
					num: null,
					enname: 'PhaseCVoltage'
				},
				{
					name: '总有功功率',
					type: '',
					unit: 'KW',
					num: null,
					enname: 'ActivePower'
				},
				{
					name: 'A相有功功率',
					type: 'pa',
					unit: 'W',
					num: null,
					enname: 'PhaseAActivePower'
				},
				{
					name: 'B相有功功率',
					type: 'pb',
					unit: 'W',
					num: null,
					enname: 'PhaseBActivePower'
				},
				{
					name: 'C相有功功率',
					type: 'pc',
					unit: 'W',
					num: null,
					enname: 'PhaseCActivePower'
				},
				{
					name: '总无功功率',
					type: '',
					unit: 'KVar',
					num: null,
					enname: 'ReactivePower'
				},
				{
					name: 'A相无功功率',
					type: 'qa',
					unit: 'Var',
					num: null,
					enname: 'PhaseAReactivePower'
				},
				{
					name: 'B相无功功率',
					type: 'qb',
					unit: 'Var',
					num: null,
					enname: 'PhaseBReactivePower'
				},
				{
					name: 'C相无功功率',
					type: 'qc',
					unit: 'Var',
					num: null,
					enname: 'PhaseCReactivePower'
				},
				{
					name: '总功率因数',
					type: '',
					unit: '',
					num: null,
					enname: 'Factor'
				},
				{
					name: 'A相功率因数',
					type: 'pfa',
					unit: '',
					num: null,
					enname: 'PhaseAPowerFactor'
				},
				{
					name: 'B相功率因数',
					type: 'pfb',
					unit: '',
					num: null,
					enname: 'PhaseBPowerFactor'
				},
				{
					name: 'C相功率因数',
					type: 'pfc',
					unit: '',
					num: null,
					enname: 'PhaseCPowerFactor'
				},
				{
					name: 'A相电压频率',
					type: 'fa',
					unit: 'Hz',
					num: null,
					enname: 'PhaseAFrequency'
				},
				{
					name: 'B相电压频率',
					type: 'fb',
					unit: 'Hz',
					num: null,
					enname: 'PhaseBFrequency'
				},
				{
					name: 'C相电压频率',
					type: 'fc',
					unit: 'Hz',
					num: null,
					enname: 'PhaseCFrequency'
				},
				{
					name: '当前总有功电能',
					type: '',
					unit: 'Kwh',
					num: null,
					enname: 'energy'
				}
			]
		};
	},
	components: {
		headerVue
	},
	onLoad(options) {
		if (options.deviceCode) {
			let deviceCode = decodeURIComponent(options.deviceCode);
			this.getDeviceData(deviceCode);
			getDeviceButtons({ deviceCode }).then((res) => {
				if (res.resultCode === 200) {
					this.btnsList.forEach((item, index) => {
						item.deviceOutput = res.data[Math.floor(index / 2)].deviceOutput;
						item.status = res.data[Math.floor(index / 2)].status;
					});
					this.btnsList = this.btnsList.filter((item) => item.status);
				}
			});
		}
	},
	onShow() {
		this.interval = setInterval(() => {
			this.getDeviceData(this.deviceInfo.deviceCode);
		}, 3000);
	},
	onUnload() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	},
	methods: {
		getDeviceData(deviceCode) {
			getDeviceData({ deviceCode }).then((res) => {
				if (res.resultCode === 200) {
					this.deviceInfo.deviceName = res.data.deviceName;
					this.deviceInfo.tag = res.data.tag ? res.data.tag : '';
					this.deviceInfo.deviceCode = res.data.deviceCode;
					this.deviceInfo.status = res.data.status ? res.data.status : 4;
					this.echartList.forEach((item, index) => {
						item.num = res.data[item.enname];
						if (item.name == '总有功功率' || item.name == '总无功功率') {
							item.num = item.num / 1000;
						}
					});
				} else {
					uni.showToast({
						title: '设备不在线',
						icon: 'error'
					});
					if (this.interval) {
						clearInterval(this.interval);
						this.interval = null;
					}
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				}
			});
		},
		leftClick() {
			uni.navigateBack();
		},
		forceOption() {
			this.$refs.popup.open();
		},
		btnClick(item, index) {
			this.currentIndex = index;
			this.$refs.popup.close();
			this.$refs.optionPopup.open();
			this.obj = item;
			if (item.name.includes('启动')) {
				this.content = item.num == 1 ? '是否启动该设备' : '是否停止该设备';
			} else {
				this.content = item.num == 1 ? '是否接通该设备' : '是否断开该设备';
			}
		},
		closeOption() {
			this.currentIndex = null;
		},
		edit() {
			this.value = this.deviceInfo.deviceName;
			this.$refs.edit.open();
		},
		confirmEdit() {
			if (this.value == this.deviceInfo.deviceName) {
				uni.showToast({
					icon: 'error',
					title: '名称重复'
				});
				return;
			} else {
				updateName({
					deviceCode: this.deviceInfo.deviceCode,
					deviceName: this.value
				}).then((res) => {
					if (res.resultCode === 200) {
						uni.showToast({
							title: '修改成功'
						});
					}
				});
			}
		},
		confirm() {
			deviceButtonOperation({
				deviceCode: this.deviceInfo.deviceCode,
				deviceOutput: this.obj.deviceOutput,
				status: this.obj.num
			})
				.then((res) => {
					if (res.resultCode === 200) {
						uni.showToast({
							title: '操作成功'
						});
					} else {
						uni.showToast({
							icon: 'error',
							title: '操作失败'
						});
					}
				})
				.finally(() => {
					this.currentIndex = null;
				});
		},
		maskClick() {
			this.currentIndex = null;
		}
	}
};
</script>

<style lang="scss">
.whiteContainer {
	border-radius: 20rpx;
	padding: 20rpx;
	.table_head {
		margin: 20rpx 0;
	}
	.container {
		background-color: #f8f8f8;
		border-radius: 60rpx;
		justify-content: space-between;
		display: flex;
		.statusItem {
			width: 190rpx;
			height: 83rpx;
			border-radius: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #636366;
			font-size: 28rpx;
			.img {
				width: 33rpx;
				height: 33rpx;
				margin-right: 10rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.stop {
			background-color: #ff4141;
			color: #ffffff;
		}
		.open {
			background-color: #83bd67;
			color: #ffffff;
		}
		.fault {
			background-color: #ff9000;
			color: #ffffff;
		}
	}
}
.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.text {
		width: 347rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
	}
	.button {
		background-color: #f7faff;
		color: #527ff4;
		font-size: 22rpx;
	}
	.img {
		width: 68rpx;
		height: 68rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
.mt {
	margin-top: 40rpx;
}
.desc {
	color: #636366;
	font-size: 24rpx;
	margin-bottom: 40rpx;
}
.echartContainer {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.echartItem {
		width: 320rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		.top {
			padding: 0 10rpx;
			font-size: 60rpx;
			flex: 1;
			background-color: #ddd;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-shrink: 0;
			.left {
				font-family: myfont;
			}
			.right {
				display: flex;
				.num {
					font-family: myfont;
				}
				.unit {
					font-size: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
				}
			}
		}
		.bottom {
			margin: 20rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			border-radius: 20rpx;
			font-size: 30rpx;
			background-color: #ff9000;
			color: #ffffff;
			.circle {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				border: 1px solid #ffffff;
				text-align: center;
				margin-right: 10rpx;
			}
		}
	}
}
.uv-popup .uv-popup__content {
	width: 80%;
	padding: 20rpx;
	border-radius: 20rpx;
	display: flex !important;
	justify-content: space-between;
	flex-wrap: wrap;
	.btnStatus {
		width: 190rpx;
		height: 83rpx;
		border-radius: 60rpx;
		color: #636366;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.active {
		background-color: #ff4141;
		color: #ffffff;
	}
}
</style>
