var handler = {
	init: function () {
		var _this = this;
		for (var i = 0; i < icons_list.length; i++) {
			var item = icons_list[i];
			var content = $('#content');
			var url = 'resources/icons/' + item.filename + '.ico';


			var img = $('<img>')
				.attr('src', url)
				.css({ 'width': '128px' });
			var s = item.description || item.filename.toCamelCase();
			var text = $('<div>').html(s);

			var element = $('<dvi>').appendTo(content)
				.append(img)
				.append(text)
				.addClass('icon-thumbnail')
				.attr('download_url', url)
				.attr('download_filename', item.filename + '.ico')
				.click(function () {
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