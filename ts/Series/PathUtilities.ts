/* *
 *
 *  (c) 2010-2022 Pawel Lysy
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

import type SVGPath from '../Core/Renderer/SVG/SVGPath';

const getLinkPath = {
    'default': getDefaultPath,
    straight: getStraightPath,
    curved: getCurvedPath
};
/* *
 *
 *  Functions
 *
 * */
interface PathParams {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    offset?: number;
    radius?: number;
    width?: number;
    inverted?: boolean;
    parentVisible: boolean;
}

function getDefaultPath(pathParams: PathParams): SVGPath {
    const {
        x1,
        y1,
        x2,
        y2,
        width = 0,
        inverted = false,
        radius,
        parentVisible
    } = pathParams;
    const path: SVGPath = [
        ['M', x1, y1],
        ['L', x1, y1],
        ['C', x1, y1, x1, y2, x1, y2],
        ['L', x1, y2],
        ['C', x1, y1, x1, y2, x1, y2],
        ['L', x1, y2]
    ];

    return parentVisible ?
        applyRadius(
            [
                ['M', x1, y1],
                ['L', x1 + width * (inverted ? -0.5 : 0.5), y1],
                ['L', x1 + width * (inverted ? -0.5 : 0.5), y2],
                ['L', x2, y2]
            ],
            radius
        ) :
        path;
}
function getStraightPath(pathParams: PathParams): SVGPath {
    const {
        x1,
        y1,
        x2,
        y2,
        width = 0,
        inverted = false,
        parentVisible
    } = pathParams;

    return parentVisible ? [
        ['M', x1, y1],
        ['L', x1 + width * (inverted ? -1 : 1), y2],
        ['L', x2, y2]
    ] : [
        ['M', x1, y1],
        ['L', x1, y2],
        ['L', x1, y2]
    ];
}
function getCurvedPath(pathParams: PathParams): SVGPath {
    const {
        x1,
        y1,
        x2,
        y2,
        offset = 0,
        width = 0,
        inverted = false,
        parentVisible
    } = pathParams;
    return parentVisible ?
        [
            ['M', x1, y1],
            [
                'C',
                x1 + offset,
                y1,
                x1 - offset + width * (inverted ? -1 : 1),
                y2,
                x1 + width * (inverted ? -1 : 1),
                y2
            ],
            ['L', x2, y2]
        ] :
        [
            ['M', x1, y1],
            ['C', x1, y1, x1, y2, x1, y2],
            ['L', x2, y2]
        ];
}
/**
 * General function to apply corner radius to a path
 * @private
 */
function applyRadius(path: SVGPath, r?: number): SVGPath {
    const d: SVGPath = [];

    for (let i = 0; i < path.length; i++) {
        const x = path[i][1];
        const y = path[i][2];

        if (typeof x === 'number' && typeof y === 'number') {
            // moveTo
            if (i === 0) {
                d.push(['M', x, y]);
            } else if (i === path.length - 1) {
                d.push(['L', x, y]);

                // curveTo
            } else if (r) {
                const prevSeg = path[i - 1];
                const nextSeg = path[i + 1];
                if (prevSeg && nextSeg) {
                    const x1 = prevSeg[1],
                        y1 = prevSeg[2],
                        x2 = nextSeg[1],
                        y2 = nextSeg[2];

                    // Only apply to breaks
                    if (
                        typeof x1 === 'number' &&
                        typeof x2 === 'number' &&
                        typeof y1 === 'number' &&
                        typeof y2 === 'number' &&
                        x1 !== x2 &&
                        y1 !== y2
                    ) {
                        const directionX = x1 < x2 ? 1 : -1,
                            directionY = y1 < y2 ? 1 : -1;
                        d.push([
                            'L',
                            x - directionX * Math.min(Math.abs(x - x1), r),
                            y - directionY * Math.min(Math.abs(y - y1), r)
                        ], [
                            'C',
                            x,
                            y,
                            x,
                            y,
                            x + directionX * Math.min(Math.abs(x - x2), r),
                            y + directionY * Math.min(Math.abs(y - y2), r)
                        ]);
                    }
                }

                // lineTo
            } else {
                d.push(['L', x, y]);
            }
        }
    }
    return d;
}
const PathUtilities = {
    applyRadius,
    getLinkPath
};

export default PathUtilities;
