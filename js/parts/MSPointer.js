if (win.PointerEvent || win.MSPointerEvent) {
	
	// The touches object keeps track of the points being touched at all times
	var touches = {};

	// Emulate a Webkit TouchList 
	Pointer.prototype.getWebkitTouches = function () {
		var key, fake = [];
		fake.item = function (i) { return this[i]; };
		for (key in touches) {
			if (touches.hasOwnProperty(key)) {
				fake.push({
					pageX: touches[key].pageX,
					pageY: touches[key].pageY,
					target: touches[key].target
				});
			}
		}
		return fake;
	};

	// Disable default IE actions for pinch and such on chart element
	wrap(Pointer.prototype, 'init', function (proceed, chart, options) {
		chart.container.style["-ms-touch-action"] = chart.container.style["touch-action"] = "none";
		proceed.call(this, chart, options);
	});

	// Add IE specific touch events to chart
	wrap(Pointer.prototype, 'setDOMEvents', function (proceed) {
		var pointer = this, eventmap;
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		eventmap = [
			[this.chart.container, "PointerDown", "touchstart", "onContainerTouchStart", function (e) {
				touches[e.pointerId] = { pageX: e.pageX, pageY: e.pageY, target: e.currentTarget };
			}],
			[this.chart.container, "PointerMove", "touchmove", "onContainerTouchMove", function (e) {
				touches[e.pointerId] = { pageX: e.pageX, pageY: e.pageY };
				if (!touches[e.pointerId].target) {
					touches[e.pointerId].target = e.currentTarget;
				}	
			}],
			[document, "PointerUp", "touchend", "onDocumentTouchEnd", function (e) {
				delete touches[e.pointerId];
			}]
		];
		
		each(eventmap, function (eventConfig) {
			addEvent(eventConfig[0], window.PointerEvent ? eventConfig[1].toLowerCase() : "MS" + eventConfig[1], function (e) {
				e = e.originalEvent;
				if (e.pointerType === "touch" || e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
					eventConfig[4](e);
					
					// This event corresponds to ontouchstart - call onContainerTouchStart
					pointer[eventConfig[3]]({
						type: eventConfig[2],
						target: e.currentTarget,
						preventDefault: noop,
						touches: pointer.getWebkitTouches()
					});
				}
			});
		});
	   
	});
}	 
