<template>
	<view class="container">
		<view class="title">更换头像</view>
		<view class="avatar" @tap="uploadAvatar"><image :src="userInfo.avatarUrl" mode="aspectFill"></image></view>
		<view class="nickName">
			<view class="title">修改昵称</view>
			<input class="uni-input" maxlength="20" type="text" v-model="profile.nickName" />
		</view>
		<view class="age">
			<view class="title">修改年龄</view>
			<input class="uni-input" type="number" v-model="profile.age" />
		</view>
		<view class="city">
			<view class="title">修改坐标</view>
			<input class="uni-input" maxlength="10" type="string" v-model="profile.city" />
		</view>
		<view class="introduce">
			<view class="tags">
				<view class="title">编辑标签</view>
				<view class="addNew">
					<input class="uni-input" maxlength="20" type="text" placeholder="输入新内容" v-model="newTag" />
					<view class="button" @tap="add('tag')"><uni-icons type="checkbox" size="30"></uni-icons></view>
				</view>
				<view class="cells">
					<view v-for="(item, index) in profile.tags" :key="index">
						<view class="item" @tap="del('tag', index)">
							<text>{{ item }}</text>
							<uni-icons type="close" size="20" color="red"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<view class="footMarks">
				<view class="title">编辑足迹</view>
				<view class="addNew">
					<input class="uni-input" maxlength="20" type="text" placeholder="输入新内容" v-model="newMark" />
					<view class="button" @tap="add('mark')"><uni-icons type="checkbox" size="30"></uni-icons></view>
				</view>
				<view class="cells">
					<view v-for="(item, index) in profile.footMark" :key="index">
						<view class="item" @tap="del('mark', index)">
							<text>{{ item }}</text>
							<uni-icons type="close" size="20" color="red"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="save"><button type="primary" size="mini" plain="true" @tap="saveChange">保存更改</button></view>
	</view>
</template>

