/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */


import type SizeObject from '../../Core/Renderer/SizeObject';
import type WordcloudPointOptions from './WordcloudPointOptions';
import DrawPointMixin from '../../Mixins/DrawPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import WordcloudSeries from './WordcloudSeries';
import U from '../../Core/Utilities.js';
const { extend } = U;

class WordcloudPoint extends ColumnSeries.prototype.pointClass implements DrawPointMixin.DrawPoint {

    /* *
     *
     * Properties
     *
     * */
    public dimensions: SizeObject = void 0 as any;
    public lastCollidedWith?: WordcloudPoint;
    public options: WordcloudPointOptions = void 0 as any;
    public polygon?: Highcharts.PolygonObject = void 0 as any;
    public rect?: Highcharts.PolygonBoxObject = void 0 as any;
    public rotation?: (boolean|number);
    public series: WordcloudSeries = void 0 as any;

    /* *
     *
     * Functions
     *
     * */
    public shouldDraw(): boolean {
        var point = this;
        return !point.isNull;
    }
    public isValid(): boolean {
        return true;
    }
}

interface WordcloudPoint {
    draw: typeof DrawPointMixin.drawPoint;
    weight: number;
}

extend(WordcloudPoint.prototype, {
    draw: DrawPointMixin.drawPoint,
    weight: 1
});

export default WordcloudPoint;
