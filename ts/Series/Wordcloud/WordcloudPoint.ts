/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygård
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PolygonBoxObject from '../../Core/Renderer/PolygonBoxObject.js';
import type SizeObject from '../../Core/Renderer/SizeObject.js';
import type WordcloudPointOptions from './WordcloudPointOptions.js';
import type WordcloudUtils from './WordcloudUtils.js';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: { prototype: { pointClass: ColumnPoint } }
} = SeriesRegistry.seriesTypes;
import WordcloudSeries from './WordcloudSeries.js';
import { extend } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

class WordcloudPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public dimensions!: SizeObject;
    /** @internal */
    public lastCollidedWith?: WordcloudPoint;
    public options!: WordcloudPointOptions;
    /** @internal */
    public polygon?: WordcloudUtils.PolygonObject;
    /** @internal */
    public rect?: PolygonBoxObject;
    /** @internal */
    public rotation?: (boolean|number);
    /** @internal */
    public series!: WordcloudSeries;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public isValid(): boolean {
        return true;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface WordcloudPoint {
    /** @internal */
    weight: number;
}

extend(WordcloudPoint.prototype, {
    weight: 1
});

/* *
 *
 *  Default Export
 *
 * */

export default WordcloudPoint;
