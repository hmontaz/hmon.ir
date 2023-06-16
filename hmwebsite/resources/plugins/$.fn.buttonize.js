/*
 Created by Hossein Montazeri
 email: hm.webmaster@gmail.com
 
 */

(function ($) {
	$.fn.buttonize = function (options) {
		var target = this;
		var options = target.children();
		var settings = $.extend({
			// These are the defaults.
			class: 'buttonizer',
			option_class: 'option',
		}, options);
		//console.log(options);
		var dummy = $('<div>').addClass(settings.class).appendTo(target.parent());
		var dummy_options = [];
		var build_dummy = function () {
			dummy.html('');
			for (var i = 0; i < options.length; i++) {
				var option = $(options[i]);
				var text = option.html();
				var value = option.attr('value');
				var element = $('<span>')
					.attr('buttonize-index', i)
					.addClass(settings.option_class)
					.toggleClass('selected', option.prop('selected') == true)
					.appendTo(dummy)
					.click(function () {
						var index = $(this).attr('buttonize-index');
						var option = $(options[index]);
						var selected = option.prop('selected');
						option.prop('selected', !selected);
						//$(this).toggleClass('selected');
						target.change();
					})
					.html(text);
				dummy_options.push(element);
			}
			//update_dummy();
		};
		var update_dummy = function () {
			for (var i = 0; i < dummy_options.length; i++) {
				var element = dummy_options[i];
				var index = element.attr('buttonize-index');
				var option = $(options[index]);
				var selected = option.prop('selected');
				element.toggleClass('selected', selected);
			}
		};
		target.change(function () { update_dummy(); }).hide();
		build_dummy();
		return this;
	};
}(jQuery));
