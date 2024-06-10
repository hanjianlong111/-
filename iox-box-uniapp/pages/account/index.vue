<template>
	<view>
		<headerVue :showNotice="showNotice" :showAccount="showAccount"></headerVue>
		<view class="f8container">
			<uv-input v-model="form.name" placeholder="请输入账号名称" border="surround"></uv-input>
			<uv-input v-model="form.phone" placeholder="请输入手机号" border="surround"></uv-input>
			<view class="btncontainer">
				<uv-button text="搜索" @click="search" :customStyle="{ backgroundColor: '#527FF4', color: '#FFFFFF' }"></uv-button>
				<uv-button @click="reset" text="重置" :customStyle="{ left: '20%' }"></uv-button>
			</view>
			<uv-skeletons :loading="loading" :skeleton="skeleton"></uv-skeletons>
			<tableVue v-if="!loading" @change="change" :list.sync="list" :total="total" type="2">
				<template #head>
					<view class="head accont_head">
						<view>账号</view>
						<view>手机号</view>
						<view>备注</view>
					</view>
				</template>
			</tableVue>
		</view>
		<tabBottom :index="2"></tabBottom>
	</view>
</template>

<script>
import { getCache } from '@/util/index.js';
import { getAccountPage } from '@/api/account.js';
import headerVue from '@/components/header.vue';
import tableVue from '@/components/table.vue';
import tabBottom from '@/components/tabbar.vue';
export default {
	data() {
		return {
			showNotice: false,
			showAccount: true,
			loading: true,
			list: [],
			total: 0,
			form: {
				current: 1,
				name: '',
				phone: '',
				size: 10
			}
		};
	},
	components: {
		headerVue,
		tableVue,
		tabBottom
	},
	onShow() {
		this.getAccountPage();
	},
	methods: {
		getAccountPage() {
			getAccountPage(this.form)
				.then((res) => {
					if (res.resultCode === 200) {
						this.list = res.data[0];
						this.list = this.list.map((item) => {
							return {
								...item,
								desc: getCache('descObj')[item.name] || ''
							};
						});
						this.total = res.data[1].total;
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
			this.getAccountPage();
		},
		reset() {
			this.form = {
				current: 1,
				name: '',
				phone: '',
				size: 10
			};
			this.getAccountPage();
		},
		change(e) {
			this.form.current = e;
			this.getAccountPage();
		}
	}
};
</script>

<style lang="scss">
.uvicon-arrow-left {
	display: none !important;
}
.uv-input {
	margin-bottom: 40rpx;
}
.btncontainer {
	display: flex;
	margin-bottom: 40rpx;
}
.accont_head {
	padding: 0 !important;
	> view:nth-child(1) {
		flex: 1;
	}
	> view:nth-child(2) {
		flex: 1;
	}
	> view:nth-child(3) {
		text-align: center;
		width: 350rpx;
	}
}
</style>
