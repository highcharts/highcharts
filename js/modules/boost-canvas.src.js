/**
 * License: www.highcharts.com/license
 * Author: Torstein Honsi, Christer Vasseng
 * 
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with HTML5 canvas compatible browsers (not IE < 9).
 *
 *
 * 
 * Development plan
 * - Column range.
 * - Heatmap. Modify the heatmap-canvas demo so that it uses this module.
 * - Treemap.
 * - Check how it works with Highstock and data grouping. Currently it only works when navigator.adaptToUpdatedData
 *   is false. It is also recommended to set scrollbar.liveRedraw to false.
 * - Check inverted charts.
 * - Check reversed axes.
 * - Chart callback should be async after last series is drawn. (But not necessarily, we don't do
	 that with initial series animation).
 * - Cache full-size image so we don't have to redraw on hide/show and zoom up. But k-d-tree still
 *   needs to be built.
 * - Test IE9 and IE10.
 * - Stacking is not perhaps not correct since it doesn't use the translation given in 
 *   the translate method. If this gets to complicated, a possible way out would be to 
 *   have a simplified renderCanvas method that simply draws the areaPath on a canvas.
 *
 * If this module is taken in as part of the core
 * - All the loading logic should be merged with core. Update styles in the core.
 * - Most of the method wraps should probably be added directly in parent methods.
 *
 * Notes for boost mode
 * - Area lines are not drawn
 * - Point markers are not drawn on line-type series
 * - Lines are not drawn on scatter charts
 * - Zones and negativeColor don't work
 * - Initial point colors aren't rendered
 * - Columns are always one pixel wide. Don't set the threshold too low.
 *
 * Optimizing tips for users
 * - For scatter plots, use a marker.radius of 1 or less. It results in a rectangle being drawn, which is 
 *   considerably faster than a circle.
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering time.
 * - The default threshold is set based on one series. If you have multiple, dense series, the combined
 *   number of points drawn gets higher, and you may want to set the threshold lower in order to 
 *   use optimizations.
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Color.js';
import '../parts/Series.js';
import '../parts/Options.js';

var win = H.win,
	doc = win.document,
	noop = function () {},
	Color = H.Color,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	each = H.each,
	extend = H.extend,
	addEvent = H.addEvent,
	fireEvent = H.fireEvent,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	wrap = H.wrap,
	CHUNK_SIZE = 50000,
	destroyLoadingDiv;

function eachAsync(arr, fn, finalFunc, chunkSize, i) {
	i = i || 0;
	chunkSize = chunkSize || CHUNK_SIZE;
	
	var threshold = i + chunkSize,
		proceed = true;

	while (proceed && i < threshold && i < arr.length) {
		proceed = fn(arr[i], i);
		i = i + 1;
	}
	if (proceed) {
		if (i < arr.length) {
			setTimeout(function () {
				eachAsync(arr, fn, finalFunc, chunkSize, i);
			});
		} else if (finalFunc) {
			finalFunc();
		}
	}
}

/*
 * Returns true if the chart is in series boost mode
 * @param chart {Highchart.Chart} - the chart to check
 * @returns {Boolean} - true if the chart is in series boost mode
 */
function isChartSeriesBoosting(chart) {	
	var threshold = (chart.options.boost ? chart.options.boost.seriesThreshold : 0) || 
					chart.options.chart.seriesBoostThreshold ||
					10;

	return chart.series.length >= threshold;
}

