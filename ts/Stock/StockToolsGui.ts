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

import type {
    HTMLDOMElement
} from '../Core/Renderer/DOMElementType';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import NavigationBindings from '../Extensions/Annotations/NavigationBindings.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    createElement,
    css,
    extend,
    fireEvent,
    getStyle,
    isArray,
    merge,
    pick,
    setOptions
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        stockTools?: Toolbar;
        /** @requires modules/stock-tools */
        setStockTools(options?: Highcharts.StockToolsOptions): void;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface LangOptions {
            stockTools?: LangStockToolsOptions;
        }
        interface LangStockToolsOptions {
            gui?: Record<string, string>;
        }
        interface Options {
            stockTools?: StockToolsOptions;
        }
        interface StockToolsGuiDefinitionsButtonOptions {
            symbol?: string;
        }
        interface StockToolsGuiDefinitionsButtonsOptions {
            [key: string]: (Array<string>|StockToolsGuiDefinitionsButtonOptions);
            items: Array<string>;
        }
        interface StockToolsGuiDefinitionsOptions {
            [key: string]: (
                StockToolsGuiDefinitionsButtonOptions|
                StockToolsGuiDefinitionsButtonsOptions
            );
            advanced: StockToolsGuiDefinitionsButtonsOptions;
            crookedLines: StockToolsGuiDefinitionsButtonsOptions;
            currentPriceIndicator: StockToolsGuiDefinitionsButtonOptions;
            flags: StockToolsGuiDefinitionsButtonsOptions;
            fullScreen: StockToolsGuiDefinitionsButtonOptions;
            indicators: StockToolsGuiDefinitionsButtonOptions;
            lines: StockToolsGuiDefinitionsButtonsOptions;
            measure: StockToolsGuiDefinitionsButtonsOptions;
            separator: StockToolsGuiDefinitionsButtonOptions;
            toggleAnnotations: StockToolsGuiDefinitionsButtonOptions;
            saveChart: StockToolsGuiDefinitionsButtonOptions;
            simpleShapes: StockToolsGuiDefinitionsButtonsOptions;
            typeChange: StockToolsGuiDefinitionsButtonsOptions;
            verticalLabels: StockToolsGuiDefinitionsButtonsOptions;
            zoomChange: StockToolsGuiDefinitionsButtonsOptions;
        }
        interface StockToolsGuiOptions {
            buttons?: Array<string>;
            className?: string;
            definitions?: StockToolsGuiDefinitionsOptions;
            enabled?: boolean;
            iconsURL?: string;
            placed?: boolean;
            toolbarClassName?: string;
            visible?: boolean;
        }
        interface StockToolsOptions {
            gui: StockToolsGuiOptions;
        }
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
            public selectButton(button: HTMLDOMElement): void;
            public showHideNavigatorion(): void;
            public showHideToolbar(): void;
            public switchSymbol(button: HTMLDOMElement, redraw?: boolean): void;
            public unselectAllButtons(button: HTMLDOMElement): void;
            public update(options: StockToolsOptions): void;
        }
    }
}

var DIV = 'div',
    SPAN = 'span',
    UL = 'ul',
    LI = 'li',
    PREFIX = 'highcharts-',
    activeClass = PREFIX + 'active';

