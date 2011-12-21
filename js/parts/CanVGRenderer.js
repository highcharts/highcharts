/* ****************************************************************************
 *                                                                            *
 * START OF ANDROID < 3 SPECIFIC CODE. THIS CAN BE REMOVED IF YOU'RE NOT      *
 * TARGETING THAT SYSTEM.                                                     *
 *                                                                            *
 *****************************************************************************/
var CanVGRenderer;
if (useCanVG) {

CanVGRenderer = function (container) {
	var containerStyle = container.style,
		containerParent = container.parentNode,
		containerLeft = containerStyle.left,
		containerTop = containerStyle.top,
		containerOffsetWidth = container.offsetWidth,
		containerOffsetHeight = container.offsetHeight,
		canvas,
		initialHiddenStyle = { visibility: HIDDEN, position: ABSOLUTE };

	this.init.apply(this, arguments);

	// add the canvas above it
	canvas = createElement('canvas', {
		width: containerOffsetWidth,
		height: containerOffsetHeight
	}, {
		position: RELATIVE,
		left: containerLeft,
		top: containerTop
	}, container);
	this.canvas = canvas;

	// Keep all deferred canvases here until we can render them
	this.deferred = [];

	// Create the tooltip line and div, they are placed as siblings to
	// the container (and as direct childs to the div specified in the html page)
	this.ttLine = createElement('div', null, initialHiddenStyle, containerParent);
	this.ttDiv = createElement('div', null, initialHiddenStyle, containerParent);
	this.ttTimer = UNDEFINED;

	// Move away the svg node to a new div inside the container's parent so we can hide it.
	var hiddenSvg = createElement('div', {
		width: containerOffsetWidth,
		height: containerOffsetHeight
	}, {
		visibility: HIDDEN,
		left: containerLeft,
		top: containerTop
	}, containerParent);
	this.hiddenSvg = hiddenSvg;
	hiddenSvg.appendChild(this.box);
};

CanVGRenderer.prototype = merge(SVGRenderer.prototype, { // inherit SVGRenderer

	/**
	 * Configures the renderer with the chart. Attach a listener to the event tooltipRefresh.
	 **/
	configure: function (chart) {
		var renderer = this,
			options = chart.options.tooltip,
			borderWidth = options.borderWidth,
			tooltipDiv = renderer.ttDiv,
			tooltipDivStyle = options.style,
			tooltipLine = renderer.ttLine,
			padding = pInt(tooltipDivStyle.padding);

		// Add border styling from options to the style
		tooltipDivStyle = merge(tooltipDivStyle, {
			padding: padding + PX,
			'background-color': options.backgroundColor,
			'border-style': 'solid',
			'border-width': borderWidth + PX,
			'border-radius': options.borderRadius + PX
		});

		// Optionally add shadow
		if (options.shadow) {
			tooltipDivStyle = merge(tooltipDivStyle, {
				'box-shadow': '1px 1px 3px gray', // w3c
				'-webkit-box-shadow': '1px 1px 3px gray' // webkit
			});
		}
		css(tooltipDiv, tooltipDivStyle);

		// Set simple style on the line
		css(tooltipLine, {
			'border-left': '1px solid darkgray'
		});

		// This event is triggered when a new tooltip should be shown
		addEvent(chart, 'tooltipRefresh', function (args) {
			var firstHalf = args.x < chart.plotWidth / 2,
				chartContainer = chart.container,
				offsetLeft = chartContainer.offsetLeft,
				offsetTop = chartContainer.offsetTop,
				position;

			// Set the content of the tooltip
			tooltipDiv.innerHTML = args.text;

			// Compute the best position for the tooltip based on the divs size and container size.
			position = placeBox(tooltipDiv.offsetWidth, tooltipDiv.offsetHeight, offsetLeft, offsetTop, chartContainer.offsetWidth, chartContainer.offsetHeight, {x: args.x, y: args.y}, 12);
			css(tooltipDiv, {
				visibility: VISIBLE,
				left: position.x + PX,
				top: position.y + PX,
				'border-color': args.borderColor
			});

			// Position the tooltip line
			css(tooltipLine, {
				visibility: VISIBLE,
				left: offsetLeft + args.x + PX,
				top: offsetTop + chart.plotTop + PX,
				height: chart.plotHeight  + PX
			});

			// This timeout hides the tooltip after 3 seconds
			// First clear any existing timer
			if (renderer.ttTimer !== UNDEFINED) {
				clearTimeout(renderer.ttTimer);
			}

			// Start a new timer that hides tooltip and line
			renderer.ttTimer = setTimeout(function () {
				css(tooltipDiv, { visibility: HIDDEN });
				css(tooltipLine, { visibility: HIDDEN });
			}, 3000);
		});
	},

	/**
	 * Extend SVGRenderer.destroy to also destroy the elements added by CanVGRenderer.
	 */
	destroy: function () {
		var renderer = this;

		// Remove the canvas
		discardElement(renderer.canvas);

		// Kill the timer
		if (renderer.ttTimer !== UNDEFINED) {
			clearTimeout(renderer.ttTimer);
		}

		// Remove the divs for tooltip and line
		discardElement(renderer.ttLine);
		discardElement(renderer.ttDiv);
		discardElement(renderer.hiddenSvg);

		// Continue with base class
		return SVGRenderer.prototype.destroy.apply(renderer);
	},

	/**
	 * Take a color and return it if it's a string, do not make it a gradient even if it is a
	 * gradient. Currently canvg cannot render gradients (turns out black),
	 * see: http://code.google.com/p/canvg/issues/detail?id=104
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop) {
		if (color && color.linearGradient) {
			// Pick the end color and forward to base implementation
			color = color.stops[color.stops.length - 1][1];
		}
		return SVGRenderer.prototype.color.call(this, color, elem, prop);
	},

	/**
	 * Draws the SVG on the canvas or adds a draw invokation to the deferred list.
	 */
	draw: function () {
		var renderer = this;

		if (win.canvg) {
			canvg(renderer.canvas, renderer.hiddenSvg.innerHTML);

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
	download: function (scriptLocation) {
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
