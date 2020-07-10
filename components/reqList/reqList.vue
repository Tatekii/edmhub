<template>
	<view class="container">
		<view class="list">
			<view v-for="item in list" :key="item._openid">
				<view class="reqItem" :data-openid="item._openid" @tap="intoDetail">
					<view class="word">{{ item.word }}</view>
					<view class="button">
						
						<text class="reqCount">{{ $tools.comparDate(item.date) }}前</text>
						<text class="fakeInto">去🏠康康</text>
						<text class="refuceItem" @tap.stop="refuseReq(item._openid)">直接拒绝</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		list: {}
	},
	methods: {
		intoDetail(e) {
			const openid = e.currentTarget.dataset.openid;
			uni.navigateTo({
				url: '../../pages/others/others?openid=' + e.currentTarget.dataset.openid + '&from=friendReq',
				fail(err) {
					uni.showToast({
						title: '出错了'
					});
					console.log(err);
				}
			});
		},
		refuseReq(e) {
			console.log('拒绝' + e);
			wx.cloud
				.callFunction({
					name: 'refuseReq',
					data: {
						openid: e
					}
				})
				.then(res => {
					console.log(res);
				}).catch(err=>{
					console.log(err)
				})
		}
	}
};
</script>

<style scoped>
.container {
	color: #ffffff;
	padding: 10rpx;
	border: 4rpx solid #000000;
	border-radius: 20rpx;
	background: #2c405a;
}
.list .reqItem {
	margin: 4rpx;
}

.list .reqItem .word {
	border: 4rpx solid black;
	border-radius: 40rpx;
	background: #232323;
	padding: 10rpx;
}
.list .reqItem .button {
	text-align:right;
	color: #000000;
	margin:10rpx 0
}
.list .reqItem .button .reqCount {
	background-color: #009d91;
	border-radius: 40rpx;
	padding: 4rpx 10rpx;
}
.list .reqItem .button .refuceItem {
	margin-left: 4rpx;
	background-color: #dd524d;
	border-radius: 40rpx;
	padding: 4rpx 10rpx;
}
.list .reqItem .button .fakeInto {
	margin-left: 4rpx;
	padding: 4rpx 10rpx;
	background-color: #ffa700;
	border-radius: 40rpx;
}
</style>
