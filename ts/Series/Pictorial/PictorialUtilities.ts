/* *
 *
 *  (c) 2010-2022 Torstein Honsi, Magdalena Gut
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type SVGElement from '../../Core/Renderer/SVG/SVGElement.js';

import Axis from '../../Core/Axis/Axis.js';

function rescalePatternFill(
    element: SVGElement,
    yAxis: Axis,
    width: number,
    height: number,
    borderWidth = 1
): void {
    const fill = element && element.attr('fill') as string;
    const match = fill && fill.match(/url\(([^)]+)\)/);
    if (match) {
        const patternPath = document.querySelector(`${match[1]} path`) as unknown as SVGElement;
        if (patternPath) {
            const bBox = patternPath.getBBox();
            let scaleX = 1 / (bBox.width + borderWidth);
            let scaleY = yAxis.len / height / bBox.height;
            let aspectRatio = bBox.width / bBox.height;
            let pointAspectRatio = width / yAxis.len;
            let x = -bBox.width / 2;

            if (aspectRatio < pointAspectRatio) {
                scaleX = scaleX * aspectRatio / pointAspectRatio;
            }

            patternPath.setAttribute(
                'stroke-width', borderWidth / (width * scaleX)
            );

            patternPath.setAttribute(
                'transform',
                'translate(0.5, 0)' +
                `scale(${scaleX} ${scaleY}) ` +
                `translate(${x + borderWidth * scaleX / 2}, ${-bBox.y})`
            );
        }
    }
}

export default { rescalePatternFill };
