/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Create announcer to speak messages to screen readers and other AT.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';

import DOMElementProvider from './DOMElementProvider.js';
import HTMLUtilities from './htmlUtilities.js';
const { visuallyHideElement } = HTMLUtilities;


/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        type AnnouncerType = ('assertive'|'polite');
        class Announcer {
            public constructor(chart: Chart, type: AnnouncerType);
            public destroy(): void;
            public announce(message: string): void;
        }
    }
}


class Announcer {
    private domElementProvider: Highcharts.DOMElementProvider;
    private announceRegion: Highcharts.HTMLDOMElement;
    private clearAnnouncementRegionTimer?: number;

    constructor(
        private chart: Highcharts.Chart,
        type: Highcharts.AnnouncerType
    ) {
        this.domElementProvider = new DOMElementProvider();
        this.announceRegion = this.addAnnounceRegion(type);
    }


    public destroy(): void {
        this.domElementProvider.destroyCreatedElements();
    }


    public announce(message: string): void {
        this.announceRegion.innerHTML = message;

        // Delete contents after a little while to avoid user finding the live
        // region in the DOM.
        if (this.clearAnnouncementRegionTimer) {
            clearTimeout(this.clearAnnouncementRegionTimer);
        }
        this.clearAnnouncementRegionTimer = setTimeout((): void => {
            this.announceRegion.innerHTML = '';
            delete this.clearAnnouncementRegionTimer;
        }, 1000);
    }


    private addAnnounceRegion(type: Highcharts.AnnouncerType): Highcharts.HTMLDOMElement {
        const chartContainer = this.chart.renderTo;
        const div = this.domElementProvider.createElement('div');

        div.setAttribute('aria-hidden', false);
        div.setAttribute('aria-live', type);

        visuallyHideElement(div);
        chartContainer.insertBefore(div, chartContainer.firstChild);

        return div;
    }
}

H.Announcer = Announcer;

export default Announcer;
