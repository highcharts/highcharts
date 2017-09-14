/**
 * (c) 2010-2017 Paweł Dalek
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var each = H.each,
	pick = H.pick,
	seriesType = H.seriesType,
	isNumber = H.isNumber,
	addEvent = H.addEvent,
	relativeLength = H.relativeLength,
	columnProto = H.seriesTypes.column.prototype;

/**
 * The lineargauge series type.
 *
 * @constructor seriesTypes.lineargauge
 * @augments seriesTypes.column
 */
seriesType('lineargauge', 'column',
	/**
	 * A lineargauge graph is used for visualizing data on linear scale
	 * within the specific range. It uses special pointers (targets).
	 * Mentioned range can be defined by setting
	 * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
	 * 
	 * @extends {plotOptions.column}
	 * @product highcharts
	 * @sample {highcharts} highcharts/demo/lineargauge/ Linearguage graph
	 * @since 6.0.0
	 * @excluding animationLimit,boostThreshold,edgeColor,edgeWidth,
	 *            findNearestPointBy,getExtremesFromAll
	 * @optionparent plotOptions.lineargauge
	 */
	{
		/**
		 * Whether to display or hide additional columns along with targets.
		 * 
		 * @type {Boolean}
		 * @since 6.0.0
		 * @default false
		 * @product highcharts
		 */
		showColumn: false,

		/**
		 * The length of the base part of the target (similar to [dial.baseLength](#plotOptions.gauge.dial.baseLength)).
		 * Can be pixel value or percentage value based on [targetTotalLength](#plotOptions.lineargauge.targetTotalLength).
		 * 
		 * @type {Number|String}
		 * @since 6.0.0
		 * @default '50%'
		 * @product highcharts
		 */
		targetBaseLength: '50%',

		/*= if (build.classic) { =*/
		/**
		 * The border color of the symbol representing the target. When
		 * not set, point's border color is used.
		 *
		 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
		 * 
		 * @type {Color}
		 * @since 6.0.0
		 * @product highcharts
		 * @apioption plotOptions.lineargauge.targetBorderColor
		 */

		/**
		 * The border width of the symbol representing the target. When
		 * not set, point's border width is used.
		 *
		 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
		 * 
		 * @type {Number}
		 * @since 6.0.0
		 * @product highcharts
		 * @apioption plotOptions.lineargauge.targetBorderWidth
		 */

		/**
		 * The color of the symbol representing the target. When
		 * not set, point's color is used.
		 *
		 * In styled mode, target color can be set with the `.highcharts-lineargauge-target-symbol` class.
		 * 
		 * @type {Color}
		 * @since 6.0.0
		 * @product highcharts
		 * @apioption plotOptions.lineargauge.targetColor
		 */
		/*= } =*/

		/**
		 * The indentation on the upper part of the target symbol.
		 *
		 * Can be pixel value or percentage value based on [targetTotalLength](#plotOptions.lineargauge.targetTotalLength).
		 * 
		 * @type {Number|String}
		 * @since 6.0.0
		 * @default '20%'
		 * @product highcharts
		 */
		targetIndent: '20%',

		/**
		 * Show additional line coming out of the target.
		 * 
		 * @type {Boolean}
		 * @since 6.0.0
		 * @default false
		 * @product highcharts
		 */
		targetLine: false,

		/*= if (build.classic) { =*/
		/**
		 * The color of the additional target line. When
		 * not set, point's border color is used.
		 *
		 * In styled mode, target color can be set with the `.highcharts-lineargauge-target-line` class.
		 * 
		 * @type {Color}
		 * @since 6.0.0
		 * @product highcharts
		 * @apioption plotOptions.lineargauge.targetLineColor
		 */

		/**
		 * The width of the additional target line. When
		 * not set, point's border width is used.
		 *
		 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-line` class.
		 * 
		 * @type {Number}
		 * @since 6.0.0
		 * @product highcharts
		 * @apioption plotOptions.lineargauge.targetLineWidth
		 */
		/*= } =*/

		/**
		 * The zIndex of the target line.
		 * 
		 * @type {Number}
		 * @since 6.0.0
		 * @default 1
		 * @product highcharts
		 */
		targetLineZIndex: 1,

		/**
		 * Display target on a point or alongside the `yAxis`.
		 * 
		 * @type {Boolean}
		 * @since 6.0.0
		 * @default true
		 * @product highcharts
		 */
		targetOnPoint: true,

		/**
		 * The total length of the target.
		 * Can be pixel value or percentage value based on column point's width.
		 * 
		 * @type {Number|String}
		 * @since 6.0.0
		 * @default '50%'
		 * @product highcharts
		 */
		targetTotalLength: '50%',

		/**
		 * The width of the target.
		 * Can be pixel value or percentage value based on column point's width.
		 * 
		 * @type {Number|String}
		 * @since 6.0.0
		 * @default '50%'
		 * @product highcharts
		 */
		targetWidth: '50%'
	}, {
		/**
		*/
		inverted: true,
		/**
		 * The target symbol and line is created for each point and added to it. Iverting
		 * chart and reversing axes are taken into account in calculating their position on chart.
		 * This method is based on column series drawPoints function.
		 */
		drawPoints: function () {
			var series = this,
				points = series.points,
				xAxis = series.xAxis,
				yAxis = series.yAxis,
				chart = series.chart,
				renderer = chart.renderer,
				seriesOptions = series.options,
				tooltip = chart.tooltip,
				inverted = chart.inverted,
				animationLimit = seriesOptions.animationLimit || 250;

			columnProto.drawPoints.apply(series);

			each(points, function (point) {
				var seriesAnimation = seriesOptions.animation,
					defaultAnimation = { duration: 1000 },
					targetSymGraphic = point.targetSymGraphic,
					targetLinGraphic = point.targetLinGraphic,                          
					pointOptions = point.options,
					pointCount = chart.pointCount,
					plotLeft = chart.plotLeft,
					plotTop = chart.plotTop,
					xAxisLength = xAxis.len,
					yAxisLength = yAxis.len,
					yAxisReversed = yAxis.reversed,                         
					dataLabel = point.dataLabel,
					valueX = point.x,
					valueY = point.y,
					targetEvents = [],
					dataLabelBox,
					minPointLength,
					halfPointWidth,
					pBarX,
					pPlotY,
					targetOnPoint,
					showColumn,
					targetLine,                         
					baseLength,
					length,
					width,
					indent,
					symbolPath,
					linePath,
					borderWidth,
					lineWidth,
					lineZIndex,
					shapeArgs,
					shapeArgsWidth,
					targetTranslateAtrr,
					offsetOnPoint,
					xAttr,
					yAttr,
					xPosition,
					yPosition,
					pixelX,
					pixelY;

				minPointLength = seriesOptions.minPointLength;
				halfPointWidth = point.pointWidth / 2;
				pBarX = point.barX;
				pPlotY = point.plotY;

				if (inverted) {
					pixelX = xAxisLength - pBarX - halfPointWidth + plotTop;
					pixelY = yAxisLength - pPlotY;

					// Considering minPointLength when chart is inverted
					if (!yAxisReversed && minPointLength) {
						if (pixelY < minPointLength) {
							pixelY = minPointLength;
						}
					} else {
						if (pPlotY < minPointLength) {
							pixelY = yAxisLength - minPointLength;
						}
					}
					pixelY += plotLeft;
				} else {
					pixelX = pBarX + halfPointWidth + plotLeft;
					pixelY = pPlotY;

					// Considering minPointLength when chart is not inverted
					if (!yAxisReversed && minPointLength) {
						if (pixelY > minPointLength) {
							pixelY = yAxisLength - minPointLength;
						}
					} else {
						if (pPlotY < minPointLength) {
							pixelY = minPointLength;
						}
					}
					pixelY += plotTop;
				}

				if (isNumber(valueY) && valueY !== null) {
					shapeArgs = point.shapeArgs;
					shapeArgsWidth = shapeArgs.width;

					// Total length of a target
					length = relativeLength(pick(pointOptions.targetTotalLength, seriesOptions.targetTotalLength), shapeArgsWidth);

					// Total width of a target
					width = relativeLength(pick(pointOptions.targetWidth, seriesOptions.targetWidth), shapeArgsWidth);

					// Base length of a target
					baseLength = relativeLength(pick(pointOptions.targetBaseLength, seriesOptions.targetBaseLength), length);

					// Vertical indent of a target
					indent = relativeLength(pick(pointOptions.targetIndent, seriesOptions.targetIndent), length);

					// Border width of a target
					borderWidth = pick(pointOptions.targetBorderWidth, seriesOptions.targetBorderWidth);

					// The option which controls whether target should display on series or on axis
					targetOnPoint = pick(pointOptions.targetOnPoint, seriesOptions.targetOnPoint);

					// The option which controls whether target should have an additional line
					targetLine = pick(pointOptions.targetLine, seriesOptions.targetLine);

					// Show/hide additional column
					showColumn = pick(pointOptions.showColumn, seriesOptions.showColumn);

					// Width of a target line
					lineWidth = pick(pointOptions.targetLineWidth, seriesOptions.targetLineWidth, seriesOptions.borderWidth, point.borderWidth, 1);

					// The zIndex of a target line
					lineZIndex = pick(pointOptions.targetLineZIndex, seriesOptions.targetLineZIndex);

					symbolPath = inverted ? 
					['M', 0, 0, 'L', -width / 2, -length + baseLength, -width / 2, -length, 0, -length + indent, width / 2, -length, width / 2, -length + baseLength, 'Z'] :
					['M', 0, 0, 'L', -length + baseLength, width / 2, -length, width / 2, -length + indent, 0, -length, -width / 2, -length + baseLength, -width / 2, 'Z'];

					symbolPath = renderer.crispLine(symbolPath, borderWidth);

					xPosition = inverted ? pixelY : (targetOnPoint ? pixelX : xAxis.left);
					yPosition = inverted ? (targetOnPoint ? pixelX : xAxis.top) : pixelY;

					xAttr = {
						translateX: xPosition
					};

					yAttr = {
						translateY: yPosition
					};

					targetTranslateAtrr = {
						translateX: inverted ? (yAxisReversed ? plotLeft + chart.plotWidth : plotLeft) : xPosition,
						translateY: inverted ? yPosition : (yAxisReversed ? plotTop : plotTop + chart.plotHeight)
					};

					// Creating/updating target symbol
					if (targetSymGraphic) {
						targetSymGraphic[pointCount < animationLimit ? 'animate' : 'attr']({
							d: symbolPath,
							translateX: xPosition,
							translateY: yPosition
						});
					} else {
						targetTranslateAtrr.zIndex = 5;

						point.targetSymGraphic = targetSymGraphic = renderer.path(symbolPath)
						.attr(targetTranslateAtrr)
						.add();

						targetSymGraphic[pointCount < animationLimit ? 'animate' : 'attr'](inverted ? xAttr : yAttr, pick(seriesAnimation, defaultAnimation));
					}

					// Creating/updating target line
					if (targetLine) {
						offsetOnPoint = xAxisLength - (targetOnPoint ? pixelX - (inverted ? plotTop : plotLeft) : 0);

						linePath = inverted ? ['M', 0, 0, 'L', 0, offsetOnPoint] : ['M', 0, 0, 'L', offsetOnPoint, 0];
						linePath = renderer.crispLine(linePath, lineWidth);

						if (targetLinGraphic) {
							targetLinGraphic[pointCount < animationLimit ? 'animate' : 'attr']({
								d: linePath,
								translateX: xPosition,
								translateY: yPosition
							});
						} else {
							targetTranslateAtrr.zIndex = lineZIndex;

							point.targetLinGraphic = targetLinGraphic = renderer.path(linePath)
							.attr(targetTranslateAtrr)
							.add();

							targetLinGraphic[pointCount < animationLimit ? 'animate' : 'attr'](inverted ? xAttr : yAttr, pick(seriesAnimation, defaultAnimation));
						}
					}

					if (!showColumn) {
						point.graphic.hide();

						if (!targetOnPoint && dataLabel) {
							dataLabelBox = dataLabel.getBBox();

							dataLabel.attr(inverted ? {
								x: yAxis.toPixels(valueY, true) - dataLabelBox.width / 2,
								y: 0
							} : {
								x: 0,
								y: yAxis.toPixels(valueY, true) - dataLabelBox.height / 2
							});
						}
					}

					/*= if (build.classic) { =*/
					// Setting style to target symbol
					targetSymGraphic.attr({
						fill: pick(
							pointOptions.targetColor,
							seriesOptions.targetColor,
							pointOptions.color,
							(series.zones.length && (point.getZone.call({
								series: series,
								x: valueX,
								y: valueY,
								options: {}
							}).color || series.color)) || undefined,
							point.color,
							series.color
							),
						stroke: pick(
							pointOptions.targetBorderColor,
							seriesOptions.targetBorderColor,
							point.borderColor,
							seriesOptions.borderColor
							),
						'stroke-width': pick(
							pointOptions.targetBorderWidth,
							seriesOptions.targetBorderWidth,
							point.borderWidth,
							seriesOptions.borderWidth
							)
					});

					// Setting style to target line, if exists
					if (targetLine) {
						targetLinGraphic.attr({
							stroke: pick(
								pointOptions.targetLineColor,
								seriesOptions.targetLineColor,
								point.borderColor,
								seriesOptions.borderColor
								),
							'stroke-width': lineWidth
						});
					}
					/*= } =*/

					// Adding event to target symbol for handling tooltip
					if (tooltip) {
						targetEvents.push(addEvent(targetSymGraphic.element, 'mouseover', function () {
							point.setState('hover');

							if (!targetOnPoint) {
								tooltip.refresh({
									plotY: !inverted ? yPosition - plotTop : yAxisLength - xPosition + plotLeft,
									plotX: !inverted ? xPosition - plotLeft : xAxisLength - yPosition + plotTop,
									series: point.series,
									x: valueX,
									y: valueY,
									category: point.category,
									color: point.color,
									colorIndex: point.colorIndex,
									name: point.name,
									percentage: point.percentage,
									total: point.total,
									stackTotal: point.stackTotal,
									getLabelConfig: point.getLabelConfig,
									tooltipFormatter: point.tooltipFormatter
								});
							} else {
								tooltip.refresh(point);
							}
						}));

						targetEvents.push(addEvent(targetSymGraphic.element, 'mouseout', function () {
							point.setState('normal');
							tooltip.hide();
						}));

						series.targetEvents = targetEvents;
					}

					// Add styles
					if (targetSymGraphic) {
						targetSymGraphic.addClass(point.getClassName() + ' highcharts-lineargauge-target-symbol', true);
					}

					if (targetLinGraphic) {
						targetLinGraphic.addClass(point.getClassName() + ' highcharts-lineargauge-target-line', true);
					}
				} else if (targetSymGraphic) {
					point.targetSymGraphic = targetSymGraphic.destroy();

					if (targetLinGraphic) {
						point.targetLinGraphic = targetLinGraphic.destroy();
					}
				}
			});
		}
	}, {
		/**
		 * Destroys target symbol and line graphics.
		 */
		destroy: function () {
			var point = this,
				targetSymGraphic = point.targetSymGraphic,
				targetLinGraphic = point.targetLinGraphic;

			if (targetSymGraphic) {
				targetSymGraphic = targetSymGraphic.destroy();
			}

			if (targetLinGraphic) {
				targetLinGraphic = targetLinGraphic.destroy();
			}

			// Deleting target events
			each(point.series.targetEvents, function (targetEvent) {
				targetEvent();
			});

			columnProto.pointClass.prototype.destroy.apply(point, arguments);
		}
	});

