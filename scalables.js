  //
 // Scalables.js
//
/*  a responsive images script by Eric Portis
    released to the public domain or whatever. */
    

  //
 // Utilities
//

try {

// This is Paul Robert Lloyd's, or I took it from him at least. I suspect it makes this a bit more cross-browser compatible.
var addEvent=function(){return document.addEventListener?function(a,c,d){if(a&&a.nodeName||a===window)a.addEventListener(c,d,!1);else if(a&&a.length)for(var b=0;b<a.length;b++)addEvent(a[b],c,d)}:function(a,c,d){if(a&&a.nodeName||a===window)a.attachEvent("on"+c,function(){return d.call(a,window.event)});else if(a&&a.length)for(var b=0;b<a.length;b++)addEvent(a[b],c,d)}}();


// debouncing function from John Hann
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

    var fuzzyFactor = 0.25,
		pixelRatio = Math.pow( (window.devicePixelRatio || 1), fuzzyFactor );



  //
 // Scalable object
//

function Scalable(el) {

	this.el = el;
	
	// store version dimensions + sources
	this.versions = [];
	var links = el.querySelectorAll( '[data-scalable] a[data-width][data-height]' );
    for ( var i = 0, len = links.length; i < len; i++ ) {
	    this.versions.push({
	    	src: links[i].getAttribute('href'),
	    	width: parseInt( links[i].getAttribute('data-width') ),
	    	height: parseInt( links[i].getAttribute('data-height') )
	    });
    }
	
	var thumbEl = el.getElementsByTagName('img')[0];
	this.thumb = {
    	src: thumbEl.getAttribute('src'),
    	width: parseInt(thumbEl.getAttribute('width')),
    	height: parseInt(thumbEl.getAttribute('height'))		
	};
	
	// picking this one out lets us get an accurate aspect ratio;
	// it's also what we use if there aren't images bigger than the available space
	this.biggest = this.versions[0];
    for ( var i = 1, len = this.versions.length; i < len; i++ ) {
		if ( this.versions[i].width > this.biggest.width ) {
			this.biggest = this.versions[i];
		}
	}
		
}


Scalable.prototype.setAvailableDimensions = function() {

	// this smells funny?
	var bigDiv = document.createElement('div');
	bigDiv.style.display = 'block';
	bigDiv.style.width = '9999px';
	bigDiv.style.height = '9999px';
	
	var padding = { horizontal: 0, vertical: 0 };
	if (window.getComputedStyle(this.el,null).getPropertyValue('box-sizing') == 'border-box') {
		padding.horizontal = parseInt(window.getComputedStyle(this.el,null).getPropertyValue('padding-left')) + parseInt(window.getComputedStyle(this.el,null).getPropertyValue('padding-right'));
		padding.vertical = parseInt(window.getComputedStyle(this.el,null).getPropertyValue('padding-top')) - parseInt(window.getComputedStyle(this.el,null).getPropertyValue('padding-bottom'));
	}
	
	this.el.appendChild(bigDiv);
	this.available = { width: this.el.clientWidth - padding.horizontal, height: this.el.clientHeight - padding.vertical };
	this.el.removeChild(bigDiv);
	
	if ( this.biggest.width / this.biggest.height > this.available.width / this.available.height ) {
		this.fitWH = 'width';
		this.freeWH = 'height';
	} else {
		this.fitWH = 'height';
		this.freeWH = 'width';		
	}
	
    return this;

}


Scalable.prototype.sizeImg = function() {

	var img = this.el.getElementsByTagName('img')[0];
	
	img.style[this.fitWH] = this.available[this.fitWH] + 'px';
	img.style[this.freeWH] = this.available[this.fitWH] * ( this.biggest[this.freeWH] / this.biggest[this.fitWH] ) + 'px';
	
	return this;

}


Scalable.prototype.loadImg = function() {
	
    // pick a source

    // determine the number of pixels we want to paint across the constraining dimension (using fuzzyfactor)
	var minPx = this.available[this.fitWH] * pixelRatio;

	if (this.thumb[this.fitWH] < minPx) { // pick from the larger, linked files
		
		// get versions with a limiting dimension greater than or equal to our minPx
		var biggerThanMin = [];
		for ( var i = 0, len = this.versions.length; i < len; i++ ) {
			if ( this.versions[i][this.fitWH] >= minPx ) {
				biggerThanMin.push( this.versions[i] );
			}
		}
		
		// if there AREN'T any bigger than our min use the biggest one we have
		if ( biggerThanMin.length == 0) {
		
			this.currentVersion = this.biggest;

		// otherwise use the smallest one that's bigger
		} else {
		
			for ( var i = 0, len = biggerThanMin.length; i < len; i++ ) {
				if ( i == 0 || biggerThanMin[i][this.fitWH] < this.currentVersion[this.fitWH] ) {
					this.currentVersion = biggerThanMin[i];
				}
			}
			
		}

	} else { // just use the thumb image
	
		this.currentVersion = this.thumb;
	
	} 
	
	/*
	console.log(
	   'picked source:\n' + this.currentVersion.src
	 + '\nminPx: ' + minPx
	 + '\nwh: ' + this.fitWH
	 + '\navailable.width: ' + this.available.width
	 + '\navailable.height: ' + this.available.height
	 + '\n'
	 );
	 */
	
	// load the source

    var newImg = new Image(),
    	oldImg = this.el.getElementsByTagName('img')[0];
    
	for ( i = 0, attrs = oldImg.attributes, len = attrs.length; i < len; i++ ) {
		if (attrs[i].nodeName != "src" && attrs[i].nodeName != "height"  && attrs[i].nodeName != "width") {
		    newImg.setAttribute( attrs[i].nodeName, attrs[i].nodeValue );
	    }
	}
    
    var that = this;
    addEvent( newImg, 'load', function(e) {
        that.el.innerHTML = "";
        that.el.appendChild(newImg);
        that.el.classList.add('scaled')
    });

    newImg.src = this.currentVersion.src;
    
    return this;

}




  //
 // On load
//

document.getElementsByTagName('html')[0].className += ' enhanced';

var scalableEls = document.querySelectorAll('[data-scalable]'),
	scalables = [];
	
for ( var i = 0, len = scalableEls.length; i < len; i++ ) {

	scalables.push( new Scalable( scalableEls[i] ) );
			
	scalables[i].setAvailableDimensions()
		.sizeImg()
		.loadImg();

}




  //
 // On resize
//

function resizeThe(scalables) {
	
	for ( var i = 0, len = scalables.length; i < len; i++ ) {
	
		var s = scalables[i];
	
		s.setAvailableDimensions()
			.sizeImg();
			
		if ( s.available[s.fitWH] * pixelRatio > s.currentVersion[s.fitWH] ) {
			s.loadImg();
		}

	}
	
}

// wait until the user is done resizing the window, then execute
addEvent( window, 'resize', debounce(function(e) { resizeThe(scalables); }, 75, false));

// orientation changes, too!
addEvent( window, 'orientationchange', function() { resizeThe(scalables); });




} catch(e) {
	var h = document.getElementsByTagName('html')[0];
	h.className = h.className.replace(' enhanced', '');
	h.className += ' doh';
	console.log(e.message);
}