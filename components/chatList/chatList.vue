<template>
	<view>
		<view v-for="item of chats" :key="item.chatid">
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @tap="remove">
					<view class="container" @tap.stop="intoChatRoom(item.chatid)">
						<view :class="item.isRead === false ? 'badge' : ''"></view>
						<view class="avatar"><image :src="item.avatarUrl" mode="aspectFit" class="img"></image></view>
						<view class="nickName">{{ item.nickName }}</view>
							<view class="lastWords">{{ getLastWords(item.last) }}</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			options: [
				{
					text: '删除聊天',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	props: {
		chats: Array
	},
	computed: {},
	methods: {
		remove(e) {
			console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text);
		},

		intoChatRoom(chatid) {
			this.$emit('intoChatRoom', { chatid });
		},
		getLastWords(data) {
			if(!data){
				return '无新消息'
			}
			return '[' + this.$tools.comparDate(data.date) + '前]' + data.content;
			//格式化
		}
	}
};
</script>

<style scoped>
.container {
	padding: 10rpx;
	border: 4rpx solid black;
	border-radius: 30rpx;
	width: 730rpx;
	background: #009d91;
	position: relative;
}
.badge {
	width: 24rpx;
	height: 24rpx;
	background: red;
	border-radius: 50%;
	position: absolute;
	top: 10rpx;
	float: left;
	left: ;
	top: 0rpx;
	left: 98rpx;
}
.avatar {
	height: 100rpx;
	width: 100rpx;
	border-radius: 20rpx;
	overflow: hidden;
	float: left;
	margin-right: 20rpx;
}
.avatar .img {
	height: 100rpx;
	width: 100rpx;
}
.nickName {
	font-size: 38rpx;
	font-weight: bold;
	color: #232323;
}
.lastWords {
	font-size: 30rpx;
	color: #232323;
	padding: 2rpx 0;
}
</style>
