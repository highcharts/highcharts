
var defaultScrollbarOptions =  {
	//enabled: true
	height: isTouchDevice ? 20 : 14,
	barBackgroundColor: '#bfc8d1',
	barBorderRadius: 0,
	barBorderWidth: 1,
	barBorderColor: '#bfc8d1',
	buttonArrowColor: '#666',
	buttonBackgroundColor: '#ebe7e8',
	buttonBorderColor: '#bbb',
	buttonBorderRadius: 0,
	buttonBorderWidth: 1,
	//showFull: true, // docs
	margin: 10, // docs
	minWidth: 6,
	rifleColor: '#666',
	zIndex: 3,		// docs
	step: 0.2,		// docs
	//size: null,	// docs
	trackBackgroundColor: '#eeeeee',
	trackBorderColor: '#eeeeee',
	trackBorderWidth: 1,
	// trackBorderRadius: 0
	liveRedraw: hasSVG && !isTouchDevice
};

defaultOptions.scrollbar = merge(true, defaultScrollbarOptions, defaultOptions.scrollbar);

/**
 * The Scrollbar class 
 * @param {Object} renderer
 * @param {Object} options
 * @param {Object} chart
 */
function Scrollbar(renderer, options, chart) { // docs
	this.scrollbarButtons = [];

	this.renderer = renderer;

	this.userOptions = options;
	this.options = merge(defaultScrollbarOptions, options);

	this.chart = chart;

	this.size = pick(this.options.size, this.options.height); // backward compatibility

	// Init
	this.render();
	this.initEvents();
	this.addEvents();
}

