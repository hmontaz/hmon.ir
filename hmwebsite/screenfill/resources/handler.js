var ScreenFiller = {
	init: function () {
		var _this = this;
		$(document).dblclick(function () {
			console.log('click');
			_this.toggleFullscreen();
		});


	},
	toggleFullscreen: function () {
		if (document.fullscreen)
			this.exitFullscreen();
		else
			this.enterFullscreen();
	},
	enterFullscreen: function () {
		var elem = document.body;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
			return;
		}
		if (elem.webkitRequestFullscreen) {
			/* Safari */
			elem.webkitRequestFullscreen();
			return;
		}
		if (elem.msRequestFullscreen) {
			/* IE11 */
			elem.msRequestFullscreen();
			return;
		}
	},
	exitFullscreen: function () {
		document.exitFullscreen();
	},

};



