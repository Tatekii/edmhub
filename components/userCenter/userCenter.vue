<!-- 插槽大法好啊！插槽牛逼！ -->
<template>
	<view class="container">
		<!-- 用户自己上传封面的插槽 -->
		<view class="cover">
			<slot name="coverSlot"><image :src="userInfo.coverUrl" mode="widthFix"></image></slot>
		</view>
		<view class="userinfo">
			<!-- 头像 -->
			<image class="userinfo-avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
			<view class="userinfo-detail">
				<!-- 城市 -->
				<text class="city">{{ userInfo.city }}</text>
				<!-- 年龄 -->
				<text class="age">{{ userInfo.age }}</text>
				<!-- 性别 -->
				<text class="gender">{{ userInfo.gender === 1 ? '🚹' : '🚺' }}</text>
			</view>
			<view class="social">
				<!-- 点赞 -->
				<view class="likes" @tap="likeU">
					<uni-icons type="heart-filled" size="17" color="hotpink"></uni-icons>
					<text>{{ $tools.formatLikes(userInfo.like) }}</text>
				</view>
			</view>
			<!-- 编辑/加好友插槽 -->
			<slot name="editor"></slot>
		</view>
		<!-- 签名 -->
		<view class="motto">
			<textarea class="motto-textarea" :disabled="type === 'mine' ? false : true" maxlength="120" auto-height :value="userInfo.motto" @confirm="editMotto" />
		</view>
		<!-- tags -->
		<view class="introduce">
			<view v-if="userInfo.tags" class="tags">
				<view class="tagTitle">🎵</view>
				<block v-for="(item, index) of userInfo.tags" :key="index">
					<view :class="bgArr1[index]">{{ item }}</view>
				</block>
			</view>
			<view v-if="userInfo.footMark" class="tags">
				<view class="tagTitle">👣</view>
				<block v-for="(item, index) in userInfo.footMark" :key="index">
					<view :class="bgArr2[index]">{{ item }}</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bgArr1: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c1', 'c8', 'c7', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20'],
			bgArr2: ['c4', 'c13', 'c17', 'c7', 'c18', 'c6', 'c1', 'c15', 'c14', 'c19', 'c2', 'c11', 'c9', 'c8', 'c10', 'c16', 'c12', 'c5', 'c3', 'c20', 'c1']
		};
	},
	props: {
		userInfo: Object,
		type: String
	},
	methods: {
		likeU() {
			this.$emit('likeU');
		},
		editMotto(e) {
			this.$emit('editMotto', e.detail.value);
		}
	},
	computed: {
		hasCover() {
			return this.userInfo.coverUrl;
		},
		fade() {
			return this.userInfo.nickName;
		}
	}
};
</script>

<style scope>
.container {
	background: #161616;
	min-height: 100vh;
}

.fade {
	opacity: 0.3;
}

.cover {
	max-height: 750rpx;
	height: 420rpx;
	width: 100%;
	overflow: hidden;
	margin-bottom: -16rpx;
	background: #fc870a;
}
.cover image {
	width: 100%;
}

.userinfo {
	background-color: #000;
	border: 4rpx #232323 solid;
	height: 140rpx;
	width: 742rpx;
	color: #fff;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	position: relative;
}

.userinfo-detail {
	padding-top: 8rpx;
	flex: 1;
}

.userinfo-detail .city {
	margin-left: 20rpx;
}

.userinfo-detail .age {
	margin-left: 20rpx;
	padding: 6rpx;
	border: 1rpx #232323 solid;
	border-radius: 6rpx;
	color: #fc870a;
}

.userinfo-detail .gender {
	margin-left: 10rpx;
}

.userinfo-avatar {
	width: 128rpx;
	height: 128rpx;
	margin-left: 30rpx;
	margin-right: 30rpx;
	flex: 0 0 128rpx;
	border-radius: 50%;
}

.userinfo .social {
	position: absolute;
	text-align: center;
	right: 20rpx;
	top: -80rpx;
}

.userinfo .social .likes {
	color: rgb(247, 65, 95);
	border: 1rpx rgb(247, 65, 95) solid;
	padding: 0 6rpx;
	background-color: #232323;
	border-radius: 10%;
	opacity: 0.8;
	font-size: 36rpx;
}

.introduce {
	display: flex;
	flex-direction: column;
	margin: 10rpx 10rpx 0 10rpx;
	border: 2rpx #232323 solid;
	border-radius: 8rpx;
	color: #fff;
}

.motto {
	color: #fff;
	margin: 20rpx;
	border: 4rpx #232323 solid;
	border-radius: 4rpx;
	padding: 4rpx;
}

.motto .motto-textarea {
	width: 100%;
	padding: 4rpx;
}

.introduce .tags {
	background: #232323;
	display: flex;
	align-content: space-around;
	justify-content: center;
	flex-wrap: wrap;
	border: 2rpx solid;
	border-image: linear-gradient(rgb(219, 51, 51), rgb(89, 0, 255)) 4;
	margin-bottom: 10rpx;
}

.introduce .tags view {
	display: inline-block;
	border-radius: 8rpx;
	border: 1rpx #000 solid;
	color: #000;
	font-weight: bold;
	font-size: 36rpx;
	text-decoration: none;
	text-align: center;
	margin: 12rpx;
	padding: 8rpx;
}
.introduce .tags .tagTitle {
	display: block;
	width: 100%;
	text-align: center;
	border: 0;
	margin: 0;
}
.c1 {
	background: linear-gradient(to bottom, #4568dc 0%, #b06ab3 100%);
}

.c2 {
	background: linear-gradient(to bottom, #43c6ac 0%, #191654 100%);
}

.c3 {
	background: linear-gradient(to bottom, #093028 0%, #237a57 100%);
}

.c4 {
	background: linear-gradient(to bottom, #43c6ac 0%, #f8ffae 100%);
}

.c6 {
	background: linear-gradient(to bottom, #ffafbd 0%, #ffc3a0 100%);
}

.c5 {
	background: linear-gradient(to bottom, #e8cbc0 0%, #636fa4 100%);
}

.c7 {
	background: linear-gradient(to bottom, #dce35b 0%, #45b649 100%);
}

.c8 {
	background: linear-gradient(to bottom, #c0c0aa 0%, #1cefff 100%);
}

.c9 {
	background: linear-gradient(to bottom, #3494e6 0%, #ec6ead 100%);
}

.c10 {
	background: linear-gradient(to bottom, #67b26f 0%, #4ca2cd 100%);
}

.c11 {
	background: linear-gradient(to bottom, #f3904f 0%, #3b4371 100%);
}

.c12 {
	background: linear-gradient(to bottom, #ee0979 0%, #ff6a00 100%);
}

.c13 {
	background: linear-gradient(to bottom, #cf8bf3 0%, #fdb99b 100%);
}

.c14 {
	background: linear-gradient(to bottom, #f4c4f3 0%, #fc67fa 100%);
}

.c15 {
	background: linear-gradient(to bottom, #00c3ff 0%, #ffff1c 100%);
}

.c16 {
	background: linear-gradient(to bottom, #ff7e5f 0%, #feb47b 100%);
}

.c17 {
	background: linear-gradient(to bottom, #ef32d9 0%, #89fffd 100%);
}

.c18 {
	background: linear-gradient(to bottom, #de6161 0%, #2657eb 100%);
}

.c19 {
	background: linear-gradient(to bottom, #4ecdc4 0%, #556270 100%);
}

.c20 {
	background: linear-gradient(to bottom, #f85032 0%, #e73827 100%);
}
</style>
