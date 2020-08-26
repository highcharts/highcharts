/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
/**
 * A valid color to be parsed and handled by Highcharts. Highcharts internally
 * supports hex colors like `#ffffff`, rgb colors like `rgb(255,255,255)` and
 * rgba colors like `rgba(255,255,255,1)`. Other colors may be supported by the
 * browsers and displayed correctly, but Highcharts is not able to process them
 * and apply concepts like opacity and brightening.
 *
 * @typedef {string} Highcharts.ColorString
 */
/**
 * A valid color type than can be parsed and handled by Highcharts. It can be a
 * color string, a gradient object, or a pattern object.
 *
 * @typedef {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject} Highcharts.ColorType
 */
/**
 * Gradient options instead of a solid color.
 *
 * @example
 * // Linear gradient used as a color option
 * color: {
 *     linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
 *     stops: [
 *         [0, '#003399'], // start
 *         [0.5, '#ffffff'], // middle
 *         [1, '#3366AA'] // end
 *     ]
 * }
 *
 * @interface Highcharts.GradientColorObject
 */ /**
* Holds an object that defines the start position and the end position relative
* to the shape.
* @name Highcharts.GradientColorObject#linearGradient
* @type {Highcharts.LinearGradientColorObject|undefined}
*/ /**
* Holds an object that defines the center position and the radius.
* @name Highcharts.GradientColorObject#radialGradient
* @type {Highcharts.RadialGradientColorObject|undefined}
*/ /**
* The first item in each tuple is the position in the gradient, where 0 is the
* start of the gradient and 1 is the end of the gradient. Multiple stops can be
* applied. The second item is the color for each stop. This color can also be
* given in the rgba format.
* @name Highcharts.GradientColorObject#stops
* @type {Array<Highcharts.GradientColorStopObject>}
*/
/**
 * Color stop tuple.
 *
 * @see Highcharts.GradientColorObject
 *
 * @interface Highcharts.GradientColorStopObject
 */ /**
* @name Highcharts.GradientColorStopObject#0
* @type {number}
*/ /**
* @name Highcharts.GradientColorStopObject#1
* @type {Highcharts.ColorString}
*/ /**
* @name Highcharts.GradientColorStopObject#color
* @type {Highcharts.Color|undefined}
*/
/**
 * Defines the start position and the end position for a gradient relative
 * to the shape. Start position (x1, y1) and end position (x2, y2) are relative
 * to the shape, where 0 means top/left and 1 is bottom/right.
 *
 * @interface Highcharts.LinearGradientColorObject
 */ /**
* Start horizontal position of the gradient. Float ranges 0-1.
* @name Highcharts.LinearGradientColorObject#x1
* @type {number}
*/ /**
* End horizontal position of the gradient. Float ranges 0-1.
* @name Highcharts.LinearGradientColorObject#x2
* @type {number}
*/ /**
* Start vertical position of the gradient. Float ranges 0-1.
* @name Highcharts.LinearGradientColorObject#y1
* @type {number}
*/ /**
* End vertical position of the gradient. Float ranges 0-1.
* @name Highcharts.LinearGradientColorObject#y2
* @type {number}
*/
/**
 * Defines the center position and the radius for a gradient.
 *
 * @interface Highcharts.RadialGradientColorObject
 */ /**
* Center horizontal position relative to the shape. Float ranges 0-1.
* @name Highcharts.RadialGradientColorObject#cx
* @type {number}
*/ /**
* Center vertical position relative to the shape. Float ranges 0-1.
* @name Highcharts.RadialGradientColorObject#cy
* @type {number}
*/ /**
* Radius relative to the shape. Float ranges 0-1.
* @name Highcharts.RadialGradientColorObject#r
* @type {number}
*/
import U from './Utilities.js';
var isNumber = U.isNumber, merge = U.merge, pInt = U.pInt;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Handle color operations. Some object methods are chainable.
 *
 * @class
 * @name Highcharts.Color
 *
 * @param {Highcharts.ColorType} input
 * The input color in either rbga or hex format
 */
