import type PositionObject from '../Core/Renderer/PositionObject';
import TreegraphSeries from '../Series/Treegraph/TreegraphSeries';
import Chart from '../Core/Chart/Chart';
import GeometryUtilities from '../Core/Geometry/GeometryUtilities.js';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
const { deg2rad } = H;
const { addEvent } = U;
const { pointInPolygon } = GeometryUtilities;

function hideOverlappingPolygons(this: Chart): void {
    const isPolygonOverlap = (
        box1Poly: [number, number][],
        box2Poly: [number, number][]
    ): boolean => {
        for (const p of box1Poly) {
            if (pointInPolygon({ x: p[0], y: p[1] }, box2Poly)) {
                return true;
            }
        }
        return false;
    };

    for (const serie of this.series) {

        const textPathCandidates = [];
        let foundPotential;

        // Gather links which may have textPaths
        if (serie.is('treegraph') && (serie as TreegraphSeries).links) {
            foundPotential = textPathCandidates.push(
                ...(serie as TreegraphSeries).links
            );
        }

        // Gather points which may have textPaths
        if (serie.is('arcdiagram') || serie.is('sunburst')) {
            foundPotential = textPathCandidates.push(
                ...serie.points
            );
        }

        if (foundPotential) {
            const length = textPathCandidates.length,
                // It is necessary to store the polygons seperately
                // because storing them on the labels (or their bbox)
                // causes all labels to get the same polygon
                polygons:[[number, number][], number][] = [];

            for (let i = 0; i < length; i++) {
                const linkOrPoint = textPathCandidates[i];

                if (linkOrPoint.dataLabel?.text?.textPath) {
                    const tp = linkOrPoint
                        .dataLabel
                        .element
                        .querySelector('textPath');

                    if (tp) {
                        const polygon: [number, number][] = [],
                            { b, h } = serie
                                .chart
                                .renderer
                                .fontMetrics(linkOrPoint.dataLabel.element),
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


                        // Calculate top and bottom coordinates for
                        // either the start or the end of a single
                        // character, and append it to the polygon.
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
                        polygons.push([polygon, i]);
                    }
                }
            }

            const polygonListLength = polygons.length;

            for (let i = 0; i < polygonListLength; i++) {
                const linkOrPoint1 = textPathCandidates[polygons[i][1]];

                for (let j = 0; j < polygonListLength; j++) {
                    const linkOrPoint2 = textPathCandidates[polygons[j][1]];

                    if (
                        i !== j &&
                        linkOrPoint1.dataLabel &&
                        linkOrPoint2.dataLabel &&
                        linkOrPoint1.dataLabel.visibility !== 'hidden' &&
                        linkOrPoint2.dataLabel.visibility !== 'hidden' &&
                        isPolygonOverlap(polygons[i][0], polygons[j][0])
                    ) {
                        linkOrPoint1.dataLabel.hide();
                    }
                }
            }
        }
    }
}

function compose(ChartClass: typeof Chart): void {
    addEvent(ChartClass, 'render', hideOverlappingPolygons);
}
const TextPathSupport = {
    compose
};

export default TextPathSupport;