<script>
const db = wx.cloud.database();
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			newTag: '',
			newMark: '',
			profile: {
				nickName: '',
				age: '',
				city: '',
				tags: [],
				footMark: []
			},
			changeLog: {
				nickName: false,
				age: false,
				city: false,
				tags: false,
				footMark: false
			}
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	watch: {
		// 使用log存储数据变化情况
		// 筛选掉没有变化的数据

		profile: {
			handler: function(data) {
				/* todo */
				for (let i in data) {
					if (typeof data[i] === 'object') {
						this.changeLog[i] = false
						console.log(i+'----->'+data[i].length,this.userInfo[i].length)
						if (data[i].length !== this.userInfo[i].length) {
							this.changeLog[i] = true;
						} else {
							for (let item of data[i]) {
								if (!this.userInfo[i].includes(item)) {
									this.changeLog[i] = true;
								}
							}
						}
					} else {
						if (this.userInfo[i] !== data[i]) {
							this.changeLog[i] = true;
						}else{
							this.changeLog[i] = false
						}
					}
				}
			},
			deep: true
		}
	},
	methods: {
		...mapMutations(['update']),
		// 新增标签
		add(type) {
			if (type === 'tag') {
				if (!this.newTag) return;
				this.profile.tags.push(this.newTag);
				this.newTag = '';
			}
			if (type === 'mark') {
				if (!this.newMark) return;
				this.profile.footMark.push(this.newMark);
				this.newMark = '';
			}
		},
		// 删除标签i
		del(type, index) {
			console.log(type, index);
			if (type === 'tag') {
				this.profile.tags.splice(index, 1);
			}
			if (type === 'mark') {
				this.profile.footMark.splice(index, 1);
			}
		},
		// 上传头像
		uploadAvatar() {
			uni.showLoading({
				title:'上传⏫中，请稍后',
				icon:'none'
			})
			const openid = this.userInfo._openid;
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album']
			})
				.then(res => {
					let tempPath = res[1].tempFiles[0].path;
					uni.compressImage({
						src: tempPath,
						quality: 1
					}).then(res => {
						tempPath = res[1].tempFilePath;
						wx.cloud
							.uploadFile({
								cloudPath: `userAvatar/${openid}_avatar.jpg`,
								filePath: tempPath // 文件路径
							})
							.then(res => {
								if (res.statusCode === 200) {
									wx.cloud
										.callFunction({
											name: 'update',
											data: {
												name: 'users',
												_openid: this.userInfo._openid,
												updates: {
													avatarUrl: res.fileID
												}
											}
										})
										.then(res => {
											console.log(res);
											// this.update({
											// 	avatarUrl: tempPath
											// });
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
		//保存修改
		async saveChange() {
			let flag = false;
			let newData = {};
			for (let i in this.changeLog) {
				if (this.changeLog[i] === true) {
					flag = true;
					newData[i] = this.profile[i];
				}
			}
			if (flag !== true) return;

			uni.showLoading({
				title: '保存中，请稍后'
			});

			//------ 标签修改 --------

			let oriTags = (this.userInfo.tags || []).concat(this.userInfo.footMark || []);
			let curTags = (newData.tags || this.userInfo.tags || []).concat(newData.footMark || this.userInfo.footMark || []);
			let addArr = [];
			curTags.forEach(item => {
				if (!oriTags.includes(item)) {
					addArr.push(item);
				}
			});
			let delArr = [];
			oriTags.forEach(item => {
				if (!curTags.includes(item)) {
					delArr.push(item);
				}
			});
			console.log('add->', addArr);
			console.log('del->', delArr);
			if (addArr.length) {
				await wx.cloud.callFunction({
					name: 'addTag',
					data: {
						addArr: addArr
					}
				});
			}
			if (delArr.length) {
				await wx.cloud
					.callFunction({
						name: 'delTag',
						data: {
							delArr: delArr
						}
					})
					.then(res => {
						console.log(res);
					});
			}
			//---------------

			await wx.cloud
				.callFunction({
					name: 'update',
					data: {
						name: 'users',
						_openid: this.userInfo._openid,
						updates: newData
					}
				})
				.then(res => {
					// this.update(newData);
					for (let i in this.changeLog) {
						this.changeLog[i] = false;
					}
					console.log(res);
				});
			uni.hideLoading();
		}
	},
	onLoad() {
		for (let i in this.profile) {
			if (typeof this.profile[i] === 'object') {
				this.profile[i] = Object.assign([], this.userInfo[i]);
			} else {
				this.profile[i] = this.userInfo[i];
			}
		}
		// for (let i in this.profile) {
		// 	this.profile[i] = base[i];
		// }
	}
};
</script>

<style scoped>
.container {
	color: #fff;
	min-height: 100%;
	padding: 10rpx;
	border: 4rpx solid;
	border-image: linear-gradient(rgb(219, 51, 51), rgb(89, 0, 255)) 30 30;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.title {
	color: gray;
	font-style: italic;
	margin: 20rpx auto;
}

.avatar image {
	width: 250rpx;
	height: 250rpx;
	border-radius: 10px;
}

@keyframes rotate {
	100% {
		-webkit-transform: rotate(1turn);
		transform: rotate(1turn);
	}
}

.avatar {
	position: relative;
	z-index: 0;
	width: 250rpx;
	height: 250rpx;
	border-radius: 10px;
	overflow: hidden;
	padding: 8rpx;
}

.avatar::before {
	content: '';
	position: absolute;
	z-index: -2;
	left: -50%;
	top: -50%;
	width: 200%;
	height: 200%;
	background-color: #399953;
	background-repeat: no-repeat;
	background-size: 50% 50%, 50% 50%;
	background-position: 0 0, 100% 0, 100% 100%, 0 100%;
	background-image: linear-gradient(#5fff8a, #399953), linear-gradient(#ffc83d, #fbb300), linear-gradient(#e65147, #d53e33), linear-gradient(#37aff5, #377af5);
	-webkit-animation: rotate 4s linear infinite;
	animation: rotate 4s linear infinite;
}

.avatar::after {
	content: '';
	position: absolute;
	z-index: -1;
	left: 12rpx;
	top: 12rpx;
	width: calc(100% - 24rpx);
	height: calc(100% - 24rpx);
	background: white;
	border-radius: 10rpx;
}

.introduce .addNew {
	width: 80%;
	margin: 0 auto;
	display: flex;
}

.uni-input {
	height: 80rpx;
	line-height: 100%;
	border: 4rpx #232323 solid;
	border-radius: 10px;
	flex: 1;
	background: #000000;
}

.introduce .addNew .button {
	font-size: 50rpx;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	width: 100rpx;
	border: 4rpx #232323 solid;
	border-radius: 10px;
	background-color: greenyellow;
}

.introduce .cells {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	border: 4rpx solid #232323;
	border-radius: 10rpx;
	background: #000000;
	margin: 18rpx;
	padding: 8rpx;
}

.introduce .item {
	height: 40rpx;
	line-height: 40rpx;
	font-weight: bolder;
	padding: 4rpx;
	margin: 4rpx;
	border: 1rpx gray solid;
	border-radius: 4rpx;
	font-size: 42rpx;
}

.save {
	position: absolute;
	top: 25rpx;
	right: 25rpx;
}
</style>
