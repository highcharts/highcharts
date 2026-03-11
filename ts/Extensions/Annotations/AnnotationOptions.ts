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

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type Annotation from './Annotation';
import type {
    AnnotationMockPointOptionsObject
} from './AnnotationMockPointOptionsObject';
import type AST from '../../Core/Renderer/HTML/AST';
import type ColorType from '../../Core/Color/ColorType';
import type Controllable from './Controllables/Controllable';
import type ControlPointOptions from './ControlPointOptions';
import type ControlTargetOptions from './ControlTargetOptions';
import type CoreOptions from '../../Core/Options';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    DataLabelsOverflowValue
} from '../../Core/Series/DataLabelOptions';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type { DeepPartial } from '../../Shared/Types';
import type { EventCallback } from '../../Core/Callback';
import type NavigationOptions from '../Exporting/NavigationOptions';
import type Point from '../../Core/Series/Point';
import type {
    ShadowOptionsObject
} from '../../Core/Renderer/ShadowOptionsObject';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
import type Templating from '../../Core/Templating';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Possible directions for draggable annotations. An empty string (`''`)
 * makes the annotation undraggable.
 *
 * @typedef {''|'x'|'xy'|'y'} Highcharts.AnnotationDraggableValue
 * @requires modules/annotations
 */
export type AnnotationDraggableValue = (''|'x'|'y'|'xy');

export interface AnnotationEventsOptions {
    /**
     * Event callback when annotation is updated (e.g. drag and
     * dropped or resized by control points).
     *
     * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
     * @since     7.1.0
     * @apioption annotations.events.afterUpdate
     */
    afterUpdate?: EventCallback<Annotation>;

    /**
     * Event callback when annotation is added to the chart.
     *
     * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
     * @since     7.1.0
     * @apioption annotations.events.add
     */
    add?: EventCallback<Annotation>;

    /**
     * Fires when the annotation is clicked.
     *
     * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
     * @since     7.1.0
     * @apioption annotations.events.click
     */
    click?: EventCallback<Annotation>;

    /**
     * Fires when the annotation is dragged.
     *
     * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
     * @apioption annotations.events.drag
     */
    drag?: EventCallback<Annotation>;

    /**
     * Event callback when annotation is removed from the chart.
     *
     * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
     * @since     7.1.0
     * @apioption annotations.events.remove
     */
    remove?: EventCallback<Annotation>;

    /** @internal */
    touchstart?: EventCallback<Annotation>;

    /** @internal */
    touchend?: EventCallback<Annotation>;
}

export interface AnnotationOptions extends ControlTargetOptions {
    /**
     * Enable or disable the initial animation when a series is
     * displayed for the `annotation`. The animation can also be set
     * as a configuration object. Please note that this option only
     * applies to the initial animation.
     * For other animations, see [chart.animation](#chart.animation)
     * and the animation parameter under the API methods.
     * The following properties are supported:
     *
     * - `defer`: The animation delay time in milliseconds.
     *
     * @sample {highcharts} highcharts/annotations/defer/
     *          Animation defer settings
     * @type {boolean|Partial<Highcharts.AnimationOptionsObject>}
     * @since 8.2.0
     */
    animation?: Partial<AnimationOptions>;

    /**
     * A class name for styling by CSS.
     *
     * @since 12.5.0
     * @type      {string}
     * @apioption annotations.className
     */
    className?: string;

    /**
     * Options for annotation's control points. Each control point
     * inherits options from controlPointOptions object.
     * Options from the controlPointOptions can be overwritten
     * by options in a specific control point.
     *
     * @declare  Highcharts.AnnotationControlPointOptionsObject
     * @requires modules/annotations
     */
    controlPointOptions?: ControlPointOptions;

    /**
     * Whether to hide the part of the annotation
     * that is outside the plot area.
     *
     * @sample highcharts/annotations/label-crop-overflow/
     *         Crop line annotation
     * @type  {boolean}
     * @since 9.3.0
     */
    crop?: boolean;

    /**
     * Allow an annotation to be draggable by a user. Possible
     * values are `'x'`, `'xy'`, `'y'` and `''` (disabled).
     *
     * @sample highcharts/annotations/draggable/
     *         Annotations draggable: 'xy'
     *
     * @type {Highcharts.AnnotationDraggableValue}
     */
    draggable?: AnnotationDraggableValue;

    /**
     * Events available in annotations.
     *
     * @requires modules/annotations
     */
    events?: AnnotationEventsOptions;