Scrollbar.prototype = {
	/**
	* Render scrollbar with all required items.
	*/
	render: function () {
		var scroller = this,
			renderer = scroller.renderer,
			options = scroller.options,
			strokeWidth = options.trackBorderWidth,
			scrollbarStrokeWidth = options.barBorderWidth,
			size = scroller.size,
			group;

		// Draw the scrollbar group:
		scroller.group = group = renderer.g(PREFIX + 'scrollbar').attr({
			zIndex: options.zIndex,
			translateY: -99999
		}).add();

		// Draw the scrollbar track:
		scroller.track = renderer.rect().attr({
			height: size,
			width: size,
			y: -strokeWidth % 2 / 2,
			x: -strokeWidth % 2 / 2,
			'stroke-width': strokeWidth,
			fill: options.trackBackgroundColor,
			stroke: options.trackBorderColor,
			r: options.trackBorderRadius || 0
		}).add(group);

		// Draw the scrollbar itself:
		scroller.scrollbarGroup = renderer.g().add(group);

		scroller.scrollbar = renderer.rect().attr({
			height: size,
			width: size,
			y: -scrollbarStrokeWidth % 2 / 2,
			x: -scrollbarStrokeWidth % 2 / 2,
			'stroke-width': scrollbarStrokeWidth,
			fill: options.barBackgroundColor,
			stroke: options.barBorderColor,
			r: options.barBorderRadius || 0
		}).add(scroller.scrollbarGroup);

		// Draw the scrollbat rifles:
		scroller.scrollbarRifles = renderer.path(scroller.swapXY([
			M,
			-3, size / 4,
			L,
			-3, 2 * size / 3,
			M,
			0, size / 4,
			L,
			0, 2 * size / 3,
			M,
			3, size / 4,
			L,
			3, 2 * size / 3
		], options.vertical)).attr({
			stroke: options.rifleColor,
			'stroke-width': 1
		}).add(scroller.scrollbarGroup);

		// Draw the buttons:
		scroller.drawScrollbarButton(0);
		scroller.drawScrollbarButton(1);
	},

	/**
	 * Position the scrollbar, method called from a parent with defined dimensions
	 * @param {Number} x - x-position on the chart
	 * @param {Number} y - y-position on the chart
	 * @param {Number} width - width of the scrollbar
	 * @param {Number} height - height of the scorllbar
	 */
	position: function (x, y, width, height) {
		var scroller = this,
			options = scroller.options,
			vertical = options.vertical,
			xOffset = height,
			yOffset = 0,
			method = scroller.rendered ? 'animate' : 'attr';

		scroller.x = x;
		scroller.y = y + options.trackBorderWidth;
		scroller.width = width; // width with buttons
		scroller.height = height;
		scroller.xOffset = xOffset;
		scroller.yOffset = yOffset;

		// If Scrollbar is a vertical type, swap options:
		if (vertical) {
			scroller.width = scroller.yOffset = width = yOffset = scroller.size;
			scroller.xOffset = xOffset = 0;
			scroller.barWidth = height - width * 2; // width without buttons
			scroller.x = x = x + scroller.options.margin;
		} else {
			scroller.height = scroller.xOffset = height = xOffset = scroller.size;
			scroller.barWidth = width - height * 2; // width without buttons
			scroller.y = scroller.y + scroller.options.margin;
		}

		// Set general position for a group:
		scroller.group[method]({
			translateX: x,
			translateY: scroller.y
		});

		// Resize background/track:
		scroller.track[method]({
			width: width,
			height: height
		});

		// Move right/bottom button ot it's place:
		scroller.scrollbarButtons[1].attr({
			translateX: vertical ? 0 : width - xOffset,
			translateY: vertical ? height - yOffset : 0
		});
	},

	/**
	 * Draw the scrollbar buttons with arrows
	 * @param {Number} index 0 is left, 1 is right
	 */
	drawScrollbarButton: function (index) {
		var scroller = this,
			renderer = scroller.renderer,
			scrollbarButtons = scroller.scrollbarButtons,
			options = scroller.options,
			size = scroller.size,
			group;

		group = renderer.g().add(scroller.group);
		scrollbarButtons.push(group);

		// Button rect:
		renderer.rect(
			-0.5, 
			-0.5, 
			size + 1,  // +1 to compensate for crispifying in rect method
			size + 1,
			options.buttonBorderRadius,
			options.buttonBorderWidth
		).attr({
			stroke: options.buttonBorderColor,
			'stroke-width': options.buttonBorderWidth,
			fill: options.buttonBackgroundColor
		}).add(group);

		// Button arrow:
		renderer.path(scroller.swapXY([
			'M',
			size / 2 + (index ? -1 : 1), 
			size / 2 - 3,
			'L',
			size / 2 + (index ? -1 : 1), 
			size / 2 + 3,
			'L',
			size / 2 + (index ? 2 : -2), 
			size / 2
		], options.vertical)).attr({
			fill: options.buttonArrowColor
		}).add(group);
	},

	/**
	* When we have vertical scrollbar, rifles are rotated, the same for arrow in buttons:
	* @param {Array} path - path to be rotated
	* @param {Boolean} vertical - if vertical scrollbar, swap x-y values
	*/
	swapXY: function (path, vertical) {
		var i,
			len = path.length,
			temp;

		if (vertical) {
			for (i = 0; i < len; i += 3) {
				temp = path[i + 1];
				path[i + 1] = path[i + 2];
				path[i + 2] = temp;
			}
		}

		return path;
	},

	/**
	* Set scrollbar size, with a given scale.
	* @param {Number} from - scale (0-1) where bar should start
	* @param {Number} to - scale (0-1) where bar should end
	*/
	setRange: function (from, to) {
		var scroller = this,
			options = scroller.options,
			vertical = options.vertical,
			fromPX,
			toPX,
			newPos,
			newSize,
			newRiflesPos,
			method = this.rendered && !this.hasDragged ? 'animate' : 'attr';

		if (!defined(scroller.barWidth)) {
			return;
		}

		fromPX = scroller.barWidth * Math.max(from, 0);
		toPX = scroller.barWidth * Math.min(to, 1);
		newSize = Math.max(correctFloat(toPX - fromPX), options.minWidth);
		newPos = Math.floor(fromPX + scroller.xOffset + scroller.yOffset);
		newRiflesPos = newSize / 2 - 0.5; // -0.5 -> rifle line width / 2

		// Store current position:
		scroller.from = from;
		scroller.to = to;

		if (!vertical) {
			scroller.scrollbarGroup[method]({
				translateX: newPos
			});
			scroller.scrollbar[method]({
				width: newSize
			});
			scroller.scrollbarRifles[method]({
				translateX: newRiflesPos
			});
			scroller.scrollbarLeft = newPos;
			scroller.scrollbarTop = 0;
		} else {
			scroller.scrollbarGroup[method]({
				translateY: newPos
			});
			scroller.scrollbar[method]({
				height: newSize
			});
			scroller.scrollbarRifles[method]({
				translateY: newRiflesPos
			});
			scroller.scrollbarTop = newPos;
			scroller.scrollbarLeft = 0;
		}

		if (newSize <= 12) {
			scroller.scrollbarRifles.hide();
		} else {
			scroller.scrollbarRifles.show(true);
		}

		// Show or hide the scrollbar based on the showFull setting
		if (options.showFull === false) {
			if (from <= 0 && to >= 1) {
				scroller.group.hide();
			} else {
				scroller.group.show();
			}
		}

		scroller.rendered = true;
	},

	/**
	* Init events methods, so we have an access to the Scrollbar itself
	*/
	initEvents: function () {
		var scroller = this;
		/**
		 * Event handler for the mouse move event.
		 */
		scroller.mouseMoveHandler = function (e) {
			var normalizedEvent = scroller.chart.pointer.normalize(e),
				options = scroller.options,
				direction = options.vertical ? 'chartY' : 'chartX',
				initPositions = scroller.initPositions,
				scrollPosition,
				chartPosition,
				change;

			// In iOS, a mousemove event with e.pageX === 0 is fired when holding the finger
			// down in the center of the scrollbar. This should be ignored.
			if (scroller.grabbedCenter && (!e.touches || e.touches[0][direction] !== 0)) { // #4696, scrollbar failed on Android

				chartPosition = {
					chartX: (normalizedEvent.chartX - scroller.x - scroller.xOffset) / scroller.barWidth,
					chartY: (normalizedEvent.chartY - scroller.y - scroller.yOffset) / scroller.barWidth
				}[direction];
				scrollPosition = scroller[direction];

				change = chartPosition - scrollPosition;

				scroller.hasDragged = true;
				scroller.updatePosition(initPositions[0] + change, initPositions[1] + change);

				if (scroller.hasDragged) {
					fireEvent(scroller, 'changed', {
						from: scroller.from,
						to: scroller.to,
						trigger: 'scrollbar',
						DOMType: e.type,
						DOMEvent: e
					});
				}
			}
		};

		/**
		 * Event handler for the mouse up event.
		 */
		scroller.mouseUpHandler = function (e) {
			if (scroller.hasDragged) {
				fireEvent(scroller, 'changed', {
					from: scroller.from,
					to: scroller.to,
					trigger: 'scrollbar',
					DOMType: e.type,
					DOMEvent: e
				});
			}
			scroller.grabbedCenter = scroller.hasDragged = scroller.chartX = scroller.chartY = null;
		};

		scroller.mouseDownHandler = function (e) {
			var normalizedEvent = scroller.chart.pointer.normalize(e);

			scroller.chartX = (normalizedEvent.chartX - scroller.x - scroller.xOffset) / scroller.barWidth;
			scroller.chartY = (normalizedEvent.chartY - scroller.y - scroller.yOffset) / scroller.barWidth;
			scroller.initPositions = [scroller.from, scroller.to];

			scroller.grabbedCenter = true;
		};

		scroller.buttonToMinClick = function (e) {
			var range = correctFloat(scroller.to - scroller.from) * scroller.options.step;
			scroller.updatePosition(correctFloat(scroller.from - range), correctFloat(scroller.to - range));
			fireEvent(scroller, 'changed', {
				from: scroller.from,
				to: scroller.to,
				trigger: 'scrollbar',
				DOMEvent: e
			});
		};

		scroller.buttonToMaxClick = function (e) {
			var range = (scroller.to - scroller.from) * scroller.options.step;
			scroller.updatePosition(scroller.from + range, scroller.to + range);
			fireEvent(scroller, 'changed', {
				from: scroller.from,
				to: scroller.to,
				trigger: 'scrollbar',
				DOMEvent: e
			});
		};

		scroller.trackClick = function (e) {
			var normalizedEvent = scroller.chart.pointer.normalize(e),
				range = scroller.to - scroller.from,
				top = scroller.y + scroller.scrollbarTop,
				left = scroller.x + scroller.scrollbarLeft;

			if ((scroller.options.vertical && normalizedEvent.chartY > top) || 
				(!scroller.options.vertical && normalizedEvent.chartX > left)) {
				// On the top or on the left side of the track:
				scroller.updatePosition(scroller.from + range, scroller.to + range);
			} else {
				// On the bottom or the right side of the track:
				scroller.updatePosition(scroller.from - range, scroller.to - range);
			}

			fireEvent(scroller, 'changed', {
				from: scroller.from,
				to: scroller.to,
				trigger: 'scrollbar',
				DOMEvent: e
			});
		};
	},

	/**
	* Update position option in the Scrollbar, with normalized 0-1 scale
	*/
	updatePosition: function (from, to) {
		if (to > 1) {
			from = correctFloat(1 - correctFloat(to - from));
			to = 1;
		}

		if (from < 0) {
			to = correctFloat(to - from);
			from = 0;
		}

		this.from = from;
		this.to = to;
	},

	/**
	 * Set up the mouse and touch events for the Scrollbar
	 */
	addEvents: function () {
		var buttonsOrder = this.options.inverted ? [1, 0] : [0, 1],
			buttons = this.scrollbarButtons,
			bar = this.scrollbarGroup.element,
			track = this.track.element,
			mouseDownHandler = this.mouseDownHandler,
			mouseMoveHandler = this.mouseMoveHandler,
			mouseUpHandler = this.mouseUpHandler,
			_events;

		// Mouse events
		_events = [
			[buttons[buttonsOrder[0]].element, 'click', this.buttonToMinClick],
			[buttons[buttonsOrder[1]].element, 'click', this.buttonToMaxClick],
			[track, 'click', this.trackClick],
			[bar, 'mousedown', mouseDownHandler],
			[doc, 'mousemove', mouseMoveHandler],
			[doc, 'mouseup', mouseUpHandler]
		];

		// Touch events
		if (hasTouch) {
			_events.push(
				[bar, 'touchstart', mouseDownHandler],
				[doc, 'touchmove', mouseMoveHandler],
				[doc, 'touchend', mouseUpHandler]
			);
		}

		// Add them all
		each(_events, function (args) {
			addEvent.apply(null, args);
		});
		this._events = _events;
	},

	/**
	 * Removes the event handlers attached previously with addEvents.
	 */
	removeEvents: function () {
		each(this._events, function (args) {
			removeEvent.apply(null, args);
		});
		this._events = UNDEFINED;
	},

	/**
	 * Destroys allocated elements.
	 */
	destroy: function () {
		var scroller = this;

		// Disconnect events added in addEvents
		scroller.removeEvents();

		// Destroy properties
		each([scroller.track, scroller.scrollbarRifles, scroller.scrollbar, scroller.scrollbarGroup, scroller.group], function (prop) {
			if (prop && prop.destroy) {
				prop = prop.destroy();
			}
		});

		// Destroy elements in collection
		destroyObjectProperties(scroller.scrollbarButtons);
	}
};

