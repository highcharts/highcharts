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
import type { A11yModel } from './ChartInfo';

export type A11yHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

export type A11yOrder = (
    'breadcrumbs' | 'rangeSelector' | 'data' | 'zoom' |
    'navigator' | 'legend' | 'menu' | 'credits' | 'stockTools'
)[];


export interface A11yChartDescriptionSectionOptions {
    /**
     * The format for the chart title in the description section.
     *
     * `{chartTitle}` is replaced with the chart title, or default chart title
     * if none is visible in the chart.
     *
     * The chart context is available as `{chart}`, and can be used to access other
     * information. See [Templating](https://www.highcharts.com/docs/chart-concepts/templating)
     * for more information.
     */
    chartTitleFormat?: string;

    /**
     * The format for the chart subtitle in the description section.
     *
     * `{chartSubtitle}` is replaced with the chart subtitle.
     *
     * The chart context is available as `{chart}`, and can be used to access other
     * information. See [Templating](https://www.highcharts.com/docs/chart-concepts/templating)
     * for more information.
     */
    chartSubtitleFormat?: string;

    /**
     * Link the chart to an HTML element describing the contents of the
     * chart.
     *
     * It is always recommended to describe charts using visible text, to
     * improve SEO as well as accessibility for users with disabilities.
     * This option lets an HTML element with a description be linked to the
     * chart, so that for example screen reader users can connect the two.
     *
     * By setting this option to a string, Highcharts runs the string as an
     * HTML selector query on the entire document. If there is only a single
     * match, this element is linked to the chart. The content of the linked
     * element will be included in the chart description by default, see
     * [a11y.chartDescriptionSection.chartDescriptionFormat](#a11y.chartDescriptionSection.chartDescriptionFormat).
     *
     * By default, the chart looks for an adjacent sibling element with the
     * `highcharts-description` class.
     *
     * The feature can be disabled by setting the option to an empty string,
     * or overridden by providing the
     * [a11y.chartDescriptionSection.chartDescriptionFormat](#a11y.chartDescriptionSection.chartDescriptionFormat)
     * option directly.
     *
     * If you need the description to be part of the exported image,
     * consider using the [caption](#caption) feature. The caption is also
     * picked up into the description, unless a linked description is found.
     */
    linkedDescription?: string;

    /**
     * The format for your provided chart description in the description.
     *
     * This will contain the description you provide through [a11y.chartDescriptionSection.linkedDescription](#a11y.chartDescriptionSection.linkedDescription).
     * If this is not available, it will contain the chart caption text, if any.
     * Alternatively, you can directly set the description text here.
     *
     * `{linkedDescription}` is replaced with the linked chart description, if available.
     * `{caption}` is replaced with the caption text, if available.
     *
     * The chart context is available as `{chart}`, and can be used to access other
     * information. See [Templating](https://www.highcharts.com/docs/chart-concepts/templating)
     * for more information.
     */
    chartDescriptionFormat?: string;

    /**
     * The format for the auto-generated chart description in the description
     * section.
     *
     * This description is generated mathematically, based on the chart
     * contents, and is intended to provide a basic understanding of the chart.
     * It will update automatically as the chart contents change.
     *
     * `{chartAutoDescription}` is replaced with the auto-generated chart description.
     *
     * The chart context is available as `{chart}`, and can be used to access other
     * information. See [Templating](https://www.highcharts.com/docs/chart-concepts/templating)
     * for more information.
     */
    chartAutoDescriptionFormat?: string;

    /**
     * By default, the chart description elements are positioned on top of the
     * corresponding visual elements, which in particular benefits screen reader
     * users - especially on touch devices.
     *
     * In some edge cases, for example where you rely on CSS hover styles, or
     * have very complex interactivity on these elements, you may need to turn
     * this behavior off for optimal results.
     */
    positionOnChart?: boolean;
}


export interface A11yDataDescriptionsOptions {
    // Todo
}


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
     * default for simple charts with very few data points and no tooltip.
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

    /**
     * Set the heading level for the chart title.
     *
     * By default, the chart attempts to determine the correct heading level,
     * but in many cases this is ambiguous and not possible. In those cases,
     * the heading level will default to `h6`.
     *
     * Can also be set to `p` to use a paragraph instead of a heading.
     */
    headingLevel?: A11yHeadingLevel;

    /**
     * The order of accessibility features in the chart, impacting reading order
     * for screen readers and other assistive technology, as well as keyboard
     * navigation order.
     *
     * This should generally match the visual order of the chart.
     */
    order?: A11yOrder;

    /**
     * Options for the chart description section, which is the invisible section
     * before the chart that typically contains information such as the chart
     * title, subtitle, and description.
     *
     * This section is read by screen readers and other assistive technology,
     * and its main purpose is to provide enough information for the user to
     * decide if they want to interact with the chart further or not.
     */
    chartDescriptionSection?: A11yChartDescriptionSectionOptions;

    /**
     * Configuration for data descriptions for the chart.
     *
     * Includes configuration for how we describe individual series, features,
     * or data points.
     */
    dataDescriptions?: A11yDataDescriptionsOptions;
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
    /**
     * Chart title used when no title is set on the chart.
     */
    defaultChartTitle?: string;

    /**
     * Hint text before the chart, read by screen readers when the model is
     * `application`.
     *
     * User testing has shown that this can be useful in more complex charts,
     * to help users understand that the chart has additional interactive
     * features, such as sonification or custom keyboard navigation, and they
     * should expect more than just an alt text or a list.
     */
    chartInteractionHint?: string;
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
