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

import type TemperatureMapSeries from './TemperatureMapSeries.js';
import type TemperatureMapPointOptions from './TemperatureMapPointOptions';

import MapBubblePoint from '../MapBubble/MapBubblePoint.js';
import U from '../../Core/Utilities.js';
import Point from '../../Core/Series/Point.js';
import SVGElementLike from '../../Core/Renderer/SVG/SVGElementLike.js';
const {
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

class TemperatureMapPoint extends MapBubblePoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: TemperatureMapSeries = void 0 as any;
    public options: TemperatureMapPointOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add graphics prop containing all graphical marker elements to
     * graphicalProps.
     *
     * @private
     */
    public getGraphicalProps(
        kinds?: Record<string, number>
    ): Point.GraphicalProps {
        const graphicalProps = super.getGraphicalProps(kinds);

        graphicalProps.plural.push('graphics');

        return graphicalProps;
    }

    /**
     * Toggle visibility of all additional graphical marker elements together
     * with point.graphic.
     *
     * @private
     */
    public setVisible(vis?: boolean): void {
        const method = vis ? 'show' : 'hide';

        super.setVisible(vis);

        this.graphics.forEach((elem: SVGElementLike): void => {
            if (elem) {
                elem[method]();
            }
        });
    }
}

/* *
 *
 *  Prototype properties
 *
 * */
interface TemperatureMapPoint{
    graphics: Array<SVGElementLike>;
}

extend(TemperatureMapPoint.prototype, {
    // pointSetState: AreaRangePoint.prototype.setState
});

/* *
 *
 *  Default export
 *
 * */

export default TemperatureMapPoint;
