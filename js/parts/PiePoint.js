/**
 * Extended point object for pies
 */
var PiePoint = extendClass(Point, {
	/**
	 * Initiate the pie slice
	 */
	init: function () {
		
		Point.prototype.init.apply(this, arguments);
		
		var point = this,
			toggleSlice;
		
		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice')
		});
		
		// add event listener for select
		toggleSlice = function() {
			point.slice();
		};
		addEvent(point, 'select', toggleSlice);
		addEvent(point, 'unselect', toggleSlice);
		
		return point;
	},
	
	/**
	 * Toggle the visibility of the pie slice
	 * @param {Boolean} vis Whether to show the slice or not. If undefined, the
	 *    visibility is toggled
	 */
	setVisible: function(vis) {	
		var point = this, 
			chart = point.series.chart,
			tracker = point.tracker,
			dataLabel = point.dataLabel,
			connector = point.connector,
			method;
		
		// if called without an argument, toggle visibility
		point.visible = vis = vis === UNDEFINED ? !point.visible : vis;
		
		method = vis ? 'show' : 'hide';
		
		point.group[method]();
		if (tracker) {
			tracker[method]();
		}
		if (dataLabel) {
			dataLabel[method]();
		}
		if (connector) {
			connector[method]();
		}
		if (point.legendItem) {
			chart.legend.colorizeItem(point, vis);
		}
	},
	
	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled 
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function(sliced, redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			slicedTranslation = point.slicedTranslation,
			translation;
			
		setAnimation(animation, chart);
		
		// redraw is true by default
		redraw = pick(redraw, true);
			
		// if called without an argument, toggle
		sliced = point.sliced = defined(sliced) ? sliced : !point.sliced;
		
		translation = {
			translateX: (sliced ? slicedTranslation[0] : chart.plotLeft),
			translateY: (sliced ? slicedTranslation[1] : chart.plotTop)
		};
		point.group.animate(translation);
		if (point.shadowGroup) {
			point.shadowGroup.animate(translation);
		}
		
	}
});
