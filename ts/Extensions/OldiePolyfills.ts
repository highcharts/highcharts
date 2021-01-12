/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  Simple polyfills for array functions in old IE browsers (6, 7 and 8) in
 *  Highcharts v7+. These polyfills are sufficient for Highcharts to work, but
 *  for fully compatible polyfills, see MDN.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* global document */

'use strict';

interface Array<T> {
    filter(callbackfn: ArrayFilterCallbackFunction<T>): Array<T>;
    some<TScope = any>(
        callbackfn: ArraySomeCallbackFunction<T, TScope>,
        thisArg?: TScope
    ): boolean;
    forEach<TScope = any>(
        callbackfn: ArrayForEachCallbackFunction<T, TScope>,
        thisArg?: TScope
    ): void;
    indexOf(searchElement: T, fromIndex?: number): number;
    map<TOutput>(
        callbackfn: ArrayMapCallbackFunction<T, TOutput>
    ): Array<TOutput>;
    reduce(callbackfn: ArrayReduceCallbackFunction<T>, initialValue?: T): T;
}
interface ArrayFilterCallbackFunction<T> {
    (value: T, index: number, array: Array<T>): boolean;
}
interface ArrayForEachCallbackFunction<T, TScope = any> {
    (this: TScope, value: T, index: number, array: Array<T>): void;
}
interface ArrayMapCallbackFunction<TInput, TOutput> {
    (value: TInput, index: number, array: Array<TInput>): TOutput;
}
interface ArrayReduceCallbackFunction<T> {
    (
        previousValue: T,
        currentValue: T,
        currentIndex: number,
        array: Array<T>
    ): T;
}
interface ArraySomeCallbackFunction<T, TScope = any> {
    (this: TScope, value: T, index: number, array: Array<T>): boolean;
}

/* eslint-disable no-extend-native */
if (!String.prototype.trim) {
    String.prototype.trim = function (): string {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function<T, TScope = any> (
        this: Array<T>,
        fn: ArrayForEachCallbackFunction<T>,
        thisArg?: TScope
    ): void {
        var i = 0,
            len = this.length;

        for (; i < len; i++) {
            if (
                typeof this[i] !== 'undefined' && // added check
                fn.call(thisArg, this[i], i, this) as any === false
            ) {
                return i as any;
            }
        }
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function<TInput, TOutput> (
        this: Array<TInput>,
        fn: ArrayMapCallbackFunction<TInput, TOutput>
        // @todo support optional ctx
    ): Array<TOutput> {
        var results = [] as Array<TOutput>,
            i = 0,
            len = this.length;

        for (; i < len; i++) {
            results[i] = fn.call(this[i], this[i], i, this);
        }

        return results;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function<T> (
        this: Array<T>,
        member: T,
        fromIndex?: number
    ): number {
        var arr = this, // #8874
            len: number,
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
    Array.prototype.filter = function<T> (
        this: Array<T>,
        fn: ArrayFilterCallbackFunction<T>
        // @todo support optional ctx
    ): Array<T> {
        var ret = [] as Array<T>,
            i = 0,
            length = this.length;

        for (; i < length; i++) {
            if ((fn as any)(this[i], i)) {
                ret.push(this[i]);
            }
        }

        return ret;
    };
}

if (!Array.prototype.some) {
    Array.prototype.some = function<T, TScope = any> (
        this: Array<T>,
        fn: ArraySomeCallbackFunction<T>,
        thisArg?: TScope
    ): boolean { // legacy
        var i = 0,
            len = this.length;

        for (; i < len; i++) {
            if (fn.call(thisArg, this[i], i, this) === true) {
                return true;
            }
        }
        return false;
    };
}

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function<T> (
        this: Array<T>,
        func: ArrayReduceCallbackFunction<T>,
        initialValue?: T
    ): T {
        var context = this,
            i = arguments.length > 1 ? 0 : 1,
            accumulator = arguments.length > 1 ? initialValue : this[0],
            len = this.length;

        for (; i < len; ++i) {
            accumulator = func.call(
                context,
                accumulator as any,
                this[i],
                i,
                this
            );
        }
        return accumulator as any;
    };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function (): Function {
        const thatFunc = this;
        const thatArg = arguments[0];
        const args = Array.prototype.slice.call(arguments, 1);
        if (typeof thatFunc !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - ' +
                'what is trying to be bound is not callable');
        }
        return function (): unknown {
            const funcArgs = args.concat(Array.prototype.slice.call(arguments));
            return thatFunc.apply(thatArg, funcArgs);
        };
    };
}

// Adapted from https://johnresig.com/blog/objectgetprototypeof/
if (!Object.getPrototypeOf) {
    if (typeof ('test' as any).__proto__ === 'object') { // eslint-disable-line no-proto
        Object.getPrototypeOf = function (object): any {
            return (object as any).__proto__; // eslint-disable-line no-proto
        };
    } else {
        Object.getPrototypeOf = function (object): any {
            const proto = object.constructor.prototype;
            if (proto === object) {
                return {}.constructor.prototype;
            }
            // May break if the constructor has been tampered with
            return proto;
        };
    }
}

if (!Object.keys) {
    Object.keys = function (
        this: Record<string, any>,
        obj: object
    ): Array<string> {
        var result = [] as Array<string>,
            prop: (number|string|symbol);

        for (prop in obj) {
            if (Object.hasOwnProperty.call(obj, prop)) {
                result.push(prop);
            }
        }
        return result;
    };
}

// Add a getElementsByClassName function if the browser doesn't have one
// Limitation: only works with one class name
// Copyright: Eike Send https://eike.se/nd
// License: MIT License
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (
        search: string
    ): any {
        var d = document,
            elements,
            pattern,
            i,
            results = [];

        if (d.querySelectorAll) { // IE8
            return d.querySelectorAll('.' + search);
        }
        if (d.evaluate) { // IE6, IE7
            pattern = './/*[contains(concat(\' \', @class, \' \'), \' ' +
                search + ' \')]';
            elements = d.evaluate(pattern, d, null, 0, null);
            while ((i = elements.iterateNext())) {
                results.push(i);
            }
        } else {
            elements = d.getElementsByTagName('*');
            pattern = new RegExp('(^|\\s)' + search + '(\\s|$)');
            for (i = 0; i < elements.length; i++) {
                if (pattern.test(elements[i].className)) {
                    results.push(elements[i]);
                }
            }
        }
        return results;
    };
}