setOptions({
    /**
     * @optionparent lang
     */
    lang: {
        /**
         * Configure the stockTools GUI titles(hints) in the chart. Requires
         * the `stock-tools.js` module to be loaded.
         *
         * @product highstock
         * @since   7.0.0
         */
        stockTools: {
            gui: {
                // Main buttons:
                simpleShapes: 'Simple shapes',
                lines: 'Lines',
                crookedLines: 'Crooked lines',
                measure: 'Measure',
                advanced: 'Advanced',
                toggleAnnotations: 'Toggle annotations',
                verticalLabels: 'Vertical labels',
                flags: 'Flags',
                zoomChange: 'Zoom change',
                typeChange: 'Type change',
                saveChart: 'Save chart',
                indicators: 'Indicators',
                currentPriceIndicator: 'Current Price Indicators',

                // Other features:
                zoomX: 'Zoom X',
                zoomY: 'Zoom Y',
                zoomXY: 'Zooom XY',
                fullScreen: 'Fullscreen',
                typeOHLC: 'OHLC',
                typeLine: 'Line',
                typeCandlestick: 'Candlestick',

                // Basic shapes:
                circle: 'Circle',
                label: 'Label',
                rectangle: 'Rectangle',

                // Flags:
                flagCirclepin: 'Flag circle',
                flagDiamondpin: 'Flag diamond',
                flagSquarepin: 'Flag square',
                flagSimplepin: 'Flag simple',

                // Measures:
                measureXY: 'Measure XY',
                measureX: 'Measure X',
                measureY: 'Measure Y',

                // Segment, ray and line:
                segment: 'Segment',
                arrowSegment: 'Arrow segment',
                ray: 'Ray',
                arrowRay: 'Arrow ray',
                line: 'Line',
                arrowLine: 'Arrow line',
                horizontalLine: 'Horizontal line',
                verticalLine: 'Vertical line',
                infinityLine: 'Infinity line',

                // Crooked lines:
                crooked3: 'Crooked 3 line',
                crooked5: 'Crooked 5 line',
                elliott3: 'Elliott 3 line',
                elliott5: 'Elliott 5 line',

                // Counters:
                verticalCounter: 'Vertical counter',
                verticalLabel: 'Vertical label',
                verticalArrow: 'Vertical arrow',

                // Advanced:
                fibonacci: 'Fibonacci',
                pitchfork: 'Pitchfork',
                parallelChannel: 'Parallel channel'
            }
        },
        navigation: {
            popup: {
                // Annotations:
                circle: 'Circle',
                rectangle: 'Rectangle',
                label: 'Label',
                segment: 'Segment',
                arrowSegment: 'Arrow segment',
                ray: 'Ray',
                arrowRay: 'Arrow ray',
                line: 'Line',
                arrowLine: 'Arrow line',
                horizontalLine: 'Horizontal line',
                verticalLine: 'Vertical line',
                crooked3: 'Crooked 3 line',
                crooked5: 'Crooked 5 line',
                elliott3: 'Elliott 3 line',
                elliott5: 'Elliott 5 line',
                verticalCounter: 'Vertical counter',
                verticalLabel: 'Vertical label',
                verticalArrow: 'Vertical arrow',
                fibonacci: 'Fibonacci',
                pitchfork: 'Pitchfork',
                parallelChannel: 'Parallel channel',
                infinityLine: 'Infinity line',
                measure: 'Measure',
                measureXY: 'Measure XY',
                measureX: 'Measure X',
                measureY: 'Measure Y',

                // Flags:
                flags: 'Flags',

                // GUI elements:
                addButton: 'add',
                saveButton: 'save',
                editButton: 'edit',
                removeButton: 'remove',
                series: 'Series',
                volume: 'Volume',
                connector: 'Connector',

                // Field names:
                innerBackground: 'Inner background',
                outerBackground: 'Outer background',
                crosshairX: 'Crosshair X',
                crosshairY: 'Crosshair Y',
                tunnel: 'Tunnel',
                background: 'Background'
            }
        }
    },
    /**
     * Configure the stockTools gui strings in the chart. Requires the
     * [stockTools module]() to be loaded. For a description of the module
     * and information on its features, see [Highcharts StockTools]().
     *
     * @product highstock
     *
     * @sample stock/demo/stock-tools-gui Stock Tools GUI
     *
     * @sample stock/demo/stock-tools-custom-gui Stock Tools customized GUI
     *
     * @since        7.0.0
     * @optionparent stockTools
     */
    stockTools: {
        /**
         * Definitions of buttons in Stock Tools GUI.
         */
        gui: {
            /**
             * Path where Highcharts will look for icons. Change this to use
             * icons from a different server.
             *
             * Since 7.1.3 use [iconsURL](#navigation.iconsURL) for popup and
             * stock tools.
             *
             * @deprecated
             * @apioption stockTools.gui.iconsURL
             *
             */
            /**
             * Enable or disable the stockTools gui.
             */
            enabled: true,
            /**
             * A CSS class name to apply to the stocktools' div,
             * allowing unique CSS styling for each chart.
             */
            className: 'highcharts-bindings-wrapper',
            /**
             * A CSS class name to apply to the container of buttons,
             * allowing unique CSS styling for each chart.
             */
            toolbarClassName: 'stocktools-toolbar',
            /**
             * A collection of strings pointing to config options for the
             * toolbar items. Each name refers to a unique key from the
             * definitions object.
             *
             * @type    {Array<string>}
             * @default [
             *   'indicators',
             *   'separator',
             *   'simpleShapes',
             *   'lines',
             *   'crookedLines',
             *   'measure',
             *   'advanced',
             *   'toggleAnnotations',
             *   'separator',
             *   'verticalLabels',
             *   'flags',
             *   'separator',
             *   'zoomChange',
             *   'fullScreen',
             *   'typeChange',
             *   'separator',
             *   'currentPriceIndicator',
             *   'saveChart'
             * ]
             */
            buttons: [
                'indicators',
                'separator',
                'simpleShapes',
                'lines',
                'crookedLines',
                'measure',
                'advanced',
                'toggleAnnotations',
                'separator',
                'verticalLabels',
                'flags',
                'separator',
                'zoomChange',
                'fullScreen',
                'typeChange',
                'separator',
                'currentPriceIndicator',
                'saveChart'
            ],
            /**
             * An options object of the buttons definitions. Each name refers to
             * unique key from buttons array.
             */
            definitions: {
                separator: {
                    /**
                     * A predefined background symbol for the button.
                     */
                    symbol: 'separator.svg'
                },
                simpleShapes: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'label',
                     *   'circle',
                     *   'rectangle'
                     * ]
                     *
                     */
                    items: [
                        'label',
                        'circle',
                        'rectangle'
                    ],
                    circle: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'circle.svg'
                    },
                    rectangle: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'rectangle.svg'
                    },
                    label: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'label.svg'
                    }
                },
                flags: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'flagCirclepin',
                     *   'flagDiamondpin',
                     *   'flagSquarepin',
                     *   'flagSimplepin'
                     * ]
                     *
                     */
                    items: [
                        'flagCirclepin',
                        'flagDiamondpin',
                        'flagSquarepin',
                        'flagSimplepin'
                    ],
                    flagSimplepin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'flag-basic.svg'
                    },
                    flagDiamondpin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'flag-diamond.svg'
                    },
                    flagSquarepin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'flag-trapeze.svg'
                    },
                    flagCirclepin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'flag-elipse.svg'
                    }
                },
                lines: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'segment',
                     *   'arrowSegment',
                     *   'ray',
                     *   'arrowRay',
                     *   'line',
                     *   'arrowLine',
                     *   'horizontalLine',
                     *   'verticalLine'
                     * ]
                     */
                    items: [
                        'segment',
                        'arrowSegment',
                        'ray',
                        'arrowRay',
                        'line',
                        'arrowLine',
                        'horizontalLine',
                        'verticalLine'
                    ],
                    segment: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'segment.svg'
                    },
                    arrowSegment: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'arrow-segment.svg'
                    },
                    ray: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'ray.svg'
                    },
                    arrowRay: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'arrow-ray.svg'
                    },
                    line: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'line.svg'
                    },
                    arrowLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'arrow-line.svg'
                    },
                    verticalLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-line.svg'
                    },
                    horizontalLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'horizontal-line.svg'
                    }
                },
                crookedLines: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'elliott3',
                     *   'elliott5',
                     *   'crooked3',
                     *   'crooked5'
                     * ]
                     *
                     */
                    items: [
                        'elliott3',
                        'elliott5',
                        'crooked3',
                        'crooked5'
                    ],
                    crooked3: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'crooked-3.svg'
                    },
                    crooked5: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'crooked-5.svg'
                    },
                    elliott3: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'elliott-3.svg'
                    },
                    elliott5: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'elliott-5.svg'
                    }
                },
                verticalLabels: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'verticalCounter',
                     *   'verticalLabel',
                     *   'verticalArrow'
                     * ]
                     */
                    items: [
                        'verticalCounter',
                        'verticalLabel',
                        'verticalArrow'
                    ],
                    verticalCounter: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-counter.svg'
                    },
                    verticalLabel: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-label.svg'
                    },
                    verticalArrow: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-arrow.svg'
                    }
                },
                advanced: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'fibonacci',
                     *   'pitchfork',
                     *   'parallelChannel'
                     * ]
                     */
                    items: [
                        'fibonacci',
                        'pitchfork',
                        'parallelChannel'
                    ],
                    pitchfork: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'pitchfork.svg'
                    },
                    fibonacci: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'fibonacci.svg'
                    },
                    parallelChannel: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'parallel-channel.svg'
                    }
                },
                measure: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'measureXY',
                     *   'measureX',
                     *   'measureY'
                     * ]
                     */
                    items: [
                        'measureXY',
                        'measureX',
                        'measureY'
                    ],
                    measureX: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'measure-x.svg'
                    },
                    measureY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'measure-y.svg'
                    },
                    measureXY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'measure-xy.svg'
                    }
                },
                toggleAnnotations: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'annotations-visible.svg'
                },
                currentPriceIndicator: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'current-price-show.svg'
                },
                indicators: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'indicators.svg'
                },
                zoomChange: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'zoomX',
                     *   'zoomY',
                     *   'zoomXY'
                     * ]
                     */
                    items: [
                        'zoomX',
                        'zoomY',
                        'zoomXY'
                    ],
                    zoomX: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'zoom-x.svg'
                    },
                    zoomY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'zoom-y.svg'
                    },
                    zoomXY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'zoom-xy.svg'
                    }
                },
                typeChange: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'typeOHLC',
                     *   'typeLine',
                     *   'typeCandlestick'
                     * ]
                     */
                    items: [
                        'typeOHLC',
                        'typeLine',
                        'typeCandlestick'
                    ],
                    typeOHLC: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-ohlc.svg'
                    },
                    typeLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-line.svg'
                    },
                    typeCandlestick: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-candlestick.svg'
                    }
                },
                fullScreen: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'fullscreen.svg'
                },
                saveChart: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'save-chart.svg'
                }
            }
        }
    }
});