var Color = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function Color(input) {
        // Collection of parsers. This can be extended from the outside by pushing
        // parsers to Highcharts.Color.prototype.parsers.
        this.parsers = [{
                // RGBA color
                // eslint-disable-next-line max-len
                regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
                parse: function (result) {
                    return [
                        pInt(result[1]),
                        pInt(result[2]),
                        pInt(result[3]),
                        parseFloat(result[4], 10)
                    ];
                }
            }, {
                // RGB color
                regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
                parse: function (result) {
                    return [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
                }
            }];
        this.rgba = [];
        // Backwards compatibility, allow instanciation without new (#13053)
        if (!(this instanceof Color)) {
            return new Color(input);
        }
        this.init(input);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates a color instance out of a color string or object.
     *
     * @function Highcharts.Color.parse
     *
     * @param {Highcharts.ColorType} input
     * The input color in either rbga or hex format.
     *
     * @return {Highcharts.Color}
     * Color instance.
     */
    Color.parse = function (input) {
        return new Color(input);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Parse the input color to rgba array
     *
     * @private
     * @function Highcharts.Color#init
     *
     * @param {Highcharts.ColorType} input
     *        The input color in either rbga or hex format
     *
     * @return {void}
     */
    Color.prototype.init = function (input) {
        var result, rgba, i, parser, len;
        this.input = input = Color.names[input && input.toLowerCase ?
            input.toLowerCase() :
            ''] || input;
        // Gradients
        if (input && input.stops) {
            this.stops = input.stops.map(function (stop) {
                return new Color(stop[1]);
            });
            // Solid colors
        }
        else {
            // Bitmasking as input[0] is not working for legacy IE.
            if (input &&
                input.charAt &&
                input.charAt() === '#') {
                len = input.length;
                input = parseInt(input.substr(1), 16);
                // Handle long-form, e.g. #AABBCC
                if (len === 7) {
                    rgba = [
                        (input & 0xFF0000) >> 16,
                        (input & 0xFF00) >> 8,
                        (input & 0xFF),
                        1
                    ];
                    // Handle short-form, e.g. #ABC
                    // In short form, the value is assumed to be the same
                    // for both nibbles for each component. e.g. #ABC = #AABBCC
                }
                else if (len === 4) {
                    rgba = [
                        (((input & 0xF00) >> 4) |
                            (input & 0xF00) >> 8),
                        (((input & 0xF0) >> 4) |
                            (input & 0xF0)),
                        ((input & 0xF) << 4) | (input & 0xF),
                        1
                    ];
                }
            }
            // Otherwise, check regex parsers
            if (!rgba) {
                i = this.parsers.length;
                while (i-- && !rgba) {
                    parser = this.parsers[i];
                    result = parser.regex.exec(input);
                    if (result) {
                        rgba = parser.parse(result);
                    }
                }
            }
        }
        this.rgba = rgba || [];
    };
    /**
     * Return the color or gradient stops in the specified format
     *
     * @function Highcharts.Color#get
     *
     * @param {string} [format]
     *        Possible values are 'a', 'rgb', 'rgba' (default).
     *
     * @return {Highcharts.ColorType}
     *         This color as a string or gradient stops.
     */
    Color.prototype.get = function (format) {
        var input = this.input, rgba = this.rgba, ret;
        if (typeof this.stops !== 'undefined') {
            ret = merge(input);
            ret.stops = [].concat(ret.stops);
            this.stops.forEach(function (stop, i) {
                ret.stops[i] = [
                    ret.stops[i][0],
                    stop.get(format)
                ];
            });
            // it's NaN if gradient colors on a column chart
        }
        else if (rgba && isNumber(rgba[0])) {
            if (format === 'rgb' || (!format && rgba[3] === 1)) {
                ret = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
            }
            else if (format === 'a') {
                ret = rgba[3];
            }
            else {
                ret = 'rgba(' + rgba.join(',') + ')';
            }
        }
        else {
            ret = input;
        }
        return ret;
    };
    /**
     * Brighten the color instance.
     *
     * @function Highcharts.Color#brighten
     *
     * @param {number} alpha
     *        The alpha value.
     *
     * @return {Highcharts.Color}
     *         This color with modifications.
     */
    Color.prototype.brighten = function (alpha) {
        var i, rgba = this.rgba;
        if (this.stops) {
            this.stops.forEach(function (stop) {
                stop.brighten(alpha);
            });
        }
        else if (isNumber(alpha) && alpha !== 0) {
            for (i = 0; i < 3; i++) {
                rgba[i] += pInt(alpha * 255);
                if (rgba[i] < 0) {
                    rgba[i] = 0;
                }
                if (rgba[i] > 255) {
                    rgba[i] = 255;
                }
            }
        }
        return this;
    };
    /**
     * Set the color's opacity to a given alpha value.
     *
     * @function Highcharts.Color#setOpacity
     *
     * @param {number} alpha
     *        Opacity between 0 and 1.
     *
     * @return {Highcharts.Color}
     *         Color with modifications.
     */
    Color.prototype.setOpacity = function (alpha) {
        this.rgba[3] = alpha;
        return this;
    };
    /**
     * Return an intermediate color between two colors.
     *
     * @function Highcharts.Color#tweenTo
     *
     * @param {Highcharts.Color} to
     *        The color object to tween to.
     *
     * @param {number} pos
     *        The intermediate position, where 0 is the from color (current
     *        color item), and 1 is the `to` color.
     *
     * @return {Highcharts.ColorString}
     *         The intermediate color in rgba notation.
     */
    Color.prototype.tweenTo = function (to, pos) {
        // Check for has alpha, because rgba colors perform worse due to lack of
        // support in WebKit.
        var fromRgba = this.rgba, toRgba = to.rgba, hasAlpha, ret;
        // Unsupported color, return to-color (#3920, #7034)
        if (!toRgba.length || !fromRgba || !fromRgba.length) {
            ret = to.input || 'none';
            // Interpolate
        }
        else {
            hasAlpha = (toRgba[3] !== 1 || fromRgba[3] !== 1);
            ret = (hasAlpha ? 'rgba(' : 'rgb(') +
                Math.round(toRgba[0] + (fromRgba[0] - toRgba[0]) * (1 - pos)) +
                ',' +
                Math.round(toRgba[1] + (fromRgba[1] - toRgba[1]) * (1 - pos)) +
                ',' +
                Math.round(toRgba[2] + (fromRgba[2] - toRgba[2]) * (1 - pos)) +
                (hasAlpha ?
                    (',' +
                        (toRgba[3] + (fromRgba[3] - toRgba[3]) * (1 - pos))) :
                    '') +
                ')';
        }
        return ret;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    // Collection of named colors. Can be extended from the outside by adding
    // colors to Highcharts.Color.names.
    Color.names = {
        white: '#ffffff',
        black: '#000000'
    };
    return Color;
}());
H.Color = Color;
/**
 * Creates a color instance out of a color string.
 *
 * @function Highcharts.color
 *
 * @param {Highcharts.ColorType} input
 *        The input color in either rbga or hex format
 *
 * @return {Highcharts.Color}
 *         Color instance
 */
H.color = Color.parse;
export default H.Color;
