/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Pointer.js';
import '../parts/Series.js';
import '../parts/Pointer.js';

/**
 * Extensions for polar charts. Additionally, much of the geometry required for polar charts is
 * gathered in RadialAxes.js.
 *
 */

var each = H.each,
	pick = H.pick,
	Pointer = H.Pointer,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	wrap = H.wrap,

	seriesProto = Series.prototype,
	pointerProto = Pointer.prototype,
	colProto;

/**
 * Search a k-d tree by the point angle, used for shared tooltips in polar charts
 */
seriesProto.searchPointByAngle = function (e) {
	var series = this,
		chart = series.chart,
		xAxis = series.xAxis,
		center = xAxis.pane.center,
		plotX = e.chartX - center[0] - chart.plotLeft,
		plotY = e.chartY - center[1] - chart.plotTop;

	return this.searchKDTree({
		clientX: 180 + (Math.atan2(plotX, plotY) * (-180 / Math.PI))
	});

};

/**
 * Wrap the buildKDTree function so that it searches by angle (clientX) in case of shared tooltip,
 * and by two dimensional distance in case of non-shared.
 */
wrap(seriesProto, 'buildKDTree', function (proceed) {
	if (this.chart.polar) {
		if (this.kdByAngle) {
			this.searchPoint = this.searchPointByAngle;
		} else {
			this.kdDimensions = 2;
		}
	}
	proceed.apply(this);
});

/**
 * Translate a point's plotX and plotY from the internal angle and radius measures to
 * true plotX, plotY coordinates
 */
seriesProto.toXY = function (point) {
	var xy,
		chart = this.chart,
		plotX = point.plotX,
		plotY = point.plotY,
		clientX;

	// Save rectangular plotX, plotY for later computation
	point.rectPlotX = plotX;
	point.rectPlotY = plotY;

	// Find the polar plotX and plotY
	xy = this.xAxis.postTranslate(point.plotX, this.yAxis.len - plotY);
	point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
	point.plotY = point.polarPlotY = xy.y - chart.plotTop;

	// If shared tooltip, record the angle in degrees in order to align X points. Otherwise,
	// use a standard k-d tree to get the nearest point in two dimensions.
	if (this.kdByAngle) {
		clientX = ((plotX / Math.PI * 180) + this.xAxis.pane.options.startAngle) % 360;
		if (clientX < 0) { // #2665
			clientX += 360;
		}
		point.clientX = clientX;
	} else {
		point.clientX = point.plotX;
	}
};

