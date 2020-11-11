<template>
	<view class="container">
		<view class="news">
			<swiper class="swiper" duration="1000" circular="true" autoplay="true" indicator-dots="true" interval="10000">
				<view v-for="(item, index) in gallery" :key="index">
					<swiper-item>
						<view class="swiper-item">
							<view class="title">
								<text>{{ item.title }}</text>
							</view>
							<image :src="item.src" class="swiper-item-image" mode="widthFix"></image>
						</view>
					</swiper-item>
				</view>
			</swiper>
		</view>
		<view class="msg">
			<view class="title">内容安全检查测试</view>
			<view class="text">
				<view class="inputWrap"><input class="input" type="text" v-model="msg" placeholder="键入敏感词检查(比如伟人)" /></view>
				<button type="default" @tap="msgCheck">录入</button>
				<text>当前：{{ location.city }}</text>
			</view>
			<view class="list">
				<view v-for="item of list" :key="item._id" class="section">
					<text class="nickName">{{item.nickname}}</text>
					<text class="words">{{item.msg}}</text>
					<text class="location">{{item.location}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// import {mapState} from 'vuex'
const db = wx.cloud.database()
export default {
	data() {
		return {
			msg: '',
			location:'无定位权限',
			list:[],
			gallery: [
				{
					title:
						'saidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidtheskysaidthesky',
					src: '/static/static/new/4.jpg'
				},
				{
					title: 'saidthesky',
					src: '/static/static/new/3.jpg'
				},
				{
					title: 'saidthesky',
					src: '/static/static/new/2.jpg'
				},
				{
					title: 'saidthesky',
					src: '/static/static/new/1.jpg'
				},
				{
					title: 'GUD？？？？？？？？？？？？？？？？？？？',
					src: '/static/static/new/5.jpg'
				}
			]
		};
	},
	computed:{
		
	},
	methods: {
		msgCheck() {
			if(!this.msg) return
			let norMsg = this.msg
			let secMsg = ''
			uni.showLoading({
				title:'正在提交'
			})
			wx.cloud
				.callFunction({
					name: 'msgCheck',
					data: {
						msg: norMsg
					}
				})
				.then(async res => {
					if(res.result.errCode!==0){
						uni.hideLoading()
						uni.showModal({
							content:'内容不合法'
						})
					}else{
						//
						this.msg = ''
						secMsg = norMsg
						await this.updateBlackBoard(secMsg)
						uni.hideLoading()
					}
				});
		},
		updateBlackBoard(msg){
			db.collection('blackboard').add({
				data:{
					msg,
					location:this.location.city || '未定位',
					due:new Date(),
					nickname:this.nickname || '匿名'
				}
			}).then(res=>{
				console.log(res)
			})
		},
		getBlackBoard(){
			db
				.collection('blackboard')
				.orderBy('date', 'desc')
				.watch({
					onChange: async snapshot => {
						this.list = snapshot.docs
					},
					onError: err => {
						console.error('the watch closed because of error', err);
					}
				})
		},
		gps(){
			// 定位
			const self = this
			wx.getSetting({
		  success (res) {
				if(!res.authSetting['scope.userLocation']){
					console.log('无定位权限')
				}else{
					console.log('有定位权限')
					uni.getLocation({
					    type: 'wgs84',
					    success: async res => {
					        // 解析地址
									await wx.cloud.callFunction({
										name:'getLocation',
										data:res
									}).then(res=>{
										let ret = res.result
										if(ret.message==='query ok'){
											self.location = ret.result.address_component
										}
									})
					    }
					});
				}
		  }
		})
	}
	},
	onLoad() {
		this.gps()
		this.getBlackBoard()
	}

};
</script>

<style lang="stylus" scoped>
.container
	color #fff
	min-height 100vh
	background #161616
	display flex
	flex-direction column
.news
	width 100%
	height 625rpx
	border-bottom 4rpx #232323 solid
.news .swiper
	height 100%
	width 100%
.news .swiper-item
	height 100%
	width 100%
	text-align center
	background linear-gradient(rgba(255, 51, 0, 0.795), rgba(251, 255, 0, 0.808), rgba(0, 162, 255, 0.801), rgba(255, 0, 242, 0.808))
	position relative
.news .swiper-item .title
	white-space nowrap
	overflow hidden
	text-overflow ellipsis
	width 750rpx
	position absolute
	top 0
	background-color #000
	opacity 0.6
.msg
	flex 1
	background #161616
	border 4rpx solid #000000
	border-radius 40rpx
.msg .title
	font-size 40rpx
	font-weight bolder
	text-align center
	border-bottom 4rpx solid #000000
.msg .inputWrap
	height 60rpx
	display flex
	font-size 40rpx
.msg .inputWrap .input
	background white
	color black
	margin 9rpx
	flex 1
.msg .list .section
	background #007AFF
	margin 8rpx
	display flex
	justify-content space-between
.msg .list text
	border 4rpx #009D91
</style>
