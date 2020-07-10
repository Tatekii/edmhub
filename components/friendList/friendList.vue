<template>
	<view class="container">
		<view class="list">
			<view v-for="item of list" :key="item">
				<view class="reqItem" :data-openid="item._openid" @tap="intoDetail">
					<view class="avatar"><image class="img" :src="item.avatarUrl" mode="aspectFit"></image></view>
					<view class="name">
						<span>{{ item.nickName }}</span>
					</view>
					<view class="lastLogin">{{ $tools.comparDate(item.lastLogin) }}前在线</view>
					<view class="button">
						<span class="intoHome btn">去🏠康康</span>
						<span class="sendMsg btn" @tap.stop="sendMsg(item._openid)">发消息</span>
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
	props: { list: Array},
	methods: {
		sendMsg(openid) {
			this.$emit('intoChatRoom',{openid})
		},
		intoDetail(e) {
			const openid = e.currentTarget.dataset.openid;
			uni.navigateTo({
				url: '../../pages/others/others?openid=' + e.currentTarget.dataset.openid + '&from=friendList',
				fail(err) {
					uni.showToast({
						title: '出错了'
					});
					console.log(err);
				}
			});
		}
	}
};
</script>

<style scoped>
.container {
	color: #ffffff;
}

.reqItem {
	display: flow-root;
	padding: 10rpx;
	border: 4rpx solid #000000;
	border-radius: 20rpx;
		background: #ed3b83;
		margin-bottom: 8rpx;
}
.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 20rpx;
	overflow: hidden;
	float: left;
	margin: 0 10rpx;
}
.avatar .img {
	width: 120rpx;
	height: 120rpx;
}
.name {
	font-size: 48rpx;
	font-weight: bolder;
	margin-left: 9px;
	padding-left: 150rpx;
	color: #161616;
}
.lastLogin {
	float: right;
	margin-top: -64rpx;
	color: #000000;
}
.button {
	float: right;
}
.button .btn {
	border-radius: 20rpx;
	padding: 6rpx;
	color: #161616;
}
.button .intoHome {
	background: #98ED;

	margin-right: 12rpx;
}
.button .sendMsg {
	background: #98ED00;
}
</style>
