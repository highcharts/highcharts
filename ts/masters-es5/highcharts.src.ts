/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../masters/highcharts.src.js';
import MSPointer from '../Core/MSPointer.js';
declare global {
    interface Math {
        sign(x: number): number;
    }
    interface ObjectConstructor {
        setPrototypeOf<T>(o: T, proto: object | null): T;
    }
}
const G: AnyRecord = Highcharts;
if (MSPointer.isRequired()) {
    G.Pointer = MSPointer;
    MSPointer.compose(G.Chart);
}
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
// Default Export
export default G;
