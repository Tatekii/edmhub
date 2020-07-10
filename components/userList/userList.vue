<template>
	<view class="list">
		<view v-for="item in listData" :key="item._id">
			<view :class="item.gender === 1 ? 'boy' : 'girl'" class="list-item" @tap="intoDetail" :data-openid="item._openid">
				<view class="avatar"><image :src="item.avatarUrl" mode="aspectFill"></image></view>
				<view class="about">
					<view>{{ item.nickName }}</view>
					<view>{{ item.gender === 1 ? '♂' : '♀' }}</view>
					<block v-if="item.tags">
						<view v-if="item.tags" v-for="i in item.tags" :key="i">{{ i }}</view>
					</block>
					<block v-if="item.footMark">
						<view v-for="i in item.footMark" :key="i">{{ i }}</view>
					</block>
				</view>
				<view v-if="type==='recommend'" class="like">
					<uni-icons type="heart-filled" size="50" color="hotpink"></uni-icons>
					<view>{{ $tools.formatLikes(item.like) }}</view>
				</view>
				<view v-if="type==='friend'" class="sendMsg" @tap.stop="sendMsg" :data-openid="item._openid">
					<uni-icons type="email-filled" size="50" color="skyblue"></uni-icons>
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
		listData: Array,
		type: String
	},
	methods: {
		intoDetail(e) {
			console.log(`进入${e.currentTarget.dataset.openid},${this.type},666`);
			uni.navigateTo({
				url:'../../pages/others/others?openid='+e.currentTarget.dataset.openid+'&from=find',
				fail(err) {
					console.log(err)
				}
			})
		},
		sendMsg(e){
			console.log(`准备给${e.currentTarget.dataset.openid}发送消息`)
		}
	}
};
</script>

<style scoped>
.list {
	display: flex;
	flex-direction: column;
	margin: 0 20rpx;
}

.list-item {
	background: #232323;
	margin-top: 16rpx;
	height: 176rpx;
	border: 8rpx solid #000;
	border-radius: 30rpx;
	display: flex;
	padding: 4rpx;
}

.list-item .avatar {
	height: 160rpx;
	flex: 0 0 160rpx;
	margin-right: 8rpx;
	border: 8rpx solid;
	border-radius: 8rpx;
}

.list-item.boy .avatar {
	border-image: linear-gradient(#5914b4, #26b3eb) 30 30;
}

.list-item.girl .avatar {
	border-image: linear-gradient(#ff00e1, #680616) 30 30;
}

.list-item .avatar image {
	width: 160rpx;
	height: 160rpx;
}

.list-item .about {
	flex: 1;
	align-content: space-around;
	justify-content: left;
	flex-wrap: wrap;
	color: gray;
	display: flex;
	overflow: hidden;
}

.list-item .about view {
	margin: 4rpx;
	padding: 4rpx;
	border: 1rpx solid #000;
	border-radius: 10rpx;
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; 
	max-width:200rpx;
}

.list-item .like {
	
	padding-top: 14rpx;
	text-align: center;
	font-size: 30rpx;
	color: pink;
}
.list-item .sendMsg{
	flex: 0 0 160rpx;
	line-height: 176rpx;
	text-align: center;
}

</style>
