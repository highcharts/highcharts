/* *
 *
 *  Module for using patterns or images as point fills.
 *
 *  (c) 2010-2024 Highsoft AS
 *  Author: Torstein Hønsi, Øystein Moseng
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

import type AnimationOptions from '../Core/Animation/AnimationOptions';
import type BBoxObject from '../Core/Renderer/BBoxObject';
import type Chart from '../Core/Chart/Chart.js';
import type ColorString from '../Core/Color/ColorString';
import type Point from '../Core/Series/Point.js';
import type PositionObject from '../Core/Renderer/PositionObject';
import type Series from '../Core/Series/Series.js';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type { SVGDOMElement } from '../Core/Renderer/DOMElementType';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';

import A from '../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import D from '../Core/Defaults.js';
const { getOptions } = D;
import H from '../Core/Globals.js';
const { composed } = H;
import MapPoint from '../Series/Map/MapPoint';
import U from '../Core/Utilities.js';
import { Palette } from '../Core/Color/Palettes';
const {
    addEvent,
    defined,
    erase,
    extend,
    merge,
    pick,
    pushUnique,
    removeEvent,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Renderer/SVG/SVGRendererLike' {
    interface SVGRendererLike {
        defIds?: Array<string>;
        idCounter?: number;
        patternElements?: Record<string, SVGElement>;
        addPattern(
            options: PatternOptionsObject,
            animation?: (boolean|AnimationOptions)
        ): (SVGElement|undefined);
    }
}

declare module '../Core/Series/PointLike' {
    interface PointLike {
        /** @requires modules/pattern-fill */
        calculatePatternDimensions(
            pattern: PatternOptionsObject
        ): void;
    }
}

export interface BPatternObject extends BBoxObject {
    aspectHeight?: number;
    aspectRatio?: number;
    aspectWidth?: number;
}

export interface PatternObject {
    animation?: Partial<AnimationOptions>;
    pattern: PatternOptionsObject;
    patternIndex?: number;
}

export interface PatternOptionsObject {
    _inverted?: (Boolean);
    _height?: (number|string);
    _width?: (number|string);
    _x?: number;
    _y?: number;
    aspectRatio?: number;
    backgroundColor?: ColorString;
    color: ColorString;
    height: number;
    id?: string;
    image?: string;
    opacity?: number;
    path: (string|SVGAttributes);
    patternContentUnits?: 'userSpaceOnUse'|'objectBoundingBox';
    patternTransform?: string;
    width: number;
    x?: number;
    y?: number;
}

/* *
 *
 *  Constants
 *
 * */

const patterns = createPatterns();

/* *
 *
 *  Functions
 *
 * */

/** @private */
function compose(
    ChartClass: typeof Chart,
    SeriesClass: typeof Series,
    SVGRendererClass: typeof SVGRenderer
): void {
    const PointClass = SeriesClass.prototype.pointClass;

    if (pushUnique(composed, compose)) {
        addEvent(ChartClass, 'endResize', onChartEndResize);
        addEvent(ChartClass, 'redraw', onChartRedraw);

        extend(PointClass.prototype, {
            calculatePatternDimensions: pointCalculatePatternDimensions
        });
        addEvent(PointClass, 'afterInit', onPointAfterInit);

        addEvent(SeriesClass, 'render', onSeriesRender);
        wrap(SeriesClass.prototype, 'getColor', wrapSeriesGetColor);

        // Pattern scale corrections
        addEvent(SeriesClass, 'afterRender', onPatternScaleCorrection);
        addEvent(SeriesClass, 'mapZoomComplete', onPatternScaleCorrection);

        extend(SVGRendererClass.prototype, {
            addPattern: rendererAddPattern
        });
        addEvent(SVGRendererClass, 'complexColor', onRendererComplexColor);
    }

}

/**
 * Add the predefined patterns.
 * @private
 */
