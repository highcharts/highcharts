/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import Delaunator from '../../Core/Delauney';

class ContourSeries extends ScatterSeries {
    public canvas?: HTMLCanvasElement;
    public context?: GPUCanvasContext;
    public adapter?: GPUAdapter | null;
    public device?: GPUDevice;

    // Dummy func for test for now
    public d(): boolean {
        const coords = new Delaunator(new Float64Array([
            377, 479, 453, 434, 326, 387, 444, 359, 511, 389,
            586, 429, 470, 315, 622, 493, 627, 367, 570, 314
        ])).triangles;
        const tris = [
            4, 3, 1, 4, 6, 3, 1, 5, 4, 4, 9, 6, 2, 0, 1, 1, 7, 5,
            5, 9, 4, 6, 2, 3, 3, 2, 1, 5, 8, 9, 0, 7, 1, 5, 7, 8
        ];

        for (let i = 0; i < coords.length; i++) {
            if (tris[i] !== coords[i]) {
                return false;
            }
        }
        return true;
    }

}

/* *
    *  *
    *   *  Registry
*    *
    *     * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        contour: typeof ContourSeries;
    }
}
SeriesRegistry.registerSeriesType('contour', ContourSeries);
