<template>
	<view class="container">
		<view class="date">{{date}}
		</view>
		<view class="main" :class="layout === 'se' ? 'self' : 'target'">
			<view class="avatar"><image class="img" :src="avatar" mode="aspectFit"></image></view>
			<view class="content">{{ content }}</view>
			<view class="space"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		avatar: String,
		content: String,
		layout: String,
		date:String
	}
};
</script>

<style scoped>
.container{
padding: 10rpx 20rpx;

}
.date{
color: gray;
/* background: #232323; */
text-align: center;
font-size: 26rpx;
border-radius: 26rpx;
width: 180rpx;
margin: 20rpx auto;

}
.main{
	display: flex;
	align-items: center;
}
.self .avatar{
	order: 1;
}
.self .space{
	order: -1;
}
.space{
	flex: 1;
}
.avatar {
	width: 80rpx;
	height: 80rpx;
	border: 2rpx solid #232323;
	overflow: hidden;
}
.avatar .img {
	width: 80rpx;
	height: 80rpx;
}
.content {
	padding: 18rpx;
	margin: 0 20rpx;
}
.self .content{
	border-radius: 26rpx 0rpx 26rpx 26rpx;
	background: #27AA4E;
}
.target .content{
	border-radius: 0 26rpx 26rpx 26rpx;
	background: #FF3B75;
}
</style>