function createPatterns(): Array<PatternOptionsObject> {
    const patterns: Array<PatternOptionsObject> = [],
        colors: Array<string> = getOptions().colors as any;

    // Start with subtle patterns
    let i = 0;
    for (
        const pattern of
        [
            'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
            'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
            'M 2 0 L 2 5 M 4 0 L 4 5',
            'M 0 2 L 5 2 M 0 4 L 5 4',
            'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5'
        ]
    ) {
        patterns.push({
            path: pattern,
            color: colors[i++],
            width: 5,
            height: 5,
            patternTransform: 'scale(1.4 1.4)'
        });
    }

    // Then add the more drastic ones
    i = 5;
    for (
        const pattern of
        [
            'M 0 0 L 5 10 L 10 0',
            'M 3 3 L 8 3 L 8 8 L 3 8 Z',
            'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0',
            'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9'
        ]
    ) {
        patterns.push({
            path: pattern,
            color: colors[i],
            width: 10,
            height: 10
        });
        i = i + 5;
    }

    return patterns;
}

/**
 * Utility function to compute a hash value from an object. Modified Java
 * String.hashCode implementation in JS. Use the preSeed parameter to add an
 * additional seeding step.
 *
 * @private
 * @function hashFromObject
 *
 * @param {Object} obj
 *        The javascript object to compute the hash from.
 *
 * @param {boolean} [preSeed=false]
 *        Add an optional preSeed stage.
 *
 * @return {string}
 *         The computed hash.
 */
function hashFromObject(obj: object, preSeed?: boolean): string {
    const str = JSON.stringify(obj),
        strLen = str.length || 0;
    let hash = 0,
        i = 0,
        char,
        seedStep;

    if (preSeed) {
        seedStep = Math.max(Math.floor(strLen / 500), 1);
        for (let a = 0; a < strLen; a += seedStep) {
            hash += str.charCodeAt(a);
        }
        hash = hash & hash;
    }

    for (; i < strLen; ++i) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash.toString(16).replace('-', '1');
}

/**
 * When animation is used, we have to recalculate pattern dimensions after
 * resize, as the bounding boxes are not available until then.
 * @private
 */
function onChartEndResize(
    this: Chart
): void {
    if (
        this.renderer &&
        (this.renderer.defIds || []).filter((
            id: string
        ): (boolean|string) => (
            id &&
            id.indexOf &&
            id.indexOf('highcharts-pattern-') === 0
        )).length
    ) {
        // We have non-default patterns to fix. Find them by looping through
        // all points.
        for (const series of this.series) {

            if (series.visible) {
                for (const point of series.points) {
                    const colorOptions = point.options && point.options.color;

                    if (
                        colorOptions &&
                        (colorOptions as PatternObject).pattern
                    ) {
                        (colorOptions as PatternObject).pattern
                            ._width = 'defer';
                        (colorOptions as PatternObject).pattern
                            ._height = 'defer';
                    }
                }
            }
        }
        // Redraw without animation
        this.redraw(false);
    }
}

/**
 * Add a garbage collector to delete old patterns with autogenerated hashes that
 * are no longer being referenced.
 * @private
 */
function onChartRedraw(
    this: Chart
): void {
    const usedIds: {[key: string]: boolean} = {},
        renderer = this.renderer,
        // Get the autocomputed patterns - these are the ones we might delete
        patterns = (renderer.defIds || []).filter((pattern): boolean => (
            pattern.indexOf &&
            pattern.indexOf('highcharts-pattern-') === 0
        ));

    if (patterns.length) {
        // Look through the DOM for usage of the patterns. This can be points,
        // series, tooltips etc.
        [].forEach.call(
            this.renderTo.querySelectorAll(
                '[color^="url("], [fill^="url("], [stroke^="url("]'
            ),
            (node: SVGDOMElement): void => {
                const id = node.getAttribute('fill') ||
                        node.getAttribute('color') ||
                        node.getAttribute('stroke');
                if (id) {
                    const sanitizedId = id
                        .replace(renderer.url, '')
                        .replace('url(#', '')
                        .replace(')', '');
                    usedIds[sanitizedId] = true;
                }
            }
        );

        // Loop through the patterns that exist and see if they are used
        for (const id of patterns) {
            if (!usedIds[id]) {
                // Remove id from used id list
                erase(renderer.defIds as any, id);
                // Remove pattern element
                if ((renderer.patternElements as any)[id]) {
                    (renderer.patternElements as any)[id].destroy();
                    delete (renderer.patternElements as any)[id];
                }
            }
        }
    }
}

