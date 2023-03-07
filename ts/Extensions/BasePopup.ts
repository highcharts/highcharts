/* *
 *
 *  Base popup.
 *
 *  (c) 2009-2021 Karol Kolodziej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import AST from '../Core/Renderer/HTML/AST.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    createElement
} = U;

/* *
 *
 *  Class
 *
 * */

class BasePopup {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        parentDiv: HTMLElement,
        iconsURL: string
    ) {
        this.iconsURL = iconsURL;

        // Create popup div.
        this.container = createElement(
            'div',
            {
                className: 'highcharts-popup highcharts-no-tooltip'
            },
            void 0,
            parentDiv
        );

        this.closeButton = this.addCloseButton();
    }

    /* *
     *
     *  Properties
     *
     * */

    public container: HTMLElement;
    public closeButton: HTMLElement;
    public formType?: string;
    public iconsURL: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create HTML element and attach click event to close popup.
     */
    private addCloseButton(): HTMLElement {
        const popup = this,
            iconsURL = this.iconsURL;

        // Create close popup button.
        const closeButton = createElement(
            'div',
            {
                className: 'highcharts-popup-close'
            },
            void 0,
            this.container
        );

        closeButton.style['background-image' as any] = 'url(' +
                (
                    iconsURL.match(/png|svg|jpeg|jpg|gif/ig) ?
                        iconsURL : iconsURL + 'close.svg'
                ) + ')';

        ['click', 'touchstart'].forEach((eventName: string): void => {
            addEvent(
                closeButton,
                eventName,
                popup.closeButtonEvents.bind(popup)
            );
        });

        return closeButton;
    }

    /**
     * Close button events.
     * @return {void}
     */
    public closeButtonEvents(): void {
        this.closePopup();
    }

    /**
     * Reset content of the current popup and show.
     */
    public showPopup(): void {
        const popupDiv = this.container,
            toolbarClass = 'highcharts-annotation-toolbar',
            popupCloseButton = this.closeButton;

        this.formType = void 0;

        // Reset content.
        popupDiv.innerHTML = AST.emptyHTML;

        // Reset toolbar styles if exists.
        if (popupDiv.className.indexOf(toolbarClass) >= 0) {
            popupDiv.classList.remove(toolbarClass);

            // reset toolbar inline styles
            popupDiv.removeAttribute('style');
        }

        // Add close button.
        popupDiv.appendChild(popupCloseButton);
        popupDiv.style.display = 'block';
        popupDiv.style.height = '';
    }

    /**
     * Hide popup.
     */
    public closePopup(): void {
        this.container.style.display = 'none';
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface BasePopup {
}

/* *
 *
 *  Default Export
 *
 * */

export default BasePopup;
