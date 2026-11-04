/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygård
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/**
 * Polygon box for certain series like `venn` and `wordcloud`.
 */
export interface PolygonBoxObject {
    /**
     * The bottom position of the polygon box.
     */
    bottom: number;
    /**
     * The left position of the polygon box.
     */
    left: number;
    /**
     * The right position of the polygon box.
     */
    right: number;
    /**
     * The top position of the polygon box.
     */
    top: number;
}

export default PolygonBoxObject;
