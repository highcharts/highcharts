/* *
 *
 *  GUI generator for Stock tools
 *
 *  (c) 2009-2021 Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ChartOptions from '../Core/Chart/ChartOptions';
import type { HTMLDOMElement } from '../Core/Renderer/DOMElementType';
import type Options from '../Core/Options';
import type {
    LangStockToolsOptions,
    StockToolsGuiDefinitionsButtonsOptions,
    StockToolsGuiDefinitionsOptions,
    StockToolsGuiOptions,
    StockToolsOptions
} from './StockToolsOptions';

import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import NavigationBindings from '../Extensions/Annotations/NavigationBindings.js';
import O from '../Core/DefaultOptions.js';
const { setOptions } = O;
import StockToolsDefaults from './StockToolsDefaults.js';
import Toolbar from './StockToolbar.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    extend,
    getStyle,
    merge,
    pick
} = U;

/* *
 *
 * Declarations
 *
 * */
declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        stockTools?: Toolbar;
        /** @requires modules/stock-tools */
        setStockTools(options?: StockToolsOptions): void;
    }
}

declare module '../Core/LangOptions'{
    interface LangOptions {
        stockTools?: LangStockToolsOptions;
    }
}

declare module '../Core/Options'{
    interface Options {
        stockTools?: StockToolsOptions;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class Toolbar {
            public constructor(
                options: StockToolsGuiOptions,
                langOptions: (Record<string, string>|undefined),
                chart: Chart
            );
            public arrowDown: HTMLDOMElement;
            public arrowUp: HTMLDOMElement;
            public arrowWrapper: HTMLDOMElement;
            public chart: Chart;
            public classMapping: Record<string, string>;
            public eventsToUnbind: Array<Function>;
            public guiEnabled: (boolean|undefined);
            public iconsURL: string;
            public lang: (Record<string, string>|undefined);
            public listWrapper: HTMLDOMElement;
            public options: StockToolsGuiOptions;
            public placed: boolean;
            public prevOffsetWidth: (number|undefined);
            public showhideBtn: HTMLDOMElement;
            public submenu: HTMLDOMElement;
            public toolbar: HTMLDOMElement;
            public visible: boolean;
            public wrapper: HTMLDOMElement;
            public addButton(
                target: HTMLDOMElement,
                options: (
                    StockToolsGuiDefinitionsButtonsOptions|
                    StockToolsGuiDefinitionsOptions
                ),
                btnName: string,
                lang: Record<string, string>
            ): Record<string, HTMLDOMElement>;
            public addNavigation(): void;
            public addSubmenu(
                parentBtn: Record<string, HTMLDOMElement>,
                button: StockToolsGuiDefinitionsButtonsOptions
            ): void;
            public addSubmenuItems(
                buttonWrapper: HTMLDOMElement,
                button: StockToolsGuiDefinitionsButtonsOptions
            ): void;
            public createHTML(): void;
            public destroy(): void;
            public eraseActiveButtons(
                buttons: NodeListOf<HTMLDOMElement>,
                currentButton: HTMLDOMElement,
                submenuItems?: NodeListOf<HTMLDOMElement>
            ): void;
            public getIconsURL(): string;
            public init(): void;
            public redraw(): void;
            public scrollButtons(): void;
            public toggleButtonAciveClass(button: HTMLDOMElement): void;
            public showHideNavigatorion(): void;
            public showHideToolbar(): void;
            public switchSymbol(button: HTMLDOMElement, redraw?: boolean): void;
            public unselectAllButtons(button: HTMLDOMElement): void;
            public update(options: StockToolsOptions): void;
        }
    }
}

const PREFIX = 'highcharts-';

setOptions(StockToolsDefaults);

/* eslint-disable no-invalid-this, valid-jsdoc */

// Run HTML generator
addEvent(Chart, 'afterGetContainer', function (): void {
    this.setStockTools();
});

addEvent(Chart, 'getMargins', function (): void {
    const listWrapper = this.stockTools && this.stockTools.listWrapper,
        offsetWidth = listWrapper && (
            (
                (listWrapper as any).startWidth +
                getStyle(listWrapper, 'padding-left') +
                getStyle(listWrapper, 'padding-right')
            ) || listWrapper.offsetWidth
        );

    if (offsetWidth && offsetWidth < this.plotWidth) {
        this.plotLeft += offsetWidth;
        this.spacing[3] += offsetWidth;
    }
}, {
    order: 0
});

