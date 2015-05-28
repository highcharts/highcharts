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
		zAxis = Highcharts.pick(series.zAxis, chart.options.zAxis[0]);

	var raw_points = [],
		raw_point,
		projected_points,
		projected_point,
		i;

	for (i = 0; i < series.data.length; i++) {
		raw_point = series.data[i];

		raw_point.isInside = raw_point.isInside ? (raw_point.z >= zAxis.min && raw_point.z <= zAxis.max) : false;

		raw_points.push({
			x: raw_point.plotX,
			y: raw_point.plotY,
			z: zAxis.translate(raw_point.z)
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

Highcharts.wrap(Highcharts.seriesTypes.scatter.prototype, 'init', function (proceed, chart, options) {
	if (chart.is3d()) {
		// add a third coordinate
		this.axisTypes = ['xAxis', 'yAxis', 'zAxis'];
		this.pointArrayMap = ['x', 'y', 'z'];
		this.parallelArrays = ['x', 'y', 'z'];
	}

	var result = proceed.apply(this, [chart, options]);

	if (this.chart.is3d()) {
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
