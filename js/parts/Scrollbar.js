
/**
 * The Scrollbar class 
 * @param {Object} chart
 */
function Scrollbar(chart, bindTo) {
	var chartOptions = chart.options,
		options = chartOptions.scrollbar,
		enabled = options.enabled,
		height = enabled ? options.height : 0;

	this.scrollbarButtons = [];
	this.elementsToDestroy = []; // Array containing the elements to destroy when Scrollbar is destroyed

	this.chart = chart;
	this.bindTo = bindTo; // container to be scrollable

	this.scrollbarHeight = height;
	this.scrollbarEnabled = enabled;
	this.scrollbarOptions = options;

	// Run scroller
	this.init();
}

Scrollbar.prototype = {
	init: function  () {
		this.addEvents();
	},

	/**
	 * Render the Scrollbar
	 */
	render: function () {
		var scroller = this,
			chart = scroller.chart,
			renderer = chart.renderer,
			bindTo = this.bindTo,
			scrollbarGroup = scroller.scrollbarGroup,
			scrollbar = scroller.scrollbar,
			scrollbarTrack = scroller.scrollbarTrack,
			scrollbarHeight = scroller.scrollbarHeight,
			scrollbarEnabled = scroller.scrollbarEnabled,
			scrollbarOptions = scroller.scrollbarOptions,
			scrollbarMinWidth = scrollbarOptions.minWidth,
			scrollbarPad,
			scrollbarStrokeWidth = scrollbarOptions.barBorderWidth,
			barBorderRadius = scrollbarOptions.barBorderRadius,
			strokeWidth,
			scrollerLeft,
			scrollerWidth = bindTo.navigatorWidth + 2 * scrollbarHeight,
			top = bindTo.top,
			navigatorLeft = bindTo.navigatorLeft,
			height = bindTo.height,
			zoomedMin = bindTo.zoomedMin,
			zoomedMax = bindTo.zoomedMax,
			range = mathRound(zoomedMax) - mathRound(zoomedMin),
			scrWidth,
			scrX,
			centerBarX,
			verb = chart.isResizing ? 'animate' : 'attr';

		if (scrollbarEnabled && !scroller.rendered) {

			// draw the scrollbar group
			scroller.scrollbarGroup = scrollbarGroup = renderer.g('scrollbar').add();

			// the scrollbar track
			strokeWidth = scrollbarOptions.trackBorderWidth;
			scroller.scrollbarTrack = scrollbarTrack = renderer.rect().attr({
				x: 0,
				y: -strokeWidth % 2 / 2,
				fill: scrollbarOptions.trackBackgroundColor,
				stroke: scrollbarOptions.trackBorderColor,
				'stroke-width': strokeWidth,
				r: scrollbarOptions.trackBorderRadius || 0,
				height: scrollbarHeight
			}).add(scrollbarGroup);

			// the scrollbar itself
			scroller.scrollbar = scrollbar = renderer.rect()
				.attr({
					y: -scrollbarStrokeWidth % 2 / 2,
					height: scrollbarHeight,
					fill: scrollbarOptions.barBackgroundColor,
					stroke: scrollbarOptions.barBorderColor,
					'stroke-width': scrollbarStrokeWidth,
					r: barBorderRadius
				})
				.add(scrollbarGroup);

			scroller.scrollbarRifles = renderer.path()
				.attr({
					stroke: scrollbarOptions.rifleColor,
					'stroke-width': 1
				})
				.add(scrollbarGroup);
		}


		// draw the scrollbar
		if (scrollbarEnabled && scrollbarGroup) {
			scrX = scrollbarHeight + zoomedMin;
			scrWidth = range - scrollbarStrokeWidth;
			if (scrWidth < scrollbarMinWidth) {
				scrollbarPad = (scrollbarMinWidth - scrWidth) / 2;
				scrWidth = scrollbarMinWidth;
				scrX -= scrollbarPad;
			}
			scroller.scrollerWidth = scrollerWidth;
			scroller.scrollerLeft = scrollerLeft = navigatorLeft - scrollbarHeight;


			// draw the buttons
			scroller.drawScrollbarButton(0);
			scroller.drawScrollbarButton(1);

			scrollbarGroup[verb]({
				translateX: scrollerLeft,
				translateY: mathRound(top + height)
			});

			scrollbarTrack[verb]({
				width: scrollerWidth
			});

			// prevent the scrollbar from drawing to small (#1246)
			scrollbar[verb]({
				x: mathFloor(scrX) + (scrollbarStrokeWidth % 2 / 2),
				width: scrWidth
			});

			centerBarX = scrollbarHeight + zoomedMin + range / 2 - 0.5;

			scroller.scrollbarRifles
				.attr({
					visibility: range > 12 ? VISIBLE : HIDDEN
				})[verb]({
					d: [
						M,
						centerBarX - 3, scrollbarHeight / 4,
						L,
						centerBarX - 3, 2 * scrollbarHeight / 3,
						M,
						centerBarX, scrollbarHeight / 4,
						L,
						centerBarX, 2 * scrollbarHeight / 3,
						M,
						centerBarX + 3, scrollbarHeight / 4,
						L,
						centerBarX + 3, 2 * scrollbarHeight / 3
					]
				});
		}

		scroller.scrollbarPad = scrollbarPad;
		scroller.rendered = true;
		scroller.range = range;

	},

	/**
	 * Draw the scrollbar buttons with arrows
	 * @param {Number} index 0 is left, 1 is right
	 */
	drawScrollbarButton: function (index) {
		var scroller = this,
			chart = scroller.chart,
			renderer = chart.renderer,
			elementsToDestroy = scroller.elementsToDestroy,
			scrollbarButtons = scroller.scrollbarButtons,
			scrollbarHeight = scroller.scrollbarHeight,
			scrollbarOptions = scroller.scrollbarOptions,
			tempElem;

		if (!scroller.rendered) {
			scrollbarButtons[index] = renderer.g().add(scroller.scrollbarGroup);

			tempElem = renderer.rect(
					-0.5,
					-0.5,
					scrollbarHeight + 1, // +1 to compensate for crispifying in rect method
					scrollbarHeight + 1,
					scrollbarOptions.buttonBorderRadius,
					scrollbarOptions.buttonBorderWidth
				).attr({
					stroke: scrollbarOptions.buttonBorderColor,
					'stroke-width': scrollbarOptions.buttonBorderWidth,
					fill: scrollbarOptions.buttonBackgroundColor
				}).add(scrollbarButtons[index]);
			elementsToDestroy.push(tempElem);

			tempElem = renderer
				.path([
					'M',
					scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 - 3,
					'L',
					scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 + 3,
					scrollbarHeight / 2 + (index ? 2 : -2), scrollbarHeight / 2
				]).attr({
					fill: scrollbarOptions.buttonArrowColor
				}).add(scrollbarButtons[index]);
			elementsToDestroy.push(tempElem);
		}

		// adjust the right side button to the varying length of the scroll track
		if (index) {
			scrollbarButtons[index].attr({
				translateX: scroller.scrollerWidth - scrollbarHeight
			});
		}
	},

	/**
	 * Set up the mouse and touch events for the Scrollbar
	 */
	addEvents: function () {
		var container = this.chart.container,
			mouseDownHandler = this.mouseDownHandler,
			mouseMoveHandler = this.mouseMoveHandler,
			mouseUpHandler = this.mouseUpHandler,
			_events;

		// Mouse events
		_events = [
			[container, 'mousedown', mouseDownHandler],
			[container, 'mousemove', mouseMoveHandler],
			[container, 'mouseup', mouseUpHandler]
		];

		// Touch events
		if (hasTouch) {
			_events.push(
				[container, 'touchstart', mouseDownHandler],
				[container, 'touchmove', mouseMoveHandler],
				[container, 'touchend', mouseUpHandler]
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
		if (this.navigatorEnabled && this.baseSeries) {
			removeEvent(this.baseSeries, 'updatedData', this.updatedDataHandler);
		}
	},
	/**
	 * Event handler for the mouse move event.
	 */
	mouseMoveHandler: function (e) {
		var chart = Highcharts.charts[this.id.split('-')[1]],
			scroller = chart.scrollbar,
			scrollbarHeight = scroller.scrollbarHeight,
			navigatorLeft = scroller.navigatorLeft,
			navigatorWidth = scroller.navigatorWidth,
			scrollerLeft = scroller.scrollerLeft,
			scrollerWidth = scroller.scrollerWidth,
			range = scroller.range,
			dragOffset = scroller.dragOffset,
			chartX;

		// In iOS, a mousemove event with e.pageX === 0 is fired when holding the finger
		// down in the center of the scrollbar. This should be ignored.
		if (!e.touches || e.touches[0].pageX !== 0) { // #4696, scrollbar failed on Android

			e = chart.pointer.normalize(e);
			chartX = e.chartX;

			// validation for handle dragging
			if (chartX < navigatorLeft) {
				chartX = navigatorLeft;
			} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
				chartX = scrollerLeft + scrollerWidth - scrollbarHeight;
			}

			if (scroller.grabbedCenter) {
				if (chartX < dragOffset) { // outside left
					chartX = dragOffset;
				} else if (chartX > navigatorWidth + dragOffset - range) { // outside right
					chartX = navigatorWidth + dragOffset - range;
				}

				scroller.bindTo.render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
				scroller.render(0, 0, chartX - dragOffset, chartX - dragOffset + range);

				if (scroller.bindTo.scrollbarOptions.liveRedraw) {
					setTimeout(function () {
						scroller.mouseUpHandler(e);
					}, 0);
				}
				scroller.hasDragged = true;
			}
		}
	},

	/**
	 * Event handler for the mouse up event.
	 */
	mouseUpHandler: function (e) {
		var chart = this.chart ? this.chart : Highcharts.charts[this.id.split('-')[1]],
			scroller = chart.scrollbar,
			bindTo = scroller.bindTo,
			xAxis = bindTo.xAxis,
			ext,
			fixedMin,
			fixedMax;

		if (scroller.hasDragged) {
			// When dragging one handle, make sure the other one doesn't change
			if (bindTo.zoomedMin === bindTo.otherHandlePos) {
				fixedMin = bindTo.fixedExtreme;
			} else if (bindTo.zoomedMax === bindTo.otherHandlePos) {
				fixedMax = bindTo.fixedExtreme;
			}

			// Snap to right edge (#4076)
			if (bindTo.zoomedMax === bindTo.navigatorWidth) {
				fixedMax = bindTo.getUnionExtremes().dataMax;
			}

			ext = xAxis.toFixedRange(bindTo.zoomedMin, bindTo.zoomedMax, fixedMin, fixedMax);

			if (defined(ext.min)) {
				chart.xAxis[0].setExtremes(
					ext.min,
					ext.max,
					true,
					false,
					{
						trigger: 'navigator',
						triggerOp: 'navigator-drag',
						DOMEvent: e // #1838
					}
				);
			}
		}

		if (e.type !== 'mousemove') {
			scroller.grabbedCenter = scroller.hasDragged = null;
		}

	},

	mouseDownHandler: function (e) {
		var chart = Highcharts.charts[this.id.split('-')[1]],
			scroller = chart.scrollbar;

		e = chart.pointer.normalize(e);

		var bindTo = scroller.bindTo,
			zoomedMin = bindTo.zoomedMin,
			zoomedMax = bindTo.zoomedMax,
			top = bindTo.top,
			height = bindTo.height,
			scrollbarHeight = scroller.scrollbarHeight,
			scrollerLeft = scroller.scrollerLeft,
			scrollerWidth = scroller.scrollerWidth,
			navigatorLeft = bindTo.navigatorLeft,
			navigatorWidth = bindTo.navigatorWidth,
			scrollbarPad = scroller.scrollbarPad || 0,
			range = bindTo.range,
			chartX = e.chartX,
			chartY = e.chartY,
			baseXAxis = chart.xAxis[0],
			fixedMax,
			ext,
			left,
			xAxis = bindTo.xAxis,
			dragOffset = 0;

		if (chartY > top + height && chartY < top + height + scrollbarHeight) {

			if (chartX > navigatorLeft + zoomedMin - scrollbarPad && chartX < navigatorLeft + zoomedMax + scrollbarPad) {
				
				scroller.grabbedCenter = chartX;
				scroller.fixedWidth = range;
                dragOffset = chartX - zoomedMin;

			} else { 
				// Click left scrollbar button
				if (chartX < navigatorLeft) {
					left = zoomedMin - range * 0.2;

				// Click right scrollbar button
				} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
					left = zoomedMin + range * 0.2;

				// Click on scrollbar track, shift the scrollbar by one range
				} else {
					left = chartX < navigatorLeft + zoomedMin ? // on the left
						zoomedMin - range :
						zoomedMax;
					
					dragOffset = chartX - zoomedMin;
				}

				if (left < 0) {
					left = 0;
				} else if (left + range >= navigatorWidth) {
					left = navigatorWidth - range;
					fixedMax = bindTo.getUnionExtremes().dataMax; // #2293, #3543
				}
				if (left !== zoomedMin) { // it has actually moved
					scroller.fixedWidth = range; // #1370

					ext = xAxis.toFixedRange(left, left + range, null, fixedMax);
					baseXAxis.setExtremes(
						ext.min,
						ext.max,
						true,
						false,
						{ trigger: 'navigator' }
					);
				}
				
			}
		}
		scroller.dragOffset = dragOffset;
	},


	/**
	 * Destroys allocated elements.
	 */
	destroy: function () {
		var scroller = this;

		// Disconnect events added in addEvents
		scroller.removeEvents();

		// Destroy properties
		each([scroller.scrollbarTrack, scroller.scrollbarRifles, scroller.scrollbarGroup, scroller.scrollbar], function (prop) {
			if (prop && prop.destroy) {
				prop.destroy();
			}
		});
		scroller.xAxis = scroller.yAxis = scroller.scrollbarTrack = scroller.scrollbarRifles = scroller.scrollbarGroup = scroller.scrollbar = null;

		// Destroy elements in collection
		each([scroller.scrollbarButtons, scroller.elementsToDestroy], function (coll) {
			destroyObjectProperties(coll);
		});
	}
};