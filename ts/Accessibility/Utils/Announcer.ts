/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Create announcer to speak messages to screen readers and other AT.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../Core/Chart/Chart';
import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import H from '../../Core/Globals.js';
import AST from '../../Core/Renderer/HTML/AST.js';
const {
    doc
} = H;
import DOMElementProvider from './DOMElementProvider.js';
import HTMLUtilities from './HTMLUtilities.js';
const {
    setElAttrs,
    visuallyHideElement
} = HTMLUtilities;


/**
 * Internal types.
 * @private
 */
declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        announcerContainer?: HTMLDOMElement;
    }
}
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
    private announceRegion: HTMLDOMElement;
    private clearAnnouncementRegionTimer?: number;

    constructor(
        private chart: Chart,
        type: Highcharts.AnnouncerType
    ) {
        this.domElementProvider = new DOMElementProvider();
        this.announceRegion = this.addAnnounceRegion(type);
    }


    public destroy(): void {
        this.domElementProvider.destroyCreatedElements();
    }


    public announce(message: string): void {
        AST.setElementHTML(this.announceRegion, message);

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


    private addAnnounceRegion(type: Highcharts.AnnouncerType): HTMLDOMElement {
        const chartContainer = this.chart.announcerContainer || this.createAnnouncerContainer();
        const div = this.domElementProvider.createElement('div');

        setElAttrs(div, {
            'aria-hidden': false,
            'aria-live': type
        });

        visuallyHideElement(div);
        chartContainer.appendChild(div);
        return div;
    }


    private createAnnouncerContainer(): HTMLDOMElement {
        const chart = this.chart;
        const container = doc.createElement('div');

        setElAttrs(container, {
            'aria-hidden': false,
            style: 'position:relative',
            'class': 'highcharts-announcer-container'
        });

        chart.renderTo.insertBefore(container, chart.renderTo.firstChild);
        chart.announcerContainer = container;
        return container;
    }
}

H.Announcer = Announcer;

export default Announcer;
