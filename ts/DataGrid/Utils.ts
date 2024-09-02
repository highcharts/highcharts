/* *
 *
 *  Data Grid utilities
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


/* *
 *
 *  Namespace
 *
 * */

namespace DataGridUtils {

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Parameters for the makeHTMLElement utils function.
     */
    export interface MakeHTMLElementParameters {
        className?: string;
        id?: string;
        innerText?: string;
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
     * Gets the translateY value of an element.
     *
     * @param element
     * The element to get the translateY value from.
     *
     * @returns The translateY value of the element.
     */
    export function getTranslateY(element: HTMLElement): number {
        const transform = element.style.transform;

        if (transform) {
            const match = transform.match(/translateY\(([^)]+)\)/);

            if (match) {
                return parseFloat(match[1]);
            }
        }

        return 0;
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
        } catch (error) {
            return '';
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridUtils;
