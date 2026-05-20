/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Animation/AnimationOptions';
import type ColorType from '../Color/ColorType';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type { DeepPartial } from '../../Shared/Types';
import type { PointMarkerOptions } from './PointOptions';
import type SeriesOptions from './SeriesOptions';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

export interface StateClassWithOptions {}

export type StateGenericOptions<T extends SeriesOptions | PointMarkerOptions> = (
    DeepPartial<Omit<T, ('states'|'data')>>
);

/**
 * Options for the halo element appearing around a hovered point or series.
 */
export interface StateHaloOptions {
    /**
     * A collection of SVG attributes to override the appearance of the halo,
     * for example `fill`, `stroke` and `stroke-width`.
     *
     * @since   4.0
     * @product highcharts highstock
     */
    attributes?: SVGAttributes;

    brightness?: number;

    /**
     * Whether to enable the halo. When set to `false`, the halo will not be
     * rendered for the given state.
     */
    enabled?: boolean;

    /**
     * Opacity for the halo unless a specific fill is overridden using the
     * `attributes` setting.
     *
     * @since   4.0
     * @product highcharts highstock
     * @default 0.25
     */
    opacity?: number;

    /**
     * The pixel size of the halo. For point markers this is the radius of the
     * halo. For pie slices it is the width of the halo outside the slice. For
     * bubbles it defaults to 5 and is the width of the halo outside the bubble.
     *
     * @since   4.0
     * @product highcharts highstock
     * @default 10
     */
    size?: number;
}

/**
 * Unified options for hover, inactive, and select states of both series and
 * point markers. All properties are optional and apply only where relevant to
 * the specific state or element type.
 */
export interface StateOptions {
    /**
     * Animation when returning to normal state after hovering.
     *
     * @default true
     */
    animation?: boolean | DeepPartial<AnimationOptions>;

    /**
     * Used by hover and inactive states. Brightness adjustment applied to the
     * series or point color, e.g. for column, pie and map series.
     */
    brightness?: number;

    /**
     * Used by hover, inactive, and select states. The color of the series or
     * point marker in this state.
     */
    color?: ColorType;

    /**
     * Used by hover, inactive, and select states. The dash style of the series
     * line in this state.
     */
    dashStyle?: DashStyleValue;

    /**
     * Used by hover and select states. Whether the state is enabled. When set
     * to `false`, the series or marker will not change appearance on hover or
     * select.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Used by hover and select states (marker). The fill color of the point
     * marker in this state. When `undefined`, the series' or point's color is
     * used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-fillcolor/
     * Solid red discs for selected points
     */
    fillColor?: ColorType;

    /**
     * Used by hover state (series). Options for the halo appearing around the
     * hovered point in line-type series as well as outside the hovered slice in
     * pie charts. By default the halo is filled by the current point or series
     * color with an opacity of 0.25. Set to `false` to disable the halo.
     *
     * In styled mode, the halo is styled with the `.highcharts-halo` class,
     * with colors inherited from `.highcharts-color-{n}`.
     *
     * @sample {highcharts} highcharts/plotoptions/halo/
     * Halo options
     * @sample {highstock} highcharts/plotoptions/halo/
     * Halo options
     *
     * @since   4.0
     * @product highcharts highstock
     */
    halo?: boolean | StateHaloOptions;

    /**
     * The color of the point marker's outline. When
     * `undefined`, the series' or point's lineColor for normal
     * state is used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linecolor/
     * White fill color, black line color
     */
    lineColor?: ColorType;

    /**
     * Used by hover state (series and marker). The pixel width of the graph
     * line or marker outline. By default this property is undefined, and
     * `lineWidthPlus` dictates how much to increase from normal state.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidth/
     * 5px line on hover
     *
     * @product highcharts highstock
     */
    lineWidth?: number;

    /**
     * Used by hover state (series and marker). The additional line width for
     * the graph or marker outline relative to the normal state.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
     * 5 pixels wider
     * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
     * 5 pixels wider
     *
     * @since   4.0.3
     * @product highcharts highstock
     * @default 1
     */
    lineWidthPlus?: number;

    /**
     * Used by hover state (series, deprecated). In Highcharts 1.0, the
     * appearance of all markers belonging to the hovered series. For settings
     * on the hover state of the individual point, see
     * [marker.states.hover](#plotOptions.series.marker.states.hover).
     *
     * @deprecated
     *
     * @excluding states, symbol
     * @product   highcharts highstock
     */
    marker?: PointMarkerOptions;

    /**
     * Used by hover and inactive states (series and marker). The opacity of
     * the series or marker elements. In the inactive state this defaults to
     * `0.2` for series.
     *
     * @default 0.2
     */
    opacity?: number;

    /**
     * Used by hover and select states (marker). The radius of the point marker
     * in this state. In hover state, defaults to the normal state's radius plus
     * `radiusPlus`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-radius/
     * 10px radius on hover
     */
    radius?: number;

    /**
     * The number of pixels to increase the radius of the
     * hovered point.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
     * 5 pixels greater radius on hover
     *
     * @since   4.0.3
     * @default 2
     */
    radiusPlus?: number;
}

export interface StatesOptions {
    hover?: StateOptions;
    inactive?: StateOptions;
    normal?: StateOptions;
    select?: StateOptions;
}

/**
 * Possible key values for the series state options.
 */
export type StatesOptionsKey = (''|keyof StatesOptions);

/**
 * Possible key values for the point state options.
 *
 * @typedef {"hover"|"inactive"|"normal"|"select"} Highcharts.PointStateValue
 */
export type PointStateValue = StatesOptionsKey;

/* *
 *
 *  Default Export
 *
 * */

export default StatesOptions;