/**
* Wrap axis initialization and create scrollbar if enabled:
*/
wrap(Axis.prototype, 'init', function (proceed) {
	var axis = this;
	proceed.apply(axis, [].slice.call(arguments, 1));

	if (axis.options.scrollbar && axis.options.scrollbar.enabled) {
		// Predefined options:
		axis.options.scrollbar.vertical = !axis.horiz;
		axis.options.startOnTick = axis.options.endOnTick = false; // docs

		axis.scrollbar = new Scrollbar(axis.chart.renderer, axis.options.scrollbar, axis.chart);

		addEvent(axis.scrollbar, 'changed', function (e) {
			var unitedMin = Math.min(pick(axis.options.min, axis.min), axis.min, axis.dataMin),
				unitedMax = Math.max(pick(axis.options.max, axis.max), axis.max, axis.dataMax),
				range = unitedMax - unitedMin,
				to,
				from;

			if ((axis.horiz && !axis.reversed) || (!axis.horiz && axis.reversed)) {
				to = unitedMin + range * this.to;
				from = unitedMin + range * this.from;
			} else {
				// y-values in browser are reversed, but this also applies for reversed horizontal axis:
				to = unitedMin + range * (1 - this.from);
				from = unitedMin + range * (1 - this.to);
			}

			axis.setExtremes(from, to, true, false, e);
		});
	}
});

