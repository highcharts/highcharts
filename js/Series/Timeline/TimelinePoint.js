/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, PiePoint = SeriesRegistry.seriesTypes.pie.prototype.pointClass;
import U from '../../Core/Utilities.js';
var defined = U.defined, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
var TimelinePoint = /** @class */ (function (_super) {
    __extends(TimelinePoint, _super);
    function TimelinePoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    TimelinePoint.prototype.alignConnector = function () {
        var point = this, series = point.series, connector = point.connector, dl = point.dataLabel, dlOptions = point.dataLabel.options = merge(series.options.dataLabels, point.options.dataLabels), chart = point.series.chart, bBox = connector.getBBox(), plotPos = {
            x: bBox.x + dl.translateX,
            y: bBox.y + dl.translateY
        }, isVisible;
        // Include a half of connector width in order to run animation,
        // when connectors are aligned to the plot area edge.
        if (chart.inverted) {
            plotPos.y -= dl.options.connectorWidth / 2;
        }
        else {
            plotPos.x += dl.options.connectorWidth / 2;
        }
        isVisible = chart.isInsidePlot(plotPos.x, plotPos.y);
        connector[isVisible ? 'animate' : 'attr']({
            d: point.getConnectorPath()
        });
        if (!series.chart.styledMode) {
            connector.attr({
                stroke: dlOptions.connectorColor || point.color,
                'stroke-width': dlOptions.connectorWidth,
                opacity: dl[defined(dl.newOpacity) ? 'newOpacity' : 'opacity']
            });
        }
    };
    TimelinePoint.prototype.drawConnector = function () {
        var point = this, series = point.series;
        if (!point.connector) {
            point.connector = series.chart.renderer
                .path(point.getConnectorPath())
                .attr({
                zIndex: -1
            })
                .add(point.dataLabel);
        }
        if (point.series.chart.isInsidePlot(// #10507
        point.dataLabel.x, point.dataLabel.y)) {
            point.alignConnector();
        }
    };
    TimelinePoint.prototype.getConnectorPath = function () {
        var point = this, chart = point.series.chart, xAxisLen = point.series.xAxis.len, inverted = chart.inverted, direction = inverted ? 'x2' : 'y2', dl = point.dataLabel, targetDLPos = dl.targetPosition, coords = {
            x1: point.plotX,
            y1: point.plotY,
            x2: point.plotX,
            y2: isNumber(targetDLPos.y) ? targetDLPos.y : dl.y
        }, negativeDistance = ((dl.alignAttr || dl)[direction[0]] <
            point.series.yAxis.len / 2), path;
        // Recalculate coords when the chart is inverted.
        if (inverted) {
            coords = {
                x1: point.plotY,
                y1: xAxisLen - point.plotX,
                x2: targetDLPos.x || dl.x,
                y2: xAxisLen - point.plotX
            };
        }
        // Subtract data label width or height from expected coordinate so
        // that the connector would start from the appropriate edge.
        if (negativeDistance) {
            coords[direction] += dl[inverted ? 'width' : 'height'];
        }
        // Change coordinates so that they will be relative to data label.
        objectEach(coords, function (_coord, i) {
            coords[i] -= (dl.alignAttr || dl)[i[0]];
        });
        path = chart.renderer.crispLine([
            ['M', coords.x1, coords.y1],
            ['L', coords.x2, coords.y2]
        ], dl.options.connectorWidth);
        return path;
    };
    TimelinePoint.prototype.init = function () {
        var point = _super.prototype.init.apply(this, arguments);
        point.name = pick(point.name, 'Event');
        point.y = 1;
        return point;
    };
    TimelinePoint.prototype.isValid = function () {
        return this.options.y !== null;
    };
    TimelinePoint.prototype.setState = function () {
        var proceed = _super.prototype.setState;
        // Prevent triggering the setState method on null points.
        if (!this.isNull) {
            proceed.apply(this, arguments);
        }
    };
    TimelinePoint.prototype.setVisible = function (visible, redraw) {
        var point = this, series = point.series;
        redraw = pick(redraw, series.options.ignoreHiddenPoint);
        PiePoint.prototype.setVisible.call(point, visible, false);
        // Process new data
        series.processData();
        if (redraw) {
            series.chart.redraw();
        }
    };
    return TimelinePoint;
}(Series.prototype.pointClass));
/* *
 *
 *  Default Export
 *
 * */
export default TimelinePoint;
