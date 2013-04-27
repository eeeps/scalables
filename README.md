# scalables

A responsive bitmap images thing, focusing on markup which describes resources rather than viewport conditions, allowing for a full separation of content and presentation.

&lt;data-scalable&gt; elements contain one thumbnail &lt;img&gt; and any number of larger sources, linked to in &lt;a&gt; elements. The &lt;img&gt; and the &lt;a&gt;s have "data-width" and "data-height" attributes which describe the size (in pixels) of the linked file. Like this:

```html
<div data-scalable>
	<img src="thumb.jpg" data-width="100" data-height="100" alt="" />
	<p>View image:</p>
	<ul>
		<li><a href="full.jpg" data-width="1024" data-height="1024">fullsize (1024 x 1024 pixels, 213 kB)</a></li>
		<li><a href="half.jpg" data-width="512" data-height="512">half (48 kB)</a></li>
		<li><a href="quarter.jpg" data-width="256" data-height="256">quarter (14 kB)</a></li>
	</ul>
</div>
```

On load, scalables.js parses this and stores the source URLs & their pixel dimensions.

On load and after any 'resize' or 'orientationchange' event, the script looks at how big the &lt;img&gt; is on the layout and swaps in an appropriately-large source.


## examples

- [Big pictures from spain](http://eeeps.github.com/scalables/examples/spain.html) ([no-js](http://eeeps.github.com/scalables/examples/spain-no-js.html))
- [A blog about oats](http://eeeps.github.com/scalables/examples/blog.html) ([no-js](http://eeeps.github.com/scalables/examples/blog-no-js.html))


## sizing with css

We're trying to free images from having a single, definitive, baked-in & fixed size, and discard the notion that a file's intrinsic pixel dimensions should have anything whatsoever to do with how large it appears on a layout. Thus, you must explicitly size your image in CSS with 'width' or 'height' styles for this script to do anything useful.

If you don't scale your initial thumbnail (usually *up*) to fit your layout in CSS, when the script looks at how big the &lt;img&gt; is it will see it at its default (native) dimensions and won't load any of the larger sources.

Practically, if you've been working images into fluid layouts in the past using the conventionally-wise techniques, this will mean writing 'width="100%;' where you had been writing 'max-width: 100%;'


## hiding the links

If you want to hide the links to the image at all of its various sizes (which, [maybe](http://www.flickr.com/photos/zipco-and-cal/8380266109/sizes/l) you [don't](http://en.wikipedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg)?), you must check for Javascript support first and only hide if you're reasonably certain that the script will run.

If you're not already checking for JS with something like modernizr, add this to your page (above the &lt;data-scalable&gt;s):

```html
<script>document.getElementsByTagName('html')[0].className += " js"</script>
```

Then you can hide the links like this:

```css
.js [data-scalables] *:not(img) {
	display: none;
}
```

## double the http requests, double the fun

We always load the thumbnails, so more often than not we end up incurring 2 HTTP requests per &lt;data-scalable&gt;. On the bright side, given that the thumbnails are small, the initial page load (built around a bunch of blurry, scaled-up images) happens blazingly fast. So despite the fact that we're "loading the image twice", everything *appears* much faster.


## retina & co.

Have opinions about how you want to deal with hi-DPI displays? You'll want to tweak the fuzzyFactor. From the comments:

	// fuzzyFactor!
	// A number between 0-1 that determines how we want to deal with device-pixel-ratios above 1
	// lower = more quality, higher = faster loads
	// 0 = images will always render as crisply as the device will allow (effective image of resolution of 2x @ 2x, 3x @ 3x, etc.)
	// 1 = screw device pixels, I only care about css-px (effective image of resolution of 1x @ 2x, 1x @ 3x, etc.)
	// 0.5 = eric's pick (effective image of resolution of 1.414x @ 2x, 2x @ 4x, 4x @16x...)
	// note! that these are *worst-case resolutions* - once an image is stretched such that its pixel-density falls below this threshold, we load a bigger one


## why, thanks

This arose as an attempt to give form to some of the thoughts I found myself spitting [here](http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2012-November/037772.html), [here](http://lists.w3.org/Archives/Public/public-respimg/2012Nov/0001.html), and [here](http://24ways.org/2012/responsive-images-what-we-thought-we-needed/). Huge thanks to Paul Robert Lloyd in particular for a helpful email exchange & for a strong, well-articulated point of view, which I found myself embracing and pushing back on in equal measure. Also thanks to Mr. Lloyd (and Josh Emerson!) for the [actual code](https://github.com/paulrobertlloyd/data-imgsrc) that this grew out of.
