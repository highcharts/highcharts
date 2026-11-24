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

import Popup from '../../Core/UI/Popup.js';
import GridUtils from '../../Core/GridUtils.js';
import Globals from '../../Core/Globals.js';

const { makeHTMLElement } = GridUtils;


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

        const { container, chartContainer } = this;
        if (!container || !chartContainer) {
            return;
        }

        this.chart = this.createChart(chartContainer);

        // Let Escape close the popup without clicking into it first.
        container.tabIndex = -1;
        container.focus();
    }

    /**
     * Destroys the chart and hides the popup.
     */
    public override hide(): void {
        this.chart?.destroy();
        delete this.chart;
        delete this.chartContainer;
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
