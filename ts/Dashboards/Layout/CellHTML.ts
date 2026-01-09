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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Component from '../Components/Component';

import EditGlobals from '../EditMode/EditGlobals.js';
import Globals from '../Globals.js';
import GUIElement from './GUIElement.js';

/* *
 *
 *  Class
 *
 * */

/**
 * @internal
 **/
class CellHTML extends GUIElement {
    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the CellHTML class.
     *
     * @param {Cell.Options} options
     * Options for the cell.
     */
    public constructor(
        options: CellHTML.Options
    ) {
        super();

        this.options = options;
        this.id = options.id;
        this.container = options.container;
        this.mountedComponent = options.mountedComponent;
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * HTML container of a GUIElement.
     */
    public container: HTMLElement;

    /**
     * Cell id.
     */
    public id: string;

    /**
     * Component mounted in the cell.
     */
    public mountedComponent?: Component;

    /**
     * The cell options.
     */
    public options: CellHTML.Options;

    /**
     * The type of a GUIElement instance.
     */
    protected type = 'cell-html' as const;


    /**
     * Destroy the element, its container, event hooks
     * and mounted component.
     */
    public destroy(): void {
        const cell = this;

        // Destroy mounted component.
        cell.mountedComponent?.destroy();

        super.destroy();
    }

    /**
     * Highlight the cell.
     */
    public setHighlight(): void {
        const cell = this;

        cell.container.classList.toggle(
            EditGlobals.classNames.cellEditHighlight
        );
        cell.mountedComponent?.board.container.classList.toggle(
            EditGlobals.classNames.dashboardCellEditHighlightActive
        );
    }

    public setActiveState(): void {
        const cell = this;

        // Apply class
        if (cell.container) {
            cell.container.classList.add(
                Globals.classNames.cellActive
            );
        }
    }
}

/* *
 *
 *  Namespace
 *
 * */

namespace CellHTML {
    /**
     * Checks if a valid cell HTML instance.
     */
    export function isCellHTML(cellHTML: unknown): cellHTML is CellHTML {
        return cellHTML instanceof CellHTML;
    }

    /**
     * Options for each cell.
     **/
    export interface Options {
        /**
         * Unique cell id.
         **/
        id: string;

        /**
         * Options controlling the edit mode for the cell.
         **/
        editMode?: {
            /**
             * Individual options for the toolbar items.
             **/
            toolbarItems?: {
                /**
                 * Options for the `destroy` toolbar item.
                 */
                destroy: {
                    enabled?: boolean;
                };
                /**
                 * Options for the `drag` toolbar item.
                 */
                drag: {
                    enabled?: boolean;
                };
                /**
                 * Options for the `settings` toolbar item.
                 */
                settings: {
                    enabled?: boolean;
                };
                /**
                 * Options for the `viewFullscreen` toolbar item.
                 */
                viewFullscreen: {
                    enabled?: boolean;
                };
            }
        }

        /**
         * HTML container of a GUIElement.
         **/
        container: HTMLElement;

        /**
         * Component mounted in the cell.
         **/
        mountedComponent?: Component;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default CellHTML;
