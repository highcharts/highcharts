/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var each = H.each,
	extend = H.extend,
	merge = H.merge,
	splat = H.splat;
/**
 * The Pane object allows options that are common to a set of X and Y axes.
 *
 * In the future, this can be extended to basic Highcharts and Highstock.
 */
function Pane(options, chart) {
	this.init(options, chart);
}

// Extend the Pane prototype
extend(Pane.prototype, {

	/**
	 * Initiate the Pane object
	 */
	init: function (options, chart) {
		this.chart = chart;
		this.backgrounds = [];

		// Set options. Angular charts have a default background (#3318)
		this.options = options = merge(
			this.defaultOptions,
			chart.angular ? { background: {} } : undefined,
			options
		);
	},

	/**
	 * Render the pane with its backgrounds.
	 */
	render: function () {

		var options = this.options,
			backgroundOption = this.options.background,
			renderer = this.chart.renderer;

		this.group = renderer.g('pane-group')
			.attr({ zIndex: options.zIndex || 0 })
			.add();

		
		// To avoid having weighty logic to place, update and remove the
		// backgrounds, push them to the first axis' plot bands and borrow the
		// existing logic there.
		if (backgroundOption) {
			each(splat(backgroundOption), function (config, i) {
				this.renderBackground(
					merge(this.defaultBackgroundOptions, config),
					i
				);
			}, this);
		}
	},

	/**
	 * Render an individual pane background.
	 * @param  {Object} backgroundOptions Background options
	 * @param  {number} i The index of the background in this.backgrounds
	 */
	renderBackground: function (backgroundOptions, i) {
		var method = 'animate';
		
		if (!this.backgrounds[i]) {
			this.backgrounds[i] = this.chart.renderer.path()
				.add(this.group);
			method = 'attr';
		}

		this.backgrounds[i][method]({
			/*= if (build.classic) { =*/
			'fill': backgroundOptions.backgroundColor,
			'stroke': backgroundOptions.borderColor,
			'stroke-width': backgroundOptions.borderWidth,
			/*= } =*/
			'd': this.axis.getPlotBandPath(
				backgroundOptions.from,
				backgroundOptions.to,
				backgroundOptions
			)
		}).attr({
			'class': 'highcharts-pane ' + (backgroundOptions.className || '')
		});

	},

	/**
	 * The default options object
	 */
	defaultOptions: {
		// background: {conditional},
		center: ['50%', '50%'],
		size: '85%',
		startAngle: 0
		//endAngle: startAngle + 360
	},

	/**
	 * The default background options
	 */
	defaultBackgroundOptions: {
		//className: 'highcharts-pane',
		shape: 'circle',
		/*= if (build.classic) { =*/
		borderWidth: 1,
		borderColor: '${palette.neutralColor20}',
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, '${palette.backgroundColor}'],
				[1, '${palette.neutralColor10}']
			]
		},
		/*= } =*/
		from: -Number.MAX_VALUE, // corrected to axis min
		innerRadius: 0,
		to: Number.MAX_VALUE, // corrected to axis max
		outerRadius: '105%'
	}
	
});

H.Pane = Pane;
