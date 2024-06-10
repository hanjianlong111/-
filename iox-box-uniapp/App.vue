<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
@import url('common.css');
@font-face {
	font-family: 'myfont';
	src: url('./static/font/DS-DIGI-1.ttf');
}
</style>
