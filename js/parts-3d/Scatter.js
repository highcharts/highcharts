/*** 
	EXTENSION FOR 3D SCATTER CHART
***/
Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'translate', function (proceed) {
//function translate3d(proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));
	
	if (!this.chart.is3d()) {
		return;
	}	

	var series = this,
		chart = series.chart,
		depth = chart.options.chart.options3d.depth,
		zAxis = chart.options.zAxis || { min : 0, max: depth };

	var rangeModifier = depth / (zAxis.max - zAxis.min),
		raw_points = [],
		raw_point,
		projected_points,
		projected_point,
		i;

	for (i = 0; i < series.data.length; i++) {
		raw_point = series.data[i];
		raw_points.push({
			x: raw_point.plotX,
			y: raw_point.plotY,
			z: (raw_point.z - zAxis.min) * rangeModifier
		});
	}

	projected_points = perspective(raw_points, chart, true);

	for (i = 0; i < series.data.length; i++) {
		raw_point = series.data[i];
		projected_point = projected_points[i];

		raw_point.plotXold = raw_point.plotX;
		raw_point.plotYold = raw_point.plotY;

		raw_point.plotX = projected_point.x;
		raw_point.plotY = projected_point.y;
		raw_point.plotZ = projected_point.z;
	}
});

Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'init', function (proceed) {
	var result = proceed.apply(this, [].slice.call(arguments, 1));

	if (this.chart.is3d()) {
		// Add a third coordinate
		this.pointArrayMap = ['x', 'y', 'z'];

		// Set a new default tooltip formatter
		var default3dScatterTooltip = 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>';
		if (this.userOptions.tooltip) {
			this.tooltipOptions.pointFormat = this.userOptions.tooltip.pointFormat || default3dScatterTooltip;
		} else {
			this.tooltipOptions.pointFormat = default3dScatterTooltip;
		}
	}
	return result;
});
