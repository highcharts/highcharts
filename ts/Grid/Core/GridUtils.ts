/* *
 *
 *  Grid utilities
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */

import type CSSObject from '../../Core/Renderer/CSSObject';

import AST from '../../Core/Renderer/HTML/AST.js';
import { isObject } from '../../Shared/Utilities.js';

AST.allowedAttributes.push(
    'srcset',
    'media'
);

AST.allowedTags.push(
    'picture',
    'source'
);


/* *
 *
 *  Declarations
 *
 * */

/**
 * The event object for the grid.
 */
export interface GridEvent<T, E extends Event = Event> {
    /**
     * The original browser event.
     */
    originalEvent?: E;
    /**
     * The target of the event.
     */
    target: T;
}

/**
 * The event listener for the grid.
 */
export interface GridEventListener {
    eventName: keyof HTMLElementEventMap;
    listener: EventListener;
}

/**
 * Parameters for the makeHTMLElement utils function.
 */
export interface MakeHTMLElementParameters {
    className?: string;
    id?: string;
    innerText?: string;
    innerHTML?: string;
    style?: Partial<CSSStyleDeclaration>;
}

/**
 * A style object or callback returning one.
 */
export type StyleValue<T> = CSSObject | ((this: T, target: T) => CSSObject);


/* *
*
*  Functions
*
* */

/**
 * Creates a HTML element with the provided options.
 *
 * @param tagName
 * The tag name of the element.
 *
 * @param params
 * The parameters of the element.
 *
 * @param parent
 * The parent element.
 */
export function makeHTMLElement<T extends HTMLElement>(
    tagName: string,
    params?: MakeHTMLElementParameters,
    parent?: HTMLElement
): T {
    const element = document.createElement(tagName);

    if (params) {
        const paramsKeys = Object.keys(
            params
        ) as (keyof MakeHTMLElementParameters)[];

        for (let i = 0; i < paramsKeys.length; i++) {
            const key = paramsKeys[i];
            const value = params[key];

            if (value !== void 0) {
                if (key === 'style') {
                    Object.assign(element.style, value);
                } else {
                    element[key] = value as string;
                }
            }
        }
    }

    if (parent) {
        parent.appendChild(element);
    }

    return element as T;
}

/**
 * Creates a div element with the provided class name and id.
 *
 * @param className
 * The class name of the div.
 *
 * @param id
 * The id of the element.
 */
export function makeDiv(className: string, id?: string): HTMLElement {
    return makeHTMLElement('div', { className, id });
}

/**
 * Check if there's a possibility that the given string is an HTML
 * (contains '<').
 *
 * @param str
 * Text to verify.
 */
export function isHTML(str: string): boolean {
    return str.indexOf('<') !== -1;
}

/**
 * Returns a string containing plain text format by removing HTML tags
 *
 * @param text
 * String to be sanitized
 *
 * @returns
 * Sanitized plain text string
 */
export function sanitizeText(text: string): string {
    try {
        return new DOMParser().parseFromString(text, 'text/html')
            .body.textContent || '';
    } catch {
        return '';
    }
}

/**
 * Sets an element's content, checking whether it is HTML or plain text.
 * Should be used instead of element.innerText when the content can be HTML.
 *
 * @param element
 * Parent element where the content should be.
 *
 * @param content
 * Content to render.
 */
export function setHTMLContent(
    element: HTMLElement,
    content: string
): void {
    if (isHTML(content)) {
        element.innerHTML = AST.emptyHTML;
        const formattedNodes = new AST(content);
        formattedNodes.addToDOM(element);
    } else {
        element.innerText = content;
    }
}

/**
 * Creates a proxy that, when reading a property, first returns the value
 * from the original options of a given entity; if it is not defined, it
 * falls back to the value from the defaults (default options), recursively
 * for nested objects. Setting values on the proxy will change the original
 * options object (1st argument), not the defaults (2nd argument).
 *
 * @param options
 * The specific options object.
 *
 * @param defaultOptions
 * The default options to fall back to.
 *
 * @returns
 * A proxy that provides merged access to options and defaults.
 */
