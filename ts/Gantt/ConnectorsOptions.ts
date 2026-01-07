/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Øystein Moseng, Lars A. V. Cabrera
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
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type ColorString from '../Core/Color/ColorString';
import type ColorType from '../Core/Color/ColorType';
import type DashStyleValue from '../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Options'{
    interface Options {
        connectors?: ConnectorsOptions;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        connectors?: ConnectorsOptions;
    }
}

/**
 * Marker options specific to the end markers for this chart's
 * Pathfinder connectors. Overrides the generic marker options.
 *
 * @declare Highcharts.ConnectorsEndMarkerOptions
 * @extends connectors.marker
 * @since   6.2.0
 */
export interface ConnectorsEndMarkerOptions {

    /**
     * Horizontal alignment of the markers relative to the points.
     *
     * @type {Highcharts.AlignValue}
     */
    align?: AlignValue;

    /**
     * Set the color of the connector markers. By default this is the
     * same as the connector color.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     6.2.0
     * @apioption connectors.marker.color
     */
    color?: ColorType;

    /**
     * Enable markers for the connectors.
     */
    enabled?: boolean;

    /**
     * Set the height of the connector markers. If not supplied, this
     * is inferred from the marker radius.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.height
     */
    height?: number;

    /**
     * Whether or not to draw the markers inside the points.
     */
    inside?: boolean;

    /**
     * Set the line/border color of the connector markers. By default
     * this is the same as the marker color.
     *
     * @type      {Highcharts.ColorString}
     * @since     6.2.0
     * @apioption connectors.marker.lineColor
     */
    lineColor?: ColorString;

    /**
     * Set the line/border width of the pathfinder markers.
     */
    lineWidth?: number;

    /**
     * Set the radius of the connector markers. The default is
     * automatically computed based on the algorithmMargin setting.
     *
     * Setting marker.width and marker.height will override this
     * setting.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.radius
     */
    radius?: number;

    /**
     * Set the symbol of the connector end markers.
     */
    symbol?: string;

    /**
     * Vertical alignment of the markers relative to the points.
     *
     * @type {Highcharts.VerticalAlignValue}
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * Set the width of the connector markers. If not supplied, this
     * is inferred from the marker radius.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.width
     */
    width?: number;
}

/**
 * Marker options for this chart's Pathfinder connectors. Note that
 * this option is overridden by the `startMarker` and `endMarker`
 * options.
 *
 * @declare Highcharts.ConnectorsMarkerOptions
 * @since   6.2.0
 */
export interface ConnectorsMarkerOptions {

    /**
     * Horizontal alignment of the markers relative to the points.
     *
     * @type {Highcharts.AlignValue}
     */
    align?: AlignValue;

    /**
     * Set the color of the connector markers. By default this is the
     * same as the connector color.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     6.2.0
     * @apioption connectors.marker.color
     */
    color?: ColorType;

    /**
     * Enable markers for the connectors.
     */
    enabled?: boolean;

    /**
     * Set the height of the connector markers. If not supplied, this
     * is inferred from the marker radius.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.height
     */
    height?: number;

    /**
     * Whether or not to draw the markers inside the points.
     */
    inside?: boolean;

    /**
     * Set the line/border color of the connector markers. By default
     * this is the same as the marker color.
     *
     * @type      {Highcharts.ColorString}
     * @since     6.2.0
     * @apioption connectors.marker.lineColor
     */
    lineColor?: ColorString;

    /**
     * Set the line/border width of the pathfinder markers.
     */
    lineWidth?: number;

    /**
     * Set the radius of the connector markers. The default is
     * automatically computed based on the algorithmMargin setting.
     *
     * Setting marker.width and marker.height will override this
     * setting.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.radius
     */
    radius?: number;

    /** @internal */
    symbol?: string;

    /**
     * Vertical alignment of the markers relative to the points.
     *
     * @type {Highcharts.VerticalAlignValue}
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * Set the width of the connector markers. If not supplied, this
     * is inferred from the marker radius.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.width
     */
    width?: number;
}

/**
 * The Pathfinder module allows you to define connections between any two
 * points, represented as lines - optionally with markers for the start
 * and/or end points. Multiple algorithms are available for calculating how
 * the connecting lines are drawn.
 *
 * Connector functionality requires Highcharts Gantt to be loaded. In Gantt
 * charts, the connectors are used to draw dependencies between tasks.
 *
 * @see [dependency](series.gantt.data.dependency)
 *
 * @sample gantt/pathfinder/demo
 *         Pathfinder connections
 *
 * @declare      Highcharts.ConnectorsOptions
 * @product      gantt
 * @optionparent connectors
 */
export interface ConnectorsOptions {

    /**
     * Set the default pathfinder margin to use, in pixels. Some Pathfinder
     * algorithms attempt to avoid obstacles, such as other points in the
     * chart. These algorithms use this margin to determine how close lines
     * can be to an obstacle. The default is to compute this automatically
     * from the size of the obstacles in the chart.
     *
     * To draw connecting lines close to existing points, set this to a low
     * number. For more space around existing points, set this number
     * higher.
     *
     * @sample gantt/pathfinder/algorithm-margin
     *         Small algorithmMargin
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.algorithmMargin
     */
    algorithmMargin?: number;

    /**
     * Set the default dash style for this chart's connecting lines.
     *
     * @type      {Highcharts.DashStyleValue}
     * @default   Solid
     * @since     6.2.0
     * @apioption connectors.dashStyle
     */
    dashStyle?: DashStyleValue;

    /**
     * Enable connectors for this chart. Requires Highcharts Gantt.
     *
     * @type      {boolean}
     * @default   true
     * @since     6.2.0
     * @apioption connectors.enabled
     */
    enabled?: boolean;

