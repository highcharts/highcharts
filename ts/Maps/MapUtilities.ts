/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';


/**
 * Test for point in polygon. Polygon defined as array of [x,y] points.
 * @private
 */
const pointInPolygon = function (
    point: { x: number, y: number },
    polygon: Array<Array<number>>
): boolean {
    let i,
        j,
        rel1,
        rel2,
        c = false,
        x = point.x,
        y = point.y;

    for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        rel1 = polygon[i][1] > y;
        rel2 = polygon[j][1] > y;
        if (
            rel1 !== rel2 &&
            (
                x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) /
                    (polygon[j][1] - polygon[i][1]) +
                    polygon[i][0]
            )
        ) {
            c = !c;
        }
    }

    return c;
};

/* *
 *
 *  Default Export
 *
 * */

const MapUtilities = {
    pointInPolygon
};

export default MapUtilities;
