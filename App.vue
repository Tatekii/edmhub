<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				flag: true,
				commitData: {}
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['login', 'commitMsg', 'update', 'updateNow']),
			async autoLogin() {
				// uni.showLoading({
				// 	mask: true,
				// 	title: '登录中'
				// });
				await wx.cloud
					.callFunction({
						name: 'login',
						data: {}
					})
					.then(async res => {
						let data = res.result;
						if (!data) {
							console.log('是新用户');
							// uni.hideLoading();
							return;
						}
						console.log('数据库中存在该用户');
						this.login(data);
						uni.showToast({
							title: '自动登陆成功'
						});
						// 开始监听msg
						this.watchMsg();
						// // 开始监听档案
						this.watchUserInfo();
					});
			},
			async watchMsg(code) {
				const db = wx.cloud.database();
				await db
					.collection('message')
					.orderBy('date', 'desc')
					.where({
						user: this.userInfo._openid
					})
					.watch({
						onChange: async snapshot => {
							console.log('message数据改变')
							const data = snapshot.docs[0]
							this.commitMsg(data)

							let flag1 = data.request.length > 0
							let flag2 = false

							if (data.chats.length > 0) {
								for (let i of data.chats) {
									if (i.isNew) {
										console.log('有新消息')
										flag2 = true
									}
								}
							}

							if (flag1 || flag2) {
								this.$nextTick(function() {
									uni.showTabBarRedDot({
										index: 2
									})
								})

							} else {
								this.$nextTick(function() {
									uni.hideTabBarRedDot({
										index: 2
									})
								})

							}
							// if (this.flag === false) return; // flag

							// let data = snapshot.docs[0];
							// this.commitData = Object.assign({}, data);

							// this.commitMsg(this.commitData);
							// // 小红点

							// let flag1 = data.request.length; //好友请求？
							// let flag2 = false; // 新消息？

							// let arr = [];

							// if (this.commitData.chats.length>0) {
							// 	for (let i of this.commitData.chats) {
							// 		if (i.isNew === true) {
							// 			// 下载会话
							// 			// i.chatid
							// 			console.log(i.chatid + '有新信息');
							// 			arr.push(i.chatid);
							// 		} else {
							// 			let localCatch = uni.getStorageSync(i.chatid);
							// 			if (!localCatch) {
							// 				console.log(i.chatid + '本地无缓存，新建');
							// 				uni.setStorageSync(i.chatid, []);
							// 			} else {
							// 				let last = localCatch[localCatch.length - 1];
							// 				if (last === catchLast) {
							// 					console.log('重复内容');
							// 					return;
							// 				}
							// 				catchLast = last;

							// 				console.log('读取local缓存', last);
							// 				// 添加last数据进入commitData
							// 				i = Object.assign(i, {
							// 					last
							// 				});
							// 			}
							// 		}

							// 		if (!i.isRead) {
							// 			flag2 = true;
							// 		}
							// 	}
							// }

							// if (flag1) {
							// 	uni.showTabBarRedDot({
							// 		index: 2
							// 	});
							// }

							// // 线上有新内容的
							// if (arr.length) {
							// 	console.log('检测到new');
							// 	await this.downlaodChat(arr);
							// }
						},
						onError: err => {
							console.error('the watch closed because of error', err);
						}
					});
			},
			async watchUserInfo() {
				const db = wx.cloud.database();
				await db
					.collection('users')
					.where({
						_openid: this.userInfo._openid
					})
					.watch({
						onChange: snapshot => {
							const data = snapshot.docs[0];
							if (snapshot.docChanges[0].dataType === 'init') return; // 避开初始化
							console.log('watch到userInfo改变');
							console.log(data);
							this.update(data);
						},
						onError: err => {
							console.error('the watch closed because of error', err);
						}
					});
			},
			async downlaodChat(chatsArr) {
				// console.log('this.commitData',this.commitData)
				const db = wx.cloud.database();
				const _ = db.command;
				// 拉取未读的聊天
				// 拉取之后删除
				// 清除isNew新消息标示
				await wx.cloud
					.callFunction({
						name: 'getChatData',
						data: {
							list: chatsArr
						}
					})
					.then(async res => {
						const data = res.result.data;
						console.log('下载线上聊天', data);

						for (let item of data) {
							// 并入本地缓存
							let localCatch = uni.getStorageSync(item._id);
							if (!localCatch.length) {
								localCatch = [];
							}
							uni.setStorageSync(item._id, localCatch.concat(item.dialoge));

							this.updateNow(true)
						}
					})
					.then(() => {
						// 清除isNew
						this.clearIsNew(chatsArr);
					});
				console.log('dowmloadChat执行结束');
			},
			async clearIsNew(list) {
				this.flag = false;
				wx.cloud
					.callFunction({
						name: 'clearIsNew',
						data: {
							list
						}
					})
					.then(res => {

						console.log('clearIsNew');
						// 重新启动监听
						this.flag = true;
					});
			}
		},
		onLaunch: function() {
			if (!wx.cloud) {
				console.error('不支持云能力');
			} else {
				wx.cloud.init({
					env: 'dev-0033',
					traceUser: true
				});
				// 自动登录
				this.autoLogin();
			}
		}
	};
</script>

<style>
	page {
		background: #161616;
	}
</style>
