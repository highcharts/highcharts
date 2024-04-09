import type PositionObject from '../Core/Renderer/PositionObject';
import Chart from '../Core/Chart/Chart';
import GeometryUtilities from '../Core/Geometry/GeometryUtilities.js';
import SVGElement from '../Core/Renderer/SVG/SVGElement';
import SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';
import DataLabelOptions from '../Core/Series/DataLabelOptions';
import Point from '../Core/Series/Point';
const { deg2rad } = H;
const { addEvent, merge, uniqueKey, defined, extend } = U;
const { pointInPolygon } = GeometryUtilities;

/**
 * Set a text path for a `text` or `label` element, allowing the text to
 * flow along a path.
 *
 * In order to unset the path for an existing element, call `setTextPath`
 * with `{ enabled: false }` as the second argument.
 *
 * @sample highcharts/members/renderer-textpath/ Text path demonstrated
 *
 * @function Highcharts.SVGElement#setTextPath
 *
 * @param {Highcharts.SVGElement|undefined} path
 *        Path to follow. If undefined, it allows changing options for the
 *        existing path.
 *
 * @param {Highcharts.DataLabelsTextPathOptionsObject} textPathOptions
 *        Options.
 *
 * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
 */
function setTextPath(
    element: SVGElement,
    path: SVGElement|undefined,
    textPathOptions: AnyRecord
): void {

    // Defaults
    textPathOptions = merge(true, {
        enabled: true,
        attributes: {
            dy: -5,
            startOffset: '50%',
            textAnchor: 'middle'
        }
    }, textPathOptions);

    const url = element.renderer.url,
        textWrapper = element.text || element,
        textPath = textWrapper.textPath,
        { attributes, enabled } = textPathOptions;

    path = path || (textPath && textPath.path);

    // Remove previously added event
    if (textPath) {
        textPath.undo();
    }

    if (path && enabled) {
        const undo = addEvent(textWrapper, 'afterModifyTree', (
            e: AnyRecord
        ): void => {

            if (path && enabled) {

                // Set ID for the path
                let textPathId = path.attr('id');
                if (!textPathId) {
                    path.attr('id', textPathId = uniqueKey());
                }

                // Set attributes for the <text>
                const textAttribs: SVGAttributes = {
                    // `dx`/`dy` options must by set on <text> (parent), the
                    // rest should be set on <textPath>
                    x: 0,
                    y: 0
                };

                if (defined(attributes.dx)) {
                    textAttribs.dx = attributes.dx;
                    delete attributes.dx;
                }
                if (defined(attributes.dy)) {
                    textAttribs.dy = attributes.dy;
                    delete attributes.dy;
                }
                textWrapper.attr(textAttribs);


                // Handle label properties
                element.attr({ transform: '' });
                if (element.box) {
                    element.box = element.box.destroy();
                }

                // Wrap the nodes in a textPath
                const children = e.nodes.slice(0);
                e.nodes.length = 0;
                e.nodes[0] = {
                    tagName: 'textPath',
                    attributes: extend(attributes, {
                        'text-anchor': attributes.textAnchor,
                        href: `${url}#${textPathId}`
                    }),
                    children
                };
            }
        });

        // Set the reference
        textWrapper.textPath = { path, undo };

    } else {
        textWrapper.attr({ dx: 0, dy: 0 });
        delete textWrapper.textPath;
    }

    if (element.added) {

        // Rebuild text after added
        textWrapper.textCache = '';
        element.renderer.buildText(textWrapper);
    }
}

function getPolygon(
    label: SVGElement,
    tp: SVGTextPathElement,
    renderer: SVGRenderer
): [number, number][] {
    const polygon: [number, number][] = [],
        { b, h } = renderer.fontMetrics(label.element),
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

    return polygon;
}

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
        if (serie.visible && serie.hasDataLabels?.()) {

            const textPathCandidates = [...serie.points];

            // Links could have textPath labels
            if ('links' in serie) {
                textPathCandidates.push(...(serie as any).links);
            }

            const length = textPathCandidates.length,
                // It is necessary to store the polygons seperately
                // because storing them on the labels (or their bbox)
                // causes all labels to get the same polygon
                polygonMap:[[number, number][], number][] = [];

            for (
                let linkOrPointIndex = 0;
                linkOrPointIndex < length;
                linkOrPointIndex++
            ) {
                const label = textPathCandidates[linkOrPointIndex].dataLabel;

                if (label && !label.options?.allowOverlap) {
                    const tp = label.text?.element.querySelector('textPath');

                    if (tp) {
                        polygonMap.push([
                            getPolygon(label, tp, serie.chart.renderer),
                            linkOrPointIndex
                        ]);
                    }
                }
            }

            for (const [label1Polygon, label1Index] of polygonMap) {
                const linkOrPointText1 = textPathCandidates[label1Index]
                    .dataLabel
                    ?.text;

                for (const [label2Polygon, label2Index] of polygonMap) {
                    if (label1Index === label2Index) {
                        continue;
                    }

                    const linkOrPointText2 = textPathCandidates[label2Index]
                        .dataLabel
                        ?.text;

                    if (
                        linkOrPointText1 &&
                        linkOrPointText2 &&
                        linkOrPointText1.visibility !== 'hidden' &&
                        linkOrPointText2.visibility !== 'hidden' &&
                        isPolygonOverlap(label1Polygon, label2Polygon)
                    ) {
                        linkOrPointText1.hide();
                    }
                }
            }
        }
    }
}
function drawTextPath(
    dataLabel: SVGElement,
    labelOptions: DataLabelOptions,
    point: Point
): void {
    const textPathOptions =
        (labelOptions as any)[
            point.formatPrefix + 'TextPath'
        ] || labelOptions.textPath;

    if (textPathOptions && !labelOptions.useHTML) {
        setTextPath(
            dataLabel,
            point.getDataLabelPath?.(dataLabel) ||
                point.graphic,
            textPathOptions
        );

        if (
            point.dataLabelPath &&
            !textPathOptions.enabled
        ) {
            // Clean the DOM
            point.dataLabelPath = (
                point.dataLabelPath.destroy()
            );
        }
    }
}

function compose(
    ChartClass: typeof Chart,
    SVGElementClass: typeof SVGElement
): void {
    addEvent(ChartClass, 'render', hideOverlappingPolygons);
    extend(SVGElementClass.prototype, {
        drawTextPath: drawTextPath
    });
}

const TextPathSupport = {
    getPolygon, // In order to test polygons
    compose,
    drawTextPath
};

export default TextPathSupport;