H.initCanvasBoost = function () {

	if (H.seriesTypes.heatmap) {
		H.wrap(H.seriesTypes.heatmap.prototype, 'drawPoints', function () {
			var ctx = this.getContext();
			if (ctx) {

				// draw the columns
				each(this.points, function (point) {
					var plotY = point.plotY,
						shapeArgs,
						pointAttr;

					if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
						shapeArgs = point.shapeArgs;

						/*= if (build.classic) { =*/
						pointAttr = point.series.pointAttribs(point);
						/*= } else { =*/
						pointAttr = point.series.colorAttribs(point);
						/*= } =*/					

						ctx.fillStyle = pointAttr.fill;
						ctx.fillRect(shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height);
					}
				});

				this.canvasToSVG();

			} else {
				this.chart.showLoading('Your browser doesn\'t support HTML5 canvas, <br>please use a modern browser');

				// Uncomment this to provide low-level (slow) support in oldIE. It will cause script errors on
				// charts with more than a few thousand points.
				// arguments[0].call(this);
			}
		});
	}


	/**
	 * Override a bunch of methods the same way. If the number of points is below the threshold,
	 * run the original method. If not, check for a canvas version or do nothing.
	 */
	// each(['translate', 'generatePoints', 'drawTracker', 'drawPoints', 'render'], function (method) {
	// 	function branch(proceed) {
	// 		var letItPass = this.options.stacking && (method === 'translate' || method === 'generatePoints');
	// 		if (((this.processedXData || this.options.data).length < (this.options.boostThreshold || Number.MAX_VALUE) ||
	// 				letItPass) || !isChartSeriesBoosting(this.chart)) {

	// 			// Clear image
	// 			if (method === 'render' && this.image) {
	// 				this.image.attr({ href: '' });
	// 				this.animate = null; // We're zooming in, don't run animation
	// 			}

	// 			proceed.call(this);

	// 		// If a canvas version of the method exists, like renderCanvas(), run
	// 		} else if (this[method + 'Canvas']) {

	// 			this[method + 'Canvas']();
	// 		}
	// 	}
	// 	wrap(Series.prototype, method, branch);

	// 	// A special case for some types - its translate method is already wrapped
	// 	if (method === 'translate') {
	// 		each(['arearange', 'bubble', 'column'], function (type) {
	// 			if (seriesTypes[type]) {
	// 				wrap(seriesTypes[type].prototype, method, branch);
	// 			}
	// 		});
	// 	}
	// });

	H.extend(Series.prototype, {
		directTouch: false,
		pointRange: 0,
		allowDG: false, // No data grouping, let boost handle large data 
		hasExtremes: function (checkX) {
			var options = this.options,
				data = options.data,
				xAxis = this.xAxis && this.xAxis.options,
				yAxis = this.yAxis && this.yAxis.options;
			return data.length > (options.boostThreshold || Number.MAX_VALUE) && isNumber(yAxis.min) && isNumber(yAxis.max) &&
				(!checkX || (isNumber(xAxis.min) && isNumber(xAxis.max)));
		},

		/**
		 * If implemented in the core, parts of this can probably be shared with other similar
		 * methods in Highcharts.
		 */
		destroyGraphics: function () {
			var series = this,
				points = this.points,
				point,
				i;

			if (points) {
				for (i = 0; i < points.length; i = i + 1) {
					point = points[i];
					if (point && point.graphic) {
						point.graphic = point.graphic.destroy();
					}
				}
			}

			each(['graph', 'area', 'tracker'], function (prop) {
				if (series[prop]) {
					series[prop] = series[prop].destroy();
				}
			});
		},

		/**
		 * Create a hidden canvas to draw the graph on. The contents is later copied over 
		 * to an SVG image element.
		 */
		getContext: function () {
			var chart = this.chart,
				width = chart.chartWidth,
				height = chart.chartHeight,
				targetGroup = this.group,
				target = this,
				ctx,
				swapXY = function (proceed, x, y, a, b, c, d) {
					proceed.call(this, y, x, a, b, c, d);
				};

			if (isChartSeriesBoosting(chart)) {
				target = chart;
				targetGroup = chart.seriesGroup;
			}

			ctx = target.ctx;

			if (!target.canvas) {
				target.canvas = doc.createElement('canvas');
				
				target.image = chart.renderer.image(
					'', 
					0, 
					0, 
					width, 
					height
				).add(targetGroup);
				
				target.ctx = ctx = target.canvas.getContext('2d');
				
				if (chart.inverted) {
					each(['moveTo', 'lineTo', 'rect', 'arc'], function (fn) {
						wrap(ctx, fn, swapXY);
					});
				}

				target.boostClipRect = chart.renderer.clipRect(
					chart.plotLeft,
					chart.plotTop,
					chart.plotWidth,
					chart.chartHeight
				);

				target.image.clip(target.boostClipRect);

			} else if (!(target instanceof H.Chart)) {
				//ctx.clearRect(0, 0, width, height);
			}

			if (target.canvas.width !== width) {
				target.canvas.width = width;				
			}

			if (target.canvas.height !== height) {
				target.canvas.height = height;				
			}

			target.image.attr({
				x: 0,
				y: 0,
				width: width,
				height: height,
				style: 'pointer-events: none'
			});

			target.boostClipRect.attr({
				x: 0,
				y: 0,
				width: chart.plotWidth,
				height: chart.chartHeight
			});

			return ctx;
		},

		/** 
		 * Draw the canvas image inside an SVG image
		 */
		canvasToSVG: function () {
			if (!isChartSeriesBoosting(this.chart)) {
				this.image.attr({ href: this.canvas.toDataURL('image/png') });
			} else if (this.image) {
				this.image.attr({ href: '' });
			}
		},

		cvsLineTo: function (ctx, clientX, plotY) {
			ctx.lineTo(clientX, plotY);
		},

		renderCanvas: function () {
			var series = this,
				options = series.options,
				chart = series.chart,
				xAxis = this.xAxis,
				yAxis = this.yAxis,
				activeBoostSettings = chart.options.boost || {},
				boostSettings = {
					timeRendering: activeBoostSettings.timeRendering || false,
					timeSeriesProcessing: activeBoostSettings.timeSeriesProcessing || false,
					timeSetup: activeBoostSettings.timeSetup || false
				},
				ctx,
				c = 0,
				xData = series.processedXData,
				yData = series.processedYData,
				rawData = options.data,
				xExtremes = xAxis.getExtremes(),
				xMin = xExtremes.min,
				xMax = xExtremes.max,
				yExtremes = yAxis.getExtremes(),
				yMin = yExtremes.min,
				yMax = yExtremes.max,
				pointTaken = {},
				lastClientX,
				sampling = !!series.sampling,
				points,
				r = options.marker && options.marker.radius,
				cvsDrawPoint = this.cvsDrawPoint,
				cvsLineTo = options.lineWidth ? this.cvsLineTo : false,
				cvsMarker = r && r <= 1 ?
					this.cvsMarkerSquare :
					this.cvsMarkerCircle,
				strokeBatch = this.cvsStrokeBatch || 1000,
				enableMouseTracking = options.enableMouseTracking !== false,
				lastPoint,
				threshold = options.threshold,
				yBottom = yAxis.getThreshold(threshold),
				hasThreshold = isNumber(threshold),
				translatedThreshold = yBottom,
				doFill = this.fill,
				isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
				isStacked = !!options.stacking,
				cropStart = series.cropStart || 0,
				loadingOptions = chart.options.loading,
				requireSorting = series.requireSorting,
				wasNull,
				connectNulls = options.connectNulls,
				useRaw = !xData,
				minVal,
				maxVal,
				minI,
				maxI,
				kdIndex,
				sdata = isStacked ? series.data : (xData || rawData),
				fillColor = series.fillOpacity ?
						new Color(series.color).setOpacity(pick(options.fillOpacity, 0.75)).get() :
						series.color,
				
				stroke = function () {
					if (doFill) {
						ctx.fillStyle = fillColor;
						ctx.fill();
					} else {
						ctx.strokeStyle = series.color;
						ctx.lineWidth = options.lineWidth;
						ctx.stroke();
					}
				},

				drawPoint = function (clientX, plotY, yBottom, i) {
					if (c === 0) {
						ctx.beginPath();

						if (cvsLineTo) {
							ctx.lineJoin = 'round';
						}
					}

					if (chart.scroller && series.options.className === 'highcharts-navigator-series') {
						plotY += chart.scroller.top;
						if (yBottom) {
							yBottom += chart.scroller.top;							
						}
					} else {
						plotY += chart.plotTop;
					}

					clientX += chart.plotLeft;

					if (wasNull) {
						ctx.moveTo(clientX, plotY);
					} else {
						if (cvsDrawPoint) {
							cvsDrawPoint(ctx, clientX, plotY, yBottom, lastPoint);
						} else if (cvsLineTo) {
							cvsLineTo(ctx, clientX, plotY);
						} else if (cvsMarker) {
							cvsMarker.call(series, ctx, clientX, plotY, r, i);
						}
					}

					// We need to stroke the line for every 1000 pixels. It will crash the browser
					// memory use if we stroke too infrequently.
					c = c + 1;
					if (c === strokeBatch) {
						stroke();
						c = 0;
					}

					// Area charts need to keep track of the last point
					lastPoint = {
						clientX: clientX,
						plotY: plotY,
						yBottom: yBottom
					};
				},

				addKDPoint = function (clientX, plotY, i) {
					// Avoid more string concatination than required
					kdIndex = clientX + ',' + plotY;

					// The k-d tree requires series points. Reduce the amount of points, since the time to build the 
					// tree increases exponentially.
					if (enableMouseTracking && !pointTaken[kdIndex]) {
						pointTaken[kdIndex] = true;

						if (chart.inverted) {
							clientX = xAxis.len - clientX;
							plotY = yAxis.len - plotY;
						}

						points.push({
							clientX: clientX,
							plotX: clientX,
							plotY: plotY,
							i: cropStart + i
						});
					}
				};

			// If we are zooming out from SVG mode, destroy the graphics
			if (this.points || this.graph) {
				this.destroyGraphics();
			}

			// The group
			series.plotGroup(
				'group',
				'series',
				series.visible ? 'visible' : 'hidden',
				options.zIndex,
				chart.seriesGroup
			);

			series.markerGroup = series.group;
			// addEvent(series, 'destroy', function () {
			// 	series.markerGroup = null;
			// });

			points = this.points = [];
			ctx = this.getContext();
			series.buildKDTree = noop; // Do not start building while drawing 

			// Display a loading indicator
			if (rawData.length > 99999) {
				chart.options.loading = merge(loadingOptions, {
					labelStyle: {
						backgroundColor: H.color('${palette.backgroundColor}').setOpacity(0.75).get(),
						padding: '1em',
						borderRadius: '0.5em'
					},
					style: {
						backgroundColor: 'none',
						opacity: 1
					}
				});
				clearTimeout(destroyLoadingDiv);
				chart.showLoading('Drawing...');
				chart.options.loading = loadingOptions; // reset
			}

			if (boostSettings.timeRendering) {
				console.time('canvas rendering'); // eslint-disable-line no-console
			}

			// Loop over the points
			eachAsync(sdata, function (d, i) {
				var x,
					y,
					clientX,
					plotY,
					isNull,
					low,
					isNextInside = false,
					isPrevInside = false,
					nx = false,
					px = false,
					chartDestroyed = typeof chart.index === 'undefined',
					isYInside = true;

				if (!chartDestroyed) {
					if (useRaw) {
						x = d[0];
						y = d[1];

						if (sdata[i + 1]) {
							nx = sdata[i + 1][0];
						}

						if (sdata[i - 1]) {
							px = sdata[i - 1][0];
						}
					} else {
						x = d;
						y = yData[i];

						if (sdata[i + 1]) {
							nx = sdata[i + 1];
						}

						if (sdata[i - 1]) {
							px = sdata[i - 1];
						}
					}

					if (nx && nx >= xMin && nx <= xMax) {
						isNextInside = true;
					}

					if (px && px >= xMin && px <= xMax) {
						isPrevInside = true;
					}

					// Resolve low and high for range series
					if (isRange) {
						if (useRaw) {
							y = d.slice(1, 3);
						}
						low = y[0];
						y = y[1];
					} else if (isStacked) {
						x = d.x;
						y = d.stackY;
						low = y - d.y;
					}

					isNull = y === null;

					// Optimize for scatter zooming
					if (!requireSorting) {
						isYInside = y >= yMin && y <= yMax;
					}

					if (!isNull && 
						(
							(x >= xMin && x <= xMax && isYInside) || 
							(isNextInside || isPrevInside)
						)) {


						clientX = Math.round(xAxis.toPixels(x, true));

						if (sampling) {
							if (minI === undefined || clientX === lastClientX) {
								if (!isRange) {
									low = y;
								}
								if (maxI === undefined || y > maxVal) {
									maxVal = y;
									maxI = i;
								}
								if (minI === undefined || low < minVal) {
									minVal = low;
									minI = i;
								}

							}
							if (clientX !== lastClientX) { // Add points and reset
								if (minI !== undefined) { // then maxI is also a number
									plotY = yAxis.toPixels(maxVal, true);
									yBottom = yAxis.toPixels(minVal, true);
									drawPoint(
										clientX,
										hasThreshold ? Math.min(plotY, translatedThreshold) : plotY,
										hasThreshold ? Math.max(yBottom, translatedThreshold) : yBottom,
										i
									);
									addKDPoint(clientX, plotY, maxI);
									if (yBottom !== plotY) {
										addKDPoint(clientX, yBottom, minI);
									}
								}

								minI = maxI = undefined;
								lastClientX = clientX;
							}
						} else {
							plotY = Math.round(yAxis.toPixels(y, true));
							drawPoint(clientX, plotY, yBottom, i);
							addKDPoint(clientX, plotY, i);
						}
					}
					wasNull = isNull && !connectNulls;

					if (i % CHUNK_SIZE === 0) {
						series.canvasToSVG();
					}
				}

				return !chartDestroyed;
			}, function () {
				var loadingDiv = chart.loadingDiv,
					loadingShown = chart.loadingShown;
				stroke();
				series.canvasToSVG();

				if (boostSettings.timeRendering) {
					console.timeEnd('canvas rendering'); // eslint-disable-line no-console
				}

				fireEvent(series, 'renderedCanvas');

				// Do not use chart.hideLoading, as it runs JS animation and will be blocked by buildKDTree.
				// CSS animation looks good, but then it must be deleted in timeout. If we add the module to core,
				// change hideLoading so we can skip this block.
				if (loadingShown) {
					extend(loadingDiv.style, {
						transition: 'opacity 250ms',
						opacity: 0
					});
					chart.loadingShown = false;
					destroyLoadingDiv = setTimeout(function () {
						if (loadingDiv.parentNode) { // In exporting it is falsy
							loadingDiv.parentNode.removeChild(loadingDiv);
						}
						chart.loadingDiv = chart.loadingSpan = null;
					}, 250);
				}

				// Pass tests in Pointer. 
				// Replace this with a single property, and replace when zooming in
				// below boostThreshold.
				series.directTouch = false;
				series.options.stickyTracking = true;

				delete series.buildKDTree; // Go back to prototype, ready to build
				series.buildKDTree();

			// Don't do async on export, the exportChart, getSVGForExport and getSVG methods are not chained for it.
			}, chart.renderer.forExport ? Number.MAX_VALUE : undefined);
		}
	});

	wrap(Series.prototype, 'setData', function (proceed) {
		if (!this.hasExtremes || !this.hasExtremes(true) || this.type === 'heatmap') {
			proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	});
	
	wrap(Series.prototype, 'processData', function (proceed) {
		if (!this.hasExtremes || !this.hasExtremes(true) || this.type === 'heatmap') {
			proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	});

	seriesTypes.scatter.prototype.cvsMarkerCircle = function (ctx, clientX, plotY, r) {
		ctx.moveTo(clientX, plotY);
		ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
	};

	// Rect is twice as fast as arc, should be used for small markers
	seriesTypes.scatter.prototype.cvsMarkerSquare = function (ctx, clientX, plotY, r) {
		ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
	};
	seriesTypes.scatter.prototype.fill = true;

	if (seriesTypes.bubble) {
		seriesTypes.bubble.prototype.cvsMarkerCircle = function (ctx, clientX, plotY, r, i) {
			ctx.moveTo(clientX, plotY);
			ctx.arc(clientX, plotY, this.radii && this.radii[i], 0, 2 * Math.PI, false);
		};
		seriesTypes.bubble.prototype.cvsStrokeBatch = 1;
	}

	extend(seriesTypes.area.prototype, {
		cvsDrawPoint: function (ctx, clientX, plotY, yBottom, lastPoint) {
			if (lastPoint && clientX !== lastPoint.clientX) {
				ctx.moveTo(lastPoint.clientX, lastPoint.yBottom);
				ctx.lineTo(lastPoint.clientX, lastPoint.plotY);
				ctx.lineTo(clientX, plotY);
				ctx.lineTo(clientX, yBottom);
			}
		},
		fill: true,
		fillOpacity: true,
		sampling: true
	});

	extend(seriesTypes.column.prototype, {
		cvsDrawPoint: function (ctx, clientX, plotY, yBottom) {
			ctx.rect(clientX - 1, plotY, 1, yBottom - plotY);
		},
		fill: true,
		sampling: true
	});

	H.Chart.prototype.callbacks.push(function (chart) {
		function canvasToSVG() {			
			if (chart.image && chart.canvas) {
				chart.image.attr({ 
					href: chart.canvas.toDataURL('image/png') 
				});			
			}
		}

		function clear() {
			if (chart.image) {
				chart.image.attr({ href: '' });
			}

			if (chart.canvas) {
				chart.canvas.getContext('2d').clearRect(
					0, 
					0, 
					chart.canvas.width,
					chart.canvas.height
				);
			}
		}

		addEvent(chart, 'predraw', clear);	
		addEvent(chart, 'render', canvasToSVG);
	});
};