/* eslint-disable no-invalid-this, valid-jsdoc */

// Run HTML generator
addEvent(Chart, 'afterGetContainer', function (): void {
    this.setStockTools();
});

addEvent(Chart, 'getMargins', function (): void {
    var listWrapper = this.stockTools && this.stockTools.listWrapper,
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
});

['beforeRender', 'beforeRedraw'].forEach((event: string): void => {
    addEvent(Chart, event, function (): void {
        if (this.stockTools) {
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
                this.spacingBox.x += offsetWidth;
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

/**
 * Toolbar Class
 * @private
 * @constructor
 * @param {Object} - options of toolbar
 * @param {Chart} - Reference to chart
 */

class Toolbar {
    public constructor(
        options: Highcharts.StockToolsGuiOptions,
        langOptions: (Record<string, string>|undefined),
        chart: Chart
    ) {
        this.chart = chart;
        this.options = options;
        this.lang = langOptions;
        // set url for icons.
        this.iconsURL = this.getIconsURL();
        this.guiEnabled = options.enabled;
        this.visible = pick(options.visible, true);
        this.placed = pick(options.placed, false);

        // General events collection which should be removed upon
        // destroy/update:
        this.eventsToUnbind = [];

        if (this.guiEnabled) {
            this.createHTML();

            this.init();

            this.showHideNavigatorion();
        }

        fireEvent(this, 'afterInit');
    }

    public arrowDown: HTMLDOMElement = void 0 as any;
    public arrowUp: HTMLDOMElement = void 0 as any;
    public arrowWrapper: HTMLDOMElement = void 0 as any;
    public chart: Chart;
    public eventsToUnbind: Array<Function>;
    public guiEnabled: (boolean|undefined);
    public iconsURL: string;
    public lang: (Record<string, string>|undefined);
    public listWrapper: HTMLDOMElement = void 0 as any;
    public options: Highcharts.StockToolsGuiOptions;
    public placed: boolean;
    public prevOffsetWidth: (number|undefined);
    public showhideBtn: HTMLDOMElement = void 0 as any;
    public submenu: HTMLDOMElement = void 0 as any;
    public toolbar: HTMLDOMElement = void 0 as any;
    public visible: boolean;
    public wrapper: HTMLDOMElement = void 0 as any;

    /**
     * Initialize the toolbar. Create buttons and submenu for each option
     * defined in `stockTools.gui`.
     * @private
     */
    public init(): void {
        var _self = this,
            lang = this.lang,
            guiOptions = this.options,
            toolbar = this.toolbar,
            addSubmenu = _self.addSubmenu,
            buttons: Array<string> = guiOptions.buttons as any,
            defs: Highcharts.StockToolsGuiDefinitionsOptions =
                guiOptions.definitions as any,
            allButtons = toolbar.childNodes,
            button: (Record<string, HTMLDOMElement>|undefined);

        // create buttons
        buttons.forEach(function (btnName: string): void {

            button = _self.addButton(toolbar, defs, btnName, lang);

            _self.eventsToUnbind.push(
                addEvent(
                    (button as any).buttonWrapper,
                    'click',
                    function (): void {
                        _self.eraseActiveButtons(
                            allButtons as any,
                            (button as any).buttonWrapper
                        );
                    }
                )
            );

            if (isArray((defs as any)[btnName].items)) {
                // create submenu buttons
                addSubmenu.call(_self, button, (defs as any)[btnName]);
            }
        });
    }
    /**
     * Create submenu (list of buttons) for the option. In example main button
     * is Line, in submenu will be buttons with types of lines.
     * @private
     * @param {Highcharts.Dictionary<Highcharts.HTMLDOMElement>}
     * button which has submenu
     * @param {Highcharts.StockToolsGuiDefinitionsButtonsOptions}
     * list of all buttons
     */
    public addSubmenu(
        parentBtn: Record<string, HTMLDOMElement>,
        button: Highcharts.StockToolsGuiDefinitionsButtonsOptions
    ): void {
        var _self = this,
            submenuArrow = parentBtn.submenuArrow,
            buttonWrapper = parentBtn.buttonWrapper,
            buttonWidth: number = getStyle(buttonWrapper, 'width') as any,
            wrapper = this.wrapper,
            menuWrapper = this.listWrapper,
            allButtons = this.toolbar.childNodes,
            topMargin = 0,
            submenuWrapper: (HTMLDOMElement|undefined);

        // create submenu container
        this.submenu = submenuWrapper = createElement(UL, {
            className: PREFIX + 'submenu-wrapper'
        }, null as any, buttonWrapper);

        // create submenu buttons and select the first one
        this.addSubmenuItems(buttonWrapper, button);

        // show / hide submenu
        _self.eventsToUnbind.push(
            addEvent(submenuArrow, 'click', function (e: Event): void {

                e.stopPropagation();
                // Erase active class on all other buttons
                _self.eraseActiveButtons(allButtons as any, buttonWrapper);

                // hide menu
                if (buttonWrapper.className.indexOf(PREFIX + 'current') >= 0) {
                    menuWrapper.style.width =
                        (menuWrapper as any).startWidth + 'px';
                    buttonWrapper.classList.remove(PREFIX + 'current');
                    (submenuWrapper as any).style.display = 'none';
                } else {
                    // show menu
                    // to calculate height of element
                    (submenuWrapper as any).style.display = 'block';

                    topMargin = (submenuWrapper as any).offsetHeight -
                                buttonWrapper.offsetHeight - 3;

                    // calculate position of submenu in the box
                    // if submenu is inside, reset top margin
                    if (
                        // cut on the bottom
                        !((submenuWrapper as any).offsetHeight +
                            buttonWrapper.offsetTop >
                        wrapper.offsetHeight &&
                        // cut on the top
                        buttonWrapper.offsetTop > topMargin)
                    ) {
                        topMargin = 0;
                    }

                    // apply calculated styles
                    css((submenuWrapper as any), {
                        top: -topMargin + 'px',
                        left: buttonWidth + 3 + 'px'
                    });

                    buttonWrapper.className += ' ' + PREFIX + 'current';
                    (menuWrapper as any).startWidth = wrapper.offsetWidth;
                    menuWrapper.style.width = (menuWrapper as any).startWidth +
                        getStyle(menuWrapper, 'padding-left') +
                        (submenuWrapper as any).offsetWidth + 3 + 'px';
                }
            })
        );
    }
    /**
     * Create buttons in submenu
     * @private
     * @param {Highcharts.HTMLDOMElement}
     * button where submenu is placed
     * @param {Highcharts.StockToolsGuiDefinitionsButtonsOptions}
     * list of all buttons options
     *
     */
    public addSubmenuItems(
        buttonWrapper: HTMLDOMElement,
        button: Highcharts.StockToolsGuiDefinitionsButtonsOptions
    ): void {
        var _self = this,
            submenuWrapper = this.submenu,
            lang = this.lang,
            menuWrapper = this.listWrapper,
            items = button.items,
            firstSubmenuItem: HTMLDOMElement,
            submenuBtn: (Record<string, HTMLDOMElement>|undefined);

        // add items to submenu
        items.forEach(function (btnName: string): void {
            // add buttons to submenu
            submenuBtn = _self.addButton(
                submenuWrapper,
                button,
                btnName,
                lang
            );

            _self.eventsToUnbind.push(
                addEvent(
                    (submenuBtn as any).mainButton,
                    'click',
                    function (): void {
                        (_self.switchSymbol as any)(this, buttonWrapper, true);
                        menuWrapper.style.width =
                            (menuWrapper as any).startWidth + 'px';
                        submenuWrapper.style.display = 'none';
                    }
                )
            );
        });

        // select first submenu item
        firstSubmenuItem = submenuWrapper
            .querySelectorAll<HTMLDOMElement>('li > .' + PREFIX + 'menu-item-btn')[0];

        // replace current symbol, in main button, with submenu's button style
        _self.switchSymbol(firstSubmenuItem, false);
    }
    /*
     * Erase active class on all other buttons.
     *
     * @param {Array} - Array of HTML buttons
     * @param {HTMLDOMElement} - Current HTML button
     *
     */
    public eraseActiveButtons(
        buttons: NodeListOf<HTMLDOMElement>,
        currentButton: HTMLDOMElement,
        submenuItems?: NodeListOf<HTMLDOMElement>
    ): void {
        [].forEach.call(buttons, function (btn: HTMLDOMElement): void {
            if (btn !== currentButton) {
                btn.classList.remove(PREFIX + 'current');
                btn.classList.remove(PREFIX + 'active');
                submenuItems =
                    btn.querySelectorAll('.' + PREFIX + 'submenu-wrapper');

                // hide submenu
                if (submenuItems.length > 0) {
                    submenuItems[0].style.display = 'none';
                }
            }
        });
    }
    /**
     * Create single button. Consist of HTML elements `li`, `span`, and (if
     * exists) submenu container.
     * @private
     * @param {Highcharts.HTMLDOMElement} target
     * HTML reference, where button should be added
     * @param {Highcharts.StockToolsGuiDefinitionsButtonsOptions|Highcharts.StockToolsGuiDefinitionsOptions} options
     * All options, by btnName refer to particular button
     * @param {string} btnName
     * of functionality mapped for specific class
     * @param {Highcharts.Dictionary<string>} lang
     * All titles, by btnName refer to particular button
     * @return {Object} - references to all created HTML elements
     */
    public addButton(
        target: HTMLDOMElement,
        options: (
            Highcharts.StockToolsGuiDefinitionsButtonsOptions|
            Highcharts.StockToolsGuiDefinitionsOptions
        ),
        btnName: string,
        lang: Record<string, string> = {}
    ): Record<string, HTMLDOMElement> {
        var btnOptions: Highcharts.StockToolsGuiDefinitionsButtonsOptions =
                options[btnName] as any,
            items = btnOptions.items,
            classMapping = Toolbar.prototype.classMapping,
            userClassName = btnOptions.className || '',
            mainButton: (HTMLDOMElement|undefined),
            submenuArrow: (HTMLDOMElement|undefined),
            buttonWrapper: (HTMLDOMElement|undefined);

        // main button wrapper
        buttonWrapper = createElement(LI, {
            className: pick(classMapping[btnName], '') + ' ' + userClassName,
            title: lang[btnName] || btnName
        }, null as any, target);

        // single button
        mainButton = createElement(SPAN, {
            className: PREFIX + 'menu-item-btn'
        }, null as any, buttonWrapper);


        // submenu
        if (items && items.length) {

            // arrow is a hook to show / hide submenu
            submenuArrow = createElement(SPAN, {
                className: PREFIX + 'submenu-item-arrow ' +
                    PREFIX + 'arrow-right'
            }, null as any, buttonWrapper);

            (submenuArrow.style as any)['background-image'] = 'url(' +
                this.iconsURL + 'arrow-bottom.svg)';
        } else {
            (mainButton.style as any)['background-image'] = 'url(' +
                this.iconsURL + btnOptions.symbol + ')';
        }

        return {
            buttonWrapper: buttonWrapper,
            mainButton: mainButton,
            submenuArrow: submenuArrow as any
        };
    }
    /*
     * Create navigation's HTML elements: container and arrows.
     *
     */
    public addNavigation(): void {
        var stockToolbar = this,
            wrapper = stockToolbar.wrapper;

        // arrow wrapper
        stockToolbar.arrowWrapper = createElement(DIV, {
            className: PREFIX + 'arrow-wrapper'
        });

        stockToolbar.arrowUp = createElement(DIV, {
            className: PREFIX + 'arrow-up'
        }, null as any, stockToolbar.arrowWrapper);

        (stockToolbar.arrowUp.style as any)['background-image'] =
            'url(' + this.iconsURL + 'arrow-right.svg)';

        stockToolbar.arrowDown = createElement(DIV, {
            className: PREFIX + 'arrow-down'
        }, null as any, stockToolbar.arrowWrapper);

        (stockToolbar.arrowDown.style as any)['background-image'] =
            'url(' + this.iconsURL + 'arrow-right.svg)';

        wrapper.insertBefore(
            stockToolbar.arrowWrapper,
            wrapper.childNodes[0]
        );

        // attach scroll events
        stockToolbar.scrollButtons();
    }
    /*
     * Add events to navigation (two arrows) which allows user to scroll
     * top/down GUI buttons, if container's height is not enough.
     *
     */
    public scrollButtons(): void {
        var targetY = 0,
            _self = this,
            wrapper = _self.wrapper,
            toolbar = _self.toolbar,
            step = 0.1 * wrapper.offsetHeight; // 0.1 = 10%

        _self.eventsToUnbind.push(
            addEvent(_self.arrowUp, 'click', function (): void {
                if (targetY > 0) {
                    targetY -= step;
                    (toolbar.style as any)['margin-top'] = -targetY + 'px';
                }
            })
        );

        _self.eventsToUnbind.push(
            addEvent(_self.arrowDown, 'click', function (): void {
                if (
                    wrapper.offsetHeight + targetY <=
                    toolbar.offsetHeight + step
                ) {
                    targetY += step;
                    (toolbar.style as any)['margin-top'] = -targetY + 'px';
                }
            })
        );
    }
    /*
     * Create stockTools HTML main elements.
     *
     */
    public createHTML(): void {
        var stockToolbar = this,
            chart = stockToolbar.chart,
            guiOptions = stockToolbar.options,
            container = chart.container,
            navigation = chart.options.navigation,
            bindingsClassName = navigation && navigation.bindingsClassName,
            listWrapper,
            toolbar,
            wrapper;

        // create main container
        stockToolbar.wrapper = wrapper = createElement(DIV, {
            className: PREFIX + 'stocktools-wrapper ' +
                guiOptions.className + ' ' + bindingsClassName
        });
        (container.parentNode as any).insertBefore(wrapper, container);

        // toolbar
        stockToolbar.toolbar = toolbar = createElement(UL, {
            className: PREFIX + 'stocktools-toolbar ' +
                    guiOptions.toolbarClassName
        });

        // add container for list of buttons
        stockToolbar.listWrapper = listWrapper = createElement(DIV, {
            className: PREFIX + 'menu-wrapper'
        });

        wrapper.insertBefore(listWrapper, wrapper.childNodes[0]);
        listWrapper.insertBefore(toolbar, listWrapper.childNodes[0]);

        stockToolbar.showHideToolbar();

        // add navigation which allows user to scroll down / top GUI buttons
        stockToolbar.addNavigation();
    }
    /**
     * Function called in redraw verifies if the navigation should be visible.
     * @private
     */
    public showHideNavigatorion(): void {
        // arrows
        // 50px space for arrows
        if (
            this.visible &&
            this.toolbar.offsetHeight > (this.wrapper.offsetHeight - 50)
        ) {
            this.arrowWrapper.style.display = 'block';
        } else {
            // reset margin if whole toolbar is visible
            this.toolbar.style.marginTop = '0px';

            // hide arrows
            this.arrowWrapper.style.display = 'none';
        }
    }
    /**
     * Create button which shows or hides GUI toolbar.
     * @private
     */
    public showHideToolbar(): void {
        var stockToolbar = this,
            chart = this.chart,
            wrapper = stockToolbar.wrapper,
            toolbar = this.listWrapper,
            submenu = this.submenu,
            visible = this.visible,
            showhideBtn: (HTMLDOMElement|undefined);

        // Show hide toolbar
        this.showhideBtn = showhideBtn = createElement(DIV, {
            className: PREFIX + 'toggle-toolbar ' + PREFIX + 'arrow-left'
        }, null as any, wrapper);

        (showhideBtn.style as any)['background-image'] =
            'url(' + this.iconsURL + 'arrow-right.svg)';

        if (!visible) {
            // hide
            if (submenu) {
                submenu.style.display = 'none';
            }
            showhideBtn.style.left = '0px';
            stockToolbar.visible = visible = false;
            toolbar.classList.add(PREFIX + 'hide');
            showhideBtn.classList.toggle(PREFIX + 'arrow-right');
            wrapper.style.height = showhideBtn.offsetHeight + 'px';
        } else {
            wrapper.style.height = '100%';
            showhideBtn.style.top = getStyle(toolbar, 'padding-top') + 'px';
            showhideBtn.style.left = (
                wrapper.offsetWidth +
                (getStyle(toolbar, 'padding-left') as any)
            ) + 'px';
        }

        // Toggle menu
        stockToolbar.eventsToUnbind.push(
            addEvent(showhideBtn, 'click', function (): void {
                chart.update({
                    stockTools: {
                        gui: {
                            visible: !visible,
                            placed: true
                        }
                    }
                });
            })
        );
    }
    /*
     * In main GUI button, replace icon and class with submenu button's
     * class / symbol.
     *
     * @param {HTMLDOMElement} - submenu button
     * @param {Boolean} - true or false
     *
     */
    public switchSymbol(
        button: HTMLDOMElement,
        redraw?: boolean
    ): void {
        var buttonWrapper = button.parentNode,
            buttonWrapperClass = (buttonWrapper as any).classList.value,
            // main button in first level og GUI
            mainNavButton = (buttonWrapper as any).parentNode.parentNode;

        // set class
        mainNavButton.className = '';
        if (buttonWrapperClass) {
            mainNavButton.classList.add(buttonWrapperClass.trim());
        }

        // set icon
        mainNavButton
            .querySelectorAll('.' + PREFIX + 'menu-item-btn')[0]
            .style['background-image'] =
            (button.style as any)['background-image'];

        // set active class
        if (redraw) {
            this.selectButton(mainNavButton);
        }
    }
    /*
     * Set select state (active class) on button.
     *
     * @param {HTMLDOMElement} - button
     *
     */
    public selectButton(button: HTMLDOMElement): void {
        if (button.className.indexOf(activeClass) >= 0) {
            button.classList.remove(activeClass);
        } else {
            button.classList.add(activeClass);
        }
    }
    /*
     * Remove active class from all buttons except defined.
     *
     * @param {HTMLDOMElement} - button which should not be deactivated
     *
     */
    public unselectAllButtons(button: HTMLDOMElement): void {
        var activeButtons = (button.parentNode as any)
            .querySelectorAll('.' + activeClass);

        [].forEach.call(activeButtons, function (
            activeBtn: HTMLDOMElement
        ): void {
            if (activeBtn !== button) {
                activeBtn.classList.remove(activeClass);
            }
        });
    }
    /*
     * Update GUI with given options.
     *
     * @param {Object} - general options for Stock Tools
     */
    public update(options: Highcharts.StockToolsOptions): void {
        merge(true, this.chart.options.stockTools, options);
        this.destroy();
        this.chart.setStockTools(options);

        // If Stock Tools are updated, then bindings should be updated too:
        if (this.chart.navigationBindings) {
            this.chart.navigationBindings.update();
        }
    }
    /**
     * Destroy all HTML GUI elements.
     * @private
     */
    public destroy(): void {
        var stockToolsDiv = this.wrapper,
            parent = stockToolsDiv && stockToolsDiv.parentNode;

        this.eventsToUnbind.forEach(function (unbinder: Function): void {
            unbinder();
        });

        // Remove the empty element
        if (parent) {
            parent.removeChild(stockToolsDiv);
        }

        // redraw
        this.chart.isDirtyBox = true;
        this.chart.redraw();
    }
    /**
     * Redraw, GUI requires to verify if the navigation should be visible.
     * @private
     */
    public redraw(): void {
        this.showHideNavigatorion();
    }

    public getIconsURL(): string {
        return (this.chart.options.navigation as any).iconsURL ||
            this.options.iconsURL ||
            'https://code.highcharts.com/@product.version@/gfx/stock-icons/';
    }
}

interface Toolbar {
    classMapping: Record<string, string>;
}

/**
 * Mapping JSON fields to CSS classes.
 * @private
 */
Toolbar.prototype.classMapping = {
    circle: PREFIX + 'circle-annotation',
    rectangle: PREFIX + 'rectangle-annotation',
    label: PREFIX + 'label-annotation',
    segment: PREFIX + 'segment',
    arrowSegment: PREFIX + 'arrow-segment',
    ray: PREFIX + 'ray',
    arrowRay: PREFIX + 'arrow-ray',
    line: PREFIX + 'infinity-line',
    arrowLine: PREFIX + 'arrow-infinity-line',
    verticalLine: PREFIX + 'vertical-line',
    horizontalLine: PREFIX + 'horizontal-line',
    crooked3: PREFIX + 'crooked3',
    crooked5: PREFIX + 'crooked5',
    elliott3: PREFIX + 'elliott3',
    elliott5: PREFIX + 'elliott5',
    pitchfork: PREFIX + 'pitchfork',
    fibonacci: PREFIX + 'fibonacci',
    parallelChannel: PREFIX + 'parallel-channel',
    measureX: PREFIX + 'measure-x',
    measureY: PREFIX + 'measure-y',
    measureXY: PREFIX + 'measure-xy',
    verticalCounter: PREFIX + 'vertical-counter',
    verticalLabel: PREFIX + 'vertical-label',
    verticalArrow: PREFIX + 'vertical-arrow',
    currentPriceIndicator: PREFIX + 'current-price-indicator',
    indicators: PREFIX + 'indicators',
    flagCirclepin: PREFIX + 'flag-circlepin',
    flagDiamondpin: PREFIX + 'flag-diamondpin',
    flagSquarepin: PREFIX + 'flag-squarepin',
    flagSimplepin: PREFIX + 'flag-simplepin',
    zoomX: PREFIX + 'zoom-x',
    zoomY: PREFIX + 'zoom-y',
    zoomXY: PREFIX + 'zoom-xy',
    typeLine: PREFIX + 'series-type-line',
    typeOHLC: PREFIX + 'series-type-ohlc',
    typeCandlestick: PREFIX + 'series-type-candlestick',
    fullScreen: PREFIX + 'full-screen',
    toggleAnnotations: PREFIX + 'toggle-annotations',
    saveChart: PREFIX + 'save-chart',
    separator: PREFIX + 'separator'
};

extend(Chart.prototype, {
    /**
     * Verify if Toolbar should be added.
     * @private
     * @param {Highcharts.StockToolsOptions} - chart options
     */
    setStockTools: function (
        this: Chart,
        options?: Highcharts.StockToolsOptions
    ): void {
        var chartOptions: Highcharts.Options = this.options,
            lang: Highcharts.LangOptions = chartOptions.lang as any,
            guiOptions = merge(
                chartOptions.stockTools && chartOptions.stockTools.gui,
                options && options.gui
            ),
            langOptions = lang.stockTools && lang.stockTools.gui;

        this.stockTools = new Toolbar(guiOptions, langOptions, this);

        if ((this.stockTools as any).guiEnabled) {
            this.isDirtyBox = true;
        }
    }
});

// Comunication with bindings:
addEvent(NavigationBindings, 'selectButton', function (
    event: Record<string, HTMLDOMElement>
): void {
    var button = event.button,
        className = PREFIX + 'submenu-wrapper',
        gui = this.chart.stockTools;

    if (gui && gui.guiEnabled) {
        // Unslect other active buttons
        gui.unselectAllButtons(event.button);

        // If clicked on a submenu, select state for it's parent
        if ((button.parentNode as any).className.indexOf(className) >= 0) {
            button = (button.parentNode as any).parentNode;
        }
        // Set active class on the current button
        gui.selectButton(button);
    }
});

addEvent(NavigationBindings, 'deselectButton', function (
    event: Record<string, HTMLDOMElement>
): void {
    var button = event.button,
        className = PREFIX + 'submenu-wrapper',
        gui = this.chart.stockTools;

    if (gui && gui.guiEnabled) {
        // If deselecting a button from a submenu, select state for it's parent
        if ((button.parentNode as any).className.indexOf(className) >= 0) {
            button = (button.parentNode as any).parentNode;
        }
        gui.selectButton(button);
    }
});

H.Toolbar = Toolbar as any;
export default H.Toolbar;
