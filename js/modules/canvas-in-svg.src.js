var wrap = Highcharts.wrap,
	seriesTypes = Highcharts.seriesTypes;

Highcharts.Series.prototype.getContext = function () {
	if (!this.canvas) {
			var ns = 'http://www.w3.org/1999/xhtml';
			var fo = this.chart.renderer.createElement('foreignObject').add(this.group);
			this.canvas = document.createElementNS(ns, 'canvas');
			this.canvas.setAttribute('width', this.chart.chartWidth);
			this.canvas.setAttribute('height', this.chart.chartHeight);
			fo.element.appendChild(this.canvas);
			this.ctx = this.canvas.getContext('2d');
			this.ctx.translate(this.group.translateX, this.group.translateY)
		}
	return this.ctx;

}
Highcharts.wrap(Highcharts.seriesTypes.heatmap.prototype, 'drawPoints', function (proceed) {
	//console.time('@drawPoints');

	var useCanvas = true;

	if (useCanvas) {
		
	 	// draw the columns
		var ctx = this.getContext();
		Highcharts.each(this.points, function (point) {
			var plotY = point.plotY,
				shapeArgs;

			if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
				shapeArgs = point.shapeArgs;
				
				ctx.fillStyle = point.pointAttr[''].fill;
				ctx.fillRect(shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height);
			}
		});
	
	} else {
		proceed.call(this);
	
	}

	//console.timeEnd('@drawPoints');
});
/*
Highcharts.seriesTypes.scatter.prototype.pointClass = Highcharts.extendClass(Highcharts.Point, {
    init: function (series, options) {
        this.series = series;
        this.x = options[0];
        this.y = options[1];
        return this;
    }
});
*/

Highcharts.seriesTypes.scatter.prototype.drawPoints = function () {
	//console.time('@drawPoints');

	var useCanvas = true;

	if (useCanvas) {

	 	// draw the columns
		var ctx = this.getContext(),
			fill = this.pointAttr[''].fill;

				
		Highcharts.each(this.points, function (point) {
			var plotY = point.plotY,
				shapeArgs;

			if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
				ctx.beginPath();
				ctx.arc(point.plotX,plotY,1,0,2*Math.PI);
				ctx.fillStyle = fill;
				ctx.fill();
			}
		});
	
	} else {
		proceed.call(this);
	
	}

	//console.timeEnd('@drawPoints');

}