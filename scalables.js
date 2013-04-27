  //
 // Scalables.js
//
/*  a responsive images script by Eric Portis (ericportis.com)
    released to the public domain or whatever. */


(function() {


// debouncing function from John Hann
// resize events can fire like crazy. this calms them down.
// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/

var debounce = function (func, threshold, execAsap) {
  var timeout;

  return function debounced() {
      var obj = this, args = arguments;
      function delayed() {
          if (!execAsap) {
              func.apply(obj, args);
          }
          timeout = null; 
      };

      if (timeout) {
          clearTimeout(timeout);
      } else if (execAsap) {
          func.apply(obj, args);
      }
      
      timeout = setTimeout(delayed, threshold || 100); 
  };
}




  //
 // fuzzyFactor!
//

// A number between 0-1 that determines how we want to deal with device-pixel-ratios above 1
// lower = more quality, higher = faster loads
// 0 = images will always render as crisply as the device will allow (effective image of resolution of 2x @ 2x, 3x @ 3x, etc.)
// 1 = screw device pixels, I only care about css-px (effective image of resolution of 1x @ 2x, 1x @ 3x, etc.)
// 0.5 = eric's pick (effective image of resolution of 1.414x @ 2x, 2x @ 4x, 4x @16x...)
// note! that these are *worst-case resolutions* - once an image is stretched such that its pixel-density falls below this threshold, we load a bigger one

var fuzzyFactor = 0.5,
	pixelRatio = Math.pow( (window.devicePixelRatio || 1), fuzzyFactor );




  //
 // Scalable object
//

function Scalable(el) {

	this.el = el;
	
	// store version dimensions + sources
	
	this.versions = [];
	
	// parse the thumb
	var thumbEl = el.getElementsByTagName('img')[0];
	this.versions.push({
    	src: thumbEl.getAttribute('src'),
    	width: parseInt(thumbEl.getAttribute('data-width')),
    	height: parseInt(thumbEl.getAttribute('data-height'))		
	});
	
	// parse the linked versions
	var links = el.querySelectorAll( 'a[data-width][data-height]' );
    for ( var i = 0, len = links.length; i < len; i++ ) {
	    this.versions.push({
	    	src: links[i].getAttribute('href'),
	    	width: parseInt( links[i].getAttribute('data-width') ),
	    	height: parseInt( links[i].getAttribute('data-height') )
	    });
    }

}



Scalable.prototype.loadImg = function() {

    // determine the number of pixels we want to paint across the image's width
	var minPx = this.el.getElementsByTagName('img')[0].clientWidth * pixelRatio;
		
	// get versions with a width greater than or equal to our minPx
	var biggerThanMin = [];
	for ( var i = 0, len = this.versions.length; i < len; i++ ) {
		if ( this.versions[i].width >= minPx ) {
			biggerThanMin.push( this.versions[i] );
		}
	}
	
	// if there AREN'T any bigger than our min use the biggest one we have
	if ( biggerThanMin.length == 0) {
	
		this.currentVersion = this.versions[0];
		for ( var i = 1, len = this.versions.length; i < len; i++ ) {
			if ( this.versions[i].width > this.currentVersion.width ) {
				this.currentVersion = this.versions[i];
			}
		}

	// otherwise use the smallest one that's bigger
	} else {
	
		for ( var i = 0, len = biggerThanMin.length; i < len; i++ ) {
			if ( i == 0 || biggerThanMin[i].width < this.currentVersion.width ) {
				this.currentVersion = biggerThanMin[i];
			}
		}
		
	}

	// load the source
    this.el.getElementsByTagName('img')[0].src = this.currentVersion.src;

}




  //
 // On load
//

var scalableEls = document.querySelectorAll('[data-scalable]'),
	scalables = [];

for ( var i = 0, len = scalableEls.length; i < len; i++ ) {
	scalables.push( new Scalable( scalableEls[i] ) );
}



function loadTheScalables() {

	for ( var i = 0, len = scalables.length; i < len; i++ ) {
		scalables[i].loadImg();
	}

}



window.addEventListener('load', loadTheScalables, false);
window.addEventListener('resize', debounce(loadTheScalables, 200, false), false);
window.addEventListener('orientationchange', loadTheScalables, false);


})();
