var handler = {
	src: 'blackfolder',
	icons: [],
	getFileExtension: function () {
		switch (this.src) {
			case 'blackfolder':
				return '.ico';
			case 'daw':
			default:
				return '.png';
		}
	},
	init: function (src, icons) {
		let _this = this;
		_this.src = src;
		_this.icons = icons;
		//----------- Sort icons alphabetically
		_this.icons.sort(function (a, b) {
			let nameA = a.filename.toUpperCase(); // ignore upper and lowercase
			let nameB = b.filename.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			// names must be equal
			return 0;
		});
		//----------- Display icons
		for (var i = 0; i < _this.icons.length; i++) {
			let item = _this.icons[i];
			let content = $('#content');
			let url = `resources/icons-${src}/${item.filename}${_this.getFileExtension()}`;

			let img = $('<img>')
				.attr('src', url)
				.css({ 'width': '128px' });
			let s = item.description || item.filename.toCamelCase();
			let text = $('<div>').html(s);
			let imgContainer = $('<div>').addClass('img-container');
			imgContainer.append(img);

			let element = $('<div>').appendTo(content)
				.append(imgContainer)
				.append(text)
				.addClass('icon-thumbnail')
				.attr('download_url', url)
				.attr('download_filename', item.filename + _this.getFileExtension())
				.on('click', function () {
					var url = $(this).attr('download_url');
					var filename = $(this).attr('download_filename');
					_this.download(url, filename);
					//console.log(download_url);
				});
		}
	},
	download: function (url, filename) {
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		link.click();
	},
};