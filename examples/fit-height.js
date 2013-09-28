// combines with the css to form a sloppy workaround for 'object-fit: contain' and 'vh' units not being supported


// Test to see if we can scale an image with a percentage-based height.
Modernizr.addTest('img-pct-height', function(){

	var body = document.getElementsByTagName('html')[0],
		html = document.getElementsByTagName('html')[0],
		oldHtmlHeight = html.style.height,
		oldBodyHeight = body.style.height;

	html.style.height = '100%';
	body.style.height = '100%';

	var img = document.createElement('img');
	img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // 1px transparent gif
	img.style.height = '100%';

	body.appendChild(img);

	var result = parseInt(window.getComputedStyle(img).height) === parseInt(window.innerHeight);

	body.removeChild(img);

	return result;

});


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