/**
 * A `lineargauge` series. If the [type](#series.lineargauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * lineargauge](#plotOptions.lineargauge).
 * 
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.lineargauge
 * @excluding dataParser,dataURL
 * @product highcharts
 * @apioption series.lineargauge
 */

 /**
 * Whether to display or hide individual additional column along with the target.
 * 
 * @type {Boolean}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.showColumn
 */

/**
 * Individual length of the base part of the target (similar to [dial.baseLength](#plotOptions.gauge.dial.baseLength)).
 * Can be pixel value or percentage value based on [targetTotalLength](#plotOptions.lineargauge.targetTotalLength).
 * 
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetBaseLength
 */

 /*= if (build.classic) { =*/
/**
 * Individual border color of the symbol representing the target. When
 * not set, point's border color is used.
 *
 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
 * 
 * @type {Color}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetBorderColor
 */

/**
 * Individual border width of the symbol representing the target. When
 * not set, point's border width is used.
 *
 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
 * 
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetBorderWidth
 */

/**
 * Individual color of the symbol representing the target. When
 * not set, point's color is used.
 *
 * In styled mode, target color can be set with the `.highcharts-lineargauge-target-symbol` class.
 * 
 * @type {Color}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetColor
 */
 /*= } =*/

/**
 * Individual indentation on the upper part of the target symbol.
 *
 * Can be pixel value or percentage value based on [targetTotalLength](#plotOptions.lineargauge.targetTotalLength).
 * 
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetIndent
 */

/**
 * Show individual additional line coming out of the target.
 * 
 * @type {Boolean}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetLine
 */

 /*= if (build.classic) { =*/
/**
 * Individual color of the additional target line. When
 * not set, point's border color is used.
 *
 * In styled mode, target color can be set with the `.highcharts-lineargauge-target-line` class.
 * 
 * @type {Color}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetLineColor
 */

/**
 * Individual width of the additional target line. When
 * not set, point's border width is used.
 *
 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-line` class.
 * 
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetLineWidth
 */
 /*= } =*/

/**
 * The zIndex of individual target line.
 * 
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetLineZIndex
 */

/**
 * Display individual target on a point or alongside the `yAxis`.
 * 
 * @type {Boolean}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOnPoint
 */

/**
 * Individual total length of the target.
 * Can be pixel value or percentage value based on column point's width.
 * 
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetTotalLength
 */

/**
 * Individual width of the target.
 * Can be pixel value or percentage value based on column point's width.
 * 
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetWidth
 */
