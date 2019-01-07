import H from '../parts/Globals.js';
import '../parts/Axis.js';
import '../parts/Series.js';

/**
 * A point-like object, a mock point or a point uses in series.
 *
 * @typedef {Highcharts.Point | Annotation.MockPoint} Annotation.PointLike
 */

/**
 * A mock point configuration.
 *
 * @typedef {Object} Annotation.MockPoint.Options
 * @property {number} x x value for the point in xAxis scale or pixels
 * @property {number} y y value for the point in yAxis scale or pixels
 * @property {string|number|Highcharts.Axis} [xAxis] xAxis instance, index or id
 * @property {string|number|Highcharts.Axis} [yAxis] yAxis instance, index or id
 */

/**
 * A trimmed point object which imitates {@link Highchart.Point} class.
 * It is created when there is a need of pointing to some chart's position
 * using axis values or pixel values
 *
 * @class
 * @memberOf Annotation
 *
 * @param {Chart} chart a chart instance
 * @param {Controllable} [target] a controllable instance
 * @param {Annotation.MockPoint.Options} options an options object
 */
function MockPoint(chart, target, options) {
    /**
     * A mock series instance imitating a real series from a real point.
     *
     * @type {Object}
     * @property {boolean} series.visible=true - whether a series is visible
     * @property {Chart} series.chart - a chart instance
     * @property {function} series.getPlotBox
     */
    this.series = {
        visible: true,
        chart: chart,
        getPlotBox: H.Series.prototype.getPlotBox
    };

    /**
     * @type {?Controllable}
     */
    this.target = target || null;

    /**
     * Options for the mock point.
     *
     * @type {Annotation.MockPoint.Options}
     */
    this.options = options;

    /**
     * If an xAxis is set it represents the point's value in terms of the xAxis.
     *
     * @name Annotation.MockPoint#x
     * @type {?number}
     */

    /**
     * If an yAxis is set it represents the point's value in terms of the yAxis.
     *
     * @name Annotation.MockPoint#y
     * @type {?number}
     */

    /**
     * It represents the point's pixel x coordinate relative to its plot box.
     *
     * @name Annotation.MockPoint#plotX
     * @type {?number}
     */

    /**
     * It represents the point's pixel y position relative to its plot box.
     *
     * @name Annotation.MockPoint#plotY
     * @type {?number}
     */

    /**
     * Whether the point is inside the plot box.
     *
     * @name Annotation.MockPoint#isInside
     * @type {boolean}
     */

    this.applyOptions(this.getOptions());
}

/**
 * Create a mock point from a real Highcharts point.
 *
 * @param {Point} point
 *
 * @return {Annotation.MockPoint} a mock point instance.
 */
MockPoint.fromPoint = function (point) {
    return new MockPoint(point.series.chart, null, {
        x: point.x,
        y: point.y,
        xAxis: point.series.xAxis,
        yAxis: point.series.yAxis
    });
};

/**
 * @typedef Annotation.MockPoint.Position
 * @property {number} x
 * @property {number} y
 */

/**
 * Get the pixel position from the point like object.
 *
 * @param {Annotation.PointLike} point
 * @param {boolean} [paneCoordinates]
 *        whether the pixel position should be relative
 *
 * @return {Annotation.MockPoint.Position} pixel position
 */
MockPoint.pointToPixels = function (point, paneCoordinates) {
    var series = point.series,
        chart = series.chart,
        x = point.plotX,
        y = point.plotY,
        plotBox;

    if (chart.inverted) {
        if (point.mock) {
            x = point.plotY;
            y = point.plotX;
        } else {
            x = chart.plotWidth - point.plotY;
            y = chart.plotHeight - point.plotX;
        }
    }

    if (series && !paneCoordinates) {
        plotBox = series.getPlotBox();
        x += plotBox.translateX;
        y += plotBox.translateY;
    }

    return {
        x: x,
        y: y
    };
};

/**
 * Get fresh mock point options from the point like object.
 *
 * @param {Annotation.PointLike} point
 *
 * @return {Annotation.MockPoint.Options} mock point's options
 */
MockPoint.pointToOptions = function (point) {
    return {
        x: point.x,
        y: point.y,
        xAxis: point.series.xAxis,
        yAxis: point.series.yAxis
    };
};

