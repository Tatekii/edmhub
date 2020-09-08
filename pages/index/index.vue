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
			<button type="default" @tap="msgCheck">内容安全检查测试</button>
			<input type="text" v-model="msg"/>
		</view>
	</view>
</template>

<script>
	// import {mapState} from 'vuex'
export default {
	computed:{
			// ...mapState(['chats'])
	},
	methods: {
		msgCheck(){
			wx.cloud.callFunction({
				name:'msgCheck',
				data:{
					msg:this.msg
				}
			}).then(res=>{
				console.log(res)
			})
		}
	},
	data() {
		return {
			msg:'',
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
	onLoad() {}
};
</script>

<style scoped>
.container {
	color: #fff;
	min-height: 100vh;
	background: #161616;
}

.news {
	width: 100%;
	height: 625rpx;
	border-bottom: 4rpx #232323 solid;
}

.news .swiper {
	height: 100%;
	width: 100%;
}

.news .swiper-item {
	height: 100%;
	width: 100%;
	text-align: center;
	background: linear-gradient(rgba(255, 51, 0, 0.795), rgba(251, 255, 0, 0.808), rgba(0, 162, 255, 0.801), rgba(255, 0, 242, 0.808));
	position: relative;
}

.news .swiper-item .title {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 750rpx;
	position: absolute;
	top: 0;
	background-color: #000;
	opacity: 0.6;
}
</style>