if (seriesTypes.spline) {
	/**
	 * Overridden method for calculating a spline from one point to the next
	 */
	wrap(seriesTypes.spline.prototype, 'getPointSpline', function (proceed, segment, point, i) {

		var ret,
			smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc;
			denom = smoothing + 1,
			plotX,
			plotY,
			lastPoint,
			nextPoint,
			lastX,
			lastY,
			nextX,
			nextY,
			leftContX,
			leftContY,
			rightContX,
			rightContY,
			distanceLeftControlPoint,
			distanceRightControlPoint,
			leftContAngle,
			rightContAngle,
			jointAngle;


		if (this.chart.polar) {

			plotX = point.plotX;
			plotY = point.plotY;
			lastPoint = segment[i - 1];
			nextPoint = segment[i + 1];

			// Connect ends
			if (this.connectEnds) {
				if (!lastPoint) {
					lastPoint = segment[segment.length - 2]; // not the last but the second last, because the segment is already connected
				}
				if (!nextPoint) {
					nextPoint = segment[1];
				}
			}

			// find control points
			if (lastPoint && nextPoint) {

				lastX = lastPoint.plotX;
				lastY = lastPoint.plotY;
				nextX = nextPoint.plotX;
				nextY = nextPoint.plotY;
				leftContX = (smoothing * plotX + lastX) / denom;
				leftContY = (smoothing * plotY + lastY) / denom;
				rightContX = (smoothing * plotX + nextX) / denom;
				rightContY = (smoothing * plotY + nextY) / denom;
				distanceLeftControlPoint = Math.sqrt(Math.pow(leftContX - plotX, 2) + Math.pow(leftContY - plotY, 2));
				distanceRightControlPoint = Math.sqrt(Math.pow(rightContX - plotX, 2) + Math.pow(rightContY - plotY, 2));
				leftContAngle = Math.atan2(leftContY - plotY, leftContX - plotX);
				rightContAngle = Math.atan2(rightContY - plotY, rightContX - plotX);
				jointAngle = (Math.PI / 2) + ((leftContAngle + rightContAngle) / 2);


				// Ensure the right direction, jointAngle should be in the same quadrant as leftContAngle
				if (Math.abs(leftContAngle - jointAngle) > Math.PI / 2) {
					jointAngle -= Math.PI;
				}

				// Find the corrected control points for a spline straight through the point
				leftContX = plotX + Math.cos(jointAngle) * distanceLeftControlPoint;
				leftContY = plotY + Math.sin(jointAngle) * distanceLeftControlPoint;
				rightContX = plotX + Math.cos(Math.PI + jointAngle) * distanceRightControlPoint;
				rightContY = plotY + Math.sin(Math.PI + jointAngle) * distanceRightControlPoint;

				// Record for drawing in next point
				point.rightContX = rightContX;
				point.rightContY = rightContY;

			}


			// moveTo or lineTo
			if (!i) {
				ret = ['M', plotX, plotY];
			} else { // curve from last point to this
				ret = [
					'C',
					lastPoint.rightContX || lastPoint.plotX,
					lastPoint.rightContY || lastPoint.plotY,
					leftContX || plotX,
					leftContY || plotY,
					plotX,
					plotY
				];
				lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
			}


		} else {
			ret = proceed.call(this, segment, point, i);
		}
		return ret;
	});
}

/**
 * Extend translate. The plotX and plotY values are computed as if the polar chart were a
 * cartesian plane, where plotX denotes the angle in radians and (yAxis.len - plotY) is the pixel distance from
 * center.
 */
wrap(seriesProto, 'translate', function (proceed) {
	var chart = this.chart,
		points,
		i;

	// Run uber method
	proceed.call(this);

	// Postprocess plot coordinates
	if (chart.polar) {
		this.kdByAngle = chart.tooltip && chart.tooltip.shared;

		if (!this.preventPostTranslate) {
			points = this.points;
			i = points.length;

			while (i--) {
				// Translate plotX, plotY from angle and radius to true plot coordinates
				this.toXY(points[i]);
			}
		}
	}
});

/**
 * Extend getSegmentPath to allow connecting ends across 0 to provide a closed circle in
 * line-like series.
 */
wrap(seriesProto, 'getGraphPath', function (proceed, points) {
	var series = this,
		i,
		firstValid;
	
	// Connect the path
	if (this.chart.polar) {
		points = points || this.points;

		// Append first valid point in order to connect the ends
		for (i = 0; i < points.length; i++) {
			if (!points[i].isNull) {
				firstValid = i;
				break;
			}
		}
		if (this.options.connectEnds !== false && firstValid !== undefined) {
			this.connectEnds = true; // re-used in splines
			points.splice(points.length, 0, points[firstValid]);
		}

		// For area charts, pseudo points are added to the graph, now we need to translate these
		each(points, function (point) {
			if (point.polarPlotY === undefined) {
				series.toXY(point);
			}
		});
	}

	// Run uber method
	return proceed.apply(this, [].slice.call(arguments, 1));

});


function polarAnimate(proceed, init) {
	var chart = this.chart,
		animation = this.options.animation,
		group = this.group,
		markerGroup = this.markerGroup,
		center = this.xAxis.center,
		plotLeft = chart.plotLeft,
		plotTop = chart.plotTop,
		attribs;

	// Specific animation for polar charts
	if (chart.polar) {

		// Enable animation on polar charts only in SVG. In VML, the scaling is different, plus animation
		// would be so slow it would't matter.
		if (chart.renderer.isSVG) {

			if (animation === true) {
				animation = {};
			}

			// Initialize the animation
			if (init) {

				// Scale down the group and place it in the center
				attribs = {
					translateX: center[0] + plotLeft,
					translateY: center[1] + plotTop,
					scaleX: 0.001, // #1499
					scaleY: 0.001
				};

				group.attr(attribs);
				if (markerGroup) {
					//markerGroup.attrSetters = group.attrSetters;
					markerGroup.attr(attribs);
				}

			// Run the animation
			} else {
				attribs = {
					translateX: plotLeft,
					translateY: plotTop,
					scaleX: 1,
					scaleY: 1
				};
				group.animate(attribs, animation);
				if (markerGroup) {
					markerGroup.animate(attribs, animation);
				}

				// Delete this function to allow it only once
				this.animate = null;
			}
		}

	// For non-polar charts, revert to the basic animation
	} else {
		proceed.call(this, init);
	}
}