    /**
     * Sets an ID for an annotation. Can be user later when
     * removing an annotation in [Chart#removeAnnotation(id)](
     * /class-reference/Highcharts.Chart#removeAnnotation) method.
     *
     * @type      {number|string}
     * @apioption annotations.id
     */
    id?: (number|string);

    /** @internal */
    itemType?: string;

    /**
     * Options for annotation's labels. Each label inherits options
     * from the labelOptions object. An option from the labelOptions
     * can be overwritten by config for a specific label.
     *
     * @requires modules/annotations
     */
    labelOptions?: AnnotationLabelOptionsOptions;

    /**
     * An array of labels for the annotation. For options that apply
     * to multiple labels, they can be added to the
     * [labelOptions](annotations.labelOptions.html).
     *
     * @type      {Array<*>}
     * @extends   annotations.labelOptions
     * @apioption annotations.labels
     */
    labels?: Array<AnnotationLabelOptions>;

    /** @internal */
    langKey?: string;

    /**
     * Options for annotation's shapes. Each shape inherits options
     * from the shapeOptions object. An option from the shapeOptions
     * can be overwritten by config for a specific shape.
     *
     * @requires  modules/annotations
     */
    shapeOptions?: AnnotationShapeOptionsOptions;

    /**
     * An array of shapes for the annotation. For options that apply
     * to multiple shapes, then can be added to the
     * [shapeOptions](annotations.shapeOptions.html).
     *
     * @type      {Array<*>}
     * @extends   annotations.shapeOptions
     * @apioption annotations.shapes
     */
    shapes?: Array<AnnotationShapeOptions>;

    /**
     * For advanced annotations, this option defines the type of annotation. Can
     * be one of the keys listed under the [types option](#annotations.types).
     *
     * @sample    highcharts/annotations-advanced/crooked-line
     *            Crooked line annotation
     * @requires  modules/annotations-advanced
     * @product   highstock
     * @type      {string}
     * @apioption annotations.type
     */
    type?: string;

    /**
     *
     * Additional options for an annotation with the type.
     *
     * @requires  modules/annotations
     * @apioption annotations.typeOptions
     */
    typeOptions?: AnnotationTypeOptions;

    /**
     * Option override for specific advanced annotation types. This collection
     * is intended for general theming using `Highcharts.setOptions()`.
     *
     * @sample   highcharts/annotations/shape/
     *           Themed crooked line annotation
     * @product highstock
     * @requires modules/annotations-advanced
     */
    types?: Record<string, DeepPartial<AnnotationOptions>>;

    /**
     * Whether the annotation is visible.
     *
     * @sample highcharts/annotations/visible/
     *         Set annotation visibility
     */
    visible?: boolean;

    /**
     * The Z index of the annotation.
     */
    zIndex?: number;
}

export interface AnnotationLabelOptionsOptions {
    /**
     * The alignment of the annotation's label. If right,
     * the right side of the label should be touching the point.
     *
     * @sample highcharts/annotations/label-position/
     *         Set labels position
     *
     * @default center
     */
    align?: AlignValue;

    /**
     * Whether to allow the annotation's labels to overlap.
     * To make the labels less sensitive for overlapping,
     * the can be set to 0.
     *
     * @sample highcharts/annotations/tooltip-like/
     *         Hide overlapping labels
     *
     * @default false
     */
    allowOverlap?: boolean;

    /**
     * The background color or gradient for the annotation's label.
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default rgba(0, 0, 0, 0.75)
     */
    backgroundColor?: ColorType;

    /**
     * The border color for the annotation's label.
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default ${palette.neutralColor100}
     */
    borderColor?: ColorType;

    /**
     * The border radius in pixels for the annotation's label.
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default 3
     */
    borderRadius?: number;

    /**
     * The border width in pixels for the annotation's label.
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default 1
     */
    borderWidth?: number;

    /**
     * A class name for styling by CSS.
     *
     * @sample highcharts/css/annotations
     *         Styled mode annotations
     *
     * @since 6.0.5
     * @default highcharts-no-tooltip
     */
    className?: string;

    /**
     * Whether to hide the annotation's label that is outside the plot area.
     *
     * @sample highcharts/annotations/label-crop-overflow/
     *         Crop or justify labels
     *
     * @default false
     */
    crop?: boolean,

    /**
     * The label's pixel distance from the point.
     *
     * @sample highcharts/annotations/label-position/
     *         Set labels position
     *
     * @default 16
     */
    distance?: number;

