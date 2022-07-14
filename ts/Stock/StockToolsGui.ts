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
import type Options from '../Core/Options';
import type {
    HTMLDOMElement
} from '../Core/Renderer/DOMElementType';

import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import NavigationBindings from '../Extensions/Annotations/NavigationBindings.js';
import O from '../Core/DefaultOptions.js';
const { setOptions } = O;
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
        setStockTools(options?: Highcharts.StockToolsOptions): void;
    }
}

declare module '../Core/LangOptions'{
    interface LangOptions {
        stockTools?: Highcharts.LangStockToolsOptions;
    }
}

declare module '../Core/Options'{
    interface Options {
        stockTools?: Highcharts.StockToolsOptions;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface LangStockToolsOptions {
            gui?: Record<string, string>;
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
                typeHLC: 'HLC',
                typeHollowCandlestick: 'Hollow Candlestick',
                typeHeikinAshi: 'Heikin Ashi',

                // Basic shapes:
                circle: 'Circle',
                ellipse: 'Ellipse',
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
                arrowInfinityLine: 'Arrow line',
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
                fibonacciTimeZones: 'Fibonacci Time Zones',
                pitchfork: 'Pitchfork',
                parallelChannel: 'Parallel channel',
                timeCycles: 'Time Cycles'
            }
        },
        navigation: {
            popup: {
                // Annotations:
                circle: 'Circle',
                ellipse: 'Ellipse',
                rectangle: 'Rectangle',
                label: 'Label',
                segment: 'Segment',
                arrowSegment: 'Arrow segment',
                ray: 'Ray',
                arrowRay: 'Arrow ray',
                line: 'Line',
                arrowInfinityLine: 'Arrow line',
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
                fibonacciTimeZones: 'Fibonacci Time Zones',
                pitchfork: 'Pitchfork',
                parallelChannel: 'Parallel channel',
                infinityLine: 'Infinity line',
                measure: 'Measure',
                measureXY: 'Measure XY',
                measureX: 'Measure X',
                measureY: 'Measure Y',
                timeCycles: 'Time Cycles',

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
                background: 'Background',

                // Indicators' searchbox (#16019):
                noFilterMatch: 'No match',

                // Indicators' params (#15170):
                searchIndicators: 'Search Indicators',
                clearFilter: '\u2715 clear filter',
                index: 'Index',
                period: 'Period',
                periods: 'Periods',
                standardDeviation: 'Standard deviation',
                periodTenkan: 'Tenkan period',
                periodSenkouSpanB: 'Senkou Span B period',
                periodATR: 'ATR period',
                multiplierATR: 'ATR multiplier',
                shortPeriod: 'Short period',
                longPeriod: 'Long period',
                signalPeriod: 'Signal period',
                decimals: 'Decimals',
                algorithm: 'Algorithm',
                topBand: 'Top band',
                bottomBand: 'Bottom band',
                initialAccelerationFactor: 'Initial acceleration factor',
                maxAccelerationFactor: 'Max acceleration factor',
                increment: 'Increment',
                multiplier: 'Multiplier',
                ranges: 'Ranges',
                highIndex: 'High index',
                lowIndex: 'Low index',
                deviation: 'Deviation',
                xAxisUnit: 'x-axis unit',
                factor: 'Factor',
                fastAvgPeriod: 'Fast average period',
                slowAvgPeriod: 'Slow average period',
                average: 'Average',

                /**
                 * Configure the aliases for indicator names.
                 *
                 * @product highstock
                 * @since 9.3.0
                 */
                indicatorAliases: {
                    // Overlays

                    /**
                     * Acceleration Bands alias.
                     *
                     * @default ['Acceleration Bands']
                     * @type    {Array<string>}
                     */
                    abands: ['Acceleration Bands'],

                    /**
                     * Bollinger Bands alias.
                     *
                     * @default ['Bollinger Bands']
                     * @type    {Array<string>}
                     */
                    bb: ['Bollinger Bands'],

                    /**
                     * Double Exponential Moving Average alias.
                     *
                     * @default ['Double Exponential Moving Average']
                     * @type    {Array<string>}
                     */
                    dema: ['Double Exponential Moving Average'],

                    /**
                     *  Exponential Moving Average alias.
                     *
                     * @default ['Exponential Moving Average']
                     * @type    {Array<string>}
                     */
                    ema: ['Exponential Moving Average'],

                    /**
                     *  Ichimoku Kinko Hyo alias.
                     *
                     * @default ['Ichimoku Kinko Hyo']
                     * @type    {Array<string>}
                     */
                    ikh: ['Ichimoku Kinko Hyo'],

                    /**
                     *  Keltner Channels alias.
                     *
                     * @default ['Keltner Channels']
                     * @type    {Array<string>}
                     */
                    keltnerchannels: ['Keltner Channels'],

                    /**
                     *  Linear Regression alias.
                     *
                     * @default ['Linear Regression']
                     * @type    {Array<string>}
                     */
                    linearRegression: ['Linear Regression'],

                    /**
                     *  Pivot Points alias.
                     *
                     * @default ['Pivot Points']
                     * @type    {Array<string>}
                     */
                    pivotpoints: ['Pivot Points'],

                    /**
                     *  Price Channel alias.
                     *
                     * @default ['Price Channel']
                     * @type    {Array<string>}
                     */
                    pc: ['Price Channel'],

                    /**
                     *  Price Envelopes alias.
                     *
                     * @default ['Price Envelopes']
                     * @type    {Array<string>}
                     */
                    priceenvelopes: ['Price Envelopes'],

                    /**
                     *  Parabolic SAR alias.
                     *
                     * @default ['Parabolic SAR']
                     * @type    {Array<string>}
                     */
                    psar: ['Parabolic SAR'],

                    /**
                     *  Simple Moving Average alias.
                     *
                     * @default ['Simple Moving Average']
                     * @type    {Array<string>}
                     */
                    sma: ['Simple Moving Average'],

                    /**
                     *  Super Trend alias.
                     *
                     * @default ['Super Trend']
                     * @type    {Array<string>}
                     */
                    supertrend: ['Super Trend'],

                    /**
                     *  Triple Exponential Moving Average alias.
                     *
                     * @default ['Triple Exponential Moving Average']
                     * @type    {Array<string>}
                     */
                    tema: ['Triple Exponential Moving Average'],

                    /**
                     *  Volume by Price alias.
                     *
                     * @default ['Volume by Price']
                     * @type    {Array<string>}
                     */
                    vbp: ['Volume by Price'],

                    /**
                     *  Volume Weighted Moving Average alias.
                     *
                     * @default ['Volume Weighted Moving Average']
                     * @type    {Array<string>}
                     */
                    vwap: ['Volume Weighted Moving Average'],

                    /**
                     *  Weighted Moving Average alias.
                     *
                     * @default ['Weighted Moving Average']
                     * @type    {Array<string>}
                     */
                    wma: ['Weighted Moving Average'],

                    /**
                     *  Zig Zagalias.
                     *
                     * @default ['Zig Zag']
                     * @type    {Array<string>}
                     */
                    zigzag: ['Zig Zag'],

                    // Oscilators
                    /**
                     *  Absolute price indicator alias.
                     *
                     * @default ['Absolute price indicator']
                     * @type    {Array<string>}
                     */
                    apo: ['Absolute price indicator'],

                    /**
                     * Accumulation/Distribution alias.
                     *
                     * @default ['Accumulation/Distribution’]
                     * @type    {Array<string>}
                     */
                    ad: ['Accumulation/Distribution'],

                    /**
                     *  Aroon alias.
                     *
                     * @default ['Aroon']
                     * @type    {Array<string>}
                     */
                    aroon: ['Aroon'],

                    /**
                     *  Aroon oscillator alias.
                     *
                     * @default ['Aroon oscillator']
                     * @type    {Array<string>}
                     */
                    aroonoscillator: ['Aroon oscillator'],

                    /**
                     *  Average True Range alias.
                     *
                     * @default ['Average True Range’]
                     * @type    {Array<string>}
                     */

                    atr: ['Average True Range'],

                    /**
                     *  Awesome oscillator alias.
                     *
                     * @default ['Awesome oscillator’]
                     * @type    {Array<string>}
                     */

                    ao: ['Awesome oscillator'],

                    /**
                     *  Commodity Channel Index alias.
                     *
                     * @default ['Commodity Channel Index’]
                     * @type    {Array<string>}
                     */

                    cci: ['Commodity Channel Index'],

                    /**
                     *  Chaikin alias.
                     *
                     * @default ['Chaikin’]
                     * @type    {Array<string>}
                     */
                    chaikin: ['Chaikin'],

                    /**
                     *  Chaikin Money Flow alias.
                     *
                     * @default ['Chaikin Money Flow’]
                     * @type    {Array<string>}
                     */
                    cmf: ['Chaikin Money Flow'],

                    /**
                     *  Chande Momentum Oscillator alias.
                     *
                     * @default ['Chande Momentum Oscillator’]
                     * @type    {Array<string>}
                     */
                    cmo: ['Chande Momentum Oscillator'],

                    /**
                     *  Disparity Index alias.
                     *
                     * @default ['Disparity Index’]
                     * @type    {Array<string>}
                     */
                    disparityindex: ['Disparity Index'],

                    /**
                     *  Directional Movement Index alias.
                     *
                     * @default ['Directional Movement Index’]
                     * @type    {Array<string>}
                     */
                    dmi: ['Directional Movement Index'],

                    /**
                     *  Detrended price oscillator alias.
                     *
                     * @default ['Detrended price oscillator’]
                     * @type    {Array<string>}
                     */
                    dpo: ['Detrended price oscillator'],

                    /**
                     *  Klinger Oscillator alias.
                     *
                     * @default [‘Klinger Oscillator’]
                     * @type    {Array<string>}
                     */
                    klinger: ['Klinger Oscillator'],

                    /**
                     *  Linear Regression Angle alias.
                     *
                     * @default [‘Linear Regression Angle’]
                     * @type    {Array<string>}
                     */
                    linearRegressionAngle: ['Linear Regression Angle'],

                    /**
                     *  Linear Regression Intercept alias.
                     *
                     * @default [‘Linear Regression Intercept’]
                     * @type    {Array<string>}
                     */
                    linearRegressionIntercept: ['Linear Regression Intercept'],

                    /**
                     *  Linear Regression Slope alias.
                     *
                     * @default [‘Linear Regression Slope’]
                     * @type    {Array<string>}
                     */
                    linearRegressionSlope: ['Linear Regression Slope'],


                    /**
                     *  Moving Average Convergence Divergence alias.
                     *
                     * @default ['Moving Average Convergence Divergence’]
                     * @type    {Array<string>}
                     */
                    macd: ['Moving Average Convergence Divergence'],

                    /**
                     *  Money Flow Index alias.
                     *
                     * @default ['Money Flow Index’]
                     * @type    {Array<string>}
                     */
                    mfi: ['Money Flow Index'],

                    /**
                     *  Momentum alias.
                     *
                     * @default [‘Momentum’]
                     * @type    {Array<string>}
                     */
                    momentum: ['Momentum'],

                    /**
                     *  Normalized Average True Range alias.
                     *
                     * @default ['Normalized Average True Range’]
                     * @type    {Array<string>}
                     */

                    natr: ['Normalized Average True Range'],

                    /**
                     *  On-Balance Volume alias.
                     *
                     * @default ['On-Balance Volume’]
                     * @type    {Array<string>}
                     */
                    obv: ['On-Balance Volume'],

                    /**
                     * Percentage Price oscillator alias.
                     *
                     * @default ['Percentage Price oscillator’]
                     * @type    {Array<string>}
                     */
                    ppo: ['Percentage Price oscillator'],

                    /**
                     *  Rate of Change alias.
                     *
                     * @default ['Rate of Change’]
                     * @type    {Array<string>}
                     */
                    roc: ['Rate of Change'],

                    /**
                     *  Relative Strength Index alias.
                     *
                     * @default ['Relative Strength Index’]
                     * @type    {Array<string>}
                     */
                    rsi: ['Relative Strength Index'],

                    /**
                     *  Slow Stochastic alias.
                     *
                     * @default [‘Slow Stochastic’]
                     * @type    {Array<string>}
                     */
                    slowstochastic: ['Slow Stochastic'],

                    /**
                     *  Stochastic alias.
                     *
                     * @default [‘Stochastic’]
                     * @type    {Array<string>}
                     */
                    stochastic: ['Stochastic'],

                    /**
                     *  TRIX alias.
                     *
                     * @default [‘TRIX’]
                     * @type    {Array<string>}
                     */
                    trix: ['TRIX'],

                    /**
                     *  Williams %R alias.
                     *
                     * @default [‘Williams %R’]
                     * @type    {Array<string>}
                     */
                    williamsr: ['Williams %R']
                }
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
                     * @type {Array}
                     * @default [
                     *   'label',
                     *   'circle',
                     *   'ellipse',
                     *   'rectangle'
                     * ]
                     *
                     */
                    items: [
                        'label',
                        'circle',
                        'ellipse',
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
                    ellipse: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'ellipse.svg'
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
                     * @type {Array}
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
                     * @type {Array}
                     * @default [
                     *   'segment',
                     *   'arrowSegment',
                     *   'ray',
                     *   'arrowRay',
                     *   'line',
                     *   'arrowInfinityLine',
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
                        'arrowInfinityLine',
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
                    arrowInfinityLine: {
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
                     * @type {Array}
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
                     * @type {Array}
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
                     * @type {Array}
                     * @default [
                     *   'fibonacci',
                     *   'fibonacciTimeZones',
                     *   'pitchfork',
                     *   'parallelChannel',
                     *   'timeCycles'
                     * ]
                     */
                    items: [
                        'fibonacci',
                        'fibonacciTimeZones',
                        'pitchfork',
                        'parallelChannel',
                        'timeCycles'
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
                    fibonacciTimeZones: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'fibonacci-timezone.svg'
                    },
                    parallelChannel: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'parallel-channel.svg'
                    },
                    timeCycles: {
                        /**
                         * A predefined backgroud symbol for the button.
                         *
                         * @type {string}
                         */
                        symbol: 'time-cycles.svg'
                    }
                },
                measure: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {Array}
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
                     * @type {Array}
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
                     * @type {Array}
                     * @default [
                     *   'typeOHLC',
                     *   'typeLine',
                     *   'typeCandlestick'
                     *   'typeHollowCandlestick'
                     * ]
                     */
                    items: [
                        'typeOHLC',
                        'typeLine',
                        'typeCandlestick',
                        'typeHollowCandlestick',
                        'typeHLC',
                        'typeHeikinAshi'
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
                    },
                    typeHLC: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-hlc.svg'
                    },
                    typeHeikinAshi: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-heikin-ashi.svg'
                    },
                    typeHollowCandlestick: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-hollow-candlestick.svg'
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
        options?: Highcharts.StockToolsOptions
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
