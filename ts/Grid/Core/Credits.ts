/* *
 *
 *  Grid Credits class
 *
 *  (c) 2020-2025 Highsoft AS
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

import Globals from './Globals.js';
import GridUtils from './GridUtils.js';

const { makeHTMLElement, setHTMLContent } = GridUtils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a credits in the grid.
 */
class Credits {

    /* *
    *
    *  Static Properties
    *
    * */

    /**
     * Default options of the credits.
     */
    public static defaultOptions: CreditsOptions = {
        enabled: true,
        // eslint-disable-next-line no-console
        text: `<picture class="hcg-logo-wrapper">
            <source srcset="https://assets.highcharts.com/grid/logo_darkx2.png 2x, https://assets.highcharts.com/grid/logo_dark.png 1x" media="(prefers-color-scheme: dark)">
            <img src="https://assets.highcharts.com/grid/logo_light.png" srcset="https://assets.highcharts.com/grid/logo_lightx2.png 2x, https://assets.highcharts.com/grid/logo_light.png 1x" alt="Highcharts logo" style="height: 20px !important; width: auto !important; display: inline-block !important;">
        </picture>`,
        href: 'https://www.highcharts.com',
        position: 'bottom'
    };


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
     * @param grid
     * The Grid instance which the credits belong to.
     *
     * @param options
     * Options for the credits label. Predefined if not provided.
     *
     */
    constructor(grid: Grid, options?: CreditsOptions) {

        this.grid = grid;

        this.containerElement = makeHTMLElement('div', {
            className: Globals.getClassName('creditsContainer')
        });

        this.textElement = this.renderAnchor();

        this.options = options ?? Credits.defaultOptions;
        this.render();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Render the credits. If the credits are disabled, they will be removed
     * from the container.
     */
    public render(): void {
        const grid = this.grid;
        const contentWrapper = grid.contentWrapper;
        const { text, href } = this.options;

        this.containerElement.remove();

        if (!this.textElement) {
            this.textElement = this.renderAnchor();
        }

        if (text && href) {
            setHTMLContent(this.textElement, text);
            this.textElement.setAttribute('href', href || '');
        }

        if (grid.descriptionElement) {
            contentWrapper?.insertBefore(
                this.containerElement,
                grid.descriptionElement
            );
        } else {
            contentWrapper?.appendChild(this.containerElement);
        }
    }

    private renderAnchor(): HTMLElement {
        const anchorElement = makeHTMLElement<HTMLAnchorElement>('a', {
            className: Globals.getClassName('creditsText')
        }, this.containerElement);

        anchorElement.setAttribute('target', '_blank');

        return anchorElement;
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
