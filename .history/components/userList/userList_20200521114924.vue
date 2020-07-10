<template>
	<view class="list">
		<view v-for="item in listData" :key="item._id">
			<view :class="item.gender === 1 ? 'boy' : 'girl'" class="list-item" @tap="intoDetail" :data-openid="item._openid">
				<view class="avatar"><image :src="item.avatarUrl"></image></view>
				<view class="about">
					
					<view>{{item.nickName}}</view>
					<view>{{item.gender===1?'♂':'♀'}}</view>
					<view v-if="item.tags">
					<view :key="i">
						{{i}}
					</view>
					</view>
<view  v-if="item.footMark" >					<view v-for="i in item.footMark" :key="i">
						{{i}}
					</view></view>

				</view>
				<view class="like">
					<uni-icons type="heart-filled" size="50" color="hotpink"></uni-icons>
					<text>{{ tools.formatLikes(item.like) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script module="tools" lang="wxs" src="../../utils/formatLikes.wxs"></script>
<script>
export default {
	data() {
		return {};
	},
	props: {
		listData: Array,
		type: String
	},
	methods:{
		intoDetail(e){
			console.log(e)
			console.log(`进入${this.type}`)
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
	margin-top: 20rpx;
	height: 176rpx;
	border: 4rpx solid #000;
	border-radius: 30rpx;
	display: flex;
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

.list-item .about view{
	margin: 4rpx;
	padding: 4rpx;
	border: 1rpx solid #000;
	border-radius: 10rpx;
	font-weight: bold;
}

.list-item .like {
	flex: 0 0 160rpx;
	line-height: 176rpx;
	text-align: center;
	font-size: 30rpx;
	border: 4rpx solid #161616;
	border-radius: 30rpx;;
}
</style>
