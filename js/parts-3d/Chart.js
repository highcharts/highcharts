/**
 *	3D Chart
 */
H.wrap(HC.prototype, 'init', function (proceed, userOptions, callback) {
	userOptions = H.merge({
		chart: {
			options3d: {
				angle1: 0,
				angle2: 0,
				depth: 0,
				frame: {
					x: 0,
					y: [0, 0]
				}
			}
		}
	},
	userOptions // user's options
	);

	// Proceed as normal
	proceed.apply(this, [userOptions, callback]);

	// Make the clipbox larger
	var mainSVG = this.container.childNodes[0];
	this.clipRect.destroy();
	this.clipRect = this.renderer.rect({x: 0, y: 0, height: this.chartHeight, width: this.chartWidth}).add(mainSVG);
});

HC.prototype.getZPosition = function (serie) {
	// Without grouping all stacks are on the front line.
	if (this.options.plotOptions.column.grouping !== false) { 
		return 0;
	}

	var stacking = this.options.plotOptions.column.stacking,
		i = (stacking ? (serie.options.stack || 0) : serie._i),	// The number of the stack
		result = 0,		
		stacks = [],
		cnt,
		S;

	// Count the number of stacks in front of this one.
	for (cnt = 0; cnt < i; cnt++) {
		S = this.series[cnt];
		if (S.visible && !stacks[S.options.stack || 0]) {
			result++;
			stacks[S.options.stack || 0] = true;
		}
	}

	return result;
};

HC.prototype.getNumberOfStacks = function () {
	var options = this.options.plotOptions.column;

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

HC.prototype.getTotalDepth = function () {
	return this.getNumberOfStacks() * (this.options.chart.options3d.depth || 0) * 1.5;
};