['beforeRender', 'beforeRedraw'].forEach((event: string): void => {
    addEvent(Chart, event, function (): void {
        if (this.stockTools) {
            const optionsChart = this.options.chart as ChartOptions;
            const listWrapper = this.stockTools.listWrapper,
                offsetWidth = listWrapper && (
                    (
                        (listWrapper as any).startWidth +
                        getStyle(listWrapper, 'padding-left') +
                        getStyle(listWrapper, 'padding-right')
                    ) || listWrapper.offsetWidth
                );

            let dirty = false;

            if (offsetWidth && offsetWidth < this.plotWidth) {
                const nextX = pick(
                    optionsChart.spacingLeft,
                    optionsChart.spacing && optionsChart.spacing[3],
                    0
                ) + offsetWidth;
                const diff = nextX - this.spacingBox.x;
                this.spacingBox.x = nextX;
                this.spacingBox.width -= diff;
                dirty = true;
            } else if (offsetWidth === 0) {
                dirty = true;
            }

            if (offsetWidth !== this.stockTools.prevOffsetWidth) {
                this.stockTools.prevOffsetWidth = offsetWidth;
                if (dirty) {
                    this.isDirtyLegend = true;
                }
            }
        }
    });
});

addEvent(Chart, 'destroy', function (): void {
    if (this.stockTools) {
        this.stockTools.destroy();
    }
});

addEvent(Chart, 'redraw', function (): void {
    if (this.stockTools && this.stockTools.guiEnabled) {
        this.stockTools.redraw();
    }
});

extend(Chart.prototype, {
    /**
     * Verify if Toolbar should be added.
     * @private
     * @param {Highcharts.StockToolsOptions} - chart options
     */
    setStockTools: function (
        this: Chart,
        options?: StockToolsOptions
    ): void {
        const chartOptions: Options = this.options,
            lang = chartOptions.lang,
            guiOptions = merge(
                chartOptions.stockTools && chartOptions.stockTools.gui,
                options && options.gui
            ),
            langOptions = lang && lang.stockTools && lang.stockTools.gui;

        this.stockTools = new Toolbar(guiOptions, langOptions, this);

        if (this.stockTools.guiEnabled) {
            this.isDirtyBox = true;
        }
    }
});

// Comunication with bindings:
addEvent(NavigationBindings, 'selectButton', function (
    event: Record<string, HTMLDOMElement>
): void {
    let button = event.button,
        className = PREFIX + 'submenu-wrapper',
        gui = this.chart.stockTools;

    if (gui && gui.guiEnabled) {
        // Unslect other active buttons
        gui.unselectAllButtons(event.button);

        // If clicked on a submenu, select state for it's parent
        if (button.parentNode.className.indexOf(className) >= 0) {
            button = button.parentNode.parentNode;
        }
        // Set active class on the current button
        gui.toggleButtonAciveClass(button);
    }
});

addEvent(NavigationBindings, 'deselectButton', function (
    event: Record<string, HTMLDOMElement>
): void {
    let button = event.button,
        className = PREFIX + 'submenu-wrapper',
        gui = this.chart.stockTools;

    if (gui && gui.guiEnabled) {
        // If deselecting a button from a submenu, select state for it's parent
        if (button.parentNode.className.indexOf(className) >= 0) {
            button = button.parentNode.parentNode;
        }
        gui.toggleButtonAciveClass(button);
    }
});

// Check if the correct price indicator button is displayed, #15029.
addEvent(Chart, 'render', function (): void {
    const chart = this,
        stockTools = chart.stockTools,
        button = stockTools &&
            stockTools.toolbar &&
            stockTools.toolbar.querySelector(
                '.highcharts-current-price-indicator'
            ) as any;

    // Change the initial button background.
    if (
        stockTools &&
        chart.navigationBindings &&
        chart.options.series &&
        button
    ) {
        if (
            chart.navigationBindings.constructor.prototype.utils
                .isPriceIndicatorEnabled(chart.series)
        ) {
            button.firstChild.style['background-image'] =
            'url("' + stockTools.getIconsURL() + 'current-price-hide.svg")';
        } else {
            button.firstChild.style['background-image'] =
            'url("' + stockTools.getIconsURL() + 'current-price-show.svg")';
        }
    }
});

H.Toolbar = Toolbar;
export default H.Toolbar;
