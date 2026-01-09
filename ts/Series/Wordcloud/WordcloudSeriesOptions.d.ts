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

/* *
 *
 *  Imports
 *
 * */

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type WordcloudPointOptions from './WordcloudPointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A word cloud is a visualization of a set of words, where the size and
 * placement of a word is determined by how it is weighted.
 *
 * A `wordcloud` series. If the [type](#series.wordcloud.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/wordcloud Word Cloud chart
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.wordcloud
 *
 * @excluding allAreas, boostThreshold, clip, colorAxis, compare,
 *            compareBase, crisp, cropThreshold, dataGrouping,
 *            dataLabels, depth, dragDrop, edgeColor, findNearestPointBy,
 *            getExtremesFromAll, grouping, groupPadding, groupZPadding,
 *            joinBy, maxPointWidth, minPointLength, navigatorOptions,
 *            negativeColor, pointInterval, pointIntervalUnit,
 *            pointPadding, pointPlacement, pointRange, pointStart,
 *            pointWidth, pointStart, pointWidth, shadow, showCheckbox,
 *            showInNavigator, softThreshold, stacking, threshold,
 *            zoneAxis, zones, dataSorting, boostBlending
 *
 * @product highcharts
 *
 * @since 6.0.0
 *
 * @requires modules/wordcloud
 *
 * @exclude dataSorting, boostThreshold, boostBlending
 */
export interface WordcloudSeriesOptions extends ColumnSeriesOptions {

    /**
     * If there is no space for a word on the playing field, then this
     * option will allow the playing field to be extended to fit the word.
     * If false then the word will be dropped from the visualization.
     *
     * NB! This option is currently not decided to be published in the API,
     * and is therefore marked as private.
     */
    allowExtendPlayingField?: boolean;

    animation?: WordcloudSeriesAnimationOptions;

    borderWidth?: number;

    clip?: boolean;

    colorByPoint?: boolean;

    /**
     * An array of data points for the series. For the `wordcloud` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 2 values. In this case, the values correspond
     *  to
     *    `name,weight`.
     *    ```js
     *    data: [
     *        ['Lorem', 4],
     *        ['Ipsum', 1]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.arearange.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        name: "Lorem",
     *        weight: 4
     *    }, {
     *        name: "Ipsum",
     *        weight: 1
     *    }]
     *    ```
     *
     * @type {Array<Array<string,number>|*>}
     *
     * @extends series.line.data
     *
     * @excluding drilldown, marker, x, y
     *
     * @product highcharts
     */
    data?: Array<(PointOptions|PointShortOptions|WordcloudPointOptions)>;

    /**
     * The word with the largest weight will have a font size equal to this
     * value. The font size of a word is the ratio between its weight and the
     * largest occuring weight, multiplied with the value of maxFontSize.
     */
    maxFontSize?: number;

    /**
     * A threshold determining the minimum font size that can be applied to a
     * word.
     */
    minFontSize?: number;

    /**
     * This option decides which algorithm is used for placement, and rotation
     * of a word. The choice of algorith is therefore a crucial part of the
     * resulting layout of the wordcloud. It is possible for users to add their
     * own custom placement strategies for use in word cloud. Read more about it
     * in our
     * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-placement-strategies)
     *
     * @validvalue ["center", "random"]
     */
    placementStrategy?: string;

    /**
     * Rotation options for the words in the wordcloud.
     *
     * @sample highcharts/plotoptions/wordcloud-rotation
     *         Word cloud with rotation
     */
    rotation?: WordcloudSeriesRotationOptions;

    showInLegend?: boolean;

    /**
     * Spiral used for placing a word after the initial position experienced a
     * collision with either another word or the borders. It is possible for
     * users to add their own custom spiralling  algorithms for use in word
     * cloud. Read more about it in our
     * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-spiralling-algorithm)
     *
     * @validvalue ["archimedean", "rectangular", "square"]
     */
    spiral?: string;

    states?: SeriesStatesOptions<WordcloudSeriesOptions>;

    /**
     * CSS styles for the words.
     *
     * @type {Highcharts.CSSObject}
     *
     * @default {"fontFamily":"sans-serif", "fontWeight": "900"}
     */
    style?: CSSObject;

    tooltip?: Partial<TooltipOptions>;

}

interface WordcloudSeriesAnimationOptions {
    duration?: number;
}


/**
 * Rotation options for the words in the wordcloud.
 *
 * @sample highcharts/plotoptions/wordcloud-rotation
 *         Word cloud with rotation
 */
export interface WordcloudSeriesRotationOptions {

    /**
     * The smallest degree of rotation for a word.
     */
    from?: number;

    /**
     * The number of possible orientations for a word, within the range of
     * `rotation.from` and `rotation.to`. Must be a number larger than 0.
     */
    orientations?: number;

    /**
     * The largest degree of rotation for a word.
     */
    to?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default WordcloudSeriesOptions;
