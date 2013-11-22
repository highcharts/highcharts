/**
 *	Extension for the Chart
 */

 H.wrap(HC.prototype, 'init', function (proceed) {	
	proceed.apply(this, [].slice.call(arguments, 1));
});


 H.wrap(HC.prototype, 'redraw', function (proceed) {	
	proceed.apply(this, [].slice.call(arguments, 1));

	var mainSVG = this.container.childNodes[0];
	this.clipRect.destroy();
	this.clipRect = this.renderer.rect({x: 0, y: 0, height: this.chartHeight, width: this.chartWidth}).add(mainSVG);
});

HC.prototype.getZPosition = function(serie) {
	if (this.options.plotOptions.column.grouping !== false) return 0;

	var stacking = this.options.plotOptions.column.stacking,
		i = (stacking ? (serie.options.stack || 0) : serie._i),
		vis = 0;		
		stacks = [];

	H.each(this.series, function (serie) {
		if (serie.visible) {
			var i2 = (stacking ? (serie.options.stack || 0) : serie._i);
			stacks[i2] = true;
			vis++;			
		}
	});
	
	var result = i,
		cnt;

	for (cnt = 0; cnt < i; cnt++) {
		if (stacks[cnt] !== true) {
			result--;
		}
	}

	return result;
}

HC.prototype.getNumberOfStacks = function() {
	if (this.options.plotOptions.column.grouping !== false) return 1;

	var stacking = this.options.plotOptions.column.stacking,	
		stacks = [];

	H.each(this.series, function (serie) {
		var i = (stacking ? (serie.options.stack || 0) : serie._i);
		stacks[i] = true;
	});
	
	return stacks.length;
}

HC.prototype.getTotalDepth = function () {
	return this.getNumberOfStacks() * this.options.D3.depth * 1.5;
}
