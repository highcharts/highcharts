/* *
 *
 *  Grid Charting popup
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Markus Barstad
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type { AnyRecord } from '../../../Shared/Types';
import type { SVGDefinition } from '../../Core/UI/SvgIcons';

import Popup from '../../Core/UI/Popup.js';
import GridUtils from '../../Core/GridUtils.js';
import Globals from '../../Core/Globals.js';
import { createGridIcon } from '../../Core/UI/SvgIcons.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Constants
 *
 * */

/**
 * The icon of the close button, an X. Override it with a `close` icon in
 * `rendering.icons`.
 */
const closeIcon: SVGDefinition = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    children: [{
        d: 'M18 6L6 18M6 6L18 18',
        'stroke-width': 2
    }]
};


/* *
 *
 *  Class
 *
 * */

/**
 * A popup over the Grid showing a chart created from its data.
 */
class ChartPopup extends Popup {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The chart shown in the popup, while it is visible.
     */
    public chart?: AnyRecord;

    /**
     * Creates the chart in the given container.
     */
    private createChart: (container: HTMLElement) => AnyRecord;

    /**
     * The chart container element.
     */
    private chartContainer?: HTMLElement;

    /**
     * The button closing the popup.
     */
    private closeButton?: HTMLButtonElement;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a chart popup.
     *
     * @param grid
     * The Grid the chart is created from.
     *
     * @param createChart
     * Creates the chart in the given container, once the popup is in the DOM.
     */
    constructor(
        grid: Grid,
        createChart: (container: HTMLElement) => AnyRecord
    ) {
        super(grid);
        this.createChart = createChart;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Shows the popup and creates the chart in it.
     *
     * @param anchorElement
     * The element to position the popup relative to.
     */
    public override show(anchorElement?: HTMLElement): void {
        super.show(anchorElement);

        const { chartContainer } = this;
        if (!chartContainer) {
            return;
        }

        this.chart = this.createChart(chartContainer);

        // Focus inside the popup, so that Escape closes it without clicking
        // into it first.
        this.closeButton?.focus();
    }

    /**
     * Destroys the chart and hides the popup.
     */
    public override hide(): void {
        this.chart?.destroy();
        delete this.chart;
        delete this.chartContainer;
        delete this.closeButton;
        super.hide();
    }

    /**
     * Renders the chart container.
     *
     * @param contentElement
     * The popup content element.
     */
    protected override renderContent(contentElement: HTMLElement): void {
        // Added before the popup is positioned, so that it is measured with
        // the chart size.
        this.container?.classList.add(
            Globals.classNamePrefix + 'chart-popup'
        );
        const { grid } = this;
        const prefix = Globals.classNamePrefix;
        const header = makeHTMLElement('div', {
            className: prefix + 'chart-popup-header'
        }, contentElement);
        const closeButton = this.closeButton = makeHTMLElement('button', {
            className: Globals.getClassName('button')
        }, header);

        closeButton.type = 'button';
        closeButton.setAttribute(
            'aria-label',
            grid.options?.lang?.charting?.closeChart || 'Close chart'
        );
        closeButton.appendChild(createGridIcon('close', {
            close: closeIcon,
            ...grid.options?.rendering?.icons
        }));
        closeButton.addEventListener('click', (): void => this.hide());

        this.chartContainer = makeHTMLElement('div', {
            className: Globals.classNamePrefix + 'chart-popup-chart'
        }, contentElement);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ChartPopup;
