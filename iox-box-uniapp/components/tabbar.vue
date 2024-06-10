<template>
	<view>
		<uv-tabbar :value="value" :fixed="true" @change="change" activeColor="#505EDC" inactiveColor="#A0A3BD">
			<uv-tabbar-item text="设备管理">
				<template v-slot:active-icon>
					<image class="icon" src="@/static/Home (1).png"></image>
				</template>
				<template v-slot:inactive-icon>
					<image class="icon" src="@/static/Home.png"></image>
				</template>
			</uv-tabbar-item>
			<uv-tabbar-item>
				<template v-slot:active-icon>
					<image class="add" src="@/static/Group 2875.png"></image>
				</template>
				<template v-slot:inactive-icon>
					<image class="add" src="@/static/Group 2875.png"></image>
				</template>
			</uv-tabbar-item>
			<uv-tabbar-item text="账号管理">
				<template v-slot:active-icon>
					<image class="icon" src="@/static/Vector (1).png"></image>
				</template>
				<template v-slot:inactive-icon>
					<image class="icon" src="@/static/Vector.png"></image>
				</template>
			</uv-tabbar-item>
		</uv-tabbar>
	</view>
</template>

<script>
import { getCache } from '@/util/index.js';
export default {
	data() {
		return {};
	},
	props: {
		index: {
			type: Number,
			default: 0
		}
	},
	computed: {
		value() {
			return this.index;
		}
	},
	methods: {
		change(index) {
			if (index == 0) {
				uni.redirectTo({
					url: '/pages/device/index'
				});
			} else if (index == 1) {
				uni.redirectTo({
					url: '/pages/scan/index'
				});
			} else {
				getCache('permission') == 1
					? uni.redirectTo({
							url: '/pages/account/account'
					  })
					: uni.redirectTo({
							url: '/pages/account/index'
					  });
			}
		}
	}
};
</script>

<style lang="scss">
.icon {
	width: 34rpx;
	height: 36rpx;
}
.add {
	width: 68rpx;
	height: 68rpx;
}
</style>
