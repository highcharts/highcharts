/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extensions to the SVGRenderer class to enable 3D shapes
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import A from '../../Animation/AnimationUtilities.js';
var animObject = A.animObject;
import Color from '../../Color/Color.js';
var color = Color.parse;
import H from '../../Globals.js';
var charts = H.charts, deg2rad = H.deg2rad;
import Math3D from '../../../Extensions/Math3D.js';
var perspective = Math3D.perspective, shapeArea = Math3D.shapeArea;
import SVGElement from './SVGElement.js';
import SVGElement3D from './SVGElement3D.js';
import SVGRenderer from './SVGRenderer.js';
import U from '../../Utilities.js';
var defined = U.defined, extend = U.extend, merge = U.merge, pick = U.pick;
/* *
 *
 *  Constants
 *
 * */
var cos = Math.cos, sin = Math.sin, PI = Math.PI, dFactor = (4 * (Math.sqrt(2) - 1) / 3) / (PI / 2);
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
var SVGRenderer3D = /** @class */ (function (_super) {
    __extends(SVGRenderer3D, _super);
    function SVGRenderer3D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /** @private */
    SVGRenderer3D.compose = function (SVGRendererClass) {
        var svgRendererProto = SVGRendererClass.prototype, svgRenderer3dProto = SVGRenderer3D.prototype;
        svgRendererProto.elements3d = SVGElement3D;
        svgRendererProto.arc3d = svgRenderer3dProto.arc3d;
        svgRendererProto.arc3dPath = svgRenderer3dProto.arc3dPath;
        svgRendererProto.cuboid = svgRenderer3dProto.cuboid;
        svgRendererProto.cuboidPath = svgRenderer3dProto.cuboidPath;
        svgRendererProto.element3d = svgRenderer3dProto.element3d;
        svgRendererProto.face3d = svgRenderer3dProto.face3d;
        svgRendererProto.polyhedron = svgRenderer3dProto.polyhedron;
        svgRendererProto.toLinePath = svgRenderer3dProto.toLinePath;
        svgRendererProto.toLineSegments = svgRenderer3dProto.toLineSegments;
    };
    /**
     * Method to construct a curved path. Can 'wrap' around more then 180
     * degrees.
     * @private
     */
    SVGRenderer3D.curveTo = function (cx, cy, rx, ry, start, end, dx, dy) {
        var result = [], arcAngle = end - start;
        if ((end > start) && (end - start > Math.PI / 2 + 0.0001)) {
            result = result.concat(this.curveTo(cx, cy, rx, ry, start, start + (Math.PI / 2), dx, dy));
            result = result.concat(this.curveTo(cx, cy, rx, ry, start + (Math.PI / 2), end, dx, dy));
            return result;
        }
        if ((end < start) && (start - end > Math.PI / 2 + 0.0001)) {
            result = result.concat(this.curveTo(cx, cy, rx, ry, start, start - (Math.PI / 2), dx, dy));
            result = result.concat(this.curveTo(cx, cy, rx, ry, start - (Math.PI / 2), end, dx, dy));
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
    };
    /* *
     *
     *  Functions
     *
     * */
    /** @private */
    SVGRenderer3D.prototype.toLinePath = function (points, closed) {
        var result = [];
        // Put "L x y" for each point
        points.forEach(function (point) {
            result.push(['L', point.x, point.y]);
        });
        if (points.length) {
            // Set the first element to M
            result[0][0] = 'M';
            // If it is a closed line, add Z
            if (closed) {
                result.push(['Z']);
            }
        }
        return result;
    };
    /** @private */
    SVGRenderer3D.prototype.toLineSegments = function (points) {
        var result = [], m = true;
        points.forEach(function (point) {
            result.push(m ? ['M', point.x, point.y] : ['L', point.x, point.y]);
            m = !m;
        });
        return result;
    };
    /**
     * A 3-D Face is defined by it's 3D vertexes, and is only visible if it's
     * vertexes are counter-clockwise (Back-face culling). It is used as a
     * polyhedron Element.
     * @private
     */
    SVGRenderer3D.prototype.face3d = function (args) {
        var renderer = this, ret = this.createElement('path');
        ret.vertexes = [];
        ret.insidePlotArea = false;
        ret.enabled = true;
        /* eslint-disable no-invalid-this */
        ret.attr = function (hash) {
            if (typeof hash === 'object' &&
                (defined(hash.enabled) ||
                    defined(hash.vertexes) ||
                    defined(hash.insidePlotArea))) {
                this.enabled = pick(hash.enabled, this.enabled);
                this.vertexes = pick(hash.vertexes, this.vertexes);
                this.insidePlotArea = pick(hash.insidePlotArea, this.insidePlotArea);
                delete hash.enabled;
                delete hash.vertexes;
                delete hash.insidePlotArea;
                var chart = charts[renderer.chartIndex], vertexes2d = perspective(this.vertexes, chart, this.insidePlotArea), path = renderer.toLinePath(vertexes2d, true), area = shapeArea(vertexes2d);
                hash.d = path;
                hash.visibility = (this.enabled && area > 0) ?
                    'visible' : 'hidden';
            }
            return SVGElement.prototype.attr.apply(this, arguments);
        };
        ret.animate = function (params) {
            if (typeof params === 'object' &&
                (defined(params.enabled) ||
                    defined(params.vertexes) ||
                    defined(params.insidePlotArea))) {
                this.enabled = pick(params.enabled, this.enabled);
                this.vertexes = pick(params.vertexes, this.vertexes);
                this.insidePlotArea = pick(params.insidePlotArea, this.insidePlotArea);
                delete params.enabled;
                delete params.vertexes;
                delete params.insidePlotArea;
                var chart = charts[renderer.chartIndex], vertexes2d = perspective(this.vertexes, chart, this.insidePlotArea), path = renderer.toLinePath(vertexes2d, true), area = shapeArea(vertexes2d), visibility = (this.enabled && area > 0) ?
                    'visible' : 'hidden';
                params.d = path;
                this.attr('visibility', visibility);
            }
            return SVGElement.prototype.animate.apply(this, arguments);
        };
        /* eslint-enable no-invalid-this */
        return ret.attr(args);
    };
    /**
     * A Polyhedron is a handy way of defining a group of 3-D faces. It's only
     * attribute is `faces`, an array of attributes of each one of it's Face3D
     * instances.
     * @private
     */
    SVGRenderer3D.prototype.polyhedron = function (args) {
        var renderer = this, result = this.g(), destroy = result.destroy;
        if (!this.styledMode) {
            result.attr({
                'stroke-linejoin': 'round'
            });
        }
        result.faces = [];
        /* eslint-disable no-invalid-this */
        // destroy all children
        result.destroy = function () {
            for (var i = 0; i < result.faces.length; i++) {
                result.faces[i].destroy();
            }
            return destroy.call(this);
        };
        result.attr = function (hash, val, complete, continueAnimation) {
            if (typeof hash === 'object' && defined(hash.faces)) {
                while (result.faces.length > hash.faces.length) {
                    result.faces.pop().destroy();
                }
                while (result.faces.length < hash.faces.length) {
                    result.faces.push(renderer.face3d().add(result));
                }
                for (var i = 0; i < hash.faces.length; i++) {
                    if (renderer.styledMode) {
                        delete hash.faces[i].fill;
                    }
                    result.faces[i].attr(hash.faces[i], null, complete, continueAnimation);
                }
                delete hash.faces;
            }
            return SVGElement.prototype.attr.apply(this, arguments);
        };
        result.animate = function (params, duration, complete) {
            if (params && params.faces) {
                while (result.faces.length > params.faces.length) {
                    result.faces.pop().destroy();
                }
                while (result.faces.length < params.faces.length) {
                    result.faces.push(renderer.face3d().add(result));
                }
                for (var i = 0; i < params.faces.length; i++) {
                    result.faces[i].animate(params.faces[i], duration, complete);
                }
                delete params.faces;
            }
            return SVGElement.prototype.animate.apply(this, arguments);
        };
        /* eslint-enable no-invalid-this */
        return result.attr(args);
    };
    /**
     * return result, generalization
     * @private
     * @requires highcharts-3d
     */
    SVGRenderer3D.prototype.element3d = function (type, shapeArgs) {
        // base
        var ret = this.g();
        // extend
        extend(ret, this.elements3d[type]);
        // init
        ret.initArgs(shapeArgs);
        // return
        return ret;
    };
    /**
     * generelized, so now use simply
     * @private
     */
    SVGRenderer3D.prototype.cuboid = function (shapeArgs) {
        return this.element3d('cuboid', shapeArgs);
    };
    /**
     * Generates a cuboid path and zIndexes
     * @private
     */
    SVGRenderer3D.prototype.cuboidPath = function (shapeArgs) {
        var x = shapeArgs.x || 0, y = shapeArgs.y || 0, z = shapeArgs.z || 0, 
        // For side calculation (right/left)
        // there is a need for height (and other shapeArgs arguments)
        // to be at least 1px
        h = shapeArgs.height || 0, w = shapeArgs.width || 0, d = shapeArgs.depth || 0, chart = charts[this.chartIndex], front, back, top, bottom, left, right, shape, path1, path2, path3, isFront, isTop, isRight, options3d = chart.options.chart.options3d, alpha = options3d.alpha, 
        // Priority for x axis is the biggest,
        // because of x direction has biggest influence on zIndex
        incrementX = 1000000, 
        // y axis has the smallest priority in case of our charts
        // (needs to be set because of stacking)
        incrementY = 10, incrementZ = 100, zIndex = 0, 
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
            }], forcedSides = [], pickShape;
        // apply perspective
        pArr = perspective(pArr, chart, shapeArgs.insidePlotArea);
        /**
         * helper method to decide which side is visible
         * @private
         */
        function mapSidePath(i) {
            // Added support for 0 value in columns, where height is 0
            // but the shape is rendered.
            // Height is used from 1st to 6th element of pArr
            if (h === 0 && i > 1 && i < 6) { // [2, 3, 4, 5]
                return {
                    x: pArr[i].x,
                    // when height is 0 instead of cuboid we render plane
                    // so it is needed to add fake 10 height to imitate cuboid
                    // for side calculation
                    y: pArr[i].y + 10,
                    z: pArr[i].z
                };
            }
            // It is needed to calculate dummy sides (front/back) for breaking
            // points in case of x and depth values. If column has side,
            // it means that x values of front and back side are different.
            if (pArr[0].x === pArr[7].x && i >= 4) { // [4, 5, 6, 7]
                return {
                    x: pArr[i].x + 10,
                    // when height is 0 instead of cuboid we render plane
                    // so it is needed to add fake 10 height to imitate cuboid
                    // for side calculation
                    y: pArr[i].y,
                    z: pArr[i].z
                };
            }
            // Added dummy depth
            if (d === 0 && i < 2 || i > 5) { // [0, 1, 6, 7]
                return {
                    x: pArr[i].x,
                    // when height is 0 instead of cuboid we render plane
                    // so it is needed to add fake 10 height to imitate cuboid
                    // for side calculation
                    y: pArr[i].y,
                    z: pArr[i].z + 10
                };
            }
            return pArr[i];
        }
        /**
         * method creating the final side
         * @private
         */
        function mapPath(i) {
            return pArr[i];
        }
        /**
         * First value - path with specific face
         * Second  value - added information about side for later calculations.
         * Possible second values are 0 for path1, 1 for path2 and -1 for no
         * path chosen.
         * Third value - string containing information about current side
         * of cuboid for forcing side rendering.
         * @private
         */
        pickShape = function (verticesIndex1, verticesIndex2, side) {
            var ret = [[], -1], 
            // An array of vertices for cuboid face
            face1 = verticesIndex1.map(mapPath), face2 = verticesIndex2.map(mapPath), 
            // dummy face is calculated the same way as standard face, but
            // if cuboid height is 0 additional height is added so it is
            // possible to use this vertices array for visible face
            // calculation
            dummyFace1 = verticesIndex1.map(mapSidePath), dummyFace2 = verticesIndex2.map(mapSidePath);
            if (shapeArea(face1) < 0) {
                ret = [face1, 0];
            }
            else if (shapeArea(face2) < 0) {
                ret = [face2, 1];
            }
            else if (side) {
                forcedSides.push(side);
                if (shapeArea(dummyFace1) < 0) {
                    ret = [face1, 0];
                }
                else if (shapeArea(dummyFace2) < 0) {
                    ret = [face2, 1];
                }
                else {
                    ret = [face1, 0]; // force side calculation.
                }
            }
            return ret;
        };
        // front or back
        front = [3, 2, 1, 0];
        back = [7, 6, 5, 4];
        shape = pickShape(front, back, 'front');
        path1 = shape[0];
        isFront = shape[1];
        // top or bottom
        top = [1, 6, 7, 0];
        bottom = [4, 5, 2, 3];
        shape = pickShape(top, bottom, 'top');
        path2 = shape[0];
        isTop = shape[1];
        // side
        right = [1, 2, 5, 6];
        left = [0, 7, 4, 3];
        shape = pickShape(right, left, 'side');
        path3 = shape[0];
        isRight = shape[1];
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
            zIndex += incrementX * (chart.plotWidth - x);
        }
        else if (!isRight) {
            zIndex += incrementX * x;
        }
        zIndex += incrementY * (!isTop ||
            // Numbers checked empirically
            (alpha >= 0 && alpha <= 180 || alpha < 360 && alpha > 357.5) ?
            chart.plotHeight - y : 10 + y);
        if (isFront === 1) {
            zIndex += incrementZ * (z);
        }
        else if (!isFront) {
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
            // additional info about zIndexes
            isFront: isFront,
            isTop: isTop
        }; // #4774
    };
    /** @private */
    SVGRenderer3D.prototype.arc3d = function (attribs) {
        var wrapper = this.g(), renderer = wrapper.renderer, customAttribs = ['x', 'y', 'r', 'innerR', 'start', 'end', 'depth'];
        /**
         * Get custom attributes. Don't mutate the original object and return an
         * object with only custom attr.
         * @private
         */
        function suckOutCustom(params) {
            var hasCA = false, ca = {}, key;
            params = merge(params); // Don't mutate the original object
            for (key in params) {
                if (customAttribs.indexOf(key) !== -1) {
                    ca[key] = params[key];
                    delete params[key];
                    hasCA = true;
                }
            }
            return hasCA ? [ca, params] : false;
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
        wrapper.onAdd = function () {
            var parent = wrapper.parentGroup, className = wrapper.attr('class');
            wrapper.top.add(wrapper);
            // These faces are added outside the wrapper group because the
            // z-index relates to neighbour elements as well
            ['out', 'inn', 'side1', 'side2'].forEach(function (face) {
                wrapper[face]
                    .attr({
                    'class': className + ' highcharts-3d-side'
                })
                    .add(parent);
            });
        };
        // Cascade to faces
        ['addClass', 'removeClass'].forEach(function (fn) {
            wrapper[fn] = function () {
                var args = arguments;
                ['top', 'out', 'inn', 'side1', 'side2'].forEach(function (face) {
                    wrapper[face][fn].apply(wrapper[face], args);
                });
            };
        });
        /**
         * Compute the transformed paths and set them to the composite shapes
         * @private
         */
        wrapper.setPaths = function (attribs) {
            var paths = wrapper.renderer.arc3dPath(attribs), zIndex = paths.zTop * 100;
            wrapper.attribs = attribs;
            wrapper.top.attr({ d: paths.top, zIndex: paths.zTop });
            wrapper.inn.attr({ d: paths.inn, zIndex: paths.zInn });
            wrapper.out.attr({ d: paths.out, zIndex: paths.zOut });
            wrapper.side1.attr({ d: paths.side1, zIndex: paths.zSide1 });
            wrapper.side2.attr({ d: paths.side2, zIndex: paths.zSide2 });
            // show all children
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
        wrapper.fillSetter = function (value) {
            var darker = color(value).brighten(-0.1).get();
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
        ['opacity', 'translateX', 'translateY', 'visibility'].forEach(function (setter) {
            wrapper[setter + 'Setter'] = function (value, key) {
                wrapper[key] = value;
                ['out', 'inn', 'side1', 'side2', 'top'].forEach(function (el) {
                    wrapper[el].attr(key, value);
                });
            };
        });
        // Override attr to remove shape attributes and use those to set child
        // paths
        wrapper.attr = function (params) {
            var ca, paramArr;
            if (typeof params === 'object') {
                paramArr = suckOutCustom(params);
                if (paramArr) {
                    ca = paramArr[0];
                    arguments[0] = paramArr[1];
                    extend(wrapper.attribs, ca);
                    wrapper.setPaths(wrapper.attribs);
                }
            }
            return SVGElement.prototype.attr.apply(wrapper, arguments);
        };
        // Override the animate function by sucking out custom parameters
        // related to the shapes directly, and update the shapes from the
        // animation step.
        wrapper.animate = function (params, animation, complete) {
            var paramArr, from = this.attribs, to, anim, randomProp = ('data-' + Math.random().toString(26).substring(2, 9));
            // Attribute-line properties connected to 3D. These shouldn't have
            // been in the attribs collection in the first place.
            delete params.center;
            delete params.z;
            delete params.alpha;
            delete params.beta;
            anim = animObject(pick(animation, this.renderer.globalAnimation));
            if (anim.duration) {
                paramArr = suckOutCustom(params);
                // Params need to have a property in order for the step to run
                // (#5765, #7097, #7437)
                wrapper[randomProp] = 0;
                params[randomProp] = 1;
                wrapper[randomProp + 'Setter'] = H.noop;
                if (paramArr) {
                    to = paramArr[0]; // custom attr
                    anim.step = function (a, fx) {
                        /**
                         * @private
                         */
                        function interpolate(key) {
                            return from[key] + (pick(to[key], from[key]) -
                                from[key]) * fx.pos;
                        }
                        if (fx.prop === randomProp) {
                            fx.elem.setPaths(merge(from, {
                                x: interpolate('x'),
                                y: interpolate('y'),
                                r: interpolate('r'),
                                innerR: interpolate('innerR'),
                                start: interpolate('start'),
                                end: interpolate('end'),
                                depth: interpolate('depth')
                            }));
                        }
                    };
                }
                animation = anim; // Only when duration (#5572)
            }
            return SVGElement.prototype.animate.call(this, params, animation, complete);
        };
        // destroy all children
        wrapper.destroy = function () {
            this.top.destroy();
            this.out.destroy();
            this.inn.destroy();
            this.side1.destroy();
            this.side2.destroy();
            return SVGElement.prototype.destroy.call(this);
        };
        // hide all children
        wrapper.hide = function () {
            this.top.hide();
            this.out.hide();
            this.inn.hide();
            this.side1.hide();
            this.side2.hide();
        };
        wrapper.show = function (inherit) {
            this.top.show(inherit);
            this.out.show(inherit);
            this.inn.show(inherit);
            this.side1.show(inherit);
            this.side2.show(inherit);
        };
        /* eslint-enable no-invalid-this */
        return wrapper;
    };
    /**
     * Generate the paths required to draw a 3D arc.
     * @private
     */
    SVGRenderer3D.prototype.arc3dPath = function (shapeArgs) {
        var cx = shapeArgs.x || 0, // x coordinate of the center
        cy = shapeArgs.y || 0, // y coordinate of the center
        start = shapeArgs.start || 0, // start angle
        end = (shapeArgs.end || 0) - 0.00001, // end angle
        r = shapeArgs.r || 0, // radius
        ir = shapeArgs.innerR || 0, // inner radius
        d = shapeArgs.depth || 0, // depth
        alpha = shapeArgs.alpha || 0, // alpha rotation of the chart
        beta = shapeArgs.beta || 0; // beta rotation of the chart
        // Derived Variables
        var cs = Math.cos(start), // cosinus of the start angle
        ss = Math.sin(start), // sinus of the start angle
        ce = Math.cos(end), // cosinus of the end angle
        se = Math.sin(end), // sinus of the end angle
        rx = r * Math.cos(beta), // x-radius
        ry = r * Math.cos(alpha), // y-radius
        irx = ir * Math.cos(beta), // x-radius (inner)
        iry = ir * Math.cos(alpha), // y-radius (inner)
        dx = d * Math.sin(beta), // distance between top and bottom in x
        dy = d * Math.sin(alpha); // distance between top and bottom in y
        // TOP
        var top = [
            ['M', cx + (rx * cs), cy + (ry * ss)]
        ];
        top = top.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, start, end, 0, 0));
        top.push([
            'L', cx + (irx * ce), cy + (iry * se)
        ]);
        top = top.concat(SVGRenderer3D.curveTo(cx, cy, irx, iry, end, start, 0, 0));
        top.push(['Z']);
        // OUTSIDE
        var b = (beta > 0 ? Math.PI / 2 : 0), a = (alpha > 0 ? 0 : Math.PI / 2);
        var start2 = start > -b ? start : (end > -b ? -b : start), end2 = end < PI - a ? end : (start < PI - a ? PI - a : end), midEnd = 2 * PI - a;
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
        var out = [
            ['M', cx + (rx * cos(start2)), cy + (ry * sin(start2))]
        ];
        out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, start2, end2, 0, 0));
        // When shape is wide, it can cross both, (c) and (d) edges, when using
        // startAngle
        if (end > midEnd && start < midEnd) {
            // Go to outer side
            out.push([
                'L', cx + (rx * cos(end2)) + dx, cy + (ry * sin(end2)) + dy
            ]);
            // Curve to the right edge of the slice (d)
            out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, end2, midEnd, dx, dy));
            // Go to the inner side
            out.push([
                'L', cx + (rx * cos(midEnd)), cy + (ry * sin(midEnd))
            ]);
            // Curve to the true end of the slice
            out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, midEnd, end, 0, 0));
            // Go to the outer side
            out.push([
                'L', cx + (rx * cos(end)) + dx, cy + (ry * sin(end)) + dy
            ]);
            // Go back to middle (d)
            out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, end, midEnd, dx, dy));
            out.push([
                'L', cx + (rx * cos(midEnd)), cy + (ry * sin(midEnd))
            ]);
            // Go back to the left edge
            out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, midEnd, end2, 0, 0));
            // But shape can cross also only (c) edge:
        }
        else if (end > PI - a && start < PI - a) {
            // Go to outer side
            out.push([
                'L',
                cx + (rx * Math.cos(end2)) + dx,
                cy + (ry * Math.sin(end2)) + dy
            ]);
            // Curve to the true end of the slice
            out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, end2, end, dx, dy));
            // Go to the inner side
            out.push([
                'L', cx + (rx * Math.cos(end)), cy + (ry * Math.sin(end))
            ]);
            // Go back to the artifical end2
            out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, end, end2, 0, 0));
        }
        out.push([
            'L',
            cx + (rx * Math.cos(end2)) + dx,
            cy + (ry * Math.sin(end2)) + dy
        ]);
        out = out.concat(SVGRenderer3D.curveTo(cx, cy, rx, ry, end2, start2, dx, dy));
        out.push(['Z']);
        // INSIDE
        var inn = [
            ['M', cx + (irx * cs), cy + (iry * ss)]
        ];
        inn = inn.concat(SVGRenderer3D.curveTo(cx, cy, irx, iry, start, end, 0, 0));
        inn.push([
            'L',
            cx + (irx * Math.cos(end)) + dx,
            cy + (iry * Math.sin(end)) + dy
        ]);
        inn = inn.concat(SVGRenderer3D.curveTo(cx, cy, irx, iry, end, start, dx, dy));
        inn.push(['Z']);
        // SIDES
        var side1 = [
            ['M', cx + (rx * cs), cy + (ry * ss)],
            ['L', cx + (rx * cs) + dx, cy + (ry * ss) + dy],
            ['L', cx + (irx * cs) + dx, cy + (iry * ss) + dy],
            ['L', cx + (irx * cs), cy + (iry * ss)],
            ['Z']
        ];
        var side2 = [
            ['M', cx + (rx * ce), cy + (ry * se)],
            ['L', cx + (rx * ce) + dx, cy + (ry * se) + dy],
            ['L', cx + (irx * ce) + dx, cy + (iry * se) + dy],
            ['L', cx + (irx * ce), cy + (iry * se)],
            ['Z']
        ];
        // correction for changed position of vanishing point caused by alpha
        // and beta rotations
        var angleCorr = Math.atan2(dy, -dx), angleEnd = Math.abs(end + angleCorr), angleStart = Math.abs(start + angleCorr), angleMid = Math.abs((start + end) / 2 + angleCorr);
        /**
         * set to 0-PI range
         * @private
         */
        function toZeroPIRange(angle) {
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
        var incPrecision = 1e5, a1 = angleMid * incPrecision, a2 = angleStart * incPrecision, a3 = angleEnd * incPrecision;
        return {
            top: top,
            // max angle is PI, so this is always higher
            zTop: Math.PI * incPrecision + 1,
            out: out,
            zOut: Math.max(a1, a2, a3),
            inn: inn,
            zInn: Math.max(a1, a2, a3),
            side1: side1,
            // to keep below zOut and zInn in case of same values
            zSide1: a3 * 0.99,
            side2: side2,
            zSide2: a2 * 0.99
        };
    };
    return SVGRenderer3D;
}(SVGRenderer));
/* *
 *
 *  Default Export
 *
 * */
export default SVGRenderer3D;
