/* *
 *
 *  Grid Credits class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { CreditsOptions } from './Options';
import type Grid from './Grid';
import type Table from '../Core/Table/Table';

import Globals from './Globals.js';
import GridUtils from './GridUtils.js';
import Defaults from './Defaults.js';
import U from '../../Core/Utilities.js';

const {
    addEvent
} = U;
const { makeHTMLElement } = GridUtils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a credits in the data grid.
 */
class Credits {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The Grid instance which the credits belong to.
     */
    public readonly grid: Grid;

    /**
     * The credits container HTML element.
     */
    public readonly containerElement: HTMLElement;

    /**
     * The credits content HTML element.
     */
    public readonly textElement: HTMLElement;

    /**
     * The options for the credits.
     */
    public options: CreditsOptions;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the credits.
     *
     * @param grid
     * The Grid instance which the credits belong to.
     */
    constructor(grid: Grid) {
        this.grid = grid;
        this.options = Defaults.defaultOptions.credits as CreditsOptions;

        this.containerElement = makeHTMLElement('div', {
            className: Globals.getClassName('creditsContainer')
        });

        this.textElement = makeHTMLElement<HTMLAnchorElement>('a', {
            className: Globals.getClassName('creditsText')
        }, this.containerElement);
        this.textElement.setAttribute('target', '_top');

        this.render();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Render the credits. If the credits are disabled, they will be removed
     * from the container. If also reflows the viewport dimensions.
     */
    public render(): void {
        const { text, href } = this.options;

        this.containerElement.remove();

        if (text && href) {
            this.textElement.innerHTML = text;
            this.textElement.setAttribute('href', href || '');
        }

        this.grid.contentWrapper?.appendChild(this.containerElement);
        this.grid.viewport?.reflow();
    }

    /**
     * Get the height of the credits container.
     */
    public getHeight(): number {
        return this.containerElement.offsetHeight;
    }

    /**
     * Destroy the credits. The credits will be removed from the container and
     * the reference to the credits will be deleted from the Grid instance
     * it belongs to.
     */
    public destroy(): void {
        this.containerElement.remove();
        delete this.grid.credits;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Credits {
    /**
     * Extends the grid classes with cell editing functionality.
     *
     * @param TableClass
     * The class to extend.
     *
     */
    export function compose(
        TableClass: typeof Table
    ): void {
        addEvent(TableClass, 'afterRenderViewport', initCredits);
    }

    /**
     * Callback function called before table initialization.
     */
    function initCredits(this: Table): void {
        this.grid.credits = new Credits(this.grid);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Credits;
