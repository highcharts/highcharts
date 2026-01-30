/* *
 *
 *  GUI generator for Stock tools
 *
 *  (c) 2009-2026 Sebastian Bochan
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    LangNavigationOptions
} from '../../Extensions/Annotations/NavigationBindingsOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Language options for stock tools.
 *
 * @interface Highcharts.LangOptions
 */
export interface LangOptions {
    navigation?: LangNavigationOptions;
    stockTools: LangStockToolsOptions;
}

/**
 * Language configuration for stock tools GUI.
 *
 * @interface Highcharts.LangStockToolsOptions
 */
export interface LangStockToolsOptions {

    /**
     * Configure the stockTools GUI titles(hints) in the chart. Requires
     * the `stock-tools.js` module to be loaded.
     *
     * @product highstock
     * @since   7.0.0
     */
    gui?: Record<string, string>;
}

/**
 * Configuration options for stock tools GUI definition buttons.
 *
 * @interface Highcharts.StockToolsGuiDefinitionsButtonOptions
 */
export interface StockToolsGuiDefinitionsButtonOptions {

    /**
     * Element type for the button.
     *
     * @type {'span'|'button'}
     */
    elementType?: 'span'|'button';

    /**
     * A predefined background symbol for the button.
     *
     * @type {string}
     */
    symbol?: string;
}

/**
 * Configuration options for stock tools GUI definition button groups.
 *
 * @interface Highcharts.StockToolsGuiDefinitionsButtonsOptions
 */
export interface StockToolsGuiDefinitionsButtonsOptions {
    [key: string]: (Array<string>|StockToolsGuiDefinitionsButtonOptions);

    /**
     * Items in the button group.
     */
    items: Array<string>;
}

/**
 * Definitions of buttons and button groups for the stock tools GUI.
 *
 * @interface Highcharts.StockToolsGuiDefinitionsOptions
 */
export interface StockToolsGuiDefinitionsOptions {
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

/**
 * Configuration options for the stock tools GUI.
 *
 * @interface Highcharts.StockToolsGuiOptions
 */
export interface StockToolsGuiOptions {

    /**
     * An array of strings pointing to config options for the toolbar items.
     * Each name refers to a unique key from the definitions object.
     *
     * @type {Array<string>}
     */
    buttons?: Array<string>;

    /**
     * A CSS class name to apply to the stock tools container, allowing
     * unique styling when multiple charts are on the same page.
     */
    className?: string;

    /**
     * Definitions of buttons and button groups for the stock tools GUI.
     */
    definitions?: StockToolsGuiDefinitionsOptions;

    /**
     * Enable or disable the stock tools GUI.
     */
    enabled?: boolean;

    /**
     * A full path to the icons location. Icons are stored as SVG files.
     *
     * @type {string}
     */
    iconsURL?: string;

    /** @internal */
    placed?: boolean;

    /**
     * A CSS class name to apply to the toolbar buttons, allowing
     * unique styling when multiple charts are on the same page.
     */
    toolbarClassName?: string;

    /**
     * Whether the stock tools toolbar is visible.
     *
     * @since 11.4.4
     */
    visible?: boolean;
}

/**
 * Configure the stock tools GUI for adding indicators, annotations, etc.
 * Requires the `stock-tools.js` module to be loaded.
 *
 * @interface Highcharts.StockToolsOptions
 * @product   highstock
 * @since     7.0.0
 */
export interface StockToolsOptions {

    /**
     * Configuration for the stock tools GUI.
     */
    gui: StockToolsGuiOptions;
}

/* *
 *
 *  Default Options
 *
 * */

export default StockToolsOptions;
