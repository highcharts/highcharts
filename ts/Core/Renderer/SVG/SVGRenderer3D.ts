/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  Extensions to the SVGRenderer class to enable 3D shapes
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

import type AnimationOptions from '../../Animation/AnimationOptions';
import type ColorType from '../../Color/ColorType';
import type Fx from '../../Animation/Fx';
import type Position3DObject from '../../Renderer/Position3DObject';
import type PositionObject from '../../Renderer/PositionObject';
import type SVGArc3D from './SVGArc3D';
import type SVGAttributes from './SVGAttributes';
import type SVGAttributes3D from './SVGAttributes3D';
import type SVGCuboid from './SVGCuboid';
import type SVGElement from './SVGElement';
import type SVGPath from './SVGPath';
import type SVGRenderer from './SVGRenderer';

import A from '../../Animation/AnimationUtilities.js';
const { animObject } = A;
import Color from '../../Color/Color.js';
const { parse: color } = Color;
import H from '../../Globals.js';
const {
    charts,
    deg2rad
} = H;
import Math3D from '../../Math3D.js';
const {
    perspective,
    shapeArea
} = Math3D;
import SVGElement3D from './SVGElement3D.js';
import U from '../../Utilities.js';
const {
    defined,
    extend,
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './SVGElementLike' {
    interface SVGElementLike {
        attribs?: SVGAttributes;
        parts?: Array<string>;
        pathType?: string;
        vertexes?: Array<Position3DObject>;
        setPaths(attribs: SVGAttributes): void;
    }
}

declare module './SVGRendererLike' {
    interface SVGRendererLike {
        Element3D: typeof SVGElement3D;
        arc3d(attribs: SVGAttributes): SVGElement;
        arc3dPath(shapeArgs: SVGAttributes): SVGArc3D;
        cuboid(shapeArgs: SVGAttributes): SVGElement;
        cuboidPath(shapeArgs: SVGAttributes): SVGCuboid;
        element3d(type: string, shapeArgs: SVGAttributes): SVGElement3D;
        face3d(args?: SVGAttributes): SVGElement;
        polyhedron(args?: SVGAttributes): SVGElement3D;
        toLinePath(
            points: Array<PositionObject>,
            closed?: boolean
        ): SVGPath;
        toLineSegments(points: Array<PositionObject>): SVGPath;
    }
}

/* *
 *
 *  Constants
 *
 * */

const cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    dFactor = (4 * (Math.sqrt(2) - 1) / 3) / (PI / 2);

/* *
 *
 *  Functions
 *
 * */

/**
 * Method to construct a curved path. Can 'wrap' around more then 180
 * degrees.
 * @private
 */
function curveTo(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    start: number,
    end: number,
    dx: number,
    dy: number
): SVGPath {
    const arcAngle = end - start;

    let result = [] as SVGPath;

    if ((end > start) && (end - start > Math.PI / 2 + 0.0001)) {
        result = result.concat(
            curveTo(
                cx, cy, rx, ry, start, start + (Math.PI / 2), dx, dy
            )
        );
        result = result.concat(
            curveTo(cx, cy, rx, ry, start + (Math.PI / 2), end, dx, dy)
        );
        return result;
    }
    if ((end < start) && (start - end > Math.PI / 2 + 0.0001)) {
        result = result.concat(
            curveTo(
                cx, cy, rx, ry, start, start - (Math.PI / 2), dx, dy
            )
        );
        result = result.concat(
            curveTo(cx, cy, rx, ry, start - (Math.PI / 2), end, dx, dy)
        );
        return result;
    }
    return [[
        'C',
        cx + (rx * Math.cos(start)) -
            ((rx * dFactor * arcAngle) * Math.sin(start)) + dx,
        cy + (ry * Math.sin(start)) +
            ((ry * dFactor * arcAngle) * Math.cos(start)) + dy,
        cx + (rx * Math.cos(end)) +
            ((rx * dFactor * arcAngle) * Math.sin(end)) + dx,
        cy + (ry * Math.sin(end)) -
            ((ry * dFactor * arcAngle) * Math.cos(end)) + dy,

        cx + (rx * Math.cos(end)) + dx,
        cy + (ry * Math.sin(end)) + dy
    ]];
}

/* *
 *
 *  Composition
 *
 * */

namespace SVGRenderer3D {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends SVGRenderer {
        Element3D: typeof SVGElement3D;
        arc3d(attribs: SVGAttributes): SVGElement;
        arc3dPath(shapeArgs: SVGAttributes): SVGArc3D;
        cuboid(shapeArgs: SVGAttributes): SVGElement;
        cuboidPath(shapeArgs: SVGAttributes): SVGCuboid;
        element3d(type: string, shapeArgs: SVGAttributes): SVGElement3D;
        face3d(args?: SVGAttributes): SVGElement;
        polyhedron(args?: SVGAttributes): SVGElement3D;
        toLinePath(
            points: Array<PositionObject>,
            closed?: boolean
        ): SVGPath;
        toLineSegments(points: Array<PositionObject>): SVGPath;
    }

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {
        const rendererProto = SVGRendererClass.prototype;

        if (!rendererProto.element3d) {
            extend(rendererProto, {
                Element3D: SVGElement3D,
                arc3d,
                arc3dPath,
                cuboid,
                cuboidPath,
                element3d,
                face3d,
                polyhedron,
                toLinePath,
                toLineSegments
            });
        }

    }

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    function toLinePath(
        points: Array<PositionObject>,
        closed?: boolean
    ): SVGPath {
        const result: SVGPath = [];

        // Put "L x y" for each point
        for (const point of points) {
            result.push(['L', point.x, point.y]);
        }

        if (points.length) {
            // Set the first element to M
            result[0][0] = 'M';

            // If it is a closed line, add Z
            if (closed) {
                result.push(['Z']);
            }
        }

        return result;
    }

    /** @private */
    function toLineSegments(
        points: Array<PositionObject>
    ): SVGPath {
        const result = [] as SVGPath;

        let m = true;

        for (const point of points) {
            result.push(m ? ['M', point.x, point.y] : ['L', point.x, point.y]);
            m = !m;
        }

        return result;
    }

    /**
     * A 3-D Face is defined by it's 3D vertexes, and is only visible if it's
     * vertexes are counter-clockwise (Back-face culling). It is used as a
     * polyhedron Element.
     * @private
     */
    function face3d(
        this: Composition,
        args?: SVGAttributes
    ): SVGElement {
        const renderer = this,
            elementProto = renderer.Element.prototype,
            ret: SVGElement = renderer.createElement('path');

        ret.vertexes = [];
        ret.insidePlotArea = false;
        ret.enabled = true;

        /* eslint-disable no-invalid-this */

        ret.attr = function (
            this: SVGElement,
            hash?: (string|SVGAttributes3D)
        ): (number|string|SVGElement) {

            if (
                typeof hash === 'object' &&
                (
                    defined(hash.enabled) ||
                    defined(hash.vertexes) ||
                    defined(hash.insidePlotArea)
                )
            ) {
                this.enabled = pick(hash.enabled, this.enabled);
                this.vertexes = pick(hash.vertexes, this.vertexes);
                this.insidePlotArea = pick(
                    hash.insidePlotArea,
                    this.insidePlotArea
                );
                delete hash.enabled;
                delete hash.vertexes;
                delete hash.insidePlotArea;

                const chart = charts[renderer.chartIndex],
                    vertexes2d = perspective(
                        this.vertexes as any,
                        chart as any,
                        this.insidePlotArea
                    ),
                    path = renderer.toLinePath(vertexes2d, true),
                    area = shapeArea(vertexes2d);

                hash.d = path;
                hash.visibility = (this.enabled && area > 0) ?
                    'inherit' : 'hidden';
            }
            return elementProto.attr.apply(this, arguments as any);
        } as any;

        ret.animate = function (
            this: SVGElement,
            params: SVGAttributes3D
        ): SVGElement {
            if (
                typeof params === 'object' &&
                (
                    defined(params.enabled) ||
                    defined(params.vertexes) ||
                    defined(params.insidePlotArea)
                )
            ) {
                this.enabled = pick(params.enabled, this.enabled);
                this.vertexes = pick(params.vertexes, this.vertexes);
                this.insidePlotArea = pick(
                    params.insidePlotArea,
                    this.insidePlotArea
                );
                delete params.enabled;
                delete params.vertexes;
                delete params.insidePlotArea;

                const chart = charts[renderer.chartIndex],
                    vertexes2d = perspective(
                        this.vertexes as any,
                        chart as any,
                        this.insidePlotArea
                    ),
                    path = renderer.toLinePath(vertexes2d, true),
                    area = shapeArea(vertexes2d),
                    visibility = (this.enabled && area > 0) ?
                        'visible' : 'hidden';

                params.d = path;
                this.attr('visibility', visibility);
            }

            return elementProto.animate.apply(this, arguments as any);
        };

        /* eslint-enable no-invalid-this */

        return ret.attr(args);
    }

    /**
     * A Polyhedron is a handy way of defining a group of 3-D faces. It's only
     * attribute is `faces`, an array of attributes of each one of it's Face3D
     * instances.
     * @private
     */
    function polyhedron(
        this: Composition,
        args?: SVGAttributes
    ): SVGElement3D {
        const renderer = this,
            elementProto = renderer.Element.prototype,
            result = renderer.g(),
            destroy = result.destroy;

        if (!this.styledMode) {
            result.attr({
                'stroke-linejoin': 'round'
            });
        }

        result.faces = [];

        // Destroy all children
        result.destroy = function (): undefined {
            for (let i = 0; i < result.faces.length; i++) {
                result.faces[i].destroy();
            }
            return destroy.call(this);
        };

        result.attr = function (
            this: SVGElement,
            hash?: (string|SVGAttributes3D),
            val?: string,
            complete?: Function,
            continueAnimation?: boolean
        ): (number|string|SVGElement) {
            if (typeof hash === 'object' && defined(hash.faces)) {
                while (result.faces.length > hash.faces.length) {
                    result.faces.pop().destroy();
                }
                while (result.faces.length < hash.faces.length) {
                    result.faces.push(renderer.face3d().add(result));
                }
                for (let i = 0; i < hash.faces.length; i++) {
                    if (renderer.styledMode) {
                        delete hash.faces[i].fill;
                    }
                    result.faces[i].attr(
                        hash.faces[i],
                        null,
                        complete,
                        continueAnimation
                    );
                }
                delete hash.faces;
            }
            return elementProto.attr.apply(this, arguments as any);
        } as any;

        result.animate = function (
            this: SVGElement,
            params: SVGAttributes3D,
            duration?: (boolean|Partial<AnimationOptions>),
            complete?: Function
        ): SVGElement {
            if (params?.faces) {
                while (result.faces.length > params.faces.length) {
                    result.faces.pop().destroy();
                }
                while (result.faces.length < params.faces.length) {
                    result.faces.push(renderer.face3d().add(result));
                }
                for (let i = 0; i < params.faces.length; i++) {
                    result.faces[i].animate(
                        params.faces[i],
                        duration,
                        complete
                    );
                }
                delete params.faces;
            }
            return elementProto.animate.apply(this, arguments as any);
        };

        return result.attr(args) as SVGElement3D;
    }

    /**
     * Return result, generalization
     * @private
     * @requires highcharts-3d
     */
    function element3d(
        this: Composition,
        type: string,
        shapeArgs: SVGAttributes
    ): SVGElement3D {
        const elem3d = new SVGElement3D.types[type](this, 'g');
        elem3d.initArgs(shapeArgs);

        return elem3d;
    }

    /**
     * Generalized, so now use simply
     * @private
     */
    function cuboid(
        this: Composition,
        shapeArgs: SVGAttributes
    ): SVGElement {
        return this.element3d('cuboid', shapeArgs);
    }

    /**
     * Generates a cuboid path and zIndexes
     * @private
     */
    function cuboidPath(
        this: Composition,
        shapeArgs: SVGAttributes3D
    ): SVGCuboid {
        const x = shapeArgs.x || 0,
            y = shapeArgs.y || 0,
            z = shapeArgs.z || 0,
            // For side calculation (right/left)
            // there is a need for height (and other shapeArgs arguments)
            // to be at least 1px
            h = shapeArgs.height || 0,
            w = shapeArgs.width || 0,
            d = shapeArgs.depth || 0,
            chart = charts[this.chartIndex],
            options3d = (chart as any).options.chart.options3d,
            alpha = options3d.alpha,
            // Priority for x axis is the biggest,
            // because of x direction has biggest influence on zIndex
            incrementX = 1000000,
            // Y axis has the smallest priority in case of our charts
            // (needs to be set because of stacking)
            incrementY = 10,
            incrementZ = 100,
            forcedSides: Array<string> = [];

        let shape: Array<number|Array<number>>,
            zIndex = 0,

            // The 8 corners of the cube
            pArr = [{
                x: x,
                y: y,
                z: z
            }, {
                x: x + w,
                y: y,
                z: z
            }, {
                x: x + w,
                y: y + h,
                z: z
            }, {
                x: x,
                y: y + h,
                z: z
            }, {
                x: x,
                y: y + h,
                z: z + d
            }, {
                x: x + w,
                y: y + h,
                z: z + d
            }, {
                x: x + w,
                y: y,
                z: z + d
            }, {
                x: x,
                y: y,
                z: z + d
            }];

        // Apply perspective
        pArr = perspective(pArr, chart as any, shapeArgs.insidePlotArea);

        /**
         * Helper method to decide which side is visible
         * @private
         */
        const mapSidePath = (i: number): Position3DObject => {
                // Added support for 0 value in columns, where height is 0
                // but the shape is rendered.
                // Height is used from 1st to 6th element of pArr
                if (h === 0 && i > 1 && i < 6) { // [2, 3, 4, 5]
                    return {
                        x: pArr[i].x,
                        // When height is 0 instead of cuboid we render plane
                        // so it is needed to add fake 10 height to imitate
                        // cuboid for side calculation
                        y: pArr[i].y + 10,
                        z: pArr[i].z
                    };
                }
                // It is needed to calculate dummy sides (front/back) for
                // breaking points in case of x and depth values. If column has
                // side, it means that x values of front and back side are
                // different.
                if (pArr[0].x === pArr[7].x && i >= 4) { // [4, 5, 6, 7]
                    return {
                        x: pArr[i].x + 10,
                        // When height is 0 instead of cuboid we render plane
                        // so it is needed to add fake 10 height to imitate
                        // cuboid for side calculation
                        y: pArr[i].y,
                        z: pArr[i].z
                    };
                }
                // Added dummy depth
                if (d === 0 && i < 2 || i > 5) { // [0, 1, 6, 7]

                    return {
                        x: pArr[i].x,
                        // When height is 0 instead of cuboid we render plane
                        // so it is needed to add fake 10 height to imitate
                        // cuboid for side calculation
                        y: pArr[i].y,
                        z: pArr[i].z + 10
                    };
                }
                return pArr[i];
            },
            /**
             * Method creating the final side
             * @private
             */
            mapPath = (i: number): Position3DObject => (pArr[i]),

            /**
             * First value - path with specific face
             * Second value - added info about side for later calculations.
             *                 Possible second values are 0 for path1, 1 for
             *                 path2 and -1 for no path chosen.
             * Third value - string containing information about current side of
             *               cuboid for forcing side rendering.
             * @private
             */
            pickShape = (
                verticesIndex1: Array<number>,
                verticesIndex2: Array<number>,
                side?: string
            ): Array<number|Array<number>> => {
                const // An array of vertices for cuboid face
                    face1: Array<Position3DObject> =
                        verticesIndex1.map(mapPath),
                    face2: Array<Position3DObject> =
                        verticesIndex2.map(mapPath),
                    // Dummy face is calculated the same way as standard face,
                    // but if cuboid height is 0 additional height is added so
                    // it is possible to use this vertices array for visible
                    // face calculation
                    dummyFace1: Array<Position3DObject> =
                        verticesIndex1.map(mapSidePath),
                    dummyFace2: Array<Position3DObject> =
                        verticesIndex2.map(mapSidePath);

                let ret = [[] as any, -1];

                if (shapeArea(face1) < 0) {
                    ret = [face1, 0];
                } else if (shapeArea(face2) < 0) {
                    ret = [face2, 1];
                } else if (side) {
                    forcedSides.push(side);
                    if (shapeArea(dummyFace1) < 0) {
                        ret = [face1, 0];
                    } else if (shapeArea(dummyFace2) < 0) {
                        ret = [face2, 1];
                    } else {
                        ret = [face1, 0]; // Force side calculation.
                    }
                }
                return ret;
            };

        // Front or back
        const front = [3, 2, 1, 0],
            back = [7, 6, 5, 4];
        shape = pickShape(front, back, 'front');
        const path1 = shape[0] as any,
            isFront = shape[1] as any;


        // Top or bottom
        const top = [1, 6, 7, 0],
            bottom = [4, 5, 2, 3];
        shape = pickShape(top, bottom, 'top');
        const path2 = shape[0] as any,
            isTop = shape[1] as any;

        // Side
        const right = [1, 2, 5, 6],
            left = [0, 7, 4, 3];
        shape = pickShape(right, left, 'side');
        const path3 = shape[0] as any,
            isRight = shape[1] as any;

        /* New block used for calculating zIndex. It is basing on X, Y and Z
        position of specific columns. All zIndexes (for X, Y and Z values) are
        added to the final zIndex, where every value has different priority. The
        biggest priority is in X and Z directions, the lowest index is for
        stacked columns (Y direction and the same X and Z positions). Big
        differences between priorities is made because we need to ensure that
        even for big changes in Y and Z parameters all columns will be drawn
        correctly. */

        if (isRight === 1) {
            // It is needed to connect value with current chart width
            // for big chart size.
            zIndex += incrementX * ((chart as any).plotWidth - x);
        } else if (!isRight) {
            zIndex += incrementX * x;
        }

        zIndex += incrementY * (
            !isTop ||
            // Numbers checked empirically
            (alpha >= 0 && alpha <= 180 || alpha < 360 && alpha > 357.5) ?
                (chart as any).plotHeight - y : 10 + y
        );

        if (isFront === 1) {
            zIndex += incrementZ * (z);
        } else if (!isFront) {
            zIndex += incrementZ * (1000 - z);
        }

        return {
            front: this.toLinePath(path1, true),
            top: this.toLinePath(path2, true),
            side: this.toLinePath(path3, true),
            zIndexes: {
                group: Math.round(zIndex)
            },
            forcedSides: forcedSides,

            // Additional info about zIndexes
            isFront: isFront,
            isTop: isTop
        }; // #4774
    }

    /** @private */
    function arc3d(
        this: Composition,
        attribs: SVGAttributes3D
    ): SVGElement {
        const renderer = this,
            wrapper = renderer.g(),
            elementProto = renderer.Element.prototype,
            customAttribs: Array<keyof SVGAttributes3D> = [
                'alpha', 'beta',
                'x', 'y', 'r', 'innerR', 'start', 'end', 'depth'
            ];

        /**
         * Get custom attributes. Don't mutate the original object and return an
         * object with only custom attr.
         * @private
         */
        function extractCustom(
            params: SVGAttributes3D
        ): ([SVGAttributes3D, SVGAttributes]|false) {
            const ca: Record<string, any> = {};

            params = merge(params); // Don't mutate the original object

            let key: keyof SVGAttributes3D;
            for (key in params) {
                if (customAttribs.indexOf(key) !== -1) {
                    ca[key] = params[key];
                    delete params[key];
                }
            }
            return Object.keys(ca).length ? [ca, params] : false;
        }

        attribs = merge(attribs);

        attribs.alpha = (attribs.alpha || 0) * deg2rad;
        attribs.beta = (attribs.beta || 0) * deg2rad;

        // Create the different sub sections of the shape
        wrapper.top = renderer.path();
        wrapper.side1 = renderer.path();
        wrapper.side2 = renderer.path();
        wrapper.inn = renderer.path();
        wrapper.out = renderer.path();

        /* eslint-disable no-invalid-this */

        // Add all faces
        wrapper.onAdd = function (): void {
            const parent = wrapper.parentGroup,
                className = wrapper.attr('class');

            wrapper.top.add(wrapper);

            // These faces are added outside the wrapper group because the
            // z-index relates to neighbour elements as well
            for (const face of ['out', 'inn', 'side1', 'side2']) {
                wrapper[face]
                    .attr({
                        'class': className + ' highcharts-3d-side'
                    })
                    .add(parent);
            }
        };

        // Cascade to faces
        for (const fn of ['addClass', 'removeClass']) {
            wrapper[fn] = function (): void {
                const args = arguments;

                for (const face of ['top', 'out', 'inn', 'side1', 'side2']) {
                    wrapper[face][fn].apply(wrapper[face], args);
                }
            };
        }

        /**
         * Compute the transformed paths and set them to the composite shapes
         * @private
         */
        wrapper.setPaths = function (attribs: SVGAttributes3D): void {

            const paths = wrapper.renderer.arc3dPath(attribs),
                zIndex = paths.zTop * 100;

            wrapper.attribs = attribs;

            wrapper.top.attr({ d: paths.top, zIndex: paths.zTop });
            wrapper.inn.attr({ d: paths.inn, zIndex: paths.zInn });
            wrapper.out.attr({ d: paths.out, zIndex: paths.zOut });
            wrapper.side1.attr({ d: paths.side1, zIndex: paths.zSide1 });
            wrapper.side2.attr({ d: paths.side2, zIndex: paths.zSide2 });


            // Show all children
            wrapper.zIndex = zIndex;
            wrapper.attr({ zIndex: zIndex });

            // Set the radial gradient center the first time
            if (attribs.center) {
                wrapper.top.setRadialReference(attribs.center);
                delete attribs.center;
            }
        };
        wrapper.setPaths(attribs);

        /**
         * Apply the fill to the top and a darker shade to the sides
         * @private
         */
        wrapper.fillSetter = function (
            this: SVGElement,
            value: ColorType
        ): SVGElement {
            const darker = color(value).brighten(-0.1).get();

            this.fill = value;

            this.side1.attr({ fill: darker });
            this.side2.attr({ fill: darker });
            this.inn.attr({ fill: darker });
            this.out.attr({ fill: darker });
            this.top.attr({ fill: value });

            return this;
        };

        // Apply the same value to all. These properties cascade down to the
        // children when set to the composite arc3d.
        for (
            const setter of
            ['opacity', 'translateX', 'translateY', 'visibility']
        ) {
            wrapper[setter + 'Setter'] = function (
                value: any,
                key: string
            ): void {
                wrapper[key] = value;
                for (const el of ['out', 'inn', 'side1', 'side2', 'top']) {
                    wrapper[el].attr(key, value);
                }
            };
        }

        // Override attr to remove shape attributes and use those to set child
        // paths
        wrapper.attr = function (
            this: SVGElement,
            params?: (string|SVGAttributes)
        ): (number|string|SVGElement) {
            if (typeof params === 'object') {
                const paramArr = extractCustom(params);
                if (paramArr) {
                    const ca = paramArr[0];
                    arguments[0] = paramArr[1];

                    // Translate alpha and beta to rotation
                    if (ca.alpha !== void 0) {
                        ca.alpha *= deg2rad;
                    }
                    if (ca.beta !== void 0) {
                        ca.beta *= deg2rad;
                    }

                    extend(wrapper.attribs, ca);
                    if (wrapper.attribs) {
                        wrapper.setPaths(wrapper.attribs);
                    }
                }
            }
            return elementProto.attr.apply(wrapper, arguments);
        } as any;

        // Override the animate function by sucking out custom parameters
        // related to the shapes directly, and update the shapes from the
        // animation step.
        wrapper.animate = function (
            this: SVGElement,
            params: SVGAttributes3D,
            animation?: (boolean|Partial<AnimationOptions>),
            complete?: Function
        ): SVGElement {
            const from = this.attribs,
                randomProp = 'data-' +
                    Math.random().toString(26).substring(2, 9);

            // Attribute-line properties connected to 3D. These shouldn't have
            // been in the attribs collection in the first place.
            delete params.center;
            delete params.z;

            const anim = animObject(
                pick(animation, this.renderer.globalAnimation)
            );

            if (anim.duration) {
                const paramArr = extractCustom(params);
                // Params need to have a property in order for the step to run
                // (#5765, #7097, #7437)
                wrapper[randomProp] = 0;
                (params as any)[randomProp] = 1;
                wrapper[randomProp + 'Setter'] = H.noop;

                if (paramArr) {
                    const to = paramArr[0], // Custom attr
                        interpolate = (
                            key: keyof SVGAttributes,
                            pos: number
                        ): number => (
                            (from as any)[key] + (
                                pick(to[key], (from as any)[key]) -
                                (from as any)[key]
                            ) * pos
                        );

                    anim.step = function (a: unknown, fx: Fx): void {
                        if (fx.prop === randomProp) {
                            fx.elem.setPaths(merge(from, {
                                x: interpolate('x', fx.pos),
                                y: interpolate('y', fx.pos),
                                r: interpolate('r', fx.pos),
                                innerR: interpolate('innerR', fx.pos),
                                start: interpolate('start', fx.pos),
                                end: interpolate('end', fx.pos),
                                depth: interpolate('depth', fx.pos)
                            }));
                        }
                    };
                }
                animation = anim; // Only when duration (#5572)
            }
            return elementProto.animate.call(
                this,
                params,
                animation,
                complete
            );
        };

        // Destroy all children
        wrapper.destroy = function (this: SVGElement): undefined {
            this.top.destroy();
            this.out.destroy();
            this.inn.destroy();
            this.side1.destroy();
            this.side2.destroy();

            return elementProto.destroy.call(this);
        };

        // Hide all children
        wrapper.hide = function (this: SVGElement): void {
            this.top.hide();
            this.out.hide();
            this.inn.hide();
            this.side1.hide();
            this.side2.hide();
        } as any;

        wrapper.show = function (
            this: SVGElement,
            inherit?: boolean
        ): void {
            this.top.show(inherit);
            this.out.show(inherit);
            this.inn.show(inherit);
            this.side1.show(inherit);
            this.side2.show(inherit);
        } as any;

        /* eslint-enable no-invalid-this */

        return wrapper;
    }

    /**
     * Generate the paths required to draw a 3D arc.
     * @private
     */
    function arc3dPath(shapeArgs: SVGAttributes3D): SVGArc3D {
        const cx = shapeArgs.x || 0, // X coordinate of the center
            cy = shapeArgs.y || 0, // Y coordinate of the center
            start = shapeArgs.start || 0, // Start angle
            end = (shapeArgs.end || 0) - 0.00001, // End angle
            r = shapeArgs.r || 0, // Radius
            ir = shapeArgs.innerR || 0, // Inner radius
            d = shapeArgs.depth || 0, // Depth
            alpha = shapeArgs.alpha || 0, // Alpha rotation of the chart
            beta = shapeArgs.beta || 0; // Beta rotation of the chart

        // Derived Variables
        const cs = Math.cos(start), // Cosinus of the start angle
            ss = Math.sin(start), // Sinus of the start angle
            ce = Math.cos(end), // Cosinus of the end angle
            se = Math.sin(end), // Sinus of the end angle
            rx = r * Math.cos(beta), // X-radius
            ry = r * Math.cos(alpha), // Y-radius
            irx = ir * Math.cos(beta), // X-radius (inner)
            iry = ir * Math.cos(alpha), // Y-radius (inner)
            dx = d * Math.sin(beta), // Distance between top and bottom in x
            dy = d * Math.sin(alpha); // Distance between top and bottom in y

        // TOP
        let top: SVGPath = [
            ['M', cx + (rx * cs), cy + (ry * ss)]
        ];

        top = top.concat(curveTo(cx, cy, rx, ry, start, end, 0, 0));
        top.push([
            'L', cx + (irx * ce), cy + (iry * se)
        ]);
        top = top.concat(curveTo(cx, cy, irx, iry, end, start, 0, 0));
        top.push(['Z']);

        // OUTSIDE
        const b = (beta > 0 ? Math.PI / 2 : 0),
            a = (alpha > 0 ? 0 : Math.PI / 2);

        const start2 = start > -b ? start : (end > -b ? -b : start),
            end2 = end < PI - a ? end : (start < PI - a ? PI - a : end),
            midEnd = 2 * PI - a;

        // When slice goes over bottom middle, need to add both, left and right
        // outer side. Additionally, when we cross right hand edge, create sharp
        // edge. Outer shape/wall:
        //
        //            -------
        //          /    ^    \
        //    4)   /   /   \   \  1)
        //        /   /     \   \
        //       /   /       \   \
        // (c)=> ====         ==== <=(d)
        //       \   \       /   /
        //        \   \<=(a)/   /
        //         \   \   /   / <=(b)
        //    3)    \    v    /  2)
        //            -------
        //
        // (a) - inner side
        // (b) - outer side
        // (c) - left edge (sharp)
        // (d) - right edge (sharp)
        // 1..n - rendering order for startAngle = 0, when set to e.g 90, order
        // changes clockwise (1->2, 2->3, n->1) and counterclockwise for
        // negative startAngle

        let out: SVGPath = [
            ['M', cx + (rx * cos(start2)), cy + (ry * sin(start2))]
        ];

        out = out.concat(curveTo(cx, cy, rx, ry, start2, end2, 0, 0));

        // When shape is wide, it can cross both, (c) and (d) edges, when using
        // startAngle
        if (end > midEnd && start < midEnd) {
            // Go to outer side
            out.push([
                'L', cx + (rx * cos(end2)) + dx, cy + (ry * sin(end2)) + dy
            ]);
            // Curve to the right edge of the slice (d)
            out = out.concat(curveTo(cx, cy, rx, ry, end2, midEnd, dx, dy));
            // Go to the inner side
            out.push([
                'L', cx + (rx * cos(midEnd)), cy + (ry * sin(midEnd))
            ]);
            // Curve to the true end of the slice
            out = out.concat(curveTo(cx, cy, rx, ry, midEnd, end, 0, 0));
            // Go to the outer side
            out.push([
                'L', cx + (rx * cos(end)) + dx, cy + (ry * sin(end)) + dy
            ]);
            // Go back to middle (d)
            out = out.concat(curveTo(cx, cy, rx, ry, end, midEnd, dx, dy));
            out.push([
                'L', cx + (rx * cos(midEnd)), cy + (ry * sin(midEnd))
            ]);
            // Go back to the left edge
            out = out.concat(curveTo(cx, cy, rx, ry, midEnd, end2, 0, 0));

        // But shape can cross also only (c) edge:
        } else if (end > PI - a && start < PI - a) {
            // Go to outer side
            out.push([
                'L',
                cx + (rx * Math.cos(end2)) + dx,
                cy + (ry * Math.sin(end2)) + dy
            ]);
            // Curve to the true end of the slice
            out = out.concat(curveTo(cx, cy, rx, ry, end2, end, dx, dy));
            // Go to the inner side
            out.push([
                'L', cx + (rx * Math.cos(end)), cy + (ry * Math.sin(end))
            ]);
            // Go back to the artificial end2
            out = out.concat(curveTo(cx, cy, rx, ry, end, end2, 0, 0));
        }

        out.push([
            'L',
            cx + (rx * Math.cos(end2)) + dx,
            cy + (ry * Math.sin(end2)) + dy
        ]);
        out = out.concat(curveTo(cx, cy, rx, ry, end2, start2, dx, dy));
        out.push(['Z']);

        // INSIDE
        let inn: SVGPath = [
            ['M', cx + (irx * cs), cy + (iry * ss)]
        ];

        inn = inn.concat(curveTo(cx, cy, irx, iry, start, end, 0, 0));
        inn.push([
            'L',
            cx + (irx * Math.cos(end)) + dx,
            cy + (iry * Math.sin(end)) + dy
        ]);
        inn = inn.concat(curveTo(cx, cy, irx, iry, end, start, dx, dy));
        inn.push(['Z']);

        // SIDES
        const side1: SVGPath = [
            ['M', cx + (rx * cs), cy + (ry * ss)],
            ['L', cx + (rx * cs) + dx, cy + (ry * ss) + dy],
            ['L', cx + (irx * cs) + dx, cy + (iry * ss) + dy],
            ['L', cx + (irx * cs), cy + (iry * ss)],
            ['Z']
        ];
        const side2: SVGPath = [
            ['M', cx + (rx * ce), cy + (ry * se)],
            ['L', cx + (rx * ce) + dx, cy + (ry * se) + dy],
            ['L', cx + (irx * ce) + dx, cy + (iry * se) + dy],
            ['L', cx + (irx * ce), cy + (iry * se)],
            ['Z']
        ];

        // Correction for changed position of vanishing point caused by alpha
        // and beta rotations
        const angleCorr = Math.atan2(dy, -dx);

        let angleEnd = Math.abs(end + angleCorr),
            angleStart = Math.abs(start + angleCorr),
            angleMid = Math.abs((start + end) / 2 + angleCorr);

        /**
         * Set to 0-PI range
         * @private
         */
        function toZeroPIRange(angle: number): number {
            angle = angle % (2 * Math.PI);
            if (angle > Math.PI) {
                angle = 2 * Math.PI - angle;
            }
            return angle;
        }
        angleEnd = toZeroPIRange(angleEnd);
        angleStart = toZeroPIRange(angleStart);
        angleMid = toZeroPIRange(angleMid);

        // *1e5 is to compensate pInt in zIndexSetter
        const incPrecision = 1e5,
            a1 = angleMid * incPrecision,
            a2 = angleStart * incPrecision,
            a3 = angleEnd * incPrecision;

        return {
            top: top,
            // Max angle is PI, so this is always higher
            zTop: Math.PI * incPrecision + 1,
            out: out,
            zOut: Math.max(a1, a2, a3),
            inn: inn,
            zInn: Math.max(a1, a2, a3),
            side1: side1,
            // To keep below zOut and zInn in case of same values
            zSide1: a3 * 0.99,
            side2: side2,
            zSide2: a2 * 0.99
        };
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default SVGRenderer3D;
