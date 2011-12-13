/* ****************************************************************************
 *                                                                            *
 * START OF ANDROID < 3 SPECIFIC CODE. THIS CAN BE REMOVED IF YOU'RE NOT      *
 * TARGETING THAT SYSTEM.                                                     *
 *                                                                            *
 *****************************************************************************/
var CanVGRenderer;
if (useCanVG) {

CanVGRenderer = function (container) {
	var contStyle = container.style,
		canvas;

	this.init.apply(this, arguments);

	// add the canvas above it
	canvas = createElement('canvas', {
		width: container.offsetWidth,
		height: container.offsetHeight
	}, {
		position: RELATIVE,
		left: contStyle.left,
		top: contStyle.top
	}, container.parentNode);

	// hide the container
	css(container, {
		position: ABSOLUTE,
		visibility: HIDDEN
	});

	this.container = container;
	this.canvas = canvas;

	// Keep all deferred canvases here until we can render them
	this.deferred = [];
};

CanVGRenderer.prototype = merge(SVGRenderer.prototype, { // inherit SVGRenderer

	/**
	 * Draws the SVG on the canvas or adds a draw invokation to the deferred list.
	 */
	draw: function () {
		var renderer = this;

		if (win.canvg) {
			canvg(renderer.canvas, renderer.container.innerHTML);
		} else {
			renderer.deferred.push(function () {
				renderer.draw();
			});
		}
	},

	/**
	 * Starts to downloads the canvg script and sets a callback to drawDeferred when its
	 * loaded.
	 */
	download: function (scriptLocation, doc) {
		var renderer = this,
			head = doc.getElementsByTagName('head')[0],
			scriptAttributes = {
				type: 'text/javascript',
				src: scriptLocation,
				onload: function () {
					renderer.drawDeferred();
				}
			};

		createElement('script', scriptAttributes, null, head);
	},

	/**
	 * Draws the deferred canvases when the canvg script is loaded.
	 */
	drawDeferred: function () {
		var renderer = this;

		each(renderer.deferred, function (fn) {
			fn();
			erase(renderer.deferred, fn);
		});
	}
});

} // end CanVGRenderer
/* ****************************************************************************
 *                                                                            *
 * END OF ANDROID < 3 SPECIFIC CODE                                           *
 *                                                                            *
 *****************************************************************************/


/**
 * General renderer
 */
Renderer = VMLRenderer || CanVGRenderer || SVGRenderer;
