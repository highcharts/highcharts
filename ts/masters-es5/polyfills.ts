// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/polyfills
 *
 * (c) 2009-2026 Highsoft AS
 * Author: Torstein Hønsi
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
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

// Replace \p{L} and \p{M} with language ranges and remove 'u' flag, #23462.
(function (): void {
    const languages =
        'a-zA-Z' + // ASCII
        '\u00C0-\u017F' + // Latin Extended
        '\u0370-\u03FF' + // Greek
        '\u0400-\u04FF\u0500-\u052F' + // Cyrillic
        '\u0590-\u05FF' + // Hebrew
        '\u0600-\u06FF\u0750-\u077F' + // Arabic + Extended
        '\u0900-\u097F' + // Devanagari
        '\u0980-\u09FF' + // Bengali
        '\u3040-\u30FF' + // Hiragana + Katakana
        '\u3130-\u318F\uAC00-\uD7AF' + // Hangul Jamo + Syllables
        '\u4E00-\u9FFF'; // CJK Unified Ideographs

    const combiningMarks =
        '\u0300-\u036F' + // Combining Diacritical Marks
        '\u0483-\u0489' +
        '\u0591-\u05C7' + // Hebrew
        '\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED' + // Arabic
        '\u09BC\u09BE-\u09C4\u09C7-\u09C8\u09CB-\u09CD\u09D7\u09E2-\u09E3'; // Bengali

    const decimalDigits =
        '0-9' +
        '\\u0660-\\u0669' +  // Arabic-Indic
        '\\u06F0-\\u06F9' +  // Farsi
        '\\u09E6-\\u09EF' +  // Bengali
        '\\u0966-\\u096F' +  // Devanagari
        '\\u0A66-\\u0A6F' +  // Gurmukhi
        '\\u0AE6-\\u0AEF' +  // Gujarati
        '\\u0B66-\\u0B6F' +  // Oriya
        '\\u0B66-\\u0B6F' +  // Tamil
        '\\u0BE6-\\u0BEF' +  // Telugu
        '\\u0C66-\\u0C6F' +  // Kannada
        '\\u0CE6-\\u0CEF' +  // Malayalam
        '\\u0D58-\\u0D5E' +  // Malayalam (archaic)
        '\\u0E50-\\u0E59' +  // Thai
        '\\u0ED0-\\u0ED9' +  // Lao
        '\\u0F20-\\u0F29' +  // Tibetan
        '\\u1040-\\u1049' +  // Myanmar
        '\\u1090-\\u1099' +  // Myanmar (Shan)
        '\\u17E0-\\u17E9' +  // Khmer
        '\\u1810-\\u1819' +  // Mongolian
        '\\u1946-\\u194F' +  // Limbu
        '\\u19D0-\\u19D9' +  // New Tai Lue
        '\\u1A80-\\u1A89' +  // Tai Tham
        '\\u1A90-\\u1A99' +  // Tai Tham
        '\\u1B50-\\u1B59' +  // Balinese
        '\\u1BB0-\\u1BB9' +  // Sundanese
        '\\u1C40-\\u1C49' +  // Lepcha
        '\\u1C50-\\u1C59' +  // Ol Chiki
        '\\u2070' +          // Superscript zero
        '\\u2074-\\u2079' +  // Superscript digits
        '\\u2080-\\u2089' +  // Subscript digits
        '\\u2150-\\u2182' +  // Number forms
        '\\u2185-\\u2189' +  // Roman numerals
        '\\u3007' +          // Ideographic number zero
        '\\u3021-\\u3029' +  // CJK numerals
        '\\u3038-\\u303A' +  // CJK numerals
        '\\uA620-\\uA629' +  // Vai
        '\\uA6E6-\\uA6EF' +  // Bamum
        '\\uA8D0-\\uA8D9' +  // Saurashtra
        '\\uA900-\\uA909' +  // Kayah Li
        '\\uA9D0-\\uA9D9' +  // Javanese
        '\\uA9F0-\\uA9F9' +  // Myanmar (Kawi)
        '\\uAA50-\\uAA59' +  // Cham
        '\\uABF0-\\uABF9' +  // Meetei Mayek
        '\\uFF10-\\uFF19';   // Full-width digits


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

        if (source.indexOf('\\p{M}') !== -1) {
            source = source.replace(/\\p\{M\}/g, combiningMarks);
            if (finalFlags) {
                finalFlags = finalFlags.replace('u', '');
            }
        }

        if (source.indexOf('\\p{Nd}') !== -1) {
            source = source.replace(/\\p\{Nd\}/g, decimalDigits);
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