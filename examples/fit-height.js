// css currently can't make an <img> potentially shrink-to-fit OR expand-to-fill a given height and a width AND preserve it's aspect ratio.
// you know, like "background-size: contain" can.
// this is a kind of workaround for that...

(function() {

var fitHeight = function() {

	var els = document.querySelectorAll('[data-scalable]');
	for ( var i = 0, len = els.length; i < len; i++ ) {

		var img = els[i].getElementsByTagName('img')[0];
		var imgRatio = parseInt(img.getAttribute('data-width')) / parseInt(img.getAttribute('data-height'));
		
		var constrainingRatio = window.innerWidth / (window.innerHeight * .9);

		if (imgRatio < constrainingRatio) {
			img.classList.add('tall');
			img.classList.remove('wide');
		} else {
			img.classList.remove('tall');
			img.classList.add('wide');
		}
	}
}

fitHeight();

window.addEventListener('resize', fitHeight, false);
window.addEventListener('orientationchange', fitHeight, false);

})();