<template>
	<view class="container">
		<view class="dialoge">
			<view v-for="(item, index) of dialoge" :key="index">
				<view v-if="item.speaker === userInfo._openid">
					<wordsbox :avatar="userInfo.avatarUrl" layout="se" :content="item.content" :date="$tools.formatTime(item.date)"></wordsbox>
				</view>
				<view v-else><wordsbox :avatar="targetInfo.avatarUrl" layout="tar" :content="item.content" :date="$tools.formatTime(item.date)"></wordsbox></view>
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
			chatid: ''
		};
	},
	computed: {
		...mapState(['userInfo', 'chats'])
	},
	methods: {
		...mapMutations(['updateLast']),
		isRead(chatid) {
			// 清除未读标签
			wx.cloud
				.callFunction({
					name: 'isRead',
					data: {
						chatid
					}
				})
				.then(res => {
					console.log('已读', res);
				});
		},
		scroll() {
			uni.pageScrollTo({
				scrollTop: 99999999,
				duration: 0
			});
		},
		async send() {
			console.log('开启roomwatch')
			await this.watchCurrentChat()
			
			// 发送消息的逻辑
			let msg = this.message;
			let chatid = this.chatid;
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
					console.log('关闭roomwatch')
					await this.watcher.close()
				});
		},
		async watchCurrentChat() {
			// watch当前聊天
			this.watcher = await db.collection('chats')
				.doc(this.chatid)
				.watch({
					onChange: snapshot => {
						console.log(snapshot)
						// 回避初始化
						// 弃用
						// if (snapshot.docChanges[0].dataType === 'init') {
						// 	console.log('init');
						// 	return;
						// }
						
						if(!snapshot.docs.length) return 
						let newDialoge = snapshot.docs[0].dialoge;
						
						newDialoge = newDialoge[newDialoge.length - 1];
						
						// if(newDialoge.speaker!==this.userInfo._openid) return 
						
						console.log('newDialoge',newDialoge);
						// 页面
						this.dialoge = this.dialoge.concat(newDialoge);
						// 滚动到底部
						this.$nextTick(()=>{
							this.scroll()
						})
						// 缓存
						const oldCatch = uni.getStorageSync(this.chatid)
						console.log('oldCatch',oldCatch)
						uni.setStorageSync(this.chatid, oldCatch.concat(newDialoge));
						// last
						this.updateLast({ chatid: this.chatid, last: newDialoge });
						
					},
					onError: err => {
						console.error('the watch closed because of error', err);
					}
				});
		}
	},
	async onLoad(options) {
		console.log('进入聊天--->', options);
		
		this.chatid = options.chatid;
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
		this.isRead(this.chatid);
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
