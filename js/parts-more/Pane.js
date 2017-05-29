/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/CenteredSeriesMixin.js';
import '../parts/Utilities.js';
var CenteredSeriesMixin = H.CenteredSeriesMixin,
	each = H.each,
	extend = H.extend,
	merge = H.merge,
	splat = H.splat;
/**
 * The Pane object allows options that are common to a set of X and Y axes.
 *
 * In the future, this can be extended to basic Highcharts and Highstock.
 *
 */
function Pane(options, chart) {
	this.init(options, chart);
}

// Extend the Pane prototype
extend(Pane.prototype, {

	coll: 'pane', // Member of chart.pane

	/**
	 * Initiate the Pane object
	 */
	init: function (options, chart) {
		this.chart = chart;
		this.background = [];

		chart.pane.push(this);

		this.setOptions(options);
	},

	setOptions: function (options) {

		// Set options. Angular charts have a default background (#3318)
		this.options = options = merge(
			this.defaultOptions,
			this.chart.angular ? { background: {} } : undefined,
			options
		);
	},

	/**
	 * Render the pane with its backgrounds.
	 */
	render: function () {

		var options = this.options,
			backgroundOption = this.options.background,
			renderer = this.chart.renderer,
			len,
			i;

		if (!this.group) {
			this.group = renderer.g('pane-group')
				.attr({ zIndex: options.zIndex || 0 })
				.add();
		}

		this.updateCenter();

		// Render the backgrounds
		if (backgroundOption) {
			backgroundOption = splat(backgroundOption);

			len = Math.max(
				backgroundOption.length,
				this.background.length || 0
			);

			for (i = 0; i < len; i++) {
				if (backgroundOption[i] && this.axis) { // #6641 - if axis exists, chart is circular and apply background
					this.renderBackground(
						merge(
							this.defaultBackgroundOptions,
							backgroundOption[i]
						),
						i
					);
				} else if (this.background[i]) {
					this.background[i] = this.background[i].destroy();
					this.background.splice(i, 1);
				}
			}
		}
	},

	/**
	 * Render an individual pane background.
	 * @param  {Object} backgroundOptions Background options
	 * @param  {number} i The index of the background in this.backgrounds
	 */
	renderBackground: function (backgroundOptions, i) {
		var method = 'animate';

		if (!this.background[i]) {
			this.background[i] = this.chart.renderer.path()
				.add(this.group);
			method = 'attr';
		}

		this.background[i][method]({
			'd': this.axis.getPlotBandPath(
				backgroundOptions.from,
				backgroundOptions.to,
				backgroundOptions
			)
		}).attr({
			/*= if (build.classic) { =*/
			'fill': backgroundOptions.backgroundColor,
			'stroke': backgroundOptions.borderColor,
			'stroke-width': backgroundOptions.borderWidth,
			/*= } =*/
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
	},

	/**
	 * Gets the center for the pane and its axis.
	 */
	updateCenter: function (axis) {
		this.center = (axis || this.axis || {}).center =
			CenteredSeriesMixin.getCenter.call(this);
	},

	/**
	 * Destroy the pane item
	 * /
	destroy: function () {
		H.erase(this.chart.pane, this);
		each(this.background, function (background) {
			background.destroy();
		});
		this.background.length = 0;
		this.group = this.group.destroy();
	},
	*/

	/**
	 * Update the pane item with new options
	 * @param  {Object} options New pane options
	 */
	update: function (options, redraw) {
		
		merge(true, this.options, options);
		this.setOptions(this.options);
		this.render();
		each(this.chart.axes, function (axis) {
			if (axis.pane === this) {
				axis.pane = null;
				axis.update({}, redraw);
			}
		}, this);
	}
	
});

H.Pane = Pane;
