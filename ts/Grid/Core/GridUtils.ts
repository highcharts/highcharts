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
 *  - Dawid Dragula
 *
 * */

import AST from '../../Core/Renderer/HTML/AST.js';
import U from '../../Core/Utilities.js';
const {
    isObject
} = U;

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
    formatText
} as const;
