type WhammyMode = 0 | 1 | 2;
type OutputCommand = 0 | 1 | 2;

type ListType = (string | null)[];

type JQueryEventHandler = (event: JQuery.TriggeredEvent) => void;

class UIHandler {
	index: number = 0;
	base: number = 0;
	mode: WhammyMode = 0;
	outputCommand: OutputCommand = 1;
	outputId: string = 'output-1';
	outputChannel: number = 0;
	midiOutputs: MIDIOutput[] = [];

	list_0: ListType = ['-OCT,+OCT', '-5TH,-4TH', '-4TH,-3RD', '+5TH,+7TH', '+5TH,+6TH', '+4TH,+5TH', '+3RD,+4TH', '+♭3RD,+3RD', '+2ND,+3RD', null, 'SHALLOW'];
	list_1: ListType = ['+2 OCT', '+ OCT', '+ 5TH', '+ 4TH', '- 2ND', '- 4TH', '- 5TH', '- OCT', '- 2OCT', 'DIVE BOMB', 'DEEP'];
	list_dt_0: ListType = ['1', '2', '3', '4', '5', '6', '7', '<tiny><br><br><sup>OCT</sup><br></tiny>', '<tiny><sup>OCT</sup><br>&#43;<br><sup>DRY</sup></tiny>'];
	list_dt_1: ListType = ['1', '2', '3', '4', '5', '6', '7', '<tiny><sup>OCT</sup><br><br></tiny><br>', '<tiny><sup>OCT</sup><br>&#43;<br><sup>DRY</sup><br><br></tiny>'];
	midi: MIDI;

	constructor() {
		var _this = this;
		this.midi = new MIDI();
		this.midi.init(() => {
			this.midiOutputs = this.midi.getOutputs();
			this.load()
			this.fillMidiOutputs()
			this.fillMidiChannels()
			this.fillMidiCommands()

			this.fillColumn(this.list_0, "itemA", $('#column_h'), function (a) { return 20 - a; })
			this.fillColumn(this.list_1, "itemB", $('#column_c'), function (b) { return b; }, 'b')
			this.fill_dt(this.list_dt_0, "itemC", $('#row_up'), function (a) { return a; })
			this.fill_dt(this.list_dt_1, "itemD", $('#row_down'), function (b) { return b; }, 'b')

			this.setupEventListeners()
			this.update()
		});

	}

	setupEventListeners(): void {
		const _this = this;
		$('#btnBase_0').on('click', () => { this.base = 0; this.update(); });
		$('#btnBase_1').on('click', () => { this.base = 1; this.update(); });
		$('#btnCLASSIC').on('click', () => { this.mode = 0; this.update(); });
		$('#btnCHORDS').on('click', () => { this.mode = 1; this.update(); });
		$('#btnDT').on('click', () => { this.mode = 2; this.update(); });
		$('#btnMUTE').on('click', () => { this.outputCommand = 0; this.update(); });
		$('#btnACTIVE').on('click', () => { this.outputCommand = 1; this.update(); });
		$('#btnBYPASS').on('click', () => { this.outputCommand = 2; this.update(); });
		$('#panel').on('mousewheel', (e: any) => {
			this.index += Math.sign(e.originalEvent.wheelDelta);
			this.update();
		});
		/*$(pnlBase).bind('mousewheel', function (e) {
			if (e.originalEvent.wheelDelta > 0)
				_this.base = 0;
			else
				_this.base = 1;
			_this.update();
		});
		$(pnlMode).bind('mousewheel', function (e) {
			_this.mode -= Math.sign(e.originalEvent.wheelDelta);
			_this.mode = Math.min(_this.mode, 2);
			_this.mode = Math.max(_this.mode, 0);
			_this.update();
		});
		$(pnlCommand).bind('mousewheel', function (e) {
			_this.outputCommand -= Math.sign(e.originalEvent.wheelDelta);
			_this.outputCommand = Math.min(_this.outputCommand, 2);
			_this.outputCommand = Math.max(_this.outputCommand, 0);
			_this.update();
		});
		$(pnlOutput).bind('mousewheel', function (e) {
			_this.outputIndex -= Math.sign(e.originalEvent.wheelDelta);
			_this.outputIndex = Math.min(_this.outputIndex, _this.midiOutputs.length - 1);
			_this.outputIndex = Math.max(_this.outputIndex, 0);
			_this.update();
		});*/
		$(function () {
			_this.resize()
		});
	}

