<template>
	<view class="whiteContainer tab">
		<view class="table_head">
			<slot name="head"></slot>
		</view>
		<view class="tr table_th" :class="{ bg: type != 4 }" v-for="(item, index) in list" :key="index">
			<view @click="rowclick(item)" class="row1" v-if="type == 1">
				<view>
					<span style="width: 150rpx">{{ item.name + (item.tag ? item.tag : '') }}</span>
					<span class="status" :class="{ active: item.online }"></span>
				</view>
				<view>{{ item.deviceCode }}</view>
				<view>
					<span class="circle" :class="{ stop: item.running == 1, open: item.running == 2, fault: item.running == 3 }"></span>
				</view>
			</view>

			<view @click="rowclick(item)" class="row2" v-if="type == 2">
				<view>{{ item.name }}</view>
				<view>{{ item.phone }}</view>
				<view v-if="item.edit">
					<uv-input
						v-model="item.desc"
						border="surround"
						:customStyle="{
							marginBottom: '0 !important',
							borderRadius: '20rpx !important',
							paddingLeft: '0 !important',
							paddingRight: '0 !important',
							flex: '0.8'
						}"
					></uv-input>
					<uv-button
						text="确定"
						@click.stop="submit(item)"
						:customStyle="{ width: '80rpx !important', height: '60rpx !important', fontSize: '18rpx', color: '#636366' }"
					></uv-button>
					<uv-button
						text="取消"
						@click.stop="cancel(item)"
						:customStyle="{ width: '80rpx !important', height: '60rpx !important', fontSize: '18rpx', color: '#636366' }"
					></uv-button>
				</view>
				<view v-else>
					<view>
						{{ item.desc }}
					</view>
					<view @click.stop="edit(item)">
						<uv-icon name="edit-pen"></uv-icon>
					</view>
				</view>
			</view>

			<view class="row3" @click="rowclick(item)" v-if="type == 3">
				<view>
					{{ item.name + (item.tag || '') }}
				</view>
				<view>
					{{ permission == 3 ? item.deviceCode : item.activePower }}
				</view>
				<view class="consumer" v-if="permission == 3">
					{{ item.deviceConsumer }}
				</view>
				<view class="online" v-else>
					<span class="block" :class="{ active: item.online }"></span>
				</view>
			</view>

			<view
				class="row4"
				:class="{
					green: item.hasPermission && !item.click,
					add: item.click && !item.hasPermission
				}"
				@click="authClick(item)"
				v-if="type == 4"
			>
				<view>
					{{ item.name + (item.tag || '') }}
				</view>
				<view>
					{{ item.deviceCode }}
				</view>
			</view>
		</view>
		<uni-pagination v-if="type != 4" show-icon :current="current" pageSize="10" total="total" @change="change"></uni-pagination>
	</view>
</template>

<script>
import { getCache, setCache } from '@/util/index.js';
export default {
	name: 'table',
	data() {
		return {
			current: 1,
			obj: {}
		};
	},
	props: {
		type: {
			type: Number,
			default: 1
		},
		total: {
			type: Number,
			default: 10
		},
		list: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		permission() {
			return getCache('permission');
		}
	},
	methods: {
		change(e) {
			this.current = e.current;
			this.$emit('change', e.current);
		},
		rowclick(item) {
			if (this.type == 1) {
				uni.navigateTo({
					url: '/subpack/device/detail?deviceCode=' + item.deviceCode
				});
			} else if (this.type == 2) {
				uni.navigateTo({
					url: '/subpack/account/detail?name=' + item.name
				});
			} else {
				if (this.permission == 3) {
					uni.navigateTo({
						url: '/subpack/device/setting?deviceCode=' + item.deviceCode
					});
				}
			}
		},
		authClick(item) {
			item.click = !item.click;
			this.$emit('update:list', this.list);
		},
		submit(item) {
			if (!item.desc) return;
			this.obj = getCache('descObj') || {};
			this.obj[item.name] = item.desc;
			setCache('descObj', this.obj);
			item.edit = !item.edit;
			this.$emit('update:list', this.list);
		},
		cancel(item) {
			item.edit = !item.edit;
			this.$emit('update:list', this.list);
		},
		edit(item) {
			item.edit = !item.edit;
			this.$emit('update:list', this.list);
		}
	}
};
</script>

<style lang="scss">
.tab {
	padding: 20rpx;
	.table_head {
		margin-bottom: 30rpx;
	}
	.tr {
		padding: 20rpx 0;
		.row1 {
			display: flex;
			> view:nth-child(1) {
				display: flex;
				align-items: center;
				flex: 1;
				.status {
					margin-left: 20rpx;
					width: 20rpx;
					height: 10rpx;
					background-color: #dddddd;
				}
				.active {
					background-color: #bee400;
				}
			}
			> view:nth-child(2) {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			> view:nth-child(3) {
				width: 120rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.circle {
					display: block;
					margin: 0 auto;
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					background-color: #dddddd;
				}
				.stop {
					background-color: #ff4141;
				}
				.open {
					background-color: #83bd67;
				}
				.fault {
					background-color: #ff9000;
				}
			}
		}
		.row2 {
			display: flex;
			> view:nth-child(1) {
				flex: 1;
				display: flex;
				align-items: center;
			}
			> view:nth-child(2) {
				flex: 1;
				display: flex;
				align-items: center;
			}
			> view:nth-child(3) {
				width: 350rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}
		}
		.row3 {
			display: flex;
			align-items: center;
			> view:nth-child(1) {
				flex: 1;
			}
			> view:nth-child(2) {
				flex: 0.8;
			}
			.consumer {
				width: 200rpx;
				display: flex;
				justify-content: flex-end;
			}
			.online {
				width: 100rpx;
				.block {
					display: block;
					margin: 0 auto;
					width: 20rpx;
					height: 10rpx;
					background-color: #dddddd;
				}
				.active {
					background-color: #bee400;
				}
			}
		}
		.row4 {
			display: flex;
			align-items: center;
			> view:nth-child(1) {
				flex: 1;
			}
			> view:nth-child(2) {
				width: 350rpx;
				display: flex;
				justify-content: flex-end;
			}
		}
		.green {
			background-color: #ec7600;
			padding: 20rpx 0;
			border-radius: 20rpx;
		}
		.add {
			background-color: #bee400;
			padding: 20rpx 0;
			border-radius: 20rpx;
		}
	}
	.bg:nth-child(even) {
		background-color: #f8f8f8;
		border-radius: 20rpx;
	}
}
</style>
