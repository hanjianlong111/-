<template>
	<view>
		<headerVue @leftClick="leftClick"></headerVue>
		<view class="f8container">
			<view class="text">详情操作控制</view>
			<view class="whiteContainer">
				<view class="table_head">
					<view>展现名称</view>
					<view>是否展现</view>
				</view>
				<view class="table_th" v-for="(item, index) in optionsList" :key="index">
					<view>第{{ item.point }}对按钮</view>
					<view>
						<uv-switch v-model="item.status" :activeValue="true" :inactiveValue="false" activeColor="#527FF4" inactiveColor="#E4E4E4"></uv-switch>
					</view>
				</view>
			</view>
			<button class="btn" @click="optionSubmit" :loading="optionLoading">确定</button>

			<view class="text">详情展示控制</view>
			<view class="whiteContainer">
				<view class="table_head">
					<view>展现名称</view>
					<view>是否展现</view>
				</view>
				<view class="table_th" v-for="(item, index) in echartList" :key="index">
					<view>{{ item.name }}</view>
					<view>
						<uv-switch v-model="item.status" :activeValue="true" :inactiveValue="false" activeColor="#527FF4" inactiveColor="#E4E4E4"></uv-switch>
					</view>
				</view>
			</view>
			<button class="btn" @click="echartSubmit" :loading="echartLoading">确定</button>

			<view class="text">详情字段控制</view>
			<view class="whiteContainer">
				<view class="text_head">
					<view>展现名称</view>
					<view>单位</view>
					<view>是否展现</view>
				</view>
				<view class="textTr" v-for="(item, index) in textList" :key="index">
					<view>
						<uv-input
							v-model="item.field"
							border="surround"
							:customStyle="{
								width: '230rpx !important',
								marginBottom: '0 !important',
								borderRadius: '20rpx !important',
								paddingLeft: '0 !important',
								paddingRight: '0 !important'
							}"
						></uv-input>
					</view>
					<view>
						<uv-input
							v-model="item.unit"
							border="surround"
							:customStyle="{
								width: '230rpx !important',
								marginBottom: '0 !important',
								borderRadius: '20rpx !important',
								paddingLeft: '0 !important',
								paddingRight: '0 !important'
							}"
						></uv-input>
					</view>
					<view>
						<uv-switch v-model="item.status" :activeValue="true" :inactiveValue="false" activeColor="#527FF4" inactiveColor="#E4E4E4"></uv-switch>
					</view>
				</view>
			</view>
			<button class="btn" @click="textSubmit" :loading="textLoading">确定</button>
		</view>
	</view>
</template>