/**
 * Merge series color options to points.
 * @private
 */
function onPointAfterInit(
    this: Point
): void {
    const point = this,
        colorOptions: (PatternObject|undefined) =
            point.options.color as any;

    // Only do this if we have defined a specific color on this point. Otherwise
    // we will end up trying to re-add the series color for each point.
    if (colorOptions && colorOptions.pattern) {
        // Move path definition to object, allows for merge with series path
        // definition
        if (typeof colorOptions.pattern.path === 'string') {
            colorOptions.pattern.path = {
                d: colorOptions.pattern.path
            };
        }
        // Merge with series options
        point.color = point.options.color = merge(
            point.series.options.color as any, colorOptions
        );
    }
}

/**
 * Add functionality to SVG renderer to handle patterns as complex colors.
 * @private
 */
function onRendererComplexColor(
    this: SVGRenderer,
    args: {
        args: [
            PatternObject,
            string,
            SVGDOMElement
        ];
    }
): boolean {
    const color = args.args[0],
        prop = args.args[1],
        element = args.args[2],
        chartIndex = (this.chartIndex || 0);

    let pattern = color.pattern,
        value: string = Palette.neutralColor80;

    // Handle patternIndex
    if (typeof color.patternIndex !== 'undefined' && patterns) {
        pattern = patterns[color.patternIndex];
    }

    // Skip and call default if there is no pattern
    if (!pattern) {
        return true;
    }

    // We have a pattern.
    if (
        pattern.image ||
        typeof pattern.path === 'string' ||
        pattern.path && pattern.path.d
    ) {
        // Real pattern. Add it and set the color value to be a reference.

        // Force Hash-based IDs for legend items, as they are drawn before
        // point render, meaning they are drawn before autocalculated image
        // width/heights. We don't want them to highjack the width/height for
        // this ID if it is defined by users.
        let forceHashId = element.parentNode &&
            (element.parentNode as any).getAttribute('class');
        forceHashId = forceHashId &&
            forceHashId.indexOf('highcharts-legend') > -1;

        // If we don't have a width/height yet, handle it. Try faking a point
        // and running the algorithm again.
        if (pattern._width === 'defer' || pattern._height === 'defer') {
            pointCalculatePatternDimensions.call(
                { graphic: { element: element } } as any, pattern
            );
        }

        // If we don't have an explicit ID, compute a hash from the
        // definition and use that as the ID. This ensures that points with
        // the same pattern definition reuse existing pattern elements by
        // default. We combine two hashes, the second with an additional
        // preSeed algorithm, to minimize collision probability.
        if (forceHashId || !pattern.id) {
            // Make a copy so we don't accidentally edit options when setting ID
            pattern = merge({}, pattern);
            pattern.id = 'highcharts-pattern-' + chartIndex + '-' +
                hashFromObject(pattern) + hashFromObject(pattern, true);
        }

        // Add it. This function does nothing if an element with this ID
        // already exists.
        this.addPattern(pattern, !this.forExport && pick(
            (pattern as any).animation,
            this.globalAnimation,
            { duration: 100 }
        ));

        value = `url(${this.url}#${pattern.id + (this.forExport ? '-export' : '')})`;

    } else {
        // Not a full pattern definition, just add color
        value = pattern.color || value;
    }

    // Set the fill/stroke prop on the element
    element.setAttribute(prop, value);

    // Allow the color to be concatenated into tooltips formatters etc.
    color.toString = function (): string {
        return value;
    };

    // Skip default handler
    return false;
}

/**
 * Calculate pattern dimensions on points that have their own pattern.
 * @private
 */
