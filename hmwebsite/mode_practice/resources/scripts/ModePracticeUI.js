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
        this.tonics = [...new Set(this.options.data.map(a => a.tonic))].sort();
        this.modes = [...new Set(this.options.data.map(a => a.mode))];
        this.player = o.player;
        this.shuffleEnabled = false;
        this.showPlayer = false;
        this.muted = false;
        this.ui = {
            player: $('#player').hide(),
            title: $('#div_title'),
            tonics: $('#list_tonics'),
            modes: $('#list_modes'),
            actionToggleShuffle: $('#action-toggle-shuffle'),
            actionTogglePlayer: $('#action-toggle-player'),
            actionPlay: $('#action-play').hide(),
            actionPause: $('#action-pause').hide(),
            actionStop: $('#action-stop').hide(),
        };
        $(document).on('keypress', function (e) {
            if (e.which == 32)
                _this.togglePlayVideo();
        });
        this.fillTonics();
    }
    changeVideo() { this.loadVideo(this.data[0]); }
    loadVideo(video) {
        //player.cueVideoById('NXCaBnzSTyo', 0)
        this.player.loadVideoById(video.videoId, video.startTime || 0);
        this.player.setVolume(video.volume || 80);
        this.ui.title.html(`${video.tonic} ${video.mode}`);
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
        if (this.shuffleEnabled)
            modes = this.shuffle(modes);
        //console.log(modes)
        for (let i = 0; i < modes.length; i++) {
            let item = modes[i];
            //if (item.tonic != this.currentTonic) continue;
            let element = $('<li>')
                .addClass('option_button')
                .data('video_index', item.index)
                .on('click', function () {
                let index = $(this).data('video_index');
                _this.loadVideo(_this.data[index]);
                //console.log()
            })
                .html(/*'▶ ' +*/ item.tonic + ' ' + item.mode);
            target.append(element);
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
        let state = this.player.getPlayerState();
        if (state == 1)
            this.pauseVideo();
        else
            this.playVideo();
    }
    updateUIState() {
        let state = this.player.getPlayerState();
        //console.log(state)
        //this.ui.actionPlay.toggleClass('active-red', state == 1)
        //this.ui.actionPause.toggleClass('active-red', state == 2)
        //this.ui.actionStop.toggleClass('active-red', state == 5)
        this.ui.actionToggleShuffle.toggleClass('active-green', this.shuffleEnabled);
        this.ui.player.toggle(this.showPlayer);
        this.ui.actionTogglePlayer.toggleClass('active-green', this.showPlayer);
        this.ui.actionPlay.toggle(state != 1);
        this.ui.actionPause.toggle(state == 1);
        this.ui.actionStop.toggle(state == 1 || state == 2);
    }
    toggleShuffle() {
        this.shuffleEnabled = !this.shuffleEnabled;
        this.updateUIState();
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
    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }
}
//# sourceMappingURL=ModePracticeUI.js.map