	fillMidiOutputs(): void {
		const outputOptions = $('#pnlOutput>.optionContainer');
		outputOptions.empty();
		this.midiOutputs.forEach((output, i) => {
			$('<div>')
				.prop('id', output.id)
				.addClass('output_option option')
				//.data('output-index', i)
				.html(output.name)
				.css({ textAlign: 'left', width: '190px' })
				.on('click', () => {
					//this.outputIndex = i;
					this.outputId = output.id;
					this.update();
				})
				.appendTo(outputOptions);
		});
	}

	fillMidiChannels(): void {
		const pnlChannel = $('#pnlChannel>.optionContainer');
		pnlChannel.empty();
		for (let i = 0; i < 16; i++) {
			$('<div>')
				.addClass('option')
				.attr('midi-channel', i)
				.html(`${i + 1}`)
				.css({ textAlign: 'left', width: '55px' })
				.on('click', () => {
					this.outputChannel = i;
					this.update();
				})
				.appendTo(pnlChannel);
		}
	}

	fillMidiCommands(): void {
		const commands = ['MUTE', 'ACTIVE', 'BYPASS'];
		const pnlCommand = $('#pnlCommand>.optionContainer');
		pnlCommand.empty();
		commands.forEach((command, i) => {
			$('<div>')
				.addClass('option')
				.html(command)
				.attr('command', i)
				//.css({ textAlign: 'left', width: '190px' })
				.on('click', () => {
					this.outputCommand = i as OutputCommand;
					this.update();
				})
				.appendTo(pnlCommand);
		});
	}

	update(): void {
		$('#panel').show();
		$('#pnlWH').toggle(this.mode !== 2);
		$('#pnlDT').toggle(this.mode === 2);
		this.save();

		const n = this.mode === 2 ? 18 : 21;
		this.index = (n + this.index) % n;
		this.mode = ((3 + this.mode) % 3) as WhammyMode;

		$('img.led').attr('src', 'resources/images/led-off.svg');
		$(`img.led[name='${this.index}']`).attr('src', 'resources/images/led-on.svg');

		const offset = this.base + (this.mode === 0 ? 0 : 1) * 42;
		const valueOn = this.index + offset;
		const valueOff = valueOn + n;

		if (MIDI !== undefined && this.midiOutputs.length > 0) {
			this.sendPC()
			//const output = this.getCurrentMidiOutput();
			//const channel = MIDI.AllChannels[this.outputChannel];		
			//if (this.outputCommand === 1) output.send([channel, valueOn]);
			//if (this.outputCommand === 2) output.send([channel, valueOff]);
		}

		this.updateDisplay(valueOn, valueOff);
		this.updateSelectionClasses();
	}


	//write a new function this.sendMidiMessage(channel, valueOn, valueOff) and console log the values
	sendPC(): void {
		const output = this.getCurrentMidiOutput();
		const channel = MIDI.AllChannels[this.outputChannel];
		const valueOn = this.index + this.base + (this.mode === 0 ? 0 : 1) * 42;
		const valueOff = valueOn + (this.mode === 2 ? 18 : 21);
		var command = 0
		switch (this.outputCommand) {
			case 1: command = valueOn; break;
			case 2: command = valueOff; break
			default: return;
		}
		output.send([channel, command]);
		console.log(`Output: '${output.name}' Channel: ${this.outputChannel + 1} PC: ${command}`);
	}


	getCurrentMidiOutput() {
		//return this.midiOutputs[this.outputIndex % this.midiOutputs.length];
		return this.midiOutputs.find(output => output.id === this.outputId)
	}

	updateDisplay(valueOn: number, valueOff: number): void {
		$('#digit_a_1').attr('src', `../resources/images/seven-segments/${Math.floor(valueOn / 10)}.svg`);
		$('#digit_a_0').attr('src', `../resources/images/seven-segments/${valueOn % 10}.svg`);
		$('#digit_b_1').attr('src', `../resources/images/seven-segments/${Math.floor(valueOff / 10)}.svg`);
		$('#digit_b_0').attr('src', `../resources/images/seven-segments/${valueOff % 10}.svg`);
	}

	updateSelectionClasses(): void {
		$('.output_option').removeClass('selected');
		$(`#${this.outputId}`).addClass('selected');

		$(`#pnlChannel>.optionContainer>.option`).removeClass('selected');
		$(`#pnlChannel>.optionContainer>.option[midi-channel=${this.outputChannel}]`).addClass('selected');

		$(`#pnlCommand>.optionContainer>.option`).removeClass('selected');
		$(`#pnlCommand>.optionContainer>.option[command=${this.outputCommand}]`).addClass('selected');

		$('#btnBase_0').toggleClass('selected', this.base === 0);
		$('#btnBase_1').toggleClass('selected', this.base === 1);
		$('#btnCLASSIC').toggleClass('selected', this.mode === 0);
		$('#btnCHORDS').toggleClass('selected', this.mode === 1);
		$('#btnDT').toggleClass('selected', this.mode === 2);
	}

