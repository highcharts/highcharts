/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/polyfills
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
if (!Array.prototype.includes) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.includes = function <T> (
        searchElement: T,
        fromIndex?: number
    ): boolean {
        return this.indexOf(searchElement, fromIndex) > -1;
    };
}
if (!Array.prototype.find) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.find = function <T> (
        predicate: (search: T, index: number, array: any[]) => boolean,
        thisArg?: T
    ): T | undefined {
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
    };
}
if (!Object.entries) {
    Object.entries = function <T> (obj: Record<string, T>): Array<[string, T]> {
        const keys = Object.keys(obj),
            iEnd = keys.length,
            entries = [] as Array<[string, T]>;

        for (let i = 0; i < iEnd; ++i) {
            entries.push([keys[i], obj[keys[i]]]);
        }

        return entries;
    };
}
if (!Object.values) {
    Object.values = function <T>(obj: Record<string, T>): Array<T> {
        const keys = Object.keys(obj),
            iEnd = keys.length,
            values = [] as Array<T>;

        for (let i = 0; i < iEnd; ++i) {
            values.push(obj[keys[i]]);
        }

        return values;
    };
}

(function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(type: string, params?: CustomEventInit) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent as any;
})();
