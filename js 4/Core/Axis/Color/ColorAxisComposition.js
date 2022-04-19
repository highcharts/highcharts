/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Color from '../../Color/Color.js';
var color = Color.parse;
import U from '../../Utilities.js';
var addEvent = U.addEvent, extend = U.extend, merge = U.merge, pick = U.pick, splat = U.splat;
/* *
 *
 *  Composition
 *
 * */
var ColorAxisComposition;
(function (ColorAxisComposition) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    var composedClasses = [];
    /* *
     *
     *  Variables
     *
     * */
    var ColorAxisClass;
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    function compose(ColorAxisType, ChartClass, FxClass, LegendClass, SeriesClass) {
        if (!ColorAxisClass) {
            ColorAxisClass = ColorAxisType;
        }
        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);
            var chartProto = ChartClass.prototype;
            chartProto.collectionsWithUpdate.push('colorAxis');
            chartProto.collectionsWithInit.colorAxis = [
                chartProto.addColorAxis
            ];
            addEvent(ChartClass, 'afterGetAxes', onChartAfterGetAxes);
            wrapChartCreateAxis(ChartClass);
        }
        if (composedClasses.indexOf(FxClass) === -1) {
            composedClasses.push(FxClass);
            var fxProto = FxClass.prototype;
            fxProto.fillSetter = wrapFxFillSetter;
            fxProto.strokeSetter = wrapFxStrokeSetter;
        }
        if (composedClasses.indexOf(LegendClass) === -1) {
            composedClasses.push(LegendClass);
            addEvent(LegendClass, 'afterGetAllItems', onLegendAfterGetAllItems);
            addEvent(LegendClass, 'afterColorizeItem', onLegendAfterColorizeItem);
            addEvent(LegendClass, 'afterUpdate', onLegendAfterUpdate);
        }
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);
            extend(SeriesClass.prototype, {
                optionalAxis: 'colorAxis',
                translateColors: seriesTranslateColors
            });
            extend(SeriesClass.prototype.pointClass.prototype, {
                setVisible: pointSetVisible
            });
            addEvent(SeriesClass, 'afterTranslate', onSeriesAfterTranslate);
            addEvent(SeriesClass, 'bindAxes', onSeriesBindAxes);
        }
    }
    ColorAxisComposition.compose = compose;
    /**
     * Extend the chart getAxes method to also get the color axis.
     * @private
     */
    function onChartAfterGetAxes() {
        var _this = this;
        var options = this.options;
        this.colorAxis = [];
        if (options.colorAxis) {
            options.colorAxis = splat(options.colorAxis);
            options.colorAxis.forEach(function (axisOptions, i) {
                axisOptions.index = i;
                new ColorAxisClass(_this, axisOptions); // eslint-disable-line no-new
            });
        }
    }
    /**
     * Add the color axis. This also removes the axis' own series to prevent
     * them from showing up individually.
     * @private
     */
    function onLegendAfterGetAllItems(e) {
        var _this = this;
        var colorAxes = this.chart.colorAxis || [], destroyItem = function (item) {
            var i = e.allItems.indexOf(item);
            if (i !== -1) {
                // #15436
                _this.destroyItem(e.allItems[i]);
                e.allItems.splice(i, 1);
            }
        };
        var colorAxisItems = [], options, i;
        colorAxes.forEach(function (colorAxis) {
            options = colorAxis.options;
            if (options && options.showInLegend) {
                // Data classes
                if (options.dataClasses && options.visible) {
                    colorAxisItems = colorAxisItems.concat(colorAxis.getDataClassLegendSymbols());
                    // Gradient legend
                }
                else if (options.visible) {
                    // Add this axis on top
                    colorAxisItems.push(colorAxis);
                }
                // If dataClasses are defined or showInLegend option is not set
                // to true, do not add color axis' series to legend.
                colorAxis.series.forEach(function (series) {
                    if (!series.options.showInLegend || options.dataClasses) {
                        if (series.options.legendType === 'point') {
                            series.points.forEach(function (point) {
                                destroyItem(point);
                            });
                        }
                        else {
                            destroyItem(series);
                        }
                    }
                });
            }
        });
        i = colorAxisItems.length;
        while (i--) {
            e.allItems.unshift(colorAxisItems[i]);
        }
    }
    /**
     * @private
     */
    function onLegendAfterColorizeItem(e) {
        if (e.visible && e.item.legendColor) {
            e.item.legendSymbol.attr({
                fill: e.item.legendColor
            });
        }
    }
    /**
     * Updates in the legend need to be reflected in the color axis. (#6888)
     * @private
     */
    function onLegendAfterUpdate() {
        var colorAxes = this.chart.colorAxis;
        if (colorAxes) {
            colorAxes.forEach(function (colorAxis) {
                colorAxis.update({}, arguments[2]);
            });
        }
    }
    /**
     * Calculate and set colors for points.
     * @private
     */
    function onSeriesAfterTranslate() {
        if (this.chart.colorAxis &&
            this.chart.colorAxis.length ||
            this.colorAttribs) {
            this.translateColors();
        }
    }
    /**
     * Add colorAxis to series axisTypes.
     * @private
     */
    function onSeriesBindAxes() {
        var axisTypes = this.axisTypes;
        if (!axisTypes) {
            this.axisTypes = ['colorAxis'];
        }
        else if (axisTypes.indexOf('colorAxis') === -1) {
            axisTypes.push('colorAxis');
        }
    }
    /**
     * Set the visibility of a single point
     * @private
     * @function Highcharts.colorPointMixin.setVisible
     * @param {boolean} visible
     */
    function pointSetVisible(vis) {
        var point = this, method = vis ? 'show' : 'hide';
        point.visible = point.options.visible = Boolean(vis);
        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key) {
            if (point[key]) {
                point[key][method]();
            }
        });
        this.series.buildKDTree(); // rebuild kdtree #13195
    }
    ColorAxisComposition.pointSetVisible = pointSetVisible;
    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     * @private
     * @function Highcharts.colorSeriesMixin.translateColors
     */
    function seriesTranslateColors() {
        var series = this, points = this.data.length ? this.data : this.points, nullColor = this.options.nullColor, colorAxis = this.colorAxis, colorKey = this.colorKey;
        points.forEach(function (point) {
            var value = point.getNestedProperty(colorKey), color = point.options.color || (point.isNull || point.value === null ?
                nullColor :
                (colorAxis && typeof value !== 'undefined') ?
                    colorAxis.toColor(value, point) :
                    point.color || series.color);
            if (color && point.color !== color) {
                point.color = color;
                if (series.options.legendType === 'point' && point.legendItem) {
                    series.chart.legend.colorizeItem(point, point.visible);
                }
            }
        });
    }
    /**
     * @private
     */
    function wrapChartCreateAxis(ChartClass) {
        var superCreateAxis = ChartClass.prototype.createAxis;
        ChartClass.prototype.createAxis = function (type, options) {
            if (type !== 'colorAxis') {
                return superCreateAxis.apply(this, arguments);
            }
            var axis = new ColorAxisClass(this, merge(options.axis, {
                index: this[type].length,
                isX: false
            }));
            this.isDirtyLegend = true;
            // Clear before 'bindAxes' (#11924)
            this.axes.forEach(function (axis) {
                axis.series = [];
            });
            this.series.forEach(function (series) {
                series.bindAxes();
                series.isDirtyData = true;
            });
            if (pick(options.redraw, true)) {
                this.redraw(options.animation);
            }
            return axis;
        };
    }
    /**
     * Handle animation of the color attributes directly.
     * @private
     */
    function wrapFxFillSetter() {
        this.elem.attr('fill', color(this.start).tweenTo(color(this.end), this.pos), void 0, true);
    }
    /**
     * Handle animation of the color attributes directly.
     * @private
     */
    function wrapFxStrokeSetter() {
        this.elem.attr('stroke', color(this.start).tweenTo(color(this.end), this.pos), void 0, true);
    }
})(ColorAxisComposition || (ColorAxisComposition = {}));
/* *
 *
 *  Default Export
 *
 * */
export default ColorAxisComposition;
