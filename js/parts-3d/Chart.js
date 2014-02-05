/*** 
	EXTENSION FOR 3D CHARTS
***/
H.wrap(HC.prototype, 'init', function (proceed) {	
	var args = arguments;
	args[1] = H.merge({ 
		chart: {
			options3d: {
				alpha: 0,
				beta: 0,
				depth: 0,

				frame: {
					bottom: { size: 1, color: 'transparent' },
					side: { size: 1, color: 'transparent' },
					back: { size: 1, color: 'transparent' }
				}
			}
		}
	}, args[1]);

	proceed.apply(this, [].slice.call(args, 1));
});

H.wrap(HC.prototype, 'setChartSize', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	// Change the clipBox size to encompass the full chart
	var inverted = this.inverted,
		clipBox = this.clipBox,
		x = inverted ? 'y' : 'x',
		y = inverted ? 'x' : 'y',
		w = inverted ? 'height' : 'width',
		h = inverted ? 'width' : 'height';

	clipBox[x] = -(this.margin[3] || 0);
	clipBox[y] = -(this.margin[0] || 0);
	clipBox[w] = this.chartWidth + (this.margin[3] || 0) + (this.margin[1] || 0);
	clipBox[h] = this.chartHeight + (this.margin[0] || 0) + (this.margin[2] || 0);
});

H.wrap(HC.prototype, 'redraw', function (proceed) {
	// Set to force a redraw of all elements
	this.isDirtyBox = true;
	proceed.apply(this, [].slice.call(arguments, 1));	
});


H.wrap(HC.prototype, 'firstRender', function (proceed) {
	// Set to force a redraw of all elements

	proceed.apply(this, [].slice.call(arguments, 1));

	var invSeries = [];

	for (i = 0; i < this.series.length; i++) {
		invSeries.push(this.series[this.series.length - (i + 1)]);
	}
	this.series = invSeries;
	
	this.redraw();
});

HC.prototype.getNumberOfStacks = function () {

	var type = this.chart.options.chart.type;
		options = this.options.plotOptions[type];
		
	// Without grouping all stacks are on the front line.
	if (options.grouping !== false) {
		return 1;
	}

	// If there is no stacking all series are their own stack.
	if (options.stacking === null || options.stacking === undefined) {
		return this.series.length;
	}

	// If there is stacking, count the stacks.
	var stacks = [];
	H.each(this.series, function (serie) {
		stacks[serie.options.stack || 0] = true;
	});
	return stacks.length;
};