function onSeriesRender(
    this: Series
): void {
    const isResizing = this.chart.isResizing;

    if (this.isDirtyData || isResizing || !this.chart.hasRendered) {
        for (const point of this.points) {
            const colorOptions = point.options && point.options.color;

            if (
                colorOptions &&
                (colorOptions as PatternObject).pattern
            ) {
                // For most points we want to recalculate the dimensions on
                // render, where we have the shape args and bbox. But if we
                // are resizing and don't have the shape args, defer it, since
                // the bounding box is still not resized.
                if (
                    isResizing &&
                    !(
                        point.shapeArgs &&
                        point.shapeArgs.width &&
                        point.shapeArgs.height
                    )
                ) {
                    (colorOptions as PatternObject)
                        .pattern._width = 'defer';
                    (colorOptions as PatternObject)
                        .pattern._height = 'defer';
                } else {
                    point.calculatePatternDimensions(
                        (colorOptions as PatternObject).pattern
                    );
                }
            }
        }
    }
}

/**
 * Set dimensions on pattern from point. This function will set internal
 * pattern._width/_height properties if width and height are not both already
 * set. We only do this on image patterns. The _width/_height properties are set
 * to the size of the bounding box of the point, optionally taking aspect ratio
 * into account. If only one of width or height are supplied as options, the
 * undefined option is calculated as above.
 *
 * @private
 * @function Highcharts.Point#calculatePatternDimensions
 *
 * @param {Highcharts.PatternOptionsObject} pattern
 *        The pattern to set dimensions on.
 *
 * @return {void}
 *
 * @requires modules/pattern-fill
 */
function pointCalculatePatternDimensions(
    this: Point,
    pattern: PatternOptionsObject
): void {
    if (pattern.width && pattern.height) {
        return;
    }

    const bBox: BPatternObject = this.graphic && (
            this.graphic.getBBox &&
            this.graphic.getBBox(true) ||
            this.graphic.element &&
            (this.graphic.element as any).getBBox()
        ) || ({} as any),
        shapeArgs = this.shapeArgs;

    // Prefer using shapeArgs, as it is animation agnostic
    if (shapeArgs) {
        bBox.width = shapeArgs.width || bBox.width;
        bBox.height = shapeArgs.height || bBox.height;
        bBox.x = shapeArgs.x || bBox.x;
        bBox.y = shapeArgs.y || bBox.y;
    }

    // For images we stretch to bounding box
    if (pattern.image) {
        // If we do not have a bounding box at this point, simply add a defer
        // key and pick this up in the fillSetter handler, where the bounding
        // box should exist.
        if (!bBox.width || !bBox.height) {
            pattern._width = 'defer';
            pattern._height = 'defer';

            // Mark the pattern to be flipped later if upside down (#16810)
            const scaleY = this.series.chart.mapView &&
                this.series.chart.mapView.getSVGTransform().scaleY;

            if (defined(scaleY) && scaleY < 0) {
                pattern._inverted = true;
            }

            return;
        }

        // Handle aspect ratio filling
        if (pattern.aspectRatio) {
            bBox.aspectRatio = bBox.width / bBox.height;
            if (pattern.aspectRatio > bBox.aspectRatio) {
                // Height of bBox will determine width
                bBox.aspectWidth = bBox.height * pattern.aspectRatio;
            } else {
                // Width of bBox will determine height
                bBox.aspectHeight = bBox.width / pattern.aspectRatio;
            }
        }

        // We set the width/height on internal properties to differentiate
        // between the options set by a user and by this function.
        pattern._width = pattern.width ||
            Math.ceil(bBox.aspectWidth || bBox.width);
        pattern._height = pattern.height ||
            Math.ceil(bBox.aspectHeight || bBox.height);
    }

    // Set x/y accordingly, centering if using aspect ratio, otherwise adjusting
    // so bounding box corner is 0,0 of pattern.
    if (!pattern.width) {
        pattern._x = pattern.x || 0;
        pattern._x += bBox.x - Math.round(
            bBox.aspectWidth ?
                Math.abs(bBox.aspectWidth - bBox.width) / 2 :
                0
        );
    }
    if (!pattern.height) {
        pattern._y = pattern.y || 0;
        pattern._y += bBox.y - Math.round(
            bBox.aspectHeight ?
                Math.abs(bBox.aspectHeight - bBox.height) / 2 :
                0
        );
    }
}