export function createOptionsProxy<T extends object>(
    options: T,
    defaultOptions: Partial<T> = {}
): T {
    const handler = <U extends object>(
        defaults: Partial<U> = {}
    ): ProxyHandler<U> => ({
        get(target: U, prop: string): unknown {
            const targetValue = target[prop as keyof U];
            const defaultValue = defaults[prop as keyof U];

            if (isObject(targetValue, true)) {
                return new Proxy(
                    targetValue,
                    handler(defaultValue ?? {})
                );
            }
            return targetValue ?? defaultValue;
        },
        set(target: U, prop: string, value: U[keyof U]): boolean {
            target[prop as keyof U] = value;
            return true;
        },
        deleteProperty(target: U, prop: string): boolean {
            delete target[prop as keyof U];
            return true;
        }
    });

    return new Proxy(options, handler(defaultOptions));
}

/**
 * Format text with placeholders. Used for lang texts.
 *
 * @param template The text template with placeholders
 * @param values Object containing values to replace placeholders
 * @returns Formatted text
 */
export function formatText(
    template: string,
    values: Record<string, string | number>
): string {
    return template.replace(/\{(\w+)\}/g, (match, key): string => (
        values[key] !== void 0 ? String(values[key]) : match
    ));
}

/**
 * Checks whether two objects have the same own keys and values.
 *
 * Supports nested plain objects and arrays. Functions are compared by
 * reference.
 *
 * @param left
 * The first object to compare.
 *
 * @param right
 * The second object to compare.
 *
 * @returns
 * `true` when both objects are equal, otherwise `false`.
 */
export function isDeepEqual(left: unknown, right: unknown): boolean {
    if (left === right) {
        return true;
    }

    if (left instanceof RegExp || right instanceof RegExp) {
        return (
            left instanceof RegExp &&
            right instanceof RegExp &&
            left.source === right.source &&
            left.flags === right.flags
        );
    }

    if (!isObject(left) || !isObject(right)) {
        return false;
    }

    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;

    if ('nodeType' in leftRecord || 'nodeType' in rightRecord) {
        return false;
    }

    if (Array.isArray(left) || Array.isArray(right)) {
        if (!Array.isArray(left) || !Array.isArray(right)) {
            return false;
        }

        if (left.length !== right.length) {
            return false;
        }
    }

    const leftKeys = Object.keys(left).filter(function (key): boolean {
        return key !== '__proto__' && key !== 'constructor';
    });
    const rightKeys = Object.keys(right).filter(function (key): boolean {
        return key !== '__proto__' && key !== 'constructor';
    });

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    for (let i = 0, iEnd = leftKeys.length; i < iEnd; ++i) {
        const key = leftKeys[i];

        if (!(key in rightRecord)) {
            return false;
        }

        if (!isDeepEqual(leftRecord[key], rightRecord[key])) {
            return false;
        }
    }

    return true;
}

/**
 * Resolves a style value that can be static or callback based.
 *
 * @param style
 * Style object or callback returning one.
 *
 * @param target
 * Runtime target used as callback context and first argument.
 *
 * @returns
 * A resolved style object or `undefined`.
 */
export function resolveStyleValue<T>(
    style?: StyleValue<T>,
    target?: T
): (CSSObject | undefined) {
    if (!style) {
        return;
    }

    if (typeof style === 'function') {
        if (!target) {
            return;
        }

        return style.call(target, target);
    }

    return style;
}

/**
 * Resolves and merges style values in order.
 *
 * @param target
 * Runtime target used as callback context and first argument.
 *
 * @param styleValues
 * Style values to merge in order, where latter entries override former.
 *
 * @returns
 * Merged style object.
 */
export function mergeStyleValues<T>(
    target: T,
    ...styleValues: Array<(StyleValue<T> | undefined)>
): CSSObject {
    const mergedStyle: CSSObject = {};

    for (const styleValue of styleValues) {
        const resolvedStyle = resolveStyleValue(styleValue, target);
        if (resolvedStyle) {
            Object.assign(mergedStyle, resolvedStyle);
        }
    }

    return mergedStyle;
}

/**
 * Waits for the next animation frame.
 */
export function waitForAnimationFrame(): Promise<void> {
    return new Promise((resolve): void => {
        requestAnimationFrame((): void => resolve());
    });
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    makeHTMLElement,
    makeDiv,
    isHTML,
    sanitizeText,
    setHTMLContent,
    createOptionsProxy,
    formatText,
    isDeepEqual,
    resolveStyleValue,
    mergeStyleValues,
    waitForAnimationFrame
} as const;
