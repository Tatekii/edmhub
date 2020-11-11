<template>
	<view>
		<view class="login" v-if="!hasLogin">
			<text>hi 点击登录按钮代表你同意我们的“用户规范”和“使用须知” 下次进入小程序将自动登录 peace~</text>
			<button open-type="getUserInfo" @getuserinfo="getUserInfo">登陆</button>
		</view>
		<userCenter :userInfo="userInfo" type="mine" v-on:editMotto="handleMotto">
			<template #coverSlot>
				<view @tap="uploadCover">
					<view v-if="!userInfo.coverUrl" class="coverTip">👀还没有封面～点我</view>
					<image v-else :src="userInfo.coverUrl" mode="widthFix"></image>
				</view>
			</template>
			<template #editor>
				<navigator url="../editor/editor">
					<view class="editInfo">
						<uni-icons type="gear-filled" size="17" color="skyblue"></uni-icons>
						<text>编辑</text>
					</view>
				</navigator>
			</template>
		</userCenter>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
const db = wx.cloud.database();
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	methods: {
		...mapMutations(['login', 'update', 'commitMsg']),
		getUserInfo(e) {
			uni.showLoading({
				mask: true,
				title: '登录中'
			});
			console.log(e.detail.userInfo);
			let userInfo = e.detail.userInfo;
			this.databaseInit(userInfo);
		},
		async databaseInit(data) {
			await wx.cloud
				.callFunction({
					name: 'initUser',
					data: data
				})
				.then(async res => {
					//res.result.id
					console.log(res);
					await wx.cloud
						.callFunction({
							name: 'sqlData',
							data: {
								name: 'users',
								_id: res.result._id
							}
						})
						.then(async res => {
							this.login(res.result.data);
							// !!!
							// TODO
							// this.watchMsg();
							wx.setNavigationBarTitle({
								title: res.result.data.nickName + '的主页'
							});
							uni.hideLoading();
						});
				});
		},
		uploadCover() {
			const openid = this.userInfo._openid;
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'] //从相册选择
			})
				.then(res => {
					let tempPath = res[1].tempFiles[0].path;
					// 压缩
					uni.compressImage({
						src: tempPath,
						quality: 1
					}).then(res => {
						tempPath = res[1].tempFilePath;
						// 
						let time = Date.now()
						time = String(time)
						time = time.substring(10)
						wx.cloud
							.uploadFile({
								cloudPath: `userCover/${openid}_cover_${time}.jpg`,
								filePath: tempPath // 文件路径
							})
							.then(async res => {
								console.log(res.fileID);
								console.log(res)
								if (res.errMsg === "cloud.uploadFile:ok") {
									await wx.cloud
										.callFunction({
											name: 'update',
											data: {
												name: 'users',
												_openid: this.userInfo._openid,
												updates: {
													coverUrl: res.fileID
												}
											}
										})
										.then(res => {
											console.log(res);
											uni.hideLoading();
										});
								}
							});
					});
				})
				.catch(err => {
					console.log(err);
					uni.hideLoading();
				});
		},
		handleMotto(data) {
			console.log('刷新签名');
			console.log(data);
			wx.cloud
				.callFunction({
					name: 'update',
					data: {
						name: 'users',
						_openid: this.userInfo._openid,
						updates: {
							motto: data
						}
					}
				})
				.then(res => {
					console.log(res);
					// this.update({
					// 	motto:data
					// })
				})
				.catch(err => {
					uni.showToast({
						title: '请等会再试试吧' + err,
						icon: 'none'
					});
				});
		},
	},
	  onShareAppMessage: function () {
	    return {
	      title: '快来找我玩耍',
	      path: '/index/index?id=123'
	    }
	  },
};
</script>

<style>
.coverTip {
	line-height: 420rpx;
	text-align: center;
	font-weight: bolder;
}
.editInfo {
	color: skyblue;
	border: 1rpx solid skyblue;
	border-radius: 8rpx;
	padding: 8rpx;
	margin-right: 20rpx;
	background-color: #232323;
}
.login {
	position: fixed;
	width: 400rpx;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	margin: 0 auto;
	z-index: 1;
	color: #f8f8f8;
}
</style>