H.extend(MockPoint.prototype, /** @lends Annotation.MockPoint# */ {
    /**
     * A flag indicating that a point is not the real one.
     *
     * @type {boolean}
     * @default true
     */
    mock: true,

    /**
     * Check if the point has dynamic options.
     *
     * @return {boolean} A positive flag if the point has dynamic options.
     */
    hasDynamicOptions: function () {
        return typeof this.options === 'function';
    },

    /**
     * Get the point's options.
     *
     * @return {Annotation.MockPoint.Options} the mock point's options.
     */
    getOptions: function () {
        return this.hasDynamicOptions() ?
            this.options(this.target) :
            this.options;
    },

    /**
     * Apply options for the point.
     *
     * @param {Annotation.MockPoint.Options} options
     */
    applyOptions: function (options) {
        this.command = options.command;

        this.setAxis(options, 'x');
        this.setAxis(options, 'y');

        this.refresh();
    },

    /**
     * Set x or y axis.
     *
     * @param {Annotation.MockPoint.Options} options
     * @param {string} xOrY 'x' or 'y' string literal
     */
    setAxis: function (options, xOrY) {
        var axisName = xOrY + 'Axis',
            axisOptions = options[axisName],
            chart = this.series.chart;

        this.series[axisName] =
            axisOptions instanceof H.Axis ?
                axisOptions :
                H.defined(axisOptions) ?
                    chart[axisName][axisOptions] || chart.get(axisOptions) :
                    null;
    },

    /**
     * Transform the mock point to an anchor
     * (relative position on the chart).
     *
     * @return {Array<number>} A quadruple of numbers which denotes x, y,
     * width and height of the box
     **/
    toAnchor: function () {
        var anchor = [this.plotX, this.plotY, 0, 0];

        if (this.series.chart.inverted) {
            anchor[0] = this.plotY;
            anchor[1] = this.plotX;
        }

        return anchor;
    },

    /**
     * @typedef {Object} Annotation.MockPoint.LabelConfig
     * @property {number|undefined} x x value translated to x axis scale
     * @property {number|undefined} y y value translated to y axis scale
     * @property {Annotation.MockPoint} point instance of the point
     */

    /**
     * Returns a label config object -
     * the same as Highcharts.Point.prototype.getLabelConfig
     *
     * @return {Annotation.MockPoint.LabelConfig} the point's label config
     */
    getLabelConfig: function () {
        return {
            x: this.x,
            y: this.y,
            point: this
        };
    },

    /**
     * Check if the point is inside its pane.
     *
     * @return {boolean} A flag indicating whether the point is inside the pane.
     */
    isInsidePane: function () {
        var plotX = this.plotX,
            plotY = this.plotY,
            xAxis = this.series.xAxis,
            yAxis = this.series.yAxis,
            isInside = true;

        if (xAxis) {
            isInside = H.defined(plotX) && plotX >= 0 && plotX <= xAxis.len;
        }

        if (yAxis) {
            isInside =
                isInside &&
                H.defined(plotY) &&
                plotY >= 0 && plotY <= yAxis.len;
        }

        return isInside;
    },

    /**
     * Refresh point values and coordinates based on its options.
     */
    refresh: function () {
        var series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            options = this.getOptions();

        if (xAxis) {
            this.x = options.x;
            this.plotX = xAxis.toPixels(options.x, true);
        } else {
            this.x = null;
            this.plotX = options.x;
        }

        if (yAxis) {
            this.y = options.y;
            this.plotY = yAxis.toPixels(options.y, true);
        } else {
            this.y = null;
            this.plotY = options.y;
        }

        this.isInside = this.isInsidePane();
    },

    /**
     * Translate the point.
     *
     * @param {number} [cx] origin x transformation
     * @param {number} [cy] origin y transformation
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     **/
    translate: function (cx, cy, dx, dy) {
        if (!this.hasDynamicOptions()) {
            this.plotX += dx;
            this.plotY += dy;

            this.refreshOptions();
        }
    },

    /**
     * Scale the point.
     *
     * @param {number} cx origin x transformation
     * @param {number} cy origin y transformation
     * @param {number} sx scale factor x
     * @param {number} sy scale factor y
     */
    scale: function (cx, cy, sx, sy) {
        if (!this.hasDynamicOptions()) {
            var x = this.plotX * sx,
                y = this.plotY * sy,
                tx = (1 - sx) * cx,
                ty = (1 - sy) * cy;

            this.plotX = tx + x;
            this.plotY = ty + y;

            this.refreshOptions();
        }
    },

    /**
     * Rotate the point.
     *
     * @param {number} cx origin x rotation
     * @param {number} cy origin y rotation
     * @param {number} radians
     */
    rotate: function (cx, cy, radians) {
        if (!this.hasDynamicOptions()) {
            var cos = Math.cos(radians),
                sin = Math.sin(radians),
                x = this.plotX,
                y = this.plotY,
                tx,
                ty;

            x -= cx;
            y -= cy;

            tx = x * cos - y * sin;
            ty = x * sin + y * cos;

            this.plotX = tx + cx;
            this.plotY = ty + cy;

            this.refreshOptions();
        }
    },

    /**
     * Refresh point options based on its plot coordinates.
     */
    refreshOptions: function () {
        var series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        this.x = this.options.x = xAxis ?
            this.options.x = xAxis.toValue(this.plotX, true) :
            this.plotX;

        this.y = this.options.y = yAxis ?
            yAxis.toValue(this.plotY, true) :
            this.plotY;
    }
});

export default MockPoint;
