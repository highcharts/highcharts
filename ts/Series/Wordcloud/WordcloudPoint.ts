/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PolygonBoxObject from '../../Core/Renderer/PolygonBoxObject';
import type SizeObject from '../../Core/Renderer/SizeObject';
import type WordcloudPointOptions from './WordcloudPointOptions';
import type WordcloudUtils from './WordcloudUtils';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: { prototype: { pointClass: ColumnPoint } }
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { extend } = U;
import WordcloudSeries from './WordcloudSeries';

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

    public dimensions!: SizeObject;
    public lastCollidedWith?: WordcloudPoint;
    public options!: WordcloudPointOptions;
    public polygon?: WordcloudUtils.PolygonObject;
    public rect?: PolygonBoxObject;
    public rotation?: (boolean|number);
    public series!: WordcloudSeries;

    /* *
     *
     *  Functions
     *
     * */

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
