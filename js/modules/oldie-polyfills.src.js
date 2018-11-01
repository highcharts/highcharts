/**
 * (c) 2010-2018 Torstein Honsi
 *
 * Simple polyfills for array functions in old IE browsers (6, 7 and 8) in
 * Highcharts v7+. These polyfills are sufficient for Highcharts to work, but
 * for fully compatible polyfills, see MDN.
 *
 * License: www.highcharts.com/license
 */
/* eslint no-extend-native: 0 */

'use strict';

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, ctx) {
        var i = 0,
            len = this.length;
        for (; i < len; i++) {
            if (
                this[i] !== undefined && // added check
                fn.call(ctx, this[i], i, this) === false
            ) {
                return i;
            }
        }
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function (fn) {
        var results = [],
            i = 0,
            len = this.length;

        for (; i < len; i++) {
            results[i] = fn.call(this[i], this[i], i, this);
        }

        return results;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (member, fromIndex) {
        var arr = this, // #8874
            len,
            i = fromIndex || 0; // #8346

        if (arr) {
            len = arr.length;

            for (; i < len; i++) {
                if (arr[i] === member) {
                    return i;
                }
            }
        }

        return -1;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fn) {
        var ret = [],
            i = 0,
            length = this.length;

        for (; i < length; i++) {
            if (fn(this[i], i)) {
                ret.push(this[i]);
            }
        }

        return ret;
    };
}

if (!Array.prototype.some) {
    Array.prototype.some = function (fn, ctx) { // legacy
        var i = 0,
            len = this.length;

        for (; i < len; i++) {
            if (fn.call(ctx, this[i], i, this) === true) {
                return true;
            }
        }
        return false;
    };
}

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (func, initialValue) {
        var context = this,
            i = arguments.length > 1 ? 0 : 1,
            accumulator = arguments.length > 1 ? initialValue : this[0],
            len = this.length;
        for (; i < len; ++i) {
            accumulator = func.call(context, accumulator, this[i], i, this);
        }
        return accumulator;
    };
}

if (!Object.keys) {
    Object.keys = function (obj) {
        var result = [],
            hasOwnProperty = Object.prototype.hasOwnProperty,
            prop;
        for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
                result.push(prop);
            }
        }
        return result;
    };
}

