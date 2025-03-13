const BlankVideo = {
    tonic: '',
    mode: '',
    volume: 80,
    videoId: '8tPnX7OPo0Q',
    isBlank: true
};
class ModePracticeUI {
    constructor(o) {
        const defaults = {
            data: []
        };
        this.options = Object.assign(Object.assign({}, defaults), o);
        //-----------		
        this.initialize(this.options);
    }
    initialize(o) {
        let _this = this;
        this.data = o.data;
        this.originalData = [...o.data];
        this.shuffledData = this.shuffle(o.data);
        this.currentMode = BlankVideo;
        this.touchedIds = [];
        this.tonics = [...new Set(this.options.data.map(a => a.tonic))].sort();
        this.modes = [...new Set(this.options.data.map(a => a.mode))];
        this.player = o.player;
        this.shuffleEnabled = false;
        this.showPlayer = false;
        this.muted = false;
        this.minVolume = Math.min(...this.data.map(o => o.volume));
        this.maxVolume = Math.max(...this.data.map(o => o.volume));
        this.ui = {
            player: $('#player').hide(),
            title: $('#div_title'),
            tonics: $('#list_tonics'),
            modes: $('#list_modes'),
            controlToggleShuffle: $('#control-toggle-shuffle').prop('title', 'Shuffle Modes'),
            controlTogglePlayer: $('#control-toggle-player').prop('title', 'Toggle Player'),
            controlPlay: $('#control-play').prop('title', 'Play').hide(),
            controlPause: $('#control-pause').prop('title', 'Pause').hide(),
            controlStop: $('#control-stop').prop('title', 'Stop').hide(),
            controlVolume: $('#control-volume').val(80).on('input', function (e) { _this.setVolume(); }).hide(),
        };
        $(document).on('keypress', function (e) {
            if (e.which == 32)
                _this.togglePlayVideo();
        });
        $(document).on('mousewheel', function (e) {
            var current = parseInt(_this.ui.controlVolume.val());
            var value = current + Math.sign(e.originalEvent.wheelDelta);
            if (value > 100)
                value = 100;
            if (value < 0)
                value = 0;
            _this.ui.controlVolume.val(value);
            _this.setVolume();
        });
        this.fillTonics();
        //this.loadVideo(BlankVideo)
    }
    changeVideo() {
        this.loadVideo(this.data[0]);
    }
    loadVideo(video) {
        video = video || this.currentMode;
        this.currentMode = video;
        //player.cueVideoById('NXCaBnzSTyo', 0)
        this.player.loadVideoById(video.videoId, video.startTime);
        //this.player.setVolume(video.volume || 80);
        this.ui.title.html(`${video.tonic} ${video.mode}`);
        this.setVolume();
    }
    setVolume(volume) {
        //console.log(this.currentMode)
        //10^(dB/10)
        volume = volume || Number.parseInt(this.ui.controlVolume.val());
        var actualVolume = this.currentMode.volume * volume / this.maxVolume;
        console.log(`volume: ${volume} actualVolume: ${actualVolume}`);
        this.player.setVolume(actualVolume);
    }
    fillTonics() {
        let _this = this;
        let target = this.ui.tonics.empty();
        for (let i = 0; i < this.tonics.length; i++) {
            let tonic = this.tonics[i];
            let element = $('<li>')
                .addClass('option_button')
                .data('tonic', tonic)
                .on('click', function () {
                _this.currentTonic = $(this).data('tonic');
                _this.fillModes();
            })
                .html(this.tonics[i]);
            target.append(element);
        }
    }
    fillModes() {
        let _this = this;
        let target = this.ui.modes.empty();
        let modes = this.data.filter(a => a.tonic == this.currentTonic);
        //console.log(modes)
        for (let i = 0; i < modes.length; i++) {
            let item = modes[i];
            //if (item.tonic != this.currentTonic) continue;
            let element = $('<li>')
                .addClass('option_button')
                .data('videoIndex', item.index)
                .on('click', function () {
                let id = $(this).data('videoIndex');
                _this.currentMode = item;
                _this.touchedIds.push(id);
                let o = _this.data.filter(a => a.index == id)[0];
                _this.loadVideo(o);
                //console.log()
            })
                .html('▶ ' + /*item.tonic + ' ' +*/ item.mode);
            target.append(element);
        }
        this.updateUIState();
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
        let state = this.player.getPlayerState();
        if (state == 1)
            this.pauseVideo();
        else
            this.playVideo();
    }
    updateUIState() {
        let state = this.player.getPlayerState();
        let _this = this;
        //console.log(state)
        //this.ui.actionPlay.toggleClass('active-red', state == 1)
        //this.ui.actionPause.toggleClass('active-red', state == 2)
        //this.ui.actionStop.toggleClass('active-red', state == 5)
        this.ui.controlToggleShuffle.toggleClass('active-green', this.shuffleEnabled);
        this.ui.player.toggle(this.showPlayer);
        this.ui.controlTogglePlayer.toggleClass('active-green', this.showPlayer);
        this.ui.controlPlay.toggle(state != 1 && !this.currentMode.isBlank);
        this.ui.controlPause.toggle(state == 1);
        this.ui.controlStop.toggle(state == 1 || state == 2);
        this.ui.controlVolume.show();
        this.ui.tonics.children().each(function () {
            let element = $(this);
            element.toggleClass('selected', element.data('tonic') == _this.currentTonic);
        });
        this.ui.modes.children().each(function () {
            let element = $(this);
            let videoIndex = element.data('videoIndex');
            element.toggleClass('selected', videoIndex == _this.currentMode.index);
            element.toggleClass('touched', _this.touchedIds.indexOf(videoIndex) != -1);
        });
    }
    toggleShuffle() {
        this.shuffleEnabled = !this.shuffleEnabled;
        this.data = this.options.data;
        if (this.shuffleEnabled) {
            this.data = this.shuffledData;
        }
        this.fillModes();
    }
    togglePlayer() {
        this.showPlayer = !this.showPlayer;
        this.updateUIState();
    }
    toggleMute() {
        this.muted = !this.muted;
        this.updateUIState();
    }
    shuffle(src) {
        let array = [...src];
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }
}
//# sourceMappingURL=ModePracticeUI.js.map