	resize(): void {
		$(`div#${this.outputId}`).each(function () { this.scrollIntoView(); });
		$(`#pnlChannel>.optionContainer>.option[midi-channel=${this.outputChannel}]`).each(function () { this.scrollIntoView(); });
	}

	load(): void {
		this.index = Number(localStorage.getItem('index')) || this.index;
		this.base = Number(localStorage.getItem('base')) || this.base;
		this.mode = (Number(localStorage.getItem('mode')) || this.mode) as WhammyMode;
		this.outputCommand = (Number(localStorage.getItem('outputCommand')) || this.outputCommand) as OutputCommand;
		this.outputId = localStorage.getItem('outputId') || this.outputId;
		this.outputChannel = Number.parseInt(localStorage.getItem('outputChannel')) || this.outputChannel;
	}

	save(): void {
		localStorage.setItem('index', this.index.toString());
		localStorage.setItem('base', this.base.toString());
		localStorage.setItem('mode', this.mode.toString());
		localStorage.setItem('outputCommand', this.outputCommand.toString());
		localStorage.setItem('outputId', this.outputId);
		localStorage.setItem('outputChannel', this.outputChannel.toString());
	}

	fill_dt(list: ListType, cssClass: string, target: JQuery, getName: (index: number) => number, dir?: string): void {
		const _tr = $('<tr>').appendTo(target);
		_tr.css('vertical-align', dir === 'b' ? 'top' : 'bottom');
		list.forEach((item, i) => {
			let _index = getName(i);
			if (dir === 'b') _index = 17 - _index;
			const _td = $('<td>').appendTo(_tr);
			const table = $('<table>').appendTo(_td);
			if (i >= 7) table.css({ 'height': '40px' })
			table.attr('index', _index);
			table.addClass(cssClass);
			table.on('click', () => {
				this.index = Number(table.attr('index'));
				this.update();
			});

			const m = 7;
			let margin = i * m;
			if (i === 8) margin = 7 * m;
			table.css(dir === 'b' ? 'margin-top' : 'margin-bottom', `${margin}px`);

			const tr0 = $('<tr>').appendTo(table);
			const tr1 = $('<tr>').appendTo(table);
			const td0 = $('<td>').appendTo(tr0);
			tr1.css('vertical-align', 'top');
			const td1 = $('<td>').appendTo(tr1);
			const img = this.newLED(_index);
			const label = $('<label>').html(item || '');
			if (dir === 'b') {
				td1.append(label);
				td0.append(img);
			} else {
				td0.append(label);//<<
				td1.append(img);
			}
		});
	}

	fillColumn(list: ListType, cssClass: string, target: JQuery, getName: (index: number) => number, dir?: string): void {
		let skipped = 0;
		list.forEach((item, i) => {
			const _index = getName(i - skipped);
			const div = $('<div>').appendTo(target);
			const table = $('<table>').addClass('noborder').appendTo(div);
			const tr = $('<tr>').appendTo(table);
			if (!item) {
				skipped++;
				tr.append($('<td style="height:20px"></td>'));
				return;
			}
			div.addClass(cssClass);
			div.attr('index', _index);
			div.on('click', () => {
				this.index = Number(div.attr('index'));
				this.update();
			})
			const td0 = $('<td>').appendTo(tr);
			const img = this.newLED(_index);
			img.appendTo(td0);
			const td1 = $('<td>').css({ 'text-align': 'left' }).appendTo(tr);
			const label = $('<label>').appendTo(td1);
			const text = item.replace(/\+/g, '▲').replace(/-/g, '▼');
			text.split(',').forEach((splitItem, j, arr) => {
				const span = $('<span>').text(splitItem).appendTo(label);
				span.addClass('whammyText');
				span.css({
					color: j === 0 && arr.length === 2 ? '#c01b15' : ''
				});
			});
			if (dir === 'b') td0.appendTo(tr);
		});
	}

	newLED(name: number): JQuery {
		return $('<img>')
			.addClass('led')
			.prop('src', 'resources/images/led-off.svg')
			.attr('name', name.toString());
	}
}
