/* *
 *
 *  (c) 2009-2019 Torstein Honsi
 *
 *  SVG map parser. This file requires data.js.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* global document, jQuery, $ */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Data {
            $frame?: JQuery<HTMLDOMElement>;
            init(options: DataOptions): void;
            loadSVG(): void;
            pathToArray(path: string, matrix: Dictionary<number>): SVGPathArray;
            pathToString(arr: Array<MapPointOptions>): Array<MapPointOptions>;
            roundPaths(
                arr: Array<(MapPointOptions&MapPointCacheObject)>,
                scale?: number
            ): Array<(MapPointOptions&MapPointCacheObject)>;
        }
        interface DataOptions {
            svg?: string;
        }
        interface MapPointOptions {
            hasFill?: boolean;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    extend,
    wrap
} = U;

import './data.src.js';

/* eslint-disable no-invalid-this */

wrap(H.Data.prototype, 'init', function (
    this: Highcharts.Data,
    proceed: Function,
    options: Highcharts.DataOptions
): void {
    proceed.call(this, options);

    if (options.svg) {
        this.loadSVG();
    }
});

/* eslint-enable no-invalid-this */

extend(H.Data.prototype, {
    // Parse an SVG path into a simplified array that Highcharts can read
    pathToArray: function (
        this: Highcharts.Data,
        path: string,
        matrix: Highcharts.Dictionary<number>
    ): Highcharts.SVGPathArray {
        var i = 0,
            position = 0,
            point: Array<number>,
            positions: (number|undefined),
            fixedPoint = [0, 0],
            startPoint = [0, 0],
            isRelative: (boolean|undefined),
            isString: boolean,
            operator: (string|undefined),
            matrixTransform = function (
                p: Highcharts.SVGPathArray,
                m: Highcharts.Dictionary<number>
            ): Array<number> {
                return [
                    m.a * (p[0] as any) + m.c * (p[1] as any) + m.e,
                    m.b * (p[0] as any) + m.d * (p[1] as any) + m.f
                ];
            };

        path = path
            // Scientific notation
            .replace(/[0-9]+e-?[0-9]+/g, function (a: string): string {
                return (+a) as any; // cast to number
            })
            // Move letters apart
            .replace(/([A-Za-z])/g, ' $1 ')
            // Add space before minus
            .replace(/-/g, ' -')
            // Trim
            .replace(/^\s*/, '').replace(/\s*$/, '')
            // Remove newlines, tabs etc
            .replace(/\s+/g, ' ')

            // Split on spaces, minus and commas
            .split(/[ ,]+/) as any;

        // Blank path
        if (path.length === 1) {
            return [];
        }

        // Real path
        for (i = 0; i < path.length; i++) {
            isString = /[a-zA-Z]/.test(path[i]);

            // Handle strings
            if (isString) {
                operator = path[i];
                positions = 2;

                // Curves have six positions
                if (operator === 'c' || operator === 'C') {
                    positions = 6;
                }

                // When moving after a closed subpath, start again from previous
                // subpath's starting point
                if (operator === 'm') {
                    startPoint = [
                        parseFloat(path[i + 1]) + startPoint[0],
                        parseFloat(path[i + 2]) + startPoint[1]
                    ];
                } else if (operator === 'M') {
                    startPoint = [
                        parseFloat(path[i + 1]),
                        parseFloat(path[i + 2])
                    ];
                }

                // Enter or exit relative mode
                if (operator === 'm' || operator === 'l' || operator === 'c') {
                    (path as any)[i] = operator.toUpperCase();
                    isRelative = true;
                } else if (
                    operator === 'M' ||
                    operator === 'L' ||
                    operator === 'C'
                ) {
                    isRelative = false;


                // Horizontal and vertical line to
                } else if (operator === 'h') {
                    isRelative = true;
                    (path as any)[i] = 'L';
                    (path as any).splice(i + 2, 0, 0);
                } else if (operator === 'v') {
                    isRelative = true;
                    (path as any)[i] = 'L';
                    (path as any).splice(i + 1, 0, 0);
                } else if (operator === 's') {
                    isRelative = true;
                    (path as any)[i] = 'L';
                    (path as any).splice(i + 1, 2);
                } else if (operator === 'S') {
                    isRelative = false;
                    (path as any)[i] = 'L';
                    (path as any).splice(i + 1, 2);
                } else if (operator === 'H' || operator === 'h') {
                    isRelative = false;
                    (path as any)[i] = 'L';
                    (path as any).splice(i + 2, 0, fixedPoint[1]);
                } else if (operator === 'V' || operator === 'v') {
                    isRelative = false;
                    (path as any)[i] = 'L';
                    (path as any).splice(i + 1, 0, fixedPoint[0]);
                } else if (operator === 'z' || operator === 'Z') {
                    fixedPoint = startPoint;
                }

            // Handle numbers
            } else {
                (path as any)[i] = parseFloat(path[i]);
                if (isRelative) {
                    (path as any)[i] += fixedPoint[position % 2];

                }

                if (position % 2 === 1) { // y
                    // only translate absolute points or initial moveTo
                    if (
                        matrix &&
                        (!isRelative || (operator === 'm' && i < 3))
                    ) {
                        point = matrixTransform(
                            [(path as any)[i - 1], (path as any)[i]],
                            matrix
                        );
                        (path as any)[i - 1] = point[0];
                        (path as any)[i] = point[1];
                    }

                }


                // Reset to zero position (x/y switching)
                if (position === (positions as any) - 1) {
                    // Set the fixed point for the next pair
                    fixedPoint = [(path as any)[i - 1], (path as any)[i]];

                    position = 0;
                } else {
                    position += 1;
                }

            }
        }

        // Handle polygon points
        if (typeof (path as any)[0] === 'number' && path.length >= 4) {
            (path as any).unshift('M');
            (path as any).splice(3, 0, 'L');
        }
        return (path as any);
    },

    // Join the path back to a string for compression
    pathToString: function (
        this: Highcharts.Data,
        arr: Array<Highcharts.MapPointOptions>
    ): Array<Highcharts.MapPointOptions> {
        arr.forEach(function (point: Highcharts.MapPointOptions): void {
            var path: Highcharts.SVGPathArray = point.path as any;

            // Join all by commas
            path = path.join(',') as any;

            // Remove commas next to a letter
            path = (path as any).replace(/,?([a-zA-Z]),?/g, '$1');

            // Reinsert
            point.path = path;
        });

        return arr;
    },

    // Scale the path to fit within a given box and round all numbers
    roundPaths: function (
        this: Highcharts.Data,
        arr: Array<(Highcharts.MapPointOptions&Highcharts.MapPointCacheObject)>,
        scale?: number
    ): Array<(Highcharts.MapPointOptions&Highcharts.MapPointCacheObject)> {
        var mapProto = H.seriesTypes.map.prototype,
            fakeSeries: Highcharts.MapSeries,
            origSize,
            transA;

        fakeSeries = {
            xAxis: {
                translate: H.Axis.prototype.translate,
                options: {},
                minPixelPadding: 0
            },
            yAxis: {
                translate: H.Axis.prototype.translate,
                options: {},
                minPixelPadding: 0
            }
        } as any;

        // Borrow the map series type's getBox method
        mapProto.getBox.call(fakeSeries, arr);

        origSize = Math.max(
            (fakeSeries.maxX as any) - (fakeSeries.minX as any),
            fakeSeries.maxY - fakeSeries.minY
        );
        scale = scale || 1000;
        transA = scale / origSize;

        fakeSeries.xAxis.transA = fakeSeries.yAxis.transA = transA;
        fakeSeries.xAxis.len = fakeSeries.yAxis.len = scale;
        fakeSeries.xAxis.min = fakeSeries.minX as any;
        fakeSeries.yAxis.min = (fakeSeries.minY + scale) / transA;

        arr.forEach(function (
            point: (Highcharts.MapPointOptions&Highcharts.MapPointCacheObject)
        ): void {

            var i: number,
                path: Highcharts.SVGPathArray;

            point.path = path = (mapProto.translatePath as any).call(
                fakeSeries,
                point.path,
                true
            );
            i = path.length;
            while (i--) {
                if (typeof path[i] === 'number') {
                    path[i] = Math.round(path[i] as any);
                }
            }
            delete point._foundBox;

        });

        return arr;
    },

    // Load an SVG file and extract the paths
    loadSVG: function (this: Highcharts.Data): void {

        var data = this,
            options = this.options;

        /* eslint-disable valid-jsdoc */

        /**
         * @private
         */
        function getPathLikeChildren(
            parent: Element
        ): Array<Highcharts.SVGDOMElement> {
            return Array.prototype.slice
                .call(parent.getElementsByTagName('path'))
                .concat(
                    Array.prototype.slice.call(
                        parent.getElementsByTagName('polygon')
                    )
                )
                .concat(
                    Array.prototype.slice.call(
                        parent.getElementsByTagName('rect')
                    )
                );
        }

        /**
         * @private
         */
        function getPathDefinition(
            node: Highcharts.SVGDOMElement
        ): (string|null|undefined) {
            if (node.nodeName === 'path') {
                return node.getAttribute('d');
            }
            if (node.nodeName === 'polygon') {
                return node.getAttribute('points');
            }
            if (node.nodeName === 'rect') {
                var x = +(node as any).getAttribute('x'),
                    y = +(node as any).getAttribute('y'),
                    w = +(node as any).getAttribute('width'),
                    h = +(node as any).getAttribute('height');

                // Return polygon definition
                return [x, y, x + w, y, x + w, y + h, x, y + h, x, y].join(' ');
            }
        }

        /**
         * @private
         */
        function getTranslate(
            elem: SVGGraphicsElement
        ): (DOMMatrix|null|undefined) {
            var ctm = elem.getCTM();

            if (!isNaN((ctm as any).f)) {
                return ctm;
            }
        }

        /**
         * @private
         */
        function getName(elem: Highcharts.SVGDOMElement): (string|null) {
            var desc = elem.getElementsByTagName('desc'),
                nameTag: Array<Highcharts.HTMLDOMElement> =
                    desc[0] && desc[0].getElementsByTagName('name') as any,
                name = nameTag && nameTag[0] && nameTag[0].innerText;

            return (
                name ||
                elem.getAttribute('inkscape:label') ||
                elem.getAttribute('id') ||
                elem.getAttribute('class')
            );
        }

        /**
         * @private
         */
        function hasFill(elem: Highcharts.SVGDOMElement): boolean {
            return (
                !/fill[\s]?\:[\s]?none/.test(
                    elem.getAttribute('style') as any
                ) &&
                elem.getAttribute('fill') !== 'none'
            );
        }

        /**
         * @private
         */
        function handleSVG(xml: (string|Highcharts.HTMLDOMElement)): void {

            var arr: Array<Highcharts.MapPointOptions> = [],
                currentParent: (Highcharts.SVGDOMElement|null|undefined),
                allPaths,
                commonLineage: (Array<Highcharts.SVGDOMElement>|undefined),
                lastCommonAncestor,
                handleGroups;

            // Make a hidden frame where the SVG is rendered
            data.$frame = data.$frame || $('<div>')
                .css({
                    position: 'absolute', // https://bugzilla.mozilla.org/show_bug.cgi?id=756985
                    top: '-9999em'
                })
                .appendTo($(document.body));
            data.$frame.html(xml);
            xml = $('svg', data.$frame)[0];

            xml.removeAttribute('viewBox');


            allPaths = getPathLikeChildren(xml);

            // Skip clip paths
            ['defs', 'clipPath'].forEach(function (nodeName: string): void {
                (xml as any).getElementsByTagName(nodeName).forEach(function (
                    parent: Highcharts.SVGDOMElement
                ): void {
                    (parent.getElementsByTagName('path') as any).forEach(
                        function (path: Highcharts.SVGDOMElement): void {
                            (path as any).skip = true;
                        }
                    );
                });
            });

            // If not all paths belong to the same group, handle groups
            allPaths.forEach(function (
                path: Highcharts.SVGDOMElement,
                i: number
            ): void {
                if (!(path as any).skip) {
                    var itemLineage = [],
                        parentNode,
                        j;

                    if (i > 0 && path.parentNode !== currentParent) {
                        handleGroups = true;
                    }
                    currentParent = path.parentNode as any;

                    // Handle common lineage
                    parentNode = path;
                    while (parentNode) {
                        itemLineage.push(parentNode);
                        parentNode = parentNode.parentNode;
                    }
                    itemLineage.reverse();

                    if (!commonLineage) {
                        commonLineage = itemLineage as any; // first iteration
                    } else {
                        for (j = 0; j < commonLineage.length; j++) {
                            if (commonLineage[j] !== itemLineage[j]) {
                                commonLineage = commonLineage.slice(0, j);
                            }
                        }
                    }
                }
            });
            lastCommonAncestor = (commonLineage as any)[
                (commonLineage as any).length - 1
            ];

            // Iterate groups to find sub paths
            if (handleGroups) {
                lastCommonAncestor.getElementsByTagName('g').forEach(
                    function (g: Highcharts.SVGDOMElement): void {
                        var groupPath: Highcharts.SVGPathArray = [],
                            pathHasFill: (boolean|undefined);

                        getPathLikeChildren(g).forEach(function (
                            path: Highcharts.SVGDOMElement
                        ): void {
                            if (!(path as any).skip) {
                                groupPath = groupPath.concat(
                                    data.pathToArray(
                                        getPathDefinition(path) as any,
                                        getTranslate(path as any) as any
                                    )
                                );

                                if (hasFill(path)) {
                                    pathHasFill = true;
                                }

                                (path as any).skip = true;
                            }
                        });
                        arr.push({
                            name: getName(g) as any,
                            path: groupPath,
                            hasFill: pathHasFill
                        });
                    }
                );
            }

            // Iterate the remaining paths that are not parts of groups
            allPaths.forEach(function (path: Highcharts.SVGDOMElement): void {
                if (!(path as any).skip) {
                    arr.push({
                        name: getName(path) as any,
                        path: data.pathToArray(
                            getPathDefinition(path) as any,
                            getTranslate(path as any) as any
                        ),
                        hasFill: hasFill(path)
                    });
                }
            });

            // Round off to compress
            data.roundPaths(arr as any);

            // Do the callback
            (options.complete as any)({
                series: [{
                    data: arr
                }]
            });
        }

        /* eslint-enable valid-jsdoc */

        if ((options.svg as any).indexOf('<svg') !== -1) {
            handleSVG(options.svg as any);
        } else {
            jQuery.ajax({
                url: options.svg,
                dataType: 'text',
                success: handleSVG
            });
        }
    }
});
