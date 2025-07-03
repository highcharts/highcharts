/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Accessibility module for Highcharts: Declarations for options
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Options from '../Core/Options';
import type { A11yModel } from './ChartInfoProvider';

/**
 * Options for configuring accessibility for the chart. Requires the
 * [accessibility module](https://code.highcharts.com/modules/a11y.js)
 * to be loaded. For a description of the module and information
 * on its features, see
 * [Highcharts Accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module).
 *
 * @since        next
 * @requires     modules/a11y
 * @optionparent a11y
 */
export interface A11yTopLevelOptions {
    /**
     * Enable accessibility functionality for the chart. For more
     * information on how to include these features, and why this is
     * recommended, see [Highcharts Accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module).
     *
     * Highcharts will by default emit a warning to the console if
     * the [accessibility module](https://code.highcharts.com/modules/a11y.js)
     * is not loaded. Setting this option to `false` will override
     * and silence the warning.
     *
     * Once the module is loaded, setting this option to `false`
     * will disable the module for this chart.
     */
    enabled?: boolean;

    /**
     * The interaction model for the chart. This is a big-picture control that
     * decides how information is made accessible to assistive technology, and
     * how keyboard navigation behaves.
     *
     * The default model is an intelligent guess based on the chart type and
     * contents. The models range from a simple summary of the chart, similar
     * to an alt text for an image, to a fully interactive model with custom
     * keyboard navigation. More complex models are needed for more complex
     * charts, but are also more difficult to use and understand for users.
     *
     * Options are:
     * - `summary`: A basic summary of the chart, with no custom interaction.
     * Analogous to an alt text for an image. No keyboard navigation. Used by
     * default for simple charts with very few data points.
     * - `list`: A list-style, more detailed summary of the chart's contents.
     * Points can be navigated with the keyboard, but only in a linear fashion.
     * Used by default for simple charts with relatively few data points.
     * - `application`: An interactive model with complex keyboard navigation.
     * Custom keyboard shortcuts are available, and can optionally be customized
     * to your specific needs. The application model is by default used for more
     * complex charts, and its default behavior depends on the chart type and
     * contents.
     */
    model?: A11yModel;
}


/**
 * Lang options for localization of accessibility features. Requires the
 * [accessibility module](https://code.highcharts.com/modules/a11y.js)
 * to be loaded. For a description of the module and information
 * on its features, see
 * [Highcharts Accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module).
 *
 * @since      next
 * @requires   modules/a11y
 */
export interface LangA11yOptions {
    defaultChartTitle?: string;
}


declare module '../Core/Options' {
    interface Options {
        a11y?: A11yTopLevelOptions;
    }
}

declare module '../Core/Options'{
    interface LangOptions {
        a11y?: LangA11yOptions;
    }
}

export default Options;
