const tools = {
	// 格式化点赞总数
	formatLikes: function(num) {
		num = num.toString()
		var len = num.length
		if (len > 3 && len <= 4) {
			var p1 = num.slice(0, -3)
			var p2 = num.slice(-3, -2)
			return p1 + '.' + p2 + 'k'
		} else if (len > 4) {
			var p1 = num.slice(0, -4)
			var p2 = num.slice(-4, -3)
			return p1 + '.' + p2 + 'w'
		} else {
			return num
		}
	},
	// 比较日期
	comparDate: function(date) {
		let now = Date.now()
		const pass = new Date(date)
		const diff = now - pass
		if (diff >= 1000 && diff < 60000) {
			return Math.floor(diff / 1000) + '秒钟'
		} else if (diff >= 60000 && diff < 3600000) {
			return Math.floor(diff / 60000) + '分钟'
		} else if (diff > 3600000 && diff < 86400000) {
			return Math.floor(diff / 3600000) + '小时'
		} else if (diff > 86400000 && diff < 604800000) {
			return Math.floor(diff / 86400000) + '天'
		} else if (diff > 604800000) {
			return Math.floor(diff / 604800000) + '周'
		} else {
			return 1 + '秒钟'
		}
	},
	// 格式化时间
	formatTime: function(date) {
		const week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

		function addZero(str) {
			return str.toString().length > 1 ? str : '0' + str
		}
		date = new Date(date)
		const now = Date.now()

		let diff = now - date

		if (diff >= 1000 && diff < 86400000) {
			// 24小时内
			return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
		} else if (diff >= 86400000 && diff < 172800000) {
			// 昨天
			return `昨天 ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
		} else if (diff >= 172800000 && diff < 604800000) {
			// 一周内
			return `${week[date.getDay()]} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
		} else if (diff >= 604800000) {
			return `${date.getMonth()}月${date.getDate()}日 ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
		}
	}
}

export default tools
