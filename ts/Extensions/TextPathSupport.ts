import type PositionObject from '../Core/Renderer/PositionObject';
import TreegraphSeries from '../Series/Treegraph/TreegraphSeries';
import Series from '../Core/Series/Series.js';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
const { deg2rad } = H;
const { addEvent } = U;

function hideOverlappingPolygons(event: Event): void {
    const serie = event.target as any;

    if (
        serie &&
        serie.is('treegraph') &&
        (serie as TreegraphSeries).links
    ) {
        const links = (serie as TreegraphSeries).links;

        for (const link of links) {
            if (link.dataLabel?.text?.textPath) {
                const tp = link.dataLabel.element.querySelector('textPath');

                if (tp) {
                    const polygon: [number, number][] = [],
                        { b, h } = serie
                            .chart
                            .renderer
                            .fontMetrics(link.dataLabel.element),
                        descender = h - b,
                        lineCleanerRegex = new RegExp(
                            '(<tspan>|' +
                            '<tspan(?!\\sclass="highcharts-br")[^>]*>|' +
                            '<\\/tspan>)',
                            'g'
                        ),
                        lines = tp
                            .innerHTML
                            .replace(lineCleanerRegex, '')
                            .split(
                                /<tspan class="highcharts-br"[^>]*>/
                            ),
                        numOfLines = lines.length;


                    // Calculate top and bottom coordinates for either the start
                    // or the end of a single character, and append it to the
                    // polygon.
                    const appendTopAndBottom = (
                        charIndex: number,
                        positionOfChar: PositionObject
                    ): [[number, number], [number, number]] => {
                        const { x, y } = positionOfChar,
                            rotation = (
                                tp.getRotationOfChar(charIndex) - 90
                            ) * deg2rad,
                            cosRot = Math.cos(rotation),
                            sinRot = Math.sin(rotation);
                        return [
                            [
                                x - descender * cosRot,
                                y - descender * sinRot
                            ],
                            [
                                x + b * cosRot,
                                y + b * sinRot
                            ]
                        ];
                    };

                    for (
                        let i = 0, lineIndex = 0;
                        lineIndex < numOfLines;
                        lineIndex++
                    ) {
                        const line = lines[lineIndex],
                            lineLen = line.length;

                        for (
                            let lineCharIndex = 0;
                            lineCharIndex < lineLen;
                            lineCharIndex += 5
                        ) {
                            const srcCharIndex = (
                                    i +
                                    lineCharIndex +
                                    lineIndex
                                ),
                                [lower, upper] = appendTopAndBottom(
                                    srcCharIndex,
                                    tp.getStartPositionOfChar(srcCharIndex)
                                );

                            if (lineCharIndex === 0) {
                                polygon.push(upper);
                                polygon.push(lower);
                            } else {
                                if (lineIndex === 0) {
                                    polygon.unshift(upper);
                                }
                                if (lineIndex === numOfLines) {
                                    polygon.push(lower);
                                }
                            }
                        }

                        i += lineLen - 1;

                        const srcCharIndex = i + lineIndex;

                        const
                            charPos = tp.getEndPositionOfChar(srcCharIndex),
                            [lower, upper] = appendTopAndBottom(
                                srcCharIndex,
                                charPos
                            );
                        polygon.unshift(upper);
                        polygon.unshift(lower);
                    }

                    // Close it
                    polygon.push(polygon[0].slice() as [number, number]);
                    link.dataLabel.bBox.polygon = polygon;
                }
            }
        }
    }
}

/** @private */
function compose(SeriesClass: typeof Series): void {
    addEvent(SeriesClass, 'afterRender', hideOverlappingPolygons);
}

const TextPathSupport = {
    compose
};

export default TextPathSupport;
