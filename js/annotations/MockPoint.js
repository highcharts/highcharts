import H from '../parts/Globals.js';
import '../parts/Axis.js';
import '../parts/Series.js';

/**
 * A mock point configuration.
 *
 * @typedef {Object} MockPointOptions
 * @property {Number} x - x value for the point in xAxis scale or pixels
 * @property {Number} y - y value for the point in yAxis scale or pixels
 * @property {String|Number} [xAxis] - xAxis index or id
 * @property {String|Number} [yAxis] - yAxis index or id
 */


/**
 * A trimmed point object which imitates {@link Highchart.Point} class.
 * It is created when there is a need of pointing to some chart's position
 * using axis values or pixel values
 *
 * @class MockPoint
 * @memberOf Highcharts
 *
 * @param {Highcharts.Chart} - the chart object
 * @param {MockPointOptions} - the options object
 */
function MockPoint(chart, target, options) {
    this.series = {
        visible: true,
        chart: chart,
        getPlotBox: H.Series.prototype.getPlotBox
    };

    this.target = target;
    this.options = options;

    this.applyOptions(this.getOptions());
}

/**
 * Create a mock point from the real Highcharts point.
 *
 * @static
 *
 * @param {Highcharts.Point} point
 * @returns {Highcharts.MockPoint}
 **/
MockPoint.fromPoint = function (point) {
    return new MockPoint(point.series.chart, {
        x: point.x,
        y: point.y,
        xAxis: point.series.xAxis,
        yAxis: point.series.yAxis
    });
};

/**
 * Get the absolute pixel position of the point.
 *
 * @static
 *
 * @param {Highcharts.MockPoint | Highcharts.Point} point
 * @returns {{ x: Number, y: Number }}
 **/
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
 * Get the options from the point.
 *
 * @static
 *
 * @param {Highcharts.MockPoint | Highcharts.Point} point
 * @returns {MockPointOptions}
 **/
MockPoint.pointToOptions = function (point) {
    return {
        x: point.x,
        y: point.y,
        xAxis: point.series.xAxis,
        yAxis: point.series.yAxis
    };
};

H.extend(MockPoint.prototype, {
    mock: true,

    hasDynamicOptions: function () {
        return typeof this.options === 'function';
    },

    getOptions: function () {
        return this.hasDynamicOptions() ?
            this.options.call(this, this.target) :
            this.options;
    },

    /**
     * Apply options for the point.
     *
     * @param {MockPointOptions} options
     **/
    applyOptions: function (options) {
        this.command = options.command;

        this.setAxis(options, 'x');
        this.setAxis(options, 'y');

        this.refresh();
    },

    /**
     * Set x or y axis.
     *
     * @param {MockPointOptions} options
     * @param {String} xOrY
     **/
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
     * @function toAnchor
     * @memberOf Highcharts.MockPoint#
     *
     * @return {Array.<Number>} A quadruple of numbers which denotes x, y,
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
     * Returns a label config object -
     * the same as Highcharts.Point.prototype.getLabelConfig
     *
     * @function #getLabelConfig
     * @memberOf Highcharts.MockPoint#
     *
     * @return {Object} labelConfig - label config object
     * @return {Number|undefined} labelConfig.x
     *         X value translated to x axis scale
     * @return {Number|undefined} labelConfig.y
     *         Y value translated to y axis scale
     * @return {MockPoint} labelConfig.point
     *         The instance of the point
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
     * @param {Boolean} isInside
     **/
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
     * @param {Number} [cx] origin x transformation
     * @param {Number} [cy] origin y transformation
     * @param {Number} dx - translation for x coordinate
     * @param {Number} dy - translation for y coordinate
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
     * @param {Number} cx origin x transformation
     * @param {Number} cy origin y transformation
     * @param {Number} sx - scale factor x
     * @param {Number} sy - scale factor y
     **/
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
     * @param {Number} cx - origin x rotation
     * @param {Number} cy - origin y rotation
     * @param {Number} radians
     **/
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
     **/
    refreshOptions: function () {
        var series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        this.options.x = xAxis ?
            this.options.x = xAxis.toValue(this.plotX, true) :
            this.plotX;

        this.options.y = yAxis ?
            yAxis.toValue(this.plotY, true) :
            this.plotY;
    }
});

export default MockPoint;
