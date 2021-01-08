/* *
 *
 *  (c) 2010-2021 Sebastian Bochan, Rafal Sebestjanski
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
import AreaRangePoint from '../AreaRange/AreaRangePoint.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
var DumbbellPoint = /** @class */ (function (_super) {
    __extends(DumbbellPoint, _super);
    function DumbbellPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.series = void 0;
        _this.options = void 0;
        _this.connector = void 0;
        _this.pointWidth = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Set the point's state extended by have influence on the connector
     * (between low and high value).
     *
     * @private
     * @param {Highcharts.Point} this The point to inspect.
     *
     * @return {void}
     */
    DumbbellPoint.prototype.setState = function () {
        var point = this, series = point.series, chart = series.chart, seriesLowColor = series.options.lowColor, seriesMarker = series.options.marker, pointOptions = point.options, pointLowColor = pointOptions.lowColor, zoneColor = point.zone && point.zone.color, lowerGraphicColor = pick(pointLowColor, seriesLowColor, pointOptions.color, zoneColor, point.color, series.color), verb = 'attr', upperGraphicColor, origProps;
        this.pointSetState.apply(this, arguments);
        if (!point.state) {
            verb = 'animate';
            if (point.lowerGraphic && !chart.styledMode) {
                point.lowerGraphic.attr({
                    fill: lowerGraphicColor
                });
                if (point.upperGraphic) {
                    origProps = {
                        y: point.y,
                        zone: point.zone
                    };
                    point.y = point.high;
                    point.zone = point.zone ? point.getZone() : void 0;
                    upperGraphicColor = pick(point.marker ? point.marker.fillColor : void 0, seriesMarker ? seriesMarker.fillColor : void 0, pointOptions.color, point.zone ? point.zone.color : void 0, point.color);
                    point.upperGraphic.attr({
                        fill: upperGraphicColor
                    });
                    extend(point, origProps);
                }
            }
        }
        point.connector[verb](series.getConnectorAttribs(point));
    };
    return DumbbellPoint;
}(AreaRangePoint));
extend(DumbbellPoint.prototype, {
    pointSetState: AreaRangePoint.prototype.setState
});
/* *
 *
 *  Default export
 *
 * */
export default DumbbellPoint;