    /**
     * A
     * [format](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * string for the data label.
     *
     * @see [plotOptions.series.dataLabels.format](#plotOptions.series.dataLabels.format)
     *
     * @sample highcharts/annotations/label-text/
     *         Set labels text
     */
    format?: string;

    /**
     * Alias for the format option.
     *
     * @see [format](#annotations.labelOptions.format)
     *
     * @sample highcharts/annotations/label-text/
     *         Set labels text
     */
    text?: string;

    /**
     * Callback JavaScript function to format the annotation's
     * label. Note that if a `format` or `text` are defined,
     * the format or text take precedence and the formatter is
     * ignored. `This` refers to a point object. The callback also receives
     * an argument `ctx` so that arrow-functions can access the same
     * context (the point in this case) as normal functions can using
     * `this`. Since v12.5.0, the callback receives `ctx`.
     *
     * @sample highcharts/annotations/label-text/
     *         Set labels text
     *
     * @type    {Highcharts.FormatterCallbackFunction<Highcharts.Point>}
     * @default function () { return defined(this.y) ? this.y : 'Annotation label'; }
     */
    formatter?: Templating.FormatterCallback<Point>;

    /**
     * Whether all the labels for an annotation are visible in the exported data
     * table.
     *
     * @sample highcharts/annotations/include-in-data-export/
     *         Do not include in the data export
     *
     * @since 8.2.0
     * @requires modules/export-data
     */
    includeInDataExport?: boolean;

    /**
     * How to handle the annotation's label that flow outside
     * the plot area. The justify option aligns the label inside
     * the plot area.
     *
     * @sample highcharts/annotations/label-crop-overflow/
     *         Crop or justify labels
     *
     * @default justify
     */
    overflow?: DataLabelsOverflowValue;

    /**
     * When either the borderWidth or the backgroundColor is
     * set, this is the padding within the box.
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default 5
     */
    padding?: number;

    /**
     * The shadow of the box. The shadow can be an object
     * configuration containing `color`, `offsetX`, `offsetY`,
     * `opacity` and `width`.
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default false
     */
    shadow?: (boolean | ShadowOptionsObject);

    /**
     * The name of a symbol to use for the border around the
     * label. Symbols are predefined functions on the Renderer
     * object.
     *
     * @sample highcharts/annotations/shapes/
     *         Available shapes for labels
     *
     * @default callout
     */
    shape?: SymbolKey;

    /**
     * Styles for the annotation's label.
     *
     * @see [plotOptions.series.dataLabels.style](plotOptions.series.dataLabels.style.html)
     *
     * @sample highcharts/annotations/label-presentation/
     *         Set labels graphic options
     *
     * @default {"fontSize": "0.7em", "fontWeight": "normal", "color": "contrast"}
     */
    style?: CSSObject;

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the annotation's label.
     *
     * @default false
     */
    useHTML?: boolean;

    /**
     * The vertical alignment of the annotation's label.
     *
     * @sample highcharts/annotations/label-position/
     *         Set labels position
     *
     * @default bottom
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * The x position offset of the label relative to the point.
     * Note that if a `distance` is defined, the distance takes
     * precedence over `x` and `y` options.
     *
     * @sample highcharts/annotations/label-position/
     *         Set labels position
     *
     * @default 0
     */
    x?: number;

    /**
     * The y position offset of the label relative to the point.
     * Note that if a `distance` is defined, the distance takes
     * precedence over `x` and `y` options.
     *
     * @sample highcharts/annotations/label-position/
     *         Set labels position
     *
     * @default -16
     */
    y?: number;
}

export interface AnnotationLabelOptions extends AnnotationLabelOptionsOptions {
    /* *
    *
    *  Excluded properties. Not omitted for ancestor type matching.
    *
    * */

    includeInDataExport?: undefined;

    /**
     * The array of control points.
     *
     * @sample highcharts/annotations/ellipse
     *         Ellipse annotation
     *
     * @extends annotations.controlPointOptions
     * @type {Array<AnnotationControlPointOptionsObject>}
     */
    controlPoints?: Array<ControlPointOptions>;

    /**
     * This option defines the point to which the label will be
     * connected. It can be either the point which exists in the
     * series - it is referenced by the point's id - or a new point
     * with defined x, y properties and optionally axes.
     *
     * @sample highcharts/annotations/mock-point/
     *         Attach annotation to a mock point
     * @sample highcharts/annotations/mock-points/
     *         Attach annotation to a mock point with different ways
     */
    point?: AnnotationMockPointOptions;
}