/**
 * Add a pattern to the renderer.
 *
 * @private
 * @function Highcharts.SVGRenderer#addPattern
 *
 * @param {Highcharts.PatternObject} options
 * The pattern options.
 *
 * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
 * The animation options.
 *
 * @return {Highcharts.SVGElement|undefined}
 * The added pattern. Undefined if the pattern already exists.
 *
 * @requires modules/pattern-fill
 */
function rendererAddPattern(
    this: SVGRenderer,
    options: PatternOptionsObject,
    animation?: (boolean|Partial<AnimationOptions>)
): (SVGElement|undefined) {
    const animate = pick(animation, true),
        animationOptions = animObject(animate),
        color: ColorString = options.color || Palette.neutralColor80,
        defaultSize = 32,
        height = options.height ||
            (typeof options._height === 'number' ? options._height : 0) ||
            defaultSize,
        rect = (fill: ColorString): SVGElement => this
            .rect(0, 0, width, height)
            .attr({ fill })
            .add(pattern),
        width = options.width ||
            (typeof options._width === 'number' ? options._width : 0) ||
            defaultSize;

    let attribs: SVGAttributes,
        id = options.id,
        path: SVGAttributes;

    if (!id) {
        this.idCounter = this.idCounter || 0;
        id = (
            'highcharts-pattern-' +
            this.idCounter +
            '-' +
            (this.chartIndex || 0)
        );
        ++this.idCounter;
    }

    if (this.forExport) {
        id += '-export';
    }
    // Do nothing if ID already exists
    this.defIds = this.defIds || [];
    if (this.defIds.indexOf(id) > -1) {
        return;
    }

    // Store ID in list to avoid duplicates
    this.defIds.push(id);

    // Calculate pattern element attributes
    const attrs: SVGAttributes = {
        id: id,
        patternUnits: 'userSpaceOnUse',
        patternContentUnits: options.patternContentUnits || 'userSpaceOnUse',
        width: width,
        height: height,
        x: options._x || options.x || 0,
        y: options._y || options.y || 0
    };

    if (options._inverted) {
        attrs.patternTransform = 'scale(1, -1)'; // (#16810)
        if (options.patternTransform) {
            options.patternTransform += ' scale(1, -1)';
        }
    }

    if (options.patternTransform) {
        attrs.patternTransform = options.patternTransform;
    }

    const pattern = this.createElement('pattern').attr(attrs).add(this.defs);

    // Set id on the SVGRenderer object
    pattern.id = id;

    // Use an SVG path for the pattern
    if (options.path) {
        path = U.isObject(options.path) ?
            options.path :
            { d: options.path };

        // The background
        if (options.backgroundColor) {
            rect(options.backgroundColor);
        }

        // The pattern
        attribs = {
            'd': path.d
        };
        if (!this.styledMode) {
            attribs.stroke = path.stroke || color;
            attribs['stroke-width'] = pick(path.strokeWidth, 2);
            attribs.fill = path.fill || 'none';
        }
        if (path.transform) {
            attribs.transform = path.transform;
        }
        this.createElement('path').attr(attribs).add(pattern);
        pattern.color = color;

    // Image pattern
    } else if (options.image) {
        if (animate) {
            this.image(
                options.image, 0, 0, width, height, function (
                    this: SVGElement
                ): void {
                    // Onload
                    this.animate({
                        opacity: pick(options.opacity, 1)
                    }, animationOptions);
                    removeEvent(this.element, 'load');
                }
            ).attr({ opacity: 0 }).add(pattern);
        } else {
            this.image(options.image, 0, 0, width, height).add(pattern);
        }
    }

    // For non-animated patterns, set opacity now
    if (!(options.image && animate) && typeof options.opacity !== 'undefined') {
        [].forEach.call(pattern.element.childNodes, (
            child: SVGDOMElement
        ): void => {
            child.setAttribute('opacity', options.opacity as any);
        });
    }

    // Store for future reference
    this.patternElements = this.patternElements || {};
    this.patternElements[id] = pattern;

    return pattern;
}

