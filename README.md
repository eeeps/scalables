# scalables

A responsive bitmap images thing, focusing on markup which describes resources rather than viewport conditions, allowing for a full separation of content and presentation.

&lt;data-scalable&gt; elements contain one thumbnail &lt;img&gt; and any number of larger sources, linked to in &lt;a&gt; elements with explicit "data-width" and "data-height" attributes. Like this:

```html
<div class="pic" data-scalable>
	<img src="thumb.jpg" width="100" height="100" alt="" />
	<p>View image:</p>
	<ul>
		<li><a href="full.jpg" data-width="1024" data-height="1024">fullsize (1024 x 1024 pixels, 213 kB)</a></li>
		<li><a href="half.jpg" data-width="512" data-height="512">half (48 kB)</a></li>
		<li><a href="quarter.jpg" data-width="256" data-height="256">quarter (14 kB)</a></li>
	</ul>
</div>
```

On load, scalables.js parses this and stores all of these versions & their sizes.

On load and after any resize or orientationchange event, scalables.js evaluates how much room is available for the image within the current layout context, swaps a single &lt;img&gt; element in for all of that fallback content, and loads the appropriate source.

## styling

Apply any & all sizing & positioning styles to the parent, &lt;data-scalable&gt; element and not to the &lt;img&gt; itself, which has its width and height styles explicitly set by the script such that it will fill & fit within the parent.

Scalables.js adds an "enhanced" class to the root element, allowing you to style your fallback thumbnail + text separately from your enhanced, scaled images.

```css
/* styles for the "unenhanced" fallback */
.pic {
	font-size: .75em;
	padding: 1em;
	}

.pic img {
	float: left;
	padding-right: 1em;
	}

/* undo! */
.enhanced .pic img {
	float: none;
	padding-right: 0;
	}
	
/* sizing & layout for the scaled-up pic */
.enhanced .pic {
	max-width: 80%;
	margin: 0 auto;
	max-height: 80vh;
	padding: 0.25em;
	}
```


## examples

- [Big pictures from spain](http://eeeps.github.com/scalables/examples/spain.html)
- [A blog about oats](http://eeeps.github.com/scalables/examples/blog.html)

## why, thanks

This arose as an attempt to give form to some of the thoughts I found myself spitting out [here](http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2012-November/037772.html), [here](http://lists.w3.org/Archives/Public/public-respimg/2012Nov/0001.html), and [here](http://24ways.org/2012/responsive-images-what-we-thought-we-needed/). Huge thanks to Paul Robert Lloyd in particular for a tremendously helpful email exchange & for a strong, well-articulated point of view, which I found myself embracing and pushing back upon in equal measure. Also thanks to Mr. Lloyd (and Josh Emerson!) for the [actual code](https://github.com/paulrobertlloyd/data-imgsrc) that this grew out of.

## :(

- If a browser dosen't respect the html5 parsing algorithm (which blocks scripts until all previous-in-markup stylesheets have loaded [I'm looking at you, my dad's Kindle Fire]), scalables.js can potentially execute before the layout is computed, meaning it will have no idea how to size the images or which source to load. Chaos ensues.
- The delayed resizing (and handling the resizing dynamically with JS instead of declaratively with CSS) is weird. I couldn't quite figure out how to size the &lt;img&gt;s up as well as down to fit within an arbitrarily-sized container (while also maintaining their aspect ratio) with CSS.
- We always load the thumbnails, so we always incur 2 HTTP requests per &lt;data-scalable&gt;. On the bright side, given that the thumbnails will likely be very small and are scaled up to fill the available space whilst we load the larger sources, the *preceived* speed of this solution is often blazingly fast.
- Next to the elegance and brevity of [this](https://github.com/scottjehl/picturefill]) and [this](https://github.com/paulrobertlloyd/data-imgsrc), it all seems a little complicated, no?

## little things

If you don't want the fallback content to flash, you'll need to include scalables.css and something or other which will add a "js" class to the html element. Modernizr works; so will adding this above any data-scalable elements:

```html
<script>document.getElementsByTagName('html')[0].className += " js"</script>
```

Have opinions about how you want to deal with hi-DPI displays? You'll want to tweak the fuzzyFactor. From the comments:

	// fuzzyFactor!
	// A number between 0-1 that determines how we want to deal with device-pixel-ratios above 1
	// lower = more quality, higher = faster loads
	// 0 = images will always render as crisply as the device will allow (effective image of resolution of 2x @ 2x, 3x @ 3x, etc.)
	// 1 = screw device pixels, I only care about css-px (effective image of resolution of 1x @ 2x, 1x @ 3x, etc.)
	// 0.5 = eric's pick (effective image of resolution of 1.414x @ 2x, 2x @ 4x, 4x @16x...)
	// note! that these are *worst-case resolutions* - once an image is stretched such that its pixel-density falls below this threshold, we load a bigger one