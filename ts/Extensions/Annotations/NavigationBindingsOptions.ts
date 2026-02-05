/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Highsoft, Black Label
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

import type AnnotationOptions from './AnnotationOptions';
import type { DeepPartial } from '../../Shared/Types';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * Configure the Popup strings in the chart. Requires the
         * `annotations.js` or `annotations-advanced.src.js` module to be
         * loaded.
         *
         * @since   7.0.0
         * @product highcharts highstock
         * @requires modules/annotations
         */
        navigation?: LangNavigationOptions;
    }
}

declare module '../Exporting/NavigationOptions' {
    interface NavigationOptions {
        /**
         * Additional options to be merged into all annotations.
         *
         * @sample stock/stocktools/navigation-annotation-options
         *         Set red color of all line annotations
         *
         * @type      {Highcharts.AnnotationsOptions}
         * @extends   annotations
         * @exclude   crookedLine, elliottWave, fibonacci, infinityLine,
         *            measure, pitchfork, tunnel, verticalLine, basicAnnotation
         * @requires     modules/annotations
         * @apioption navigation.annotationsOptions
         */
        annotationsOptions?: DeepPartial<AnnotationOptions>;

        /**
         * Bindings definitions for custom HTML buttons. Each binding implements
         * simple event-driven interface:
         *
         * - `className`: classname used to bind event to
         *
         * - `init`: initial event, fired on button click
         *
         * - `start`: fired on first click on a chart
         *
         * - `steps`: array of sequential events fired one after another on each
         *   of users clicks
         *
         * - `end`: last event to be called after last step event
         *
         * @type         {Highcharts.Dictionary<Highcharts.NavigationBindingsOptionsObject>|*}
         *
         * @sample {highstock} stock/stocktools/stocktools-thresholds
         *               Custom bindings
         * @sample {highcharts} highcharts/annotations/bindings/
         *               Simple binding
         * @sample {highcharts} highcharts/annotations/bindings-custom-annotation/
         *               Custom annotation binding
         *
         * @since        7.0.0
         * @requires     modules/annotations
         * @product      highcharts highstock
         */
        bindings?: Record<string, NavigationBindingsOptions>;

        /**
         * A CSS class name where all bindings will be attached to. Multiple
         * charts on the same page should have separate class names to prevent
         * duplicating events.
         *
         * Default value of versions < 7.0.4 `highcharts-bindings-wrapper`
         *
         * @since     7.0.0
         * @type      {string}
         */
        bindingsClassName?: string;

        /**
         * Events to communicate between Stock Tools and custom GUI.
         *
         * @since        7.0.0
         * @product      highcharts highstock
         * @optionparent navigation.events
         */
        events?: NavigationEventsOptions;

        /**
         * Path where Highcharts will look for icons. Change this to use icons
         * from a different server.
         *
         * @type      {string}
         * @default   https://code.highcharts.com/@product.version@/gfx/stock-icons/
         * @since     7.1.3
         * @apioption navigation.iconsURL
         */
        iconsURL?: string;
    }
}

interface IndicatorAliases {
    [key: string]: Array<string>;
}

export interface LangNavigationOptions {
    /**
     * Translations for all field names used in popup.
     *
     * @product highcharts highstock
     */
    popup?: PopupOptions;
}

interface NavigationBindingsOptions {
    /**
     * Options to customize the bindings' annotation shapes and labels.
     *
     * @type      {Highcharts.AnnotationsOptions}
     * @extends   navigation.annotationsOptions
     */
    annotationsOptions?: DeepPartial<AnnotationOptions>;

    /** @internal */
    noDataState?: 'normal' | 'disabled';

    /** @internal */
    className: string;

    /** @internal */
    end?: Function;

    /** @internal */
    init?: Function;

    /** @internal */
    start?: Function;

    /** @internal */
    steps?: Array<Function>;
}

interface NavigationEventsOptions {
    /**
     * A `closePopup` event. Fired when Popup should be hidden, for example
     * when clicking on an annotation again.
     *
     * @type      {Function}
     * @apioption navigation.events.closePopup
     */
    closePopup?: Function;

    /**
     * Event fired when button state should change, for example after
     * adding an annotation.
     *
     * @type      {Function}
     * @sample    highcharts/annotations/gui/
     *            Change icon in a dropddown on event
     * @sample    highcharts/annotations/gui-buttons/
     *            Change button class on event
     * @apioption navigation.events.deselectButton
     */
    deselectButton?: Function;

    /**
     * Event fired on a button click.
     *
     * @type      {Function}
     * @sample    highcharts/annotations/gui/
     *            Change icon in a dropddown on event
     * @sample    highcharts/annotations/gui-buttons/
     *            Change button class on event
     * @apioption navigation.events.selectButton
     */
    selectButton?: Function;

    /**
     * A `showPopup` event. Fired when selecting for example an annotation.
     *
     * @type      {Function}
     * @apioption navigation.events.showPopup
     */
    showPopup?: Function;
}

export interface PopupOptions {
    [key: string]: (string | IndicatorAliases | undefined);
    indicatorAliases?: IndicatorAliases;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigationBindingsOptions;