/**
 * Make sure we have a series color.
 * @private
 */
function wrapSeriesGetColor(
    this: Series,
    proceed: Series['getColor']
): void {
    const oldColor = this.options.color;

    // Temporarely remove color options to get defaults
    if (oldColor &&
        (oldColor as PatternObject).pattern &&
        !(oldColor as PatternObject).pattern.color
    ) {
        delete this.options.color;
        // Get default
        proceed.apply(this, [].slice.call(arguments, 1) as any);
        // Replace with old, but add default color
        (oldColor as PatternObject).pattern.color =
            this.color as any;
        this.color = this.options.color = oldColor;
    } else {
        // We have a color, no need to do anything special
        proceed.apply(this, [].slice.call(arguments, 1) as any);
    }
}

/**
 * Scale patterns inversly to the series it's used in.
 * Maintains a visual (1,1) scale regardless of size.
 * @private
 */
function onPatternScaleCorrection(
    this: Series
): void {
    const series = this;

    // If not a series used in a map chart, skip it.
    if (!series.chart?.mapView) {
        return;
    }

    const chart = series.chart,
        renderer = chart.renderer,
        patterns = renderer.patternElements;

    // Only scale if we have patterns to scale.
    if (renderer.defIds?.length && patterns) {
        // Filter for points which have patterns that don't use images assigned
        // and has a group scale available.
        series.points.filter(function (p: Point): boolean {
            const point: MapPoint = (p as MapPoint);

            // No graphic we can fetch id from, filter out this point.
            if (!point.graphic) {
                return false;
            }

            return (
                point.graphic.element.hasAttribute('fill') ||
                point.graphic.element.hasAttribute('color') ||
                point.graphic.element.hasAttribute('stroke')
            ) &&
            !(point.options.color as any)?.pattern?.image &&
            !!point.group?.scaleX &&
            !!point.group?.scaleY;
        })
            // Map up pattern id's and their scales.
            .map(function (p: Point): [string, PositionObject] {
                const point: MapPoint = (p as MapPoint);
                // Parse the id from the graphic element of the point.
                const id = (
                    point.graphic?.element.getAttribute('fill') ||
                    point.graphic?.element.getAttribute('color') ||
                    point.graphic?.element.getAttribute('stroke') || ''
                )
                    .replace(renderer.url, '')
                    .replace('url(#', '')
                    .replace(')', '');

                return [
                    id,
                    {
                        x: point.group?.scaleX || 1,
                        y: point.group?.scaleY || 1
                    }
                ];
            })
            // Filter out colors and other non-patterns, as well as duplicates.
            .filter(function (
                [id, _]: [string, PositionObject],
                index: number,
                arr: [string, PositionObject][]
            ): boolean {
                return id !== '' &&
                id.indexOf('highcharts-pattern-') !== -1 &&
                !arr.some(function (
                    [otherID, _]: [string, PositionObject],
                    otherIndex: number
                ): boolean {
                    return otherID === id && otherIndex < index;
                });
            })
            .forEach(function ([id, scale]: [string, PositionObject]): void {
                patterns[id].scaleX = 1 / scale.x;
                patterns[id].scaleY = 1 / scale.y;
                patterns[id].updateTransform('patternTransform');
            });
    }
}

/* *
 *
 *  Registry
 *
 * */

declare module '../Core/Color/ColorType' {
    interface ColorTypeRegistry {
        PatternFill: PatternObject;
    }
}

/* *
 *
 *  Export
 *
 * */

const PatternFill = {
    compose,
    patterns
};