/**
* Wrap rendering axis, and update scrollbar if one is created:
*/
wrap(Axis.prototype, 'render', function (proceed) {
	var axis = this,		
		scrollMin = Math.min(pick(axis.options.min, axis.min), axis.min, axis.dataMin),
		scrollMax = Math.max(pick(axis.options.max, axis.max), axis.max, axis.dataMax),
		scrollbar = axis.scrollbar,
		from,
		to;

	proceed.apply(axis, [].slice.call(arguments, 1));

	if (scrollbar) {
		if (axis.horiz) {
			scrollbar.position(
				axis.left, 
				axis.top + axis.height + axis.offset + 2 + (axis.opposite ? 0 : axis.axisTitleMargin),
				axis.width,
				axis.height
			);
		} else {
			scrollbar.position(
				axis.left + axis.width + 2 + axis.offset + (axis.opposite ? axis.axisTitleMargin : 0), 
				axis.top, 
				axis.width, 
				axis.height
			);
		}

		if (isNaN(scrollMin) || isNaN(scrollMax) || !defined(axis.min) || !defined(axis.max)) {
			scrollbar.setRange(0, 0); // default action: when there is not extremes on the axis, but scrollbar exists, make it full size
		} else {
			from = (axis.min - scrollMin) / (scrollMax - scrollMin);
			to = (axis.max - scrollMin) / (scrollMax - scrollMin);

			if ((axis.horiz && !axis.reversed) || (!axis.horiz && axis.reversed)) {
				scrollbar.setRange(from, to);
			} else {
				scrollbar.setRange(1 - to, 1 - from); // inverse vertical axis
			}
		}
	}
});

/**
* Make space for a scrollbar
*/
wrap(Axis.prototype, 'getOffset', function (proceed) {
	var axis = this,
		index = axis.horiz ? 2 : 1,
		scrollbar = axis.scrollbar;

	proceed.apply(axis, [].slice.call(arguments, 1));

	if (scrollbar) {
		axis.chart.axisOffset[index] += scrollbar.size + scrollbar.options.margin;
	}
});

/**
* Destroy scrollbar when connected to the specific axis
*/
wrap(Axis.prototype, 'destroy', function (proceed) {
	if (this.scrollbar) {
		this.scrollbar = this.scrollbar.destroy();
	}

	proceed.apply(this, [].slice.call(arguments, 1));
});

Highcharts.Scrollbar = Scrollbar;
