/* *
 *
 *  (c) 2010-2022 Torstein Honsi, Magdalena Gut
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import Axis from '../../Core/Axis/Axis.js';

function rescalePatternFill(
    element: SVGElement,
    yAxis: Axis,
    height: number
): void {
    const fill = element && element.attr('fill') as string;
    const match = fill && fill.match(/url\(([^)]+)\)/);
    if (match) {
        const patternPath = document.querySelector(`${match[1]} path`) as unknown as SVGElement;
        if (patternPath) {
            const bBox = patternPath.getBBox();
            const scaleX = 1 / bBox.width;
            const scaleY = yAxis.len /
               height /
                bBox.height;
            patternPath.setAttribute(
                'transform',
                `scale(${scaleX} ${scaleY}) ` +
                `translate(${-bBox.x}, ${-bBox.y})`
            );
        }
    }
}

export default { rescalePatternFill };