export default PatternFill;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Pattern options
 *
 * @interface Highcharts.PatternOptionsObject
 *//**
 * Background color for the pattern if a `path` is set (not images).
 * @name Highcharts.PatternOptionsObject#backgroundColor
 * @type {Highcharts.ColorString|undefined}
 *//**
 * URL to an image to use as the pattern.
 * @name Highcharts.PatternOptionsObject#image
 * @type {string|undefined}
 *//**
 * Width of the pattern. For images this is automatically set to the width of
 * the element bounding box if not supplied. For non-image patterns the default
 * is 32px. Note that automatic resizing of image patterns to fill a bounding
 * box dynamically is only supported for patterns with an automatically
 * calculated ID.
 * @name Highcharts.PatternOptionsObject#width
 * @type {number|undefined}
 *//**
 * Analogous to pattern.width.
 * @name Highcharts.PatternOptionsObject#height
 * @type {number|undefined}
 *//**
 * For automatically calculated width and height on images, it is possible to
 * set an aspect ratio. The image will be zoomed to fill the bounding box,
 * maintaining the aspect ratio defined.
 * @name Highcharts.PatternOptionsObject#aspectRatio
 * @type {number|undefined}
 *//**
 * Horizontal offset of the pattern. Defaults to 0.
 * @name Highcharts.PatternOptionsObject#x
 * @type {number|undefined}
 *//**
 * Vertical offset of the pattern. Defaults to 0.
 * @name Highcharts.PatternOptionsObject#y
 * @type {number|undefined}
 *//**
 * Either an SVG path as string, or an object. As an object, supply the path
 * string in the `path.d` property. Other supported properties are standard SVG
 * attributes like `path.stroke` and `path.fill`. If a path is supplied for the
 * pattern, the `image` property is ignored.
 * @name Highcharts.PatternOptionsObject#path
 * @type {string|Highcharts.SVGAttributes|undefined}
 *//**
 * SVG `patternTransform` to apply to the entire pattern.
 * @name Highcharts.PatternOptionsObject#patternTransform
 * @type {string|undefined}
 * @see [patternTransform demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series/pattern-fill-transform)
 *//**
 * Pattern color, used as default path stroke.
 * @name Highcharts.PatternOptionsObject#color
 * @type {Highcharts.ColorString|undefined}
 *//**
 * Opacity of the pattern as a float value from 0 to 1.
 * @name Highcharts.PatternOptionsObject#opacity
 * @type {number|undefined}
 *//**
 * ID to assign to the pattern. This is automatically computed if not added, and
 * identical patterns are reused. To refer to an existing pattern for a
 * Highcharts color, use `color: "url(#pattern-id)"`.
 * @name Highcharts.PatternOptionsObject#id
 * @type {string|undefined}
 */

/**
 * Holds a pattern definition.
 *
 * @sample highcharts/series/pattern-fill-area/
 *         Define a custom path pattern
 * @sample highcharts/series/pattern-fill-pie/
 *         Default patterns and a custom image pattern
 * @sample maps/demo/pattern-fill-map/
 *         Custom images on map
 *
 * @example
 * // Pattern used as a color option
 * color: {
 *     pattern: {
 *            path: {
 *                 d: 'M 3 3 L 8 3 L 8 8 Z',
 *                fill: '#102045'
 *            },
 *            width: 12,
 *            height: 12,
 *            color: '#907000',
 *            opacity: 0.5
 *     }
 * }
 *
 * @interface Highcharts.PatternObject
 *//**
 * Pattern options
 * @name Highcharts.PatternObject#pattern
 * @type {Highcharts.PatternOptionsObject}
 *//**
 * Animation options for the image pattern loading.
 * @name Highcharts.PatternObject#animation
 * @type {boolean|Partial<Highcharts.AnimationOptionsObject>|undefined}
 *//**
 * Optionally an index referencing which pattern to use. Highcharts adds
 * 10 default patterns to the `Highcharts.patterns` array. Additional
 * pattern definitions can be pushed to this array if desired. This option
 * is an index into this array.
 * @name Highcharts.PatternObject#patternIndex
 * @type {number|undefined}
 */

''; // Keeps doclets above in transpiled file
