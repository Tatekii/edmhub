<template>
	<view class="container">
		<view class="tab">
			<view :class="tab === 'recommend' ? 'active' : ''" @tap="recommendTab">推荐</view>
		</view>
		<userList :type="tab" :listData="userList"></userList>
	</view>
</template>

<script>
import { mapState } from 'vuex';
const db = wx.cloud.database();
const _ = db.command

export default {
	data() {
		return {
			userList: [],
			tab: 'recommend',
			recommendList: [],
		};
	},
	computed: {
		...mapState(['hasLogin'])
	},
	methods: {
		jumpToMine(){
			uni.showModal({
				title: '提示',
				content: '请先登录',
				cancelText: '随便看看',
				confirmText: '前去登陆',
				success: function(res) {
					if (res.confirm) {
						uni.switchTab({
							url: '../mine/mine',
							fail(res) {
								console.log(res);
							}
						});
					} else if (res.cancel) {
						uni.switchTab({
							url: '../index/index',
							fail(res) {
								console.log(res);
							}
						});
					}
				}
			});
		},
		async recommendTab() {
			if (this.tab === 'recommend') {
				return;
			}
			await this.getAllList()
			this.tab = 'recommend';
			this.userList = this.recommendList;
			wx.setNavigationBarTitle({
				title: '认识新朋友'
			});
		},
		getAllList() {
			uni.showLoading({
				title: '加载中'
			});
			wx.cloud.callFunction({
				name:'getRecomend',
				data:{}
			}).then(res=>{
				this.recommendList = res.result.data
			}).catch(err=>{
				console.log(err)
			}).then(()=>{
				this.userList = this.recommendList
				uni.hideLoading();
			})
		}
	},
	onShow() {
		this.getAllList()
	},
	onLoad() {
		// this.getAllList()
	}
};
</script>

<style scoped>
.container {
	background: #161616;
	min-height: 100vh;
	color: #fff;
}
.tab {
	display: flex;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 44rpx;
	font-weight: bolder;
}

.tab view {
	flex: 1;
	text-align: center;
	border-bottom: 1rpx #232323 solid;
}

.tab .active {
	border-bottom: 6rpx #fc870a solid;
}
</style>
