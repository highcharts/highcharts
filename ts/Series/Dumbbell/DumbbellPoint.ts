/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Sebastian Bochan, Rafal Sebestjanski
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

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

    public series!: DumbbellSeries;
    public options!: DumbbellPointOptions;
    public connector?: SVGElement;
    public pointWidth!: number;

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
     */
    public setState(): void {
        const point = this,
            series = point.series,
            chart = series.chart,
            seriesLowColor = series.options.lowColor,
            seriesMarker = series.options.marker,
            seriesLowMarker = series.options.lowMarker,
            pointOptions = point.options,
            pointLowColor = pointOptions.lowColor,
            zoneColor = point.zone && point.zone.color,
            lowerGraphicColor = pick(
                pointLowColor,
                seriesLowMarker?.fillColor,
                seriesLowColor,
                pointOptions.color,
                zoneColor,
                point.color,
                series.color
            );
        let verb = 'attr',
            upperGraphicColor,
            origProps: Partial<DumbbellPoint>;

        this.pointSetState.apply(point, arguments);

        if (!point.state) {
            verb = 'animate';
            const [lowerGraphic, upperGraphic] = point.graphics || [];
            if (lowerGraphic && !chart.styledMode) {
                lowerGraphic.attr({
                    fill: lowerGraphicColor
                });
                if (upperGraphic) {
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
                    upperGraphic.attr({
                        fill: upperGraphicColor
                    });
                    extend(point, origProps);
                }
            }
        }

        point.connector?.[verb](series.getConnectorAttribs(point));
    }

    public destroy(): void {
        const point = this;

        // #15560
        if (!point.graphic) {
            point.graphic = point.connector;
            point.connector = void 0 as any;
        }
        return super.destroy();
    }
}

/* *
 *
 *  Class Prototype
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
