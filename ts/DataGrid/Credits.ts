/* *
 *
 *  Data Grid Credits class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import type { CreditsOptions } from './Options';
import type DataGrid from './DataGrid';

import Globals from './Globals.js';
import DGUtils from './Utils.js';

const { makeHTMLElement } = DGUtils;

/* *
 *
 *  Abstract Class of Row
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
     * The Data Grid Table instance which the credits belong to.
     */
    public dataGrid: DataGrid;

    /**
     * The credits container HTML element.
     */
    public containerElement: HTMLElement;

    /**
     * The credits content HTML element.
     */
    public textElement: HTMLElement;

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
     * @param dataGrid
     * The Data Grid Table instance which the credits belong to.
     */
    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;
        this.options = dataGrid.options?.credits ?? {};

        this.containerElement = makeHTMLElement('div', {
            className: Globals.classNames.creditsContainer
        });

        this.textElement = makeHTMLElement<HTMLAnchorElement>('a', {
            className: Globals.classNames.creditsText
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
     * Set the content of the credits.
     */
    private setContent(): void {
        const { text, href } = this.options;

        this.textElement.innerText = text || '';
        this.textElement.setAttribute('href', href || '');
    }

    /**
     * Append the credits to the container. The position of the credits is
     * determined by the `position` option.
     */
    private appendToContainer(): void {
        const { position } = this.options;

        if (position === 'top') {
            // Append the credits to the top of the table.
            this.dataGrid.contentWrapper?.prepend(this.containerElement);
            return;
        }

        // Append the credits to the bottom of the table.
        this.dataGrid.contentWrapper?.appendChild(this.containerElement);
    }

    /**
     * Update the credits with new options.
     *
     * @param options
     * The new options for the credits.
     *
     * @param render
     * Whether to render the credits after the update.
     */
    public update(
        options: Partial<CreditsOptions> | undefined,
        render = true
    ): void {
        if (options) {
            this.dataGrid.update({
                credits: options
            }, false);

            this.options = this.dataGrid.options?.credits ?? {};
        }

        if (render) {
            this.render();
        }
    }

    /**
     * Render the credits. If the credits are disabled, they will be removed
     * from the container. If also reflows the viewport dimensions.
     */
    public render(): void {
        const enabled = this.options.enabled ?? false;

        this.containerElement.remove();

        if (enabled) {
            this.setContent();
            this.appendToContainer();
        } else {
            this.destroy();
        }

        this.dataGrid.viewport?.reflow();
    }

    /**
     * Get the height of the credits container.
     */
    public getHeight(): number {
        return this.containerElement.offsetHeight;
    }

    /**
     * Destroy the credits. The credits will be removed from the container and
     * the reference to the credits will be deleted from the DataGrid instance
     * it belongs to.
     */
    public destroy(): void {
        this.containerElement.remove();
        delete this.dataGrid.credits;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Credits {

}


/* *
 *
 *  Default Export
 *
 * */

export default Credits;