// Define the animate method for regular series
wrap(seriesProto, 'animate', polarAnimate);


if (seriesTypes.column) {

	colProto = seriesTypes.column.prototype;

	colProto.polarArc = function (low, high, start, end) {
		var center = this.xAxis.center,
			len = this.yAxis.len;
			
		return this.chart.renderer.symbols.arc(
			center[0],
			center[1],
			len - high,
			null,
			{
				start: start,
				end: end,
				innerR: len - pick(low, len)
			}
		);
	};

	/**
	* Define the animate method for columnseries
	*/
	wrap(colProto, 'animate', polarAnimate);


	/**
	 * Extend the column prototype's translate method
	 */
	wrap(colProto, 'translate', function (proceed) {

		var xAxis = this.xAxis,
			startAngleRad = xAxis.startAngleRad,
			start,
			points,
			point,
			i;

		this.preventPostTranslate = true;

		// Run uber method
		proceed.call(this);

		// Postprocess plot coordinates
		if (xAxis.isRadial) {
			points = this.points;
			i = points.length;
			while (i--) {
				point = points[i];
				start = point.barX + startAngleRad;
				point.shapeType = 'path';
				point.shapeArgs = {
					d: this.polarArc(point.yBottom, point.plotY, start, start + point.pointWidth)
				};
				// Provide correct plotX, plotY for tooltip
				this.toXY(point);
				point.tooltipPos = [point.plotX, point.plotY];
				point.ttBelow = point.plotY > xAxis.center[1];
			}
		}
	});


	/**
	 * Align column data labels outside the columns. #1199.
	 */
	wrap(colProto, 'alignDataLabel', function (proceed, point, dataLabel, options, alignTo, isNew) {

		if (this.chart.polar) {
			var angle = point.rectPlotX / Math.PI * 180,
				align,
				verticalAlign;

			// Align nicely outside the perimeter of the columns
			if (options.align === null) {
				if (angle > 20 && angle < 160) {
					align = 'left'; // right hemisphere
				} else if (angle > 200 && angle < 340) {
					align = 'right'; // left hemisphere
				} else {
					align = 'center'; // top or bottom
				}
				options.align = align;
			}
			if (options.verticalAlign === null) {
				if (angle < 45 || angle > 315) {
					verticalAlign = 'bottom'; // top part
				} else if (angle > 135 && angle < 225) {
					verticalAlign = 'top'; // bottom part
				} else {
					verticalAlign = 'middle'; // left or right
				}
				options.verticalAlign = verticalAlign;
			}

			seriesProto.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
		} else {
			proceed.call(this, point, dataLabel, options, alignTo, isNew);
		}

	});
}

/**
 * Extend getCoordinates to prepare for polar axis values
 */
wrap(pointerProto, 'getCoordinates', function (proceed, e) {
	var chart = this.chart,
		ret = {
			xAxis: [],
			yAxis: []
		};

	if (chart.polar) {

		each(chart.axes, function (axis) {
			var isXAxis = axis.isXAxis,
				center = axis.center,
				x = e.chartX - center[0] - chart.plotLeft,
				y = e.chartY - center[1] - chart.plotTop;

			ret[isXAxis ? 'xAxis' : 'yAxis'].push({
				axis: axis,
				value: axis.translate(
					isXAxis ?
						Math.PI - Math.atan2(x, y) : // angle
						Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), // distance from center
					true
				)
			});
		});

	} else {
		ret = proceed.call(this, e);
	}

	return ret;
});
