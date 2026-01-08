/* *
 *
 *  Grid Credits class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { CreditsOptions } from '../../Core/Options';

import Globals from '../../Core/Globals.js';
import Credits from '../../Core/Credits.js';

import GridUtils from '../../Core/GridUtils.js';
const { setHTMLContent } = GridUtils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a credits in the data grid.
 */
class CreditsPro extends Credits {
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

        setHTMLContent(this.textElement, text || '');
        this.textElement.setAttribute('href', href || '');
    }

    /**
     * Append the credits to the container. The position of the credits is
     * determined by the `position` option.
     */
    private appendToContainer(): void {
        const grid = this.grid;
        const contentWrapper = grid.contentWrapper;
        const { position } = this.options;

        // Apply grid-pro class
        this.containerElement.classList.add(
            Globals.getClassName('creditsPro')
        );

        if (position === 'top') {
            // Append the credits to the top of the table.
            contentWrapper?.prepend(this.containerElement);
            return;
        }

        // Append the credits to the bottom of the table.
        if (grid.descriptionElement) {
            contentWrapper?.insertBefore(
                this.containerElement,
                grid.descriptionElement
            );
        } else {
            contentWrapper?.appendChild(this.containerElement);
        }
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
            this.grid.update({
                credits: options
            }, false);

            this.options = this.grid.options?.credits ?? {};
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

        this.grid.viewport?.reflow();
    }

    public override destroy(): void {
        super.destroy();
        delete this.grid.credits;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default CreditsPro;
