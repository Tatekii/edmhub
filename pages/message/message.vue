<template>
	<view class="container">
		<!-- 返回顶部 -->
		<view v-show="showButton">
			<scrollToTop @tap="scrollTop"></scrollToTop>
		</view>

		<view class="title">
			<view class="req" @tap="showReqList">
				<span class="reqCount">{{ request.length }}</span>
				人向你打招呼
			</view>
			<view class="friend" @tap="showFriendList">
				好友
				<span class="reqCount">{{ friends.length }}</span>
			</view>
		</view>

		<view class="list">
			<view class="reqList" v-if="showList === 'req' && request.length">
				<reqList :list="request"></reqList>
			</view>

			<view class="friendList" v-if="showList === 'fri' && userInfo.friend.length">
				<friendList :list="friendData" @intoChatRoom="intoChatRoom"></friendList>
			</view>
		</view>

		<view class="chatList" :class="showList ? 'fade' : ''">
			<chatList :chats="chats" @intoChatRoom="intoChatRoom" @delChat="delChat"></chatList>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	const db = wx.cloud.database();
	const _ = db.command;

	export default {
		data() {
			return {
				showList: false,
				// 返回顶部
				showButton: false,
				friendData: []
			};
		},
		computed: {
			...mapState(['hasLogin', 'chats', 'request', 'userInfo', 'changeNow']),
			chatLength() {
				return this.chats.length;
			},
			requestLength() {
				return this.request.length;
			},
			friends() {
				return this.userInfo.friend;
			},
			mixFriToList() {
				for (let item of this.chats) {
					let friData = this.friendData
					let curUser = friData.find(user => user._openid === item.with)
					Object.assign(item, curUser)
				}
			}
		},
		watch: {
			chatLength() {
				console.log('聊天组改变');
				this.updateFriendList();
				//
			},
			friends() {
				//好友数目改变
				this.updateFriendList();
			},
			requestLength(len) {
				if (len > 0) {
					this.showList = 'req'
				}
			},
			// changeNow(flag) {
			// 	if (flag === true) {
			// 		//刷新last数据
			// 		this.refreshLast()
			// 	}
			// }
		},
		methods: {
			delChat(index) {
				console.log(index)
				// 删除vuex中数据
				// 删除localStorage
			},
			// refreshLast() {
			// 	for (let item of this.chats) {
			// 		let dialoge = uni.getStorageSync(item.chatid)
			// 		let last = dialoge[dialoge.length - 1]
			// 		Object.assign(item, {
			// 			last
			// 		})
			// 	}
			// },
			scrollTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			showReqList() {
				if (this.showList === 'req' || !this.request.length) {
					this.showList = false;
					return;
				}
				this.showList = 'req';
			},
			async showFriendList() {
				if (this.showList === 'fri' || !this.userInfo.friend.length) {
					this.showList = false;
					return;
				}
				try {
					if (this.friendData.length) {
						this.updateFriendList();
						console.log('显示再更新');
					} else {
						await this.updateFriendList();
						console.log('等待拉取新数据');
					}
				} catch (e) {
					console.log(e);
				}
				this.showList = 'fri';
			},
			// 后台默默更新好友的信息
			async updateFriendList() {
				const list = await db
					.collection('users')
					.where({
						_openid: _.in(this.friends)
					})
					.field({
						avatarUrl: true,
						_openid: true,
						lastLogin: true,
						nickName: true
					})
					.get()
					.then(res => {
						return res.data;
					});
				this.friendData = list;
				await uni.setStorageSync('friendListData', list);
			},
			intoChatRoom(arg) {
				let openid, chatid;
				if (arg.openid) {
					openid = arg.openid;
					for (let item of this.chats) {
						if (item._openid === openid) {
							chatid = item.chatid;
						}
					}
				} else if (arg.chatid) {
					chatid = arg.chatid;
					for (let item of this.chats) {
						if (item.chatid === chatid) {
							openid = item.with;
						}
					}
				}
				if (!openid || !chatid) {
					uni.showToast({
						title: '未携带参数'
					});
				}

				uni.navigateTo({
					url: '../../pages/chatroom/chatroom?openid=' + openid + '&chatid=' + chatid,
					fail(err) {
						uni.showToast({
							title: '出错了'
						});
						console.log(err);
					}
				});
			}
		},
		onLoad() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '提示',
					content: '请先登录',
					cancelText: '随便看看',
					confirmText: '前去登陆',
					success: function(res) {
						if (res.confirm) {
							uni.switchTab({
								url: '../mine/mine',
								fail(res) {
									console.log(res);
								}
							});
						} else if (res.cancel) {
							uni.switchTab({
								url: '../index/index',
								fail(res) {
									console.log(res);
								}
							});
						}
					}
				});
			}
			this.friendData = uni.getStorageSync('friendListData');
			this.updateFriendList()
		},
		onPageScroll(e) {
			if (e.scrollTop >= 400) {
				this.showButton = true;
			} else {
				this.showButton = false;
			}
		}
	};
</script>

<style scoped>
	.container {
		margin: 10rpx;
	}

	.title {
		display: flex;
		flex-direction: row;
	}

	.title view {
		font-weight: bolder;
		text-align: center;
		color: white;
		padding: 12rpx;
		border: 4rpx solid black;
		border-radius: 30rpx;
		flex: 1;
	}

	.title .req {
		background: #2c405a;
	}

	.title .friend {
		background: #ed3b83;
	}

	.title .reqCount {
		background: #fc870a;
		border-radius: 40rpx;
		display: inline-block;
		margin: 0 10rpx;
		text-align: center;
		padding: 0 10rpx;
		color: #000000;
	}

	.list {
		position: absolute;
		top: 94rpx;
		z-index: 6;
		width: 730rpx;
	}

	.fade {
		opacity: 0.1;
	}

	.chatList {
		margin-top: 10rpx;
	}
</style>
