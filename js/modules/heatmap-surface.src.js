/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2011-2014 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*global HighchartsAdapter*/
(function (Highcharts) {


var UNDEFINED,
	defaultOptions = Highcharts.getOptions(),
	each = Highcharts.each,
	extendClass = Highcharts.extendClass,
	merge = Highcharts.merge,
	seriesTypes = Highcharts.seriesTypes,
	eps = 0.0001;

/**
 * Extend the default options with map options
 */
defaultOptions.plotOptions.heatmap_surface = merge(defaultOptions.plotOptions.heatmap, {
	marker: merge(
		{}, {
		states: {
			hover: {
				color: 'rgba(255,0,0,0.2)'
			}
		}
	})
});

// The Heatmap series type
seriesTypes.heatmap_surface = extendClass(seriesTypes.heatmap, {
	type: 'heatmap_surface',
	init: function () {
		seriesTypes.heatmap.prototype.init.apply(this, arguments);
	},
	translateColors: function () {
		//Hide the markers, so that the surface is visible instead.
		//Keep in mind that we draw the markers anyway, so that the tooltip still works
		each(this.data, function (point) {
			point.color = 'rgba(0,0,0,0)';
		});
	},
	drawTriangle: function (group, a,b,c) {
		var attribs = {
				'shape-rendering': 'crispEdges'
			};
		var colorKey = this.colorKey;

		//Normalized values of the vertexes
		var values = [
			this.colorAxis.toRelativePosition(a[colorKey]),
			this.colorAxis.toRelativePosition(b[colorKey]),
			this.colorAxis.toRelativePosition(c[colorKey])
		];
		
		//All vertexes have the same value/color
		if (Math.abs(values[0] - values[1]) < eps && Math.abs(values[0] - values[2]) < eps) {
			attribs.fill = this.colorAxis.toColor((a.value+b.value+c.value)/3);
		//Use a linear gradient to interpolate values/colors
		} else {
			//Find function where "Value = A*X + B*Y + C" at the 3 vertexes
			var m = new Matrix([
				[a.plotX, a.plotY, 1, values[0]],
				[b.plotX, b.plotY, 1, values[1]],
				[c.plotX, c.plotY, 1, values[2]]]);
			m.toReducedRowEchelonForm();
			var A = m.mtx[0][3];
			var B = m.mtx[1][3];
			var C = m.mtx[2][3];
			
			//For convenience, we place our gradient control points at (k*A, k*B)
			//We can find the value of K as:
			// Value = A*X + B*Y + C = 
			// Value = A*(A*k) + B*(B*k) + C
			// Value = A²*k + B²*k + C
			// Value = k*(A² + B²) + C
			// k = (Value - C) / (A² + B²)
			var k0 = (0-C) / (A*A + B*B);
			var k1 = (1-C) / (A*A + B*B);
			
			// Assign a linear gradient that interpolates all 3 vertexes
			attribs.fill = {
				linearGradient: {
					x1: k0*A, 
					y1: k0*B, 
					x2: k1*A, 
					y2: k1*B, 
					spreadMethod:'pad', 
					gradientUnits:'userSpaceOnUse'
				},
				stops: this.colorAxis.options.stops || [
					[0, this.colorAxis.options.minColor],
					[1, this.colorAxis.options.maxColor]
				]
			};
		}
		
		
		var path = [
			'M',
			a.plotX + ',' + a.plotY,
			'L',
			b.plotX + ',' + b.plotY,
			'L',
			c.plotX + ',' + c.plotY,
			'Z'
		];
		this.chart.renderer.path(path)
			.attr(attribs)
			.add(group);
	},
	drawGraph: function () {
		var series = this,
			i,j,
			points = series.points,
			options = this.options,
			grid_width = options.grid_width;
		if (!series.surface_group) {
			series.surface_group = this.chart.renderer.g().add(series.group);
		}
		if (series.surface_current_group) {
			series.surface_current_group.destroy();
		}
		var group = series.surface_current_group = this.chart.renderer.g().add(series.surface_group);
		
		if (grid_width) {
			//points are in a nice regular grid
			for (i=1; i<points.length/grid_width; i++) {
				for (j=1; j<options.grid_width; j++) {
					this.drawTriangle(
						group,
						points[( i )*grid_width + (j-1)], 
						points[(i-1)*grid_width + (j-1)], 
						points[(i-1)*grid_width + ( j )]);
					
					this.drawTriangle(
						group,
						points[( i )*grid_width + ( j )], 
						points[( i )*grid_width + (j-1)], 
						points[(i-1)*grid_width + ( j )]);
				}
			}
		} else {
			//If points are not in a regular grid, use Delaunay triangulation.
			//You will have to include this: https://github.com/ironwallaby/delaunay
			var triangles = Delaunay.triangulate(points.map(function(x) {
				return [x.plotX, x.plotY];
			}));
			for (i=0; i<triangles.length; i+=3) {
				this.drawTriangle(
					group,
					points[triangles[i]], 
					points[triangles[i+1]], 
					points[triangles[i+2]]);
			}
		}
	}
});

// ==== Matrix functions =======
	
// http://rosettacode.org/wiki/Matrix_Transpose#JavaScript
function Matrix(ary) {
	this.mtx = ary;
	this.height = ary.length;
	this.width = ary[0].length;
}
	
// http://rosettacode.org/wiki/Reduced_row_echelon_form#JavaScript
Matrix.prototype.toReducedRowEchelonForm = function() {
	var lead = 0, i, j;
	for (var r = 0; r < this.height; r++) {
		if (this.width <= lead) {
			return;
		}
		i = r;
		while (this.mtx[i][lead] === 0) {
			i++;
			if (this.height == i) {
				i = r;
				lead++;
				if (this.width == lead) {
					return;
				}
			}
		}

		var tmp = this.mtx[i];
		this.mtx[i] = this.mtx[r];
		this.mtx[r] = tmp;

		var val = this.mtx[r][lead];
		for (j = 0; j < this.width; j++) {
			this.mtx[r][j] /= val;
		}

		for (i = 0; i < this.height; i++) {
			if (i == r) continue;
			val = this.mtx[i][lead];
			for (j = 0; j < this.width; j++) {
				this.mtx[i][j] -= val * this.mtx[r][j];
			}
		}
		lead++;
	}
	return this;
};

}(Highcharts));