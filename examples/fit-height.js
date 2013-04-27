// combines with the css to form a sloppy workaround for 'object-fit: contain' and 'vh' units not being supported

(function() {

var fitHeight = function() {

	var els = document.querySelectorAll('.photo');
	for ( var i = 0, len = els.length; i < len; i++ ) {

		var img = els[i].getElementsByTagName('img')[0];
		var imgRatio = parseInt(img.getAttribute('data-width')) / parseInt(img.getAttribute('data-height'));
		
		var constrainingRatio = window.innerWidth / (window.innerHeight * .9);

		if (imgRatio < constrainingRatio) {
			els[i].classList.add('tall');
		} else {
			els[i].classList.remove('tall');
		}
	}
}

fitHeight();

window.addEventListener('resize', fitHeight, false);
window.addEventListener('orientationchange', fitHeight, false);

})();