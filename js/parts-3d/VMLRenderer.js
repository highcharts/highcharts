/**
 *	Extension to the VML Renderer
 */
if (Highcharts.VMLRenderer) {

Highcharts.VMLRenderer.prototype.cuboid = Highcharts.SVGRenderer.prototype.cuboid;
Highcharts.VMLRenderer.prototype.cuboidPath = Highcharts.SVGRenderer.prototype.cuboidPath;

Highcharts.VMLRenderer.prototype.toLinePath = Highcharts.SVGRenderer.prototype.toLinePath;

Highcharts.VMLRenderer.prototype.createElement3D = Highcharts.SVGRenderer.prototype.createElement3D;

Highcharts.VMLRenderer.prototype.arc3d = function (shapeArgs) { 
	var result = Highcharts.SVGRenderer.prototype.arc3d.call(this, shapeArgs);
	result.css({zIndex: result.zIndex});
	return result;
};

Highcharts.VMLRenderer.prototype.arc3dPath = Highcharts.SVGRenderer.prototype.arc3dPath;

// Draw the series in the reverse order
Highcharts.Chart.prototype.renderSeries = function () {
	var serie,
		i = this.series.length;
	while (i--) {		
		serie = this.series[i];
		serie.translate();
		if (serie.setTooltipPoints) {
			serie.setTooltipPoints();
		}
		serie.render();	
	}
};

}
