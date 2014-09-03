'use strict';

module.exports = function() {

	$(document).ready(function() {

		var $html = $('html');
		var $masthead = $('#masthead');
		var $title = $masthead.find('h1');
		var titleOffset = $title.offset().top;
		var windowHeight = $(window).height();

		$(window).resize(function() {
			windowHeight = $(window).height();
		});

		$(window).scroll(function() {

			var scrollTop = $(window).scrollTop();

			if(scrollTop >= titleOffset) {
				$masthead.addClass('title-fixed');
				$title.addClass('fixed');
			} else {
				$masthead.removeClass('title-fixed');
				$title.removeClass('fixed');
			}

			if(scrollTop >= windowHeight - 60) {
				$html.css({'padding-top': windowHeight});
				$masthead.addClass('fixed');
			} else {
				$html.css({'padding-top': '0'});
				$masthead.removeClass('fixed');
			}

		});

	});
	
};