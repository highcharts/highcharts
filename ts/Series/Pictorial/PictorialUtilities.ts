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
import type { PictorialPathOptions } from './PictorialSeriesOptions';
import U from '../../Core/Utilities.js';

import Axis from '../../Core/Axis/Axis.js';

const {
    defined
} = U;

function rescalePatternFill(
    element: SVGElement,
    stackHeight: number,
    width: number,
    height: number,
    borderWidth = 1
): void {
    const fill = element && element.attr('fill') as string,
        match = fill && fill.match(/url\(([^)]+)\)/);

    if (match) {
        const patternPath =
            document.querySelector(`${match[1]} path`) as unknown as SVGElement;
        if (patternPath) {
            const bBox = patternPath.getBBox();
            let scaleX = 1 / (bBox.width + borderWidth),
                scaleY = stackHeight / height / bBox.height,
                aspectRatio = bBox.width / bBox.height,
                pointAspectRatio = width / stackHeight,
                x = -bBox.width / 2;

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

function getStackMetrics(
    yAxis: Axis,
    shape?: PictorialPathOptions
): {
        height: number,
        y: number
    } {
    let height = yAxis.len,
        y = 0;

    if (shape && defined(shape.max)) {
        y = yAxis.toPixels(shape.max, true);
        height = yAxis.len - y;
    }

    return {
        height,
        y
    };
}

function invertShadowGroup(
    shadowGroup: SVGElement,
    yAxis: Axis
): void {

    let inverted = yAxis.chart.inverted;

    if (inverted) {
        shadowGroup.attr({
            rotation: inverted ? 90 : 0,
            scaleX: inverted ? -1 : 1
        });
    }
}

export default { rescalePatternFill, invertShadowGroup, getStackMetrics };
