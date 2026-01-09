/* *
 *
 *  Grid Button interface
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Popup from './Popup.js';


/* *
 *
 *  Interface
 *
 * */

/**
 * Basic interface for buttons used in Grid components, like `ContextMenu` or
 * `Toolbar`.
 * @private
 */
export interface Button {
    /**
     * Focuses the button.
     */
    focus(): void;

    /**
     * Sets the highlighted state of the button.
     *
     * @param highlighted
     * Whether the button should be highlighted.
     */
    setHighlighted(highlighted: boolean): void;

    /**
     * Sets the active state of the button.
     *
     * @param active
     * Whether the button should be active.
     */
    setActive(active: boolean): void;

    /**
     * The popup associated with the button, if any.
     */
    popup?: Popup;
}


/* *
 *
 *  Default Export
 *
 * */

export default Button;
