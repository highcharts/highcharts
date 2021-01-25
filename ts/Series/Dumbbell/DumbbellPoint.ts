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

/* *
 *
 *  Imports
 *
 * */

import type DumbbellSeries from './DumbbellSeries.js';
import type DumbbellPointOptions from './DumbbellPointOptions';

import AreaRangePoint from '../AreaRange/AreaRangePoint.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class DumbbellPoint extends AreaRangePoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: DumbbellSeries = void 0 as any;
    public options: DumbbellPointOptions = void 0 as any;
    public connector: Highcharts.SVGElement = void 0 as any;
    public pointWidth: number = void 0 as any;

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
    setState(): void {
        var point = this,
            series = point.series,
            chart = series.chart,
            seriesLowColor = series.options.lowColor,
            seriesMarker = series.options.marker,
            pointOptions = point.options,
            pointLowColor = pointOptions.lowColor,
            zoneColor = point.zone && point.zone.color,
            lowerGraphicColor = pick(
                pointLowColor,
                seriesLowColor,
                pointOptions.color,
                zoneColor,
                point.color,
                series.color
            ),
            verb = 'attr',
            upperGraphicColor,
            origProps;

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
                    upperGraphicColor = pick(
                        point.marker ? point.marker.fillColor : void 0,
                        seriesMarker ? seriesMarker.fillColor : void 0,
                        pointOptions.color,
                        point.zone ? point.zone.color : void 0,
                        point.color
                    );
                    point.upperGraphic.attr({
                        fill: upperGraphicColor
                    });
                    extend(point, origProps);
                }
            }
        }

        point.connector[verb](series.getConnectorAttribs(point));
    }
}

/* *
 *
 *  Prototype properties
 *
 * */
interface DumbbellPoint{
    pointSetState: typeof AreaRangePoint.prototype.setState;
}

extend(DumbbellPoint.prototype, {
    pointSetState: AreaRangePoint.prototype.setState
});

/* *
 *
 *  Default export
 *
 * */

export default DumbbellPoint;
