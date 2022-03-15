/* eslint-disable valid-jsdoc */

/**
 * General function to apply corner radius to a path
 * @private
 */

/* eslint-enable valid-jsdoc */

import type SVGPath from '../Core/Renderer/SVG/SVGPath';

function curvedPath(path: SVGPath, r?: number): SVGPath {
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
    curvedPath
};

export default PathUtilities;
