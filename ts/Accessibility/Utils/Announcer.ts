/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Create announcer to speak messages to screen readers and other AT.
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

import AST from '../../Core/Renderer/HTML/AST.js';
import DOMElementProvider from './DOMElementProvider.js';
import H from '../../Core/Globals.js';
const { doc } = H;
import HU from './HTMLUtilities.js';
const {
    addClass,
    visuallyHideElement
} = HU;
import { attr, internalClearTimeout } from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Internal types.
 * @internal
 */
declare module '../../Core/Chart/ChartBase'{
    interface ChartBase {
        announcerContainer?: HTMLDOMElement;
    }
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class Announcer {

    /* *
     *
     *  Properties
     *
     * */

    private domElementProvider: DOMElementProvider;
    private announceRegion: HTMLDOMElement;
    private clearAnnouncementRegionTimer?: number;

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * @param {Highcharts.Chart} chart
     * The chart that owns the announcer.
     *
     * @param {Highcharts.AnnouncerType} type
     * The ARIA live region politeness setting.
     *
     * @internal
     */
    constructor(
        private chart: Chart,
        type: Announcer.Type
    ) {
        this.domElementProvider = new DOMElementProvider();
        this.announceRegion = this.addAnnounceRegion(type);
    }

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public destroy(): void {
        this.domElementProvider.destroyCreatedElements();
    }

    /**
     * Announces a message to assistive technologies.
     *
     * @param {string} message
     * The message to announce.
     *
     * @internal
     */
    public announce(message: string): void {
        AST.setElementHTML(this.announceRegion, message);

        // Delete contents after a little while to avoid user finding the live
        // region in the DOM.
        if (this.clearAnnouncementRegionTimer) {
            internalClearTimeout(this.clearAnnouncementRegionTimer);
        }
        this.clearAnnouncementRegionTimer = setTimeout((): void => {
            this.announceRegion.innerHTML = AST.emptyHTML;
            delete this.clearAnnouncementRegionTimer;
        }, 3000);
    }

    /** @internal */
    private addAnnounceRegion(type: Announcer.Type): HTMLDOMElement {
        const chartContainer = (
                this.chart.announcerContainer || this.createAnnouncerContainer()
            ),
            div = this.domElementProvider.createElement('div');

        attr(div, {
            'aria-hidden': false,
            'aria-live': type,
            'aria-atomic': true
        });

        if (this.chart.styledMode) {
            addClass(div, 'highcharts-visually-hidden');
        } else {
            visuallyHideElement(div);
        }

        chartContainer.appendChild(div);
        return div;
    }

    /** @internal */
    private createAnnouncerContainer(): HTMLDOMElement {
        const chart = this.chart,
            container = doc.createElement('div');

        attr(container, {
            'aria-hidden': false,
            'class': 'highcharts-announcer-container'
        });
        container.style.position = 'relative';

        chart.renderTo.insertBefore(container, chart.renderTo.firstChild);
        chart.announcerContainer = container;
        return container;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/** @internal */
namespace Announcer {
    export type Type = ('assertive'|'polite');
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default Announcer;