<script>
import headerVue from '@/components/header.vue';
import { getDeviceButtons, getDeviceEchart, getCustomFields, setDevicesButtons, setDeviceFields, setCustomFields } from '@/api/device.js';
export default {
	data() {
		return {
			optionLoading: false,
			echartLoading: false,
			textLoading: false,
			deviceCode: '',
			optionsList: [
				{
					point: '',
					status: false
				},
				{
					point: '',
					status: false
				},
				{
					point: '',
					status: false
				},
				{
					point: '',
					status: false
				},
				{
					point: '',
					status: false
				},
				{
					point: '',
					status: false
				}
			],
			echartList: [
				{
					name: 'A相电压(V)',
					enname: 'PhaseAVoltage',
					status: false
				},
				{
					name: 'B相电压(V)',
					enname: 'PhaseBVoltage',
					status: false
				},
				{
					name: 'C相电压(V)',
					enname: 'PhaseCVoltage',
					status: false
				},
				{
					name: 'A相电流(A)',
					enname: 'PhaseACurrent',
					status: false
				},
				{
					name: 'B相电流(A)',
					enname: 'PhaseBCurrent',
					status: false
				},
				{
					name: 'C相电流(A)',
					enname: 'PhaseCVoltage',
					status: false
				},
				{
					name: '总有功功率(KW)',
					enname: 'ActivePower',
					status: false
				},
				{
					name: 'A相有功功率(W)',
					enname: 'PhaseAActivePower',
					status: false
				},
				{
					name: 'B相有功功率(W)',
					enname: 'PhaseBActivePower',
					status: false
				},
				{
					name: 'C相有功功率(W)',
					enname: 'PhaseCActivePower',
					status: false
				},
				{
					name: '总无功功率(KVar)',
					enname: 'ReactivePower',
					status: false
				},
				{
					name: 'A相无功功率(Var)',
					enname: 'PhaseAReactivePower',
					status: false
				},
				{
					name: 'B相无功功率(Var)',
					enname: 'PhaseBReactivePower',
					status: false
				},
				{
					name: 'C相无功功率(Var)',
					enname: 'PhaseCReactivePower',
					status: false
				},
				{
					name: '总功率因数',
					enname: 'Factor',
					status: false
				},
				{
					name: 'A相功率因数',
					enname: 'PhaseAPowerFactor',
					status: false
				},
				{
					name: 'B相功率因数',
					enname: 'PhaseBPowerFactor',
					status: false
				},
				{
					name: 'C相功率因数',
					enname: 'PhaseCPowerFactor',
					status: false
				},
				{
					name: 'A相电压频率(Hz)',
					enname: 'PhaseAFrequency',
					status: false
				},
				{
					name: 'B相电压频率(Hz)',
					enname: 'PhaseBFrequency',
					status: false
				},
				{
					name: 'C相电压频率(Hz)',
					enname: 'PhaseCFrequency',
					status: false
				},
				{
					name: '当前总有功电能(Kwh)',
					enname: 'energy',
					status: false
				}
			],
			textList: [
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				},
				{
					field: '',
					unit: '',
					status: false
				}
			]
		};
	},
	onLoad(options) {
		if (options.deviceCode) {
			let deviceCode = options.deviceCode;
			this.deviceCode = options.deviceCode;
			getDeviceButtons({ deviceCode }).then((res) => {
				if (res.resultCode === 200) {
					this.optionsList = res.data.map((item) => {
						return {
							...item,
							point: item.point,
							status: item.status
						};
					});
				}
			});
			getDeviceEchart({ deviceCode }).then((res) => {
				if (res.resultCode === 200) {
					this.echartList.forEach((item, index) => {
						item.status = res.data.includes(item.enname);
					});
				}
			});
			getCustomFields({ deviceCode }).then((res) => {});
		}
	},
	components: {
		headerVue
	},
	methods: {
		leftClick() {
			uni.navigateBack();
		},
		optionSubmit() {
			this.optionLoading = true;
			setDevicesButtons(this.optionsList)
				.then((res) => {
					if (res.resultCode !== 200) {
						uni.showToast({
							icon: 'error',
							title: '操作失败'
						});
					}
				})
				.finally(() => {
					this.optionLoading = false;
				});
		},
		echartSubmit() {
			this.echartLoading = true;
			let list;
			list = this.echartList
				.map((item) => {
					if (item.status) {
						return item.enname;
					}
				})
				.filter((ite) => ite);
			setDeviceFields(list, this.deviceCode)
				.then((res) => {
					if (res.resultCode !== 200) {
						uni.showToast({
							icon: 'error',
							title: '操作失败'
						});
					}
				})
				.finally(() => {
					this.echartLoading = false;
				});
		},
		textSubmit() {
			this.textLoading = true;
			setCustomFields()
				.then((res) => {})
				.finally(() => {
					this.textLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
.text {
	margin-bottom: 30rpx;
}
.whiteContainer {
	padding: 20rpx;
	.table_head {
		display: flex;
		justify-content: space-around;
		margin-bottom: 30rpx;
	}
	.text_head {
		color: #666666;
		font-size: 28rpx;
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}
	.table_th {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		> view:nth-child(1) {
			flex: 1;
			text-align: center;
		}
		> view:nth-child(2) {
			width: 320rpx;
			display: flex;
			justify-content: center;
		}
	}
	.textTr {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		> view:nth-child(1) {
			flex: 1;
		}
		> view:nth-child(2) {
			flex: 1;
		}
		> view:nth-child(3) {
			width: 100rpx;
			display: flex;
			justify-content: center;
		}
	}
	.textTr:last-child {
		margin-bottom: 0;
	}
	.table_th:last-child {
		margin-bottom: 0;
	}
}
.btn {
	margin: 30rpx 0;
}
</style>
