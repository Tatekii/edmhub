<template>
	<view class="container">
		<view class="dialoge">
			<view v-for="(item, index) of dialoge" :key="index">
				<view v-if="item.speaker === userInfo._openid">
					<wordsbox :avatar="userInfo.avatarUrl" layout="se" :content="item.content" :date="$tools.formatTime(item.date)"></wordsbox>
				</view>
				<view v-else>
					<wordsbox :avatar="targetInfo.avatarUrl" layout="tar" :content="item.content" :date="$tools.formatTime(item.date)"></wordsbox>
				</view>
			</view>
		</view>
		<view class="input">
			<view class="inputwrap"><textarea class="inputarea" type="text" v-model="message" /></view>

			<span class="send" @tap="send"><image class="icon" src="../../static/icon_selected/fasong.png" mode="aspectFit"></image></span>
		</view>
	</view>
</template>

<script>
const db = wx.cloud.database();
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			dialoge: [],
			targetInfo: [],
			message: '',
			options:{},
			sending:false
		};
	},
	computed: {
		...mapState(['userInfo', 'chats'])
	},
	methods: {
		...mapMutations(['updateNow']),
		// isRead(chatid) {
		// 	// 清除未读标签
		// 	wx.cloud
		// 		.callFunction({
		// 			name: 'isRead',
		// 			data: {
		// 				chatid
		// 			}
		// 		})
		// 		.then(res => {
		// 			console.log('已读', res);
		// 		});
		// },
		clearIsNew(chatId){
			console.log(chatId)
			wx.cloud.callFunction({
				name:'isNew',
				data:{
					chatid:chatId
				}
			})
			.then(res=>{
				console.log('clearIsNew')
			})
		},
		scroll() {
			uni.pageScrollTo({
				scrollTop: 99999999,
				duration: 0
			});
		},
		async send() {
			if(this.sending===true)return 
			// 话要一句一句说
			this.sending = true
			let msg = this.message;
			if(!msg) return
			let chatid = this.options.chatid;
			let target = this.targetInfo._openid;
			await wx.cloud
				.callFunction({
					name: 'sendMsg',
					data: {
						msg,
						chatid,
						target
					}
				})
				.then(async res => {
					console.log(`发送${msg}给${target}`, res.result);
					this.message = '';
					this.sending = false
				});
		},
		async watchCurrentChat() {
			this.chatRoomWatcher = await db
				.collection('chats')
				.doc(this.options.chatid)
				.watch({
					onChange: snapshot => {
						let newDialoge = snapshot.docs[0].dialoge;
						// console.log(newDialoge)
						// // if(snapshot.docChanges[0].dataType==='init'){
						// // 	console.log('init,不执行啧监听逻辑到此为止')
						// // 	return
						// // }
						// if (!newDialoge || !newDialoge.length) return;
						// newDialoge = newDialoge[newDialoge.length -1];
						// 页面
						// this.dialoge = [].concat(this.dialoge,newDialoge);
						this.dialoge = newDialoge

						// 滚动到底部
						this.$nextTick(() => {
							this.scroll();
						});
						// 缓存
						const oldCatch = uni.getStorageSync(this.options.chatid);
						// uni.setStorageSync(this.options.chatid, oldCatch.concat(newDialoge));
						
						// last
						this.updateNow(true)
						// this.updateLast({ chatid: this.options.chatid, last: newDialoge });
					},
					onError: err => {
						console.error('the watch closed because of error', err);
					}
				});
		}
	},
	async onLoad(options) {
		console.log('进入聊天--->', options);
		this.options = options
		this.dialoge = uni.getStorageSync(options.chatid);

		// targetInfo
		const friendData = uni.getStorageSync('friendListData');
		for (let item of friendData) {
			if (item._openid === options.openid) {
				this.targetInfo = item;
			}
		}

		// title
		uni.setNavigationBarTitle({
			title: this.targetInfo.nickName
		});
		this.$nextTick(() => {
			// scrollToBottom
			this.scroll();
		});
		// this.isRead(options.chatid);
		this.watchCurrentChat()
		// 进入聊天后将isNew标识去掉
		this.clearIsNew(options.chatid)
	},
	async onUnload(){
		await this.chatRoomWatcher.close()
	}
};
</script>

<style scoped>
.dialoge {
	min-height: 1086rpx;
	overflow: hidden;
	padding-bottom: 10vh;
}
.wordsbox {
	background: #5fff8a;
	width: 300rpx;
}
.input {
	height: 10vh;
	position: fixed;
	bottom: 0;
	background: black;
	width: 100%;
	display: flex;
}
.input .inputwrap {
	flex: 1;
	padding: 2%;
	color: #ffffff;
}
.input .inputwrap .inputarea {
	border: 8rpx solid #232323;
	border-radius: 16rpx;
	height: 100%;
	background: #090909;
	font-size: 34rpx;
	padding: 10rpx;
	width: 100%;
	box-sizing: border-box;
}
.input .send {
	flex: 0 0 100rpx;
	padding: 3% 0;
}
.input .send .icon {
	width: 80rpx;
	height: 80rpx;
}
</style>