/**
 * Annotation point, which can be:
 * - a string: the ID of an existing series point,
 * - an object: mock point options,
 * - a function: returning either mock point options object or a point.
 *
 * Internally, this can also be a point or a mock point.
 *
 * @requires modules/annotations
 */
export type AnnotationMockPointOptions = (
    string | AnnotationMockPointOptionsObject | AnnotationMockPointFunction
);

/**
 * Callback function that returns the annotation shape point or it's options.
 *
 * @callback Highcharts.AnnotationMockPointFunction
 *
 * @param {Highcharts.AnnotationControllable} controllable
 *        Controllable shape or label.
 *
 * @return {
 *     Highcharts.AnnotationMockPointOptionsObject |
 *     Highcharts.Point
 * }
 *         Annotations shape point or it's options.
 */
export interface AnnotationMockPointFunction {
    (controllable: Controllable):
        AnnotationMockPointOptionsObject | Point;
}

export interface AnnotationShapeOptionsOptions {
    /**
     * The radius of the `ellipse` shape in y direction. Can be defined in
     * pixels or yAxis units, if
     * [shapes.yAxis](#annotations.shapeOptions.yAxis) index is defined.
     *
     * @sample highcharts/annotations/ellipse/
     *         Ellipse annotation
     **/
    ry?: number;

    /**
     * The xAxis index which should be used for annotation's sizes and
     * points coordinates conversion.
     *
     * This option is used for `rect` shape
     * [width](#annotations.shapeOptions.width), and all shape
     * [point](#annotations.shapes.point) and
     * [points](#annotations.shapes.points) coordinates.
     *
     * @sample highcharts/annotations/shapes-axis-units/
     *         Shapes created with axis units
     **/
    xAxis?: number;

    /**
     * The yAxis index which should be used for annotation's sizes and
     * points coordinates conversion.
     *
     * This option is used for `rect` shape
     * [height](#annotations.shapeOptions.height), `circle` shape
     * [radius](#annotations.shapeOptions.r), `ellipse`
     * [y direction radius](#annotations.shapeOptions.ry), and all shape
     * [point](#annotations.shapes.point) and
     * [points](#annotations.shapes.points) coordinates.
     *
     * @sample highcharts/annotations/shapes-axis-units/
     *         Shapes created with axis units
     **/
    yAxis?: number;

    /**
     * The width of the `rect` shape. Can be defined in pixels or xAxis
     * units, if [shapes.xAxis](#annotations.shapeOptions.xAxis) index is
     * defined.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     **/
    width?: number;

    /**
     * The height of the `rect` shape. Can be defined in pixels or yAxis
     * units, if [shapes.yAxis](#annotations.shapeOptions.yAxis) index is
     * defined.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     */
    height?: number;

    /**
     * The type of the shape.
     * Available options are `circle`, `rect`, `ellipse` and `path`.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     *
     * @sample highcharts/annotations/ellipse/
     *         Ellipse annotation
     *
     * @default rect
     */
    type?: string;

    /**
     * The URL for an image to use as the annotation shape.
     * Note, type has to be set to `'image'`.
     *
     * @see [annotations.shapeOptions.type](#annotations.shapeOptions.type)
     *
     * @sample highcharts/annotations/shape-src/
     *         Define a marker image url for annotations
     */
    src?: string;

    /**
     * Name of the dash style to use for the shape's stroke.
     *
     * @sample {highcharts} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     */
    dashStyle?: DashStyleValue;

    /**
     * The color of the shape's stroke.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     *
     * @default rgba(0, 0, 0, 0.75)
     */
    stroke?: ColorType;

    /**
     * The pixel stroke width of the shape.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     *
     * @default 1
     */
    strokeWidth?: number;

    /**
     * The color of the shape's fill.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     *
     * @default rgba(0, 0, 0, 0.75)
     */
    fill?: ColorType;

    /**
     * The radius of the `circle` shape. Can be defined in pixels or yAxis
     * units, if [shapes.yAxis](#annotations.shapeOptions.yAxis) index is
     * defined.
     *
     * @sample highcharts/annotations/shape/
     *         Basic shape annotation
     *
     * @default 0
     */
    r?: number;

    /**
     * Defines additional snapping area around an annotation
     * making this annotation to focus. Defined in pixels.
     *
     * @default 2
     */
    snap?: number;
}

export interface AnnotationShapeOptions extends AnnotationShapeOptionsOptions {
    /**
     * The array of control points.
     *
     * @sample highcharts/annotations-advanced/controllable-image
     *         Controllable image annotation
     *
     * @extends annotations.controlPointOptions
     * @type {Array<AnnotationControlPointOptionsObject>}
     * @apioption annotations.shapes.controlPoints
     */
    controlPoints?: Array<ControlPointOptions>;

    /**
     * Id of the marker which will be drawn at the final vertex of
     * the path. Custom markers can be defined in defs property.
     *
     * @see [defs.markers](#defs.markers)
     *
     * @sample highcharts/annotations/custom-markers/
     *         Define a custom marker for annotations
     */
    markerEnd?: string;

    /**
     * Id of the marker which will be drawn at the first vertex of
     * the path. Custom markers can be defined in defs property.
     *
     * @see [defs.markers](#defs.markers)
     *
     * @sample {highcharts} highcharts/annotations/custom-markers/
     *         Define a custom marker for annotations
     */
    markerStart?: string;

    /**
     * This option defines the point to which the shape will be
     * connected. It can be either the point which exists in the
     * series - it is referenced by the point's id - or a new point
     * with defined x, y properties and optionally axes.
     *
     * @sample highcharts/annotations/mock-points/
     *         Attach annotation to a mock point with different ways
     *
     * @type      {Highcharts.AnnotationMockPointOptions}
     * @extends   annotations.labels.point
     * @requires  modules/annotations
     * @apioption annotations.shapes.point
     */
    point?: AnnotationMockPointOptions;

    /**
     * An array of points for the shape
     * or a callback function that returns that shape point.
     *
     * This option is available
     * for shapes which can use multiple points such as path. A
     * point can be either a point object or a point's id.
     *
     * @see [annotations.shapes.point](#annotations.shapes.point)
     *
     * @type      {Array<Highcharts.AnnotationMockPointOptions>}
     * @extends   annotations.labels.point
     * @apioption annotations.shapes.points
     */
    points?: Array<AnnotationMockPointOptions>;
}

export interface AnnotationTypeOptions {
    /**
     * Background shape options for the annotation.
     *
     * @extends annotations.shapeOptions
     * @apioption annotations.typeOptions.background
     */
    background?: AnnotationShapeOptionsOptions;

    /**
     * Height of the annotation in pixels.
     *
     * @type {number}
     * @apioption annotations.typeOptions.height
     */
    height?: number;

    /**
     * Line options.
     *
     * @extends annotations.shapeOptions
     * @apioption annotations.typeOptions.line
     */
    line?: AnnotationShapeOptionsOptions;

    /**
     * A single point that the annotation is attached to. It can be either
     * the point which exists in the series - it is referenced by the
     * point's id - or a new point with defined x, y properties
     * and optionally axes.
     *
     * @type {string | Highcharts.AnnotationMockPointOptionsObject}
     * @apioption annotations.typeOptions.point
     */
    point?: (string | AnnotationMockPointOptionsObject);

    /**
     * An array of points that the annotation is attached to. Each point can
     * the point which exists in the series - it is referenced by the
     * point's id - or a new point with defined x, y properties
     * and optionally axes.
     *
     * @type {Array<(string | Highcharts.AnnotationMockPointOptionsObject)>}
     * @apioption annotations.typeOptions.points
     */
    points?: Array<(string | AnnotationMockPointOptionsObject)>;

    /**
     * The annotation type identifier.
     *
     * @type {string}
     * @apioption annotations.typeOptions.type
     */
    type?: string;

    /**
     * This number defines which `xAxis` the point is connected to.
     * It refers to either the axis id or the index of the axis
     * in the `xAxis` array.
     *
     * @type {number}
     * @apioption annotations.typeOptions.xAxis
     */
    xAxis?: number;

    /**
     * This number defines which `yAxis` the point is connected to.
     * It refers to either the axis id or the index of the axis
     * in the `yAxis` array.
     *
     * @type {number}
     * @apioption annotations.typeOptions.yAxis
     */
    yAxis?: number;

    /** @internal */
    yOffset?: number;
}

/** @internal */
export interface ChartOptions extends CoreOptions {
    annotations: Array<AnnotationOptions>;
    defs: Record<string, AST.Node>;
    navigation: NavigationOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationOptions;
