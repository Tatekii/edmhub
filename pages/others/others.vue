<template>
	<view>
		<uni-popup v-if="from === 'find'" ref="popup" type="dialog">
			<uni-popup-dialog type="info" mode="input" title="你会怎么打招呼" maxlength="35" placeholder="35字引起对方的注意" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<view v-if="from==='friendReq'" class="reqButton">
				<button @tap="acceptReq" :disabled="!reqIng" type="primary">🤝你好呀</button>
			  <button @tap="refuseReq" :disabled="!reqIng" type="warn">👋拒绝</button>
				 <button @tap="sendMsg" :disabled="reqIng" type="primary">🎉发消息</button>
		</view>
		<userCenter :userInfo="peopleInfo" type="other" v-on:likeU="handleLike">
			<template #editor>
				<view v-if="from === 'find'">
					<view v-if="!urFriend" class="editInfo stranger" @tap="addFriend">
						<uni-icons type="personadd" size="17" color="hotpink"></uni-icons>
						<text>打个招呼</text>
					</view>
					<view v-if="urFriend" class="editInfo friend" @tap="delFriend">
						<uni-icons type="minus" size="17" color="red"></uni-icons>
						<text>断绝关系</text>
					</view>
				</view>
			</template>
		</userCenter>
	</view>
</template>

<script>
const db = wx.cloud.database();
import { mapState,mapMutations } from 'vuex';
import uniPopupDialog from '../../components/uni-popup/uni-popup-dialog.vue';
export default {
	components: {
		uniPopupDialog
	},
	data() {
		return {
			peopleInfo: {},
			urFriend: false,
			from: '',
			reqIng:true
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['update']),
		acceptReq(){
			uni.showLoading({
				title:'请稍后'
			})
			console.log('接受')
			wx.cloud.callFunction({
				name:'acceptReq',
				data:{
					openid:this.peopleInfo._openid
				}
			}).then(res=>{
				console.log(res)
					// 更新本地friendlist
					// this.update({
					// 	friend:newList
					// })
					this.reqIng=false
			}).then(()=>{
				uni.hideLoading()
			})
		},
		refuseReq(){
			console.log('拒绝')
			wx.cloud.callFunction({
				name:'refuseReq',
				data:{
					openid:this.peopleInfo._openid
				}
			}).then(res=>{
				console.log(res)
				if(res.result.stats.updated===1){
					uni.navigateBack()
				}
			})
		},
		close(done) {
			done();
		},
		confirm(done, value) {
			console.log(value);
			if (!value) {
				uni.showToast({
					title: '必须带上一句话哦'
				});
				return;
			}
			wx.cloud
				.callFunction({
					name: 'addFriend',
					data: {
						_openid: this.peopleInfo._openid,
						words: value
					}
				})
				.then(res => {
					console.log(res);
					if (res.result === 'requested') {
						uni.showToast({
							title: '已经点过了哦',
							icon: 'none',
							duration: 2000
						});
						return;
					}

					uni.showToast({
						title: '请耐心等待对方的回应吧',
						icon: 'none'
					});
				});
			done();
		},
		handleLike() {
			if (!this.userInfo._openid) {
				uni.showToast({
					title: '您还没有登录',
					duration: 2000,
					icon: 'none'
				});
				return;
			}
			console.log('处理点赞');
			wx.cloud
				.callFunction({
					name: 'addLike',
					data: {
						target: this.peopleInfo._openid
					}
				})
				.then(res => {
					console.log(res);
					if (res.result === 'already') {
						uni.showToast({
							title: '你已经like过他了',
							icon: 'none'
						});
					}
					this.peopleInfo.like++;
				});
		},

		addFriend() {
			if (!this.userInfo._openid) {
				uni.showToast({
					title: '您还没有登录',
					duration: 2000,
					icon: 'none'
				});
				return;
			}
			console.log(`向${this.peopleInfo._openid}发送好友申请`);
			this.$refs.popup.open();
		},
		delFriend() {
			uni.showModal({
				content:'确认移除好友吗？',
				cancelText:'再想想',
				confirmText:'拜拜咯',
				confirmColor:'red',	
				success: () => {
						console.log(`删除${this.peopleInfo.nickName}`)
						wx.cloud.callFunction({
							name:'delFriend',
							data:{
								openid:this.peopleInfo._openid
							}
						}).then(res=>{
							console.log(res.result.stats.updated)
							if(res.result.stats.updated===1){
								console.log('成功删除')
							}else{
								uni.showToast({
									icon:'info',
									title:'服务器忙请稍后再试'
								})
							}
						})
				}
			})
		}
	},
	onLoad(options) {
		console.log(`由页面${options.from}进入${options.openid}`);
		this.from = options.from;
		// 判断从find点击进来还是打招呼点进来

		uni.showLoading({
			title: '加载中'
		});
		const openid = options.openid;
		db.collection('users')
			.where({
				_openid: openid
			})
			.get()
			.then(res => {
				this.peopleInfo = res.data[0];
				uni.setNavigationBarTitle({
					title:this.peopleInfo.nickName+'的主页'
				})
				if (this.userInfo.friend.includes(this.peopleInfo._openid)) {
					this.urFriend = true;
				}
			})
			.catch(err => {
				console.log(err);
			})
			.then(() => {
				uni.hideLoading();
			});
	}
};
</script>

<style scoped>
	.reqButton{
		display: flex;
		margin: 4rpx 0;
	}
	.reqButton button{
		border: 8rpx solid #000;
		display: inline-block;
		flex: 1;
		border-radius: 30rpx;
	}
.editInfo.stranger {
	color: pink;
	border: 1rpx solid hotpink;
	border-radius: 8rpx;
	padding: 8rpx;
	margin-right: 20rpx;
	background-color: #232323;
}
.editInfo.friend {
	color: red;
	border: 1rpx solid red;
	border-radius: 8rpx;
	padding: 8rpx;
	margin-right: 20rpx;
	background-color: #232323;
}
</style>
