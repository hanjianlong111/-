export function cache(key, value = null) {
	const timestamp = Date.parse(new Date()) / 1000;
	if (!key) {
		return;
	}
	if (value === null) {
		const val = uni.getStorageSync(key);
		const tmp = val.split("|");
		if (!tmp[1] || timestamp >= tmp[1]) {
			uni.removeStorageSync(key);
			return "";
		} else {
			return tmp[0];
		}
	} else {
		const expire = timestamp + 3600 * 24 * 7;
		value = `${value}|${expire}`;
		uni.setStorageSync(key, value);
	}
}

export function getCache(key) {
	return uni.getStorageSync(key)
}

export function setCache(key, value) {
	return uni.setStorageSync(key, value)
}