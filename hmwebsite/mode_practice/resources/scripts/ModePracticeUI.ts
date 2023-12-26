type YTPlayer = {
	playVideo()
	stopVideo()
	pauseVideo()
	loadVideoById(videoId: string, startTime: number)
	getPlayerState()
	getCurrentTime()
	setVolume(volume: number)
}
class ModePracticeUI {
	data: ModeData[]
	tonics: any[]
	modes: any[]
	player: YTPlayer
	options: ModePracticeOptions
	currentTonic: null
	shuffleEnabled: boolean
	ui: {
		//container: any
	}
	constructor(o) {
		const defaults = {
			data: []
		} as ModePracticeOptions
		this.options = { ...defaults, ...o };
		//-----------		
		this.initialize(this.options)
	}
	initialize(o: ModePracticeOptions) {
		let _this = this;
		this.data = o.data
		this.tonics = [...new Set(this.options.data.map(a => a.tonic))].sort();
		this.modes = [...new Set(this.options.data.map(a => a.mode))];
		this.player = o.player;
		this.shuffleEnabled = false
		this.ui = {
			//container: o.container,
		}
		$(document).on('keypress', function (e) {
			if (e.which == 32) _this.togglePlayVideo()
		})
		this.fillTonics()
	}
	//changeVideo() { loadVideo(this.data[index++]) }
	changeVideo() { this.loadVideo(this.data[0]) }
	loadVideo(video: ModeData) {
		//player.cueVideoById('NXCaBnzSTyo', 0)
		this.player.loadVideoById(video.videoId, video.startTime || 0)
		this.player.setVolume(video.volume || 80);
		$('#div_title').html(`${video.tonic} ${video.mode}`)
		//player.playVideo()
	}
	fillTonics() {
		let _this = this
		let target = $('#list_tonics').empty()
		for (let i = 0; i < this.tonics.length; i++) {
			let tonic = this.tonics[i]
			let element = $('<li>')
				.addClass('option_button')
				.data('tonic', tonic)
				.on('click', function () {
					_this.currentTonic = $(this).data('tonic')
					_this.fillModes()
				})
				.html(this.tonics[i])
			target.append(element)
		}
	}
	fillModes() {
		let _this = this
		let target = $('#list_modes').empty()
		let modes = this.data.filter(a => a.tonic == this.currentTonic);
		if (this.shuffleEnabled) modes = this.shuffle(modes)
		//console.log(modes)
		for (let i = 0; i < modes.length; i++) {
			let item = modes[i]
			//if (item.tonic != this.currentTonic) continue;
			let element = $('<li>')
				.addClass('option_button')
				.data('video_index', item.index)
				.on('click', function () {
					let index = $(this).data('video_index')
					_this.loadVideo(_this.data[index])
					//console.log()
				})
				.html(/*'▶ ' +*/ item.tonic + ' ' + item.mode)
			target.append(element)
		}
	}
	playVideo() {
		this.player.playVideo();
	}
	stopVideo() {
		this.player.stopVideo();
	}
	pauseVideo() {
		this.player.pauseVideo();
	}
	togglePlayVideo() {
		let state = this.player.getPlayerState()
		if (state == 1)
			this.pauseVideo()
		else
			this.playVideo()
	}
	updateUIState() {
		let state = this.player.getPlayerState()
		//console.log(state)
		//$('#action-play').toggleClass('active-red', state == 1)
		//$('#action-pause').toggleClass('active-red', state == 2)
		//$('#action-stop').toggleClass('active-red', state == 5)

		$('#action-toggle-shuffle').toggleClass('active-green', this.shuffleEnabled)

		$('#action-play').toggle(state != 1)
		$('#action-pause').toggle(state == 1)
		$('#action-stop').toggle(state == 1 || state == 2)
	}
	toggleShuffle() {
		this.shuffleEnabled = !this.shuffleEnabled;
		this.updateUIState()
		this.fillModes()
	}
	shuffle(array) {
		let currentIndex = array.length, randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex > 0) {

			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}

		return array;
	}
}