    /**
     * Marker options specific to the end markers for this chart's
     * Pathfinder connectors. Overrides the generic marker options.
     *
     * @declare Highcharts.ConnectorsEndMarkerOptions
     * @extends connectors.marker
     * @since   6.2.0
     */
    endMarker?: ConnectorsEndMarkerOptions;

    /**
     * Set the default color for this chart's Pathfinder connecting lines.
     * Defaults to the color of the point being connected.
     *
     * @type      {Highcharts.ColorString}
     * @since     6.2.0
     * @apioption connectors.lineColor
     */
    lineColor?: ColorString;

    /**
     * Set the default pixel width for this chart's Pathfinder connecting
     * lines.
     *
     * @since 6.2.0
     */
    lineWidth?: number;

    /**
     * Marker options for this chart's Pathfinder connectors. Note that
     * this option is overridden by the `startMarker` and `endMarker`
     * options.
     *
     * @declare Highcharts.ConnectorsMarkerOptions
     * @since   6.2.0
     */
    marker?: ConnectorsMarkerOptions;

    /**
     * The corner radius for the connector line.
     *
     * @since 11.2.0
     */
    radius?: number;

    /**
     * Marker options specific to the start markers for this chart's
     * Pathfinder connectors. Overrides the generic marker options.
     *
     * @declare Highcharts.ConnectorsStartMarkerOptions
     * @extends connectors.marker
     * @since   6.2.0
     */
    startMarker?: ConnectorsStartMarkerOptions;

    /**
     * Set the default pathfinder algorithm to use for this chart. It is
     * possible to define your own algorithms by adding them to the
     * Highcharts.Pathfinder.prototype.algorithms object before the chart
     * has been created.
     *
     * The default algorithms are as follows:
     *
     * `straight`:      Draws a straight line between the connecting
     *                  points. Does not avoid other points when drawing.
     *
     * `simpleConnect`: Finds a path between the points using right angles
     *                  only. Takes only starting/ending points into
     *                  account, and will not avoid other points.
     *
     * `fastAvoid`:     Finds a path between the points using right angles
     *                  only. Will attempt to avoid other points, but its
     *                  focus is performance over accuracy. Works well with
     *                  less dense datasets.
     *
     * Default value: `straight` is used as default for most series types,
     * while `simpleConnect` is used as default for Gantt series, to show
     * dependencies between points.
     *
     * @sample gantt/pathfinder/demo
     *         Different types used
     *
     * @type    {Highcharts.PathfinderTypeValue}
     * @default undefined
     * @since   6.2.0
     */
    type?: PathfinderTypeValue;
}

/**
 * Marker options specific to the start markers for this chart's
 * Pathfinder connectors. Overrides the generic marker options.
 *
 * @declare Highcharts.ConnectorsStartMarkerOptions
 * @extends connectors.marker
 * @since   6.2.0
 */
export interface ConnectorsStartMarkerOptions {

    /**
     * Horizontal alignment of the markers relative to the points.
     *
     * @type {Highcharts.AlignValue}
     */
    align?: AlignValue;

    /**
     * Set the color of the connector markers. By default this is the
     * same as the connector color.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     6.2.0
     * @apioption connectors.marker.color
     */
    color?: ColorType;

    /**
     * Enable markers for the connectors.
     */
    enabled?: boolean;

    /**
     * Set the height of the connector markers. If not supplied, this
     * is inferred from the marker radius.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.height
     */
    height?: number;

    /**
     * Whether or not to draw the markers inside the points.
     */
    inside?: boolean;

    /**
     * Set the line/border color of the connector markers. By default
     * this is the same as the marker color.
     *
     * @type      {Highcharts.ColorString}
     * @since     6.2.0
     * @apioption connectors.marker.lineColor
     */
    lineColor?: ColorString;

    /**
     * Set the line/border width of the pathfinder markers.
     */
    lineWidth?: number;

    /**
     * Set the radius of the connector markers. The default is
     * automatically computed based on the algorithmMargin setting.
     *
     * Setting marker.width and marker.height will override this
     * setting.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.radius
     */
    radius?: number;

    /**
     * Set the symbol of the connector start markers.
     */
    symbol?: string;

    /**
     * Vertical alignment of the markers relative to the points.
     *
     * @type {Highcharts.VerticalAlignValue}
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * Set the width of the connector markers. If not supplied, this
     * is inferred from the marker radius.
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption connectors.marker.width
     */
    width?: number;
}

/**
 * The default pathfinder algorithm to use for a chart. It is possible to define
 * your own algorithms by adding them to the
 * `Highcharts.Pathfinder.prototype.algorithms`
 * object before the chart has been created.
 *
 * The default algorithms are as follows:
 *
 * `straight`:      Draws a straight line between the connecting
 *                  points. Does not avoid other points when drawing.
 *
 * `simpleConnect`: Finds a path between the points using right angles
 *                  only. Takes only starting/ending points into
 *                  account, and will not avoid other points.
 *
 * `fastAvoid`:     Finds a path between the points using right angles
 *                  only. Will attempt to avoid other points, but its
 *                  focus is performance over accuracy. Works well with
 *                  less dense datasets.
 *
 * @typedef {"fastAvoid"|"simpleConnect"|"straight"|string} Highcharts.PathfinderTypeValue
 */
export type PathfinderTypeValue = string; /* @todo (
    'straight'|
    'fastAvoid'|
    'simpleConnect'|
    string
);*/

/* *
 *
 *  Default Export
 *
 * */

export default ConnectorsOptions;
