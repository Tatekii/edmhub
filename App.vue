<script>
import { mapMutations, mapState } from 'vuex';
export default {
	data() {
		return {
			flag: true
		};
	},
	computed: {
		...mapState(['userInfo', 'chats'])
	},
	methods: {
		...mapMutations(['login', 'commitMsg', 'update', 'updateLast']),
		async autoLogin() {
			uni.showLoading({
				mask: true,
				title: '登录中'
			});
			await wx.cloud
				.callFunction({
					name: 'login',
					data: {}
				})
				.then(async res => {
					let data = res.result;
					if (!data) {
						console.log('newUser');
						uni.hideLoading();
						return;
					}
					console.log('数据库中存在该用户');
					await this.login(data);
					uni.hideLoading();
					uni.showToast({
						title: '登陆成功'
					});
					// 监听msg
					this.watchMsg();
					// 监听档案
					this.watchUserInfo();
				});
		},
		async watchMsg(code) {
			const db = wx.cloud.database();
			let catchLast;
			await db
				.collection('message')
				.orderBy('date', 'desc')
				.where({
					user: this.userInfo._openid
				})
				.watch({
					onChange: async snapshot => {
						uni.hideTabBarRedDot({
							index: 2
						});
						if (this.flag === false) return; // flag

						let data = snapshot.docs[0];
						let commitdData = Object.assign({}, data);
						console.log('App watchMsg');
						console.log(data);
						await this.commitMsg(commitdData);

						// 显示小红点
						let flag1 = data.request.length; //好友请求？
						let flag2 = false; // 新消息？

						let arr = [];

						if (data.chats.length) {
							for (let i of data.chats) {
								if (i.isNew === true) {
									// 下载会话
									// i.chatid
									arr.push(String(i.chatid));
								} else {
									const chatid = i.chatid;
									let last = uni.getStorageSync(chatid) || [];
									last = last[last.length - 1];
									if (last === catchLast) return;
									catchLast = last;
									const obj = { chatid: chatid, last: last };
									console.log('读取local缓存', obj);
									await this.updateLast(obj);
								}

								if (!i.isRead) {
									flag2 = true;
								}
							}
						}
						if (flag1 || flag2) {
							uni.showTabBarRedDot({
								index: 2
							});
						}

						// 线上有新内容的
						if (arr.length) {
							console.log('检测到new');
							await this.downlaodChat(arr);
						}
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
					console.log('拉取线上聊天', data);

					for (let item of data) {
						let last = uni.getStorageSync(item._id);
						last = last[last.length - 1];
						let obj = { chatid: item._id, last: last };
						this.updateLast(obj);
					}
				})
				.then(() => {
					// 清除isNew
					this.clearIsNew(chatsArr);
				});
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
	onLaunch: async function() {
		if (!wx.cloud) {
			console.error('不支持云能力');
		} else {
			wx.cloud.init({
				env: 'dev-0033',
				traceUser: true
			});
			// 自动登录
			await this.autoLogin();
		}
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
page {
	background: #161616;
}
</style>
