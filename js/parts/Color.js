/**
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * A valid color to be parsed and handled by Highcharts. Highcharts internally
 * supports hex colors like `#ffffff`, rgb colors like `rgb(255,255,255)` and
 * rgba colors like `rgba(255,255,255,1)`. Other colors may be supported by the
 * browsers and displayed correctly, but Highcharts is not able to process them
 * and apply concepts like opacity and brightening.
 *
 * @typedef {string} Highcharts.ColorString
 */

'use strict';

import H from './Globals.js';
import './Utilities.js';

var isNumber = H.isNumber,
    merge = H.merge,
    pInt = H.pInt;

/**
 * Handle color operations. The object methods are chainable.
 *
 * @private
 * @class
 * @name Highcharts.Color
 *
 * @param {Highcharts.ColorString} input
 *        The input color in either rbga or hex format
 */
H.Color = function (input) {
    // Backwards compatibility, allow instanciation without new
    if (!(this instanceof H.Color)) {
        return new H.Color(input);
    }
    // Initialize
    this.init(input);
};
H.Color.prototype = {

    // Collection of parsers. This can be extended from the outside by pushing
    // parsers to Highcharts.Color.prototype.parsers.
    parsers: [{
        // RGBA color
        regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/, // eslint-disable-line security/detect-unsafe-regex
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
        regex:
            /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
        parse: function (result) {
            return [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
        }
    }],

    // Collection of named colors. Can be extended from the outside by adding
    // colors to Highcharts.Color.prototype.names.
    names: {
        white: '#ffffff',
        black: '#000000'
    },

    /**
     * Parse the input color to rgba array
     *
     * @private
     * @function Highcharts.Color#init
     *
     * @param {Highcharts.ColorString} input
     *        The input color in either rbga or hex format
     */
    init: function (input) {
        var result,
            rgba,
            i,
            parser,
            len;

        this.input = input = this.names[
            input && input.toLowerCase ?
                input.toLowerCase() :
                ''
        ] || input;

        // Gradients
        if (input && input.stops) {
            this.stops = input.stops.map(function (stop) {
                return new H.Color(stop[1]);
            });

        // Solid colors
        } else {

            // Bitmasking as input[0] is not working for legacy IE.
            if (input && input.charAt && input.charAt() === '#') {

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
                } else if (len === 4) {

                    rgba = [
                        ((input & 0xF00) >> 4) | (input & 0xF00) >> 8,
                        ((input & 0xF0) >> 4) | (input & 0xF0),
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
    },

    /**
     * Return the color in the specified format
     *
     * @function Highcharts.Color#get
     *
     * @param {string} format
     *        Possible values are 'a', 'rgb', undefined
     *
     * @return {Highcharts.ColorString}
     *         This color as a string.
     */
    get: function (format) {
        var input = this.input,
            rgba = this.rgba,
            ret;

        if (this.stops) {
            ret = merge(input);
            ret.stops = [].concat(ret.stops);
            this.stops.forEach(function (stop, i) {
                ret.stops[i] = [ret.stops[i][0], stop.get(format)];
            });

        // it's NaN if gradient colors on a column chart
        } else if (rgba && isNumber(rgba[0])) {
            if (format === 'rgb' || (!format && rgba[3] === 1)) {
                ret = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
            } else if (format === 'a') {
                ret = rgba[3];
            } else {
                ret = 'rgba(' + rgba.join(',') + ')';
            }
        } else {
            ret = input;
        }
        return ret;
    },

    /**
     * Brighten the color instance.
     *
     * @function Highcharts.Color#brighten
     *
     * @param {number} alpha
     *        The alpha value.
     *
     * @return {Highcharts.ColorString}
     *         This color with modifications.
     */
    brighten: function (alpha) {
        var i,
            rgba = this.rgba;

        if (this.stops) {
            this.stops.forEach(function (stop) {
                stop.brighten(alpha);
            });

        } else if (isNumber(alpha) && alpha !== 0) {
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
    },

    /**
     * Set the color's opacity to a given alpha value.
     *
     * @function Highcharts.Color#setOpacity
     *
     * @param {number} alpha
     *        Opacity between 0 and 1.
     *
     * @return {Highcharts.ColorString}
     *         Color with modifications.
     */
    setOpacity: function (alpha) {
        this.rgba[3] = alpha;
        return this;
    },

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
    tweenTo: function (to, pos) {
        // Check for has alpha, because rgba colors perform worse due to lack of
        // support in WebKit.
        var fromRgba = this.rgba,
            toRgba = to.rgba,
            hasAlpha,
            ret;

        // Unsupported color, return to-color (#3920, #7034)
        if (!toRgba.length || !fromRgba || !fromRgba.length) {
            ret = to.input || 'none';

        // Interpolate
        } else {
            hasAlpha = (toRgba[3] !== 1 || fromRgba[3] !== 1);
            ret = (hasAlpha ? 'rgba(' : 'rgb(') +
                Math.round(toRgba[0] + (fromRgba[0] - toRgba[0]) * (1 - pos)) +
                ',' +
                Math.round(toRgba[1] + (fromRgba[1] - toRgba[1]) * (1 - pos)) +
                ',' +
                Math.round(toRgba[2] + (fromRgba[2] - toRgba[2]) * (1 - pos)) +
                (
                    hasAlpha ?
                        (
                            ',' +
                            (toRgba[3] + (fromRgba[3] - toRgba[3]) * (1 - pos))
                        ) :
                        ''
                ) +
                ')';
        }
        return ret;
    }
};

/**
 * Creates a color instance out of a color string.
 *
 * @private
 * @function Highcharts.color
 *
 * @param {Highcharts.ColorString} input
 *        The input color in either rbga or hex format
 */
H.color = function (input) {
    return new H.Color(input);
};
