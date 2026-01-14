// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/polyfills
 *
 * (c) 2009-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
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
if (!Array.prototype.fill) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.fill = function <T> (
        value: T,
        start?: number,
        end?: number
    ): T[] {
        const O = Object(this),
            len = O.length >>> 0,
            relativeStart = Number(start) || 0;

        let k = relativeStart === -Infinity ? 0 : relativeStart < 0 ?
            Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

        const relativeEnd = end === void 0 ? len : Number(end),
            final = relativeEnd === -Infinity ? 0 : relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

        while (k < final) {
            O[k++] = value;
        }
        return O;
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

const ElementPrototype = window.Element.prototype;

if (typeof ElementPrototype.matches !== 'function') {
    ElementPrototype.matches = function matches(selector: string): boolean {
        let element = this;
        const elements = element.ownerDocument.querySelectorAll(selector);
        let index = 0;
        while (elements[index] && elements[index] !== element) {
            ++index;
        }
        return Boolean(elements[index]);
    };
}

if (typeof ElementPrototype.closest !== 'function') {
    ElementPrototype.closest = function closest(
        selector: keyof HTMLElementTagNameMap
    ): Element | null {
        let element: Element | null = this;
        while (element && element.nodeType === 1) {
            if (element?.matches(selector)) {
                return element;
            }
            element = (element.parentNode as Element | null) || null;
        }
        return null;
    };
}

(function () {
    if (
        typeof window === 'undefined' ||
        window.CustomEvent ||
        !window.document ||
        !window.Event
    ) {
        return false;
    }

    function CustomEvent(type: string, params?: CustomEventInit) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = window.document.createEvent('CustomEvent');
        evt.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent as any;
})();

// Replace \p{L} with language ranges and remove 'u' flag, #23462.
(function (): void {
    const languages =
        'a-zA-Z' + // ASCII
        '\u00C0-\u017F' + // Latin Extended
        '\u0370-\u03FF' + // Greek
        '\u0400-\u04FF\u0500-\u052F' + // Cyrillic
        '\u0590-\u05FF' + // Hebrew
        '\u0600-\u06FF\u0750-\u077F' + // Arabic + Extended
        '\u0900-\u097F' + // Devanagari
        '\u3040-\u30FF' + // Hiragana + Katakana
        '\u3130-\u318F\uAC00-\uD7AF' + // Hangul Jamo + Syllables
        '\u4E00-\u9FFF'; // CJK Unified Ideographs

    const OriginalRegExp = RegExp;

    (window as any).RegExp = function (
        pattern: string | RegExp,
        flags?: string
    ): RegExp {
        let source = typeof pattern === 'string' ? pattern : pattern.source,
            finalFlags =
            flags !== undefined
                ? flags
                : typeof pattern !== 'string'
                    ? pattern.flags
                    : '';

        if (source.indexOf('\\p{L}') !== -1) {
            source = source.replace(/\\p\{L\}/g, languages);
            if (finalFlags) {
                finalFlags = finalFlags.replace('u', '');
            }
        }

        if (typeof finalFlags !== 'string') {
            finalFlags = '';
        }

        return new OriginalRegExp(source, finalFlags);
    };

    (window as any).RegExp.prototype = (OriginalRegExp as any).prototype;
})();