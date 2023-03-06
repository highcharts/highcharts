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

import type Chart from '../../../Core/Chart/Chart';

import AST from '../../../Core/Renderer/HTML/AST.js';
import D from '../../../Core/Defaults.js';
const { getOptions } = D;
import H from '../../../Core/Globals.js';
const { doc } = H;
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    fireEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */


export interface PopupFieldsObject {
    actionType: string;
    fields: PopupFieldsTree;
    linkedTo?: string;
    seriesId?: string;
    type?: string;
}

export interface PopupFieldsTree {
    [key: string]: (string | PopupFieldsTree);
}

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
        iconsURL: string,
        chart?: Chart
    ) {
        this.chart = chart;
        this.iconsURL = iconsURL;
        this.lang = (getOptions().lang.navigation as any).popup;

        // Create popup div.
        this.container = createElement(
            'div',
            {
                className: 'highcharts-popup highcharts-no-tooltip'
            },
            void 0,
            parentDiv
        );

        addEvent(this.container, 'mousedown', (): void => {
            const activeAnnotation = chart &&
                chart.navigationBindings &&
                chart.navigationBindings.activeAnnotation;

            if (activeAnnotation) {
                activeAnnotation.cancelClick = true;

                const unbind = addEvent(doc, 'click', (): void => {
                    setTimeout((): void => {
                        activeAnnotation.cancelClick = false;
                    }, 0);
                    unbind();
                });
            }
        });

        this.addCloseBtn();
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart?: Chart;
    public container: HTMLElement;
    public formType?: string;
    public iconsURL: string;
    public lang: Record<string, string>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create HTML element and attach click event to close popup.
     */
    private addCloseBtn(): void {
        const iconsURL = this.iconsURL;

        // Create close popup button.
        const closeBtn = createElement(
            'div',
            {
                className: 'highcharts-popup-close'
            },
            void 0,
            this.container
        );

        closeBtn.style['background-image' as any] = 'url(' +
                (
                    iconsURL.match(/png|svg|jpeg|jpg|gif/ig) ?
                        iconsURL : iconsURL + 'close.svg'
                ) + ')';

        ['click', 'touchstart'].forEach((eventName: string): void => {
            addEvent(closeBtn, eventName, (): void => {
                if (this.chart) {
                    const navigationBindings = this.chart.navigationBindings;

                    fireEvent(navigationBindings, 'closePopup');

                    if (
                        navigationBindings &&
                        navigationBindings.selectedButtonElement
                    ) {
                        fireEvent(
                            navigationBindings,
                            'deselectButton',
                            { button: navigationBindings.selectedButtonElement }
                        );
                    }
                } else {
                    this.closePopup();
                }
            });
        });
    }

    /**
     * Reset content of the current popup and show.
     */
    public showPopup(): void {
        const popupDiv = this.container,
            toolbarClass = 'highcharts-annotation-toolbar',
            popupCloseBtn = popupDiv
                .querySelectorAll('.highcharts-popup-close')[0];

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
        popupDiv.appendChild(popupCloseBtn);
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
