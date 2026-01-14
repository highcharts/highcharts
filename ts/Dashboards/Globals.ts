/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *  - Pawel Lysy
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GUIElement from './Layout/GUIElement';
import type Board from './Board';

/* *
 *
 *  Namespace
 *
 * */

/**
 * Global Dashboards namespace in classic `<scripts>`-based implementations.
 *
 * @namespace Dashboards
 */
namespace Globals {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Abstract class type to wrap expected instance T.
     */
    export interface Class<T = unknown> extends Function {
        new(...args: Array<unknown>): T;
    }

    /**
     * Event callback as used by Highcharts.
     */
    export interface EventCallback<T> {
        (
            this: T,
            eventArguments: (Record<string, unknown>|Event)
        ): (boolean|void);
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Prefix of a GUIElement HTML class name.
     */
    export const classNamePrefix = 'highcharts-dashboards-';

    export const version = '@product.version@';

    /** @internal */
    export const classNames = {
        layout: classNamePrefix + 'layout',
        cell: classNamePrefix + 'cell',
        cellHover: classNamePrefix + 'cell-state-hover',
        cellActive: classNamePrefix + 'cell-state-active',
        cellLoading: classNamePrefix + 'cell-state-loading',
        row: classNamePrefix + 'row',
        layoutsWrapper: classNamePrefix + 'layouts-wrapper',
        boardContainer: classNamePrefix + 'wrapper'
    };

    /** @internal */
    export const guiElementType: Record<string, GUIElement.GUIElementType> = {
        row: 'row',
        cell: 'cell',
        layout: 'layout'
    };

    /**
     * Contains all Board instances of this window.
     */
    export const boards: Array<Board|undefined> = [];

    /**
     * Reference to the window used by Dashboards.
     */
    export const win = window;

    export const doc = document;

    export const noop = function (): void {};

    export const isMS = /(edge|msie|trident)/i
        .test((win.navigator && win.navigator.userAgent) || '') && !win.opera;

    export const supportsPassiveEvents = (function (): boolean {
        // Checks whether the browser supports passive events, (#11353).
        let supportsPassive = false;

        // Object.defineProperty doesn't work on IE as well as passive
        // events - instead of using polyfill, we can exclude IE totally.
        if (!isMS) {
            const opts = Object.defineProperty({}, 'passive', {
                get: function (): void {
                    supportsPassive = true;
                }
            });

            if (win.addEventListener && win.removeEventListener) {
                win.addEventListener('testPassive', noop, opts);
                win.removeEventListener('testPassive', noop, opts);
            }
        }

        return supportsPassive;
    }());

}

/* *
 *
 *  Default Export
 *
 * */

export default Globals;
