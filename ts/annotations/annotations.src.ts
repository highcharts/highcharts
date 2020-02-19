/* *
 *
 *  (c) 2009-2017 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class Annotation implements AnnotationControllable, AnnotationEventEmitter {
            public static ControlPoint: typeof AnnotationControlPoint;
            public static MockPoint: typeof AnnotationMockPoint;
            public static shapesMap: Dictionary<Function>;
            public static types: AnnotationTypesDictionary;
            public constructor(chart: AnnotationChart, userOptions: AnnotationsOptions);
            public annotation: AnnotationControllable['annotation'];
            public addControlPoints: AnnotationControllableMixin['addControlPoints'];
            public addEvents: AnnotationEventEmitterMixin['addEvents'];
            public anchor: AnnotationControllableMixin['anchor'];
            public attr: AnnotationControllableMixin['attr'];
            public attrsFromOptions: AnnotationControllableMixin['attrsFromOptions'];
            public chart: AnnotationChart;
            public clipRect?: SVGElement;
            public clipXAxis?: Axis;
            public clipYAxis?: Axis;
            public coll: 'annotations';
            public collection: AnnotationControllable['collection'];
            public controlPoints: Array<AnnotationControlPoint>;
            public defaultOptions: AnnotationsOptions;
            public getPointsOptions: AnnotationControllableMixin['getPointsOptions'];
            public graphic: SVGElement;
            public group: SVGElement;
            public index: AnnotationControllable['index'];
            public isUpdating?: boolean;
            public labelCollector: ChartLabelCollectorFunction;
            public labels: Array<AnnotationLabelType>;
            public labelsGroup: SVGElement;
            public linkPoints: AnnotationControllableMixin['linkPoints'];
            public mouseMoveToRadians: AnnotationEventEmitterMixin['mouseMoveToRadians'];
            public mouseMoveToScale: AnnotationEventEmitterMixin['mouseMoveToScale'];
            public mouseMoveToTranslation: AnnotationEventEmitterMixin['mouseMoveToTranslation'];
            public nonDOMEvents: Array<string>;
            public onDrag: AnnotationEventEmitterMixin['onDrag'];
            public onMouseDown: AnnotationEventEmitterMixin['onMouseDown'];
            public onMouseUp: AnnotationEventEmitterMixin['onMouseUp'];
            public options: AnnotationsOptions;
            public point: AnnotationControllableMixin['point'];
            public points: Array<AnnotationPointType>;
            public removeDocEvents: AnnotationEventEmitterMixin['removeDocEvents'];
            public rotate: AnnotationControllableMixin['rotate'];
            public scale: AnnotationControllableMixin['scale'];
            public shapes: Array<AnnotationShapeType>;
            public shapesGroup: SVGElement;
            public shouldBeDrawn: AnnotationControllableMixin['shouldBeDrawn'];
            public transform: AnnotationControllableMixin['transform'];
            public transformPoint: AnnotationControllableMixin['transformPoint'];
            public translate: AnnotationControllableMixin['translate'];
            public translatePoint: AnnotationControllableMixin['translatePoint'];
            public translateShape: AnnotationControllableMixin['translateShape'];
            public userOptions: AnnotationsOptions;
            public addClipAxes(): void;
            public addClipPaths(): void;
            public addLabels(): void;
            public addShapes(): void;
            public adjustVisibility(item: AnnotationControllable): void;
            public destroy(): void;
            public destroyItem(item: AnnotationControllable): void;
            public getClipBox(): BBoxObject;
            public getLabelsAndShapesOptions(
                baseOptions: AnnotationsOptions,
                newOptions: Partial<AnnotationsOptions>
            ): AnnotationsOptions
            public init(): void;
            public initLabel(labelOptions: DeepPartial<AnnotationsLabelsOptions>, index: number): AnnotationLabelType;
            public initShape(shapeOptions: DeepPartial<AnnotationsShapesOptions>, index: number): AnnotationShapeType;
            public redraw(animation?: boolean): void;
            public redrawItem(item: AnnotationControllable, animation?: boolean): void;
            public redrawItems(items: Array<AnnotationControllable>, animation?: boolean): void;
            public remove(): void;
            public render(): void;
            public renderItem(item: AnnotationControllable): void;
            public setClipAxes(): void;
            public setControlPointsVisibility(visibile: boolean): void;
            public setLabelCollector(): void;
            public setOptions(userOptions: AnnotationsOptions): void;
            public setVisibility(visible?: boolean): void;
            public update(userOptions: DeepPartial<AnnotationsOptions>): void;
        }
        interface AnnotationChart extends Chart {
            annotations: Array<Annotation>;
            controlPointsGroup: SVGElement;
            options: AnnotationChartOptionsObject;
            plotBoxClip: SVGElement;
            addAnnotation(userOptions: AnnotationsOptions, redraw?: boolean): Annotation;
            drawAnnotations(): void;
            initAnnotation(userOptions: AnnotationsOptions): Annotation;
            removeAnnotation(idOrAnnotation: (number|string|Annotation)): void;
        }
        interface AnnotationChartOptionsObject extends Options {
            annotations: Array<AnnotationsOptions>;
            defs: Dictionary<SVGDefinitionObject>;
            navigation: NavigationOptions;
        }
        interface AnnotationControllableLabel {
            itemType: 'label';
        }
        interface AnnotationControlPointEventsOptionsObject {
            drag?: AnnotationControlPointDragEventFunction;
        }
        interface AnnotationControlPointOptionsObject {
            draggable?: undefined;
            events: AnnotationControlPointEventsOptionsObject;
            height: number;
            index?: number;
            positioner: AnnotationControlPointPositionerFunction;
            style: CSSObject;
            symbol: string;
            visible: boolean;
            width: number;
        }
        type AnnotationDraggableValue = (''|'x'|'y'|'xy');
        type AnnotationLabelType = AnnotationControllableLabel;
        type AnnotationShapeType = (
            AnnotationControllableCircle|AnnotationControllableImage|AnnotationControllablePath|
            AnnotationControllableRect
        );
        interface AnnotationMockPointOptionsObject {
            x: number;
            xAxis?: (number|string|Axis|null);
            y: number;
            yAxis?: (number|string|Axis|null);
        }
        interface AnnotationPoint extends Point {
            series: AnnotationSeries;
        }
        interface AnnotationSeries extends Series {
            chart: AnnotationChart;
            points: Array<AnnotationPoint>;
        }
        interface AnnotationsEventsOptions {
            afterUpdate?: EventCallbackFunction<Annotation>;
            add?: EventCallbackFunction<Annotation>;
            click?: EventCallbackFunction<Annotation>;
            remove?: EventCallbackFunction<Annotation>;
        }
        interface AnnotationsLabelOptions extends AnnotationControllableOptionsObject {
            align: AlignValue;
            allowOverlap: boolean;
            backgroundColor: ColorType;
            borderColor: ColorType;
            borderRadius: number;
            borderWidth: number;
            className: string;
            crop: boolean;
            distance?: number;
            format?: string;
            formatter: FormatterCallbackFunction<Point>;
            overflow: DataLabelsOverflowValue;
            padding: number;
            shadow: (boolean|ShadowOptionsObject);
            shape: SymbolKeyValue;
            style: CSSObject;
            text?: string;
            type?: string;
            useHTML: boolean;
            verticalAlign: VerticalAlignValue;
            x: number;
            y: number;
        }
        interface AnnotationsLabelsOptions extends AnnotationsLabelOptions {
            point?: (string|AnnotationMockPointOptionsObject);
            itemType?: string;
        }
        interface AnnotationsOptions extends AnnotationControllableOptionsObject {
            controlPointOptions: AnnotationControlPointOptionsObject;
            draggable: AnnotationDraggableValue;
            events: AnnotationsEventsOptions;
            id?: (number|string);
            itemType?: string;
            labelOptions: AnnotationsLabelOptions;
            labels: Array<AnnotationsLabelsOptions>;
            shapeOptions: AnnotationsShapeOptions;
            shapes: Array<AnnotationsShapesOptions>;
            type?: string;
            typeOptions: AnnotationsTypeOptions;
            visible: boolean;
            zIndex: number;
        }
        interface AnnotationsShapeOptions extends AnnotationControllableOptionsObject {
            d?: (string|Function|SVGPathArray);
            fill: ColorType;
            height?: number;
            r: number;
            shapes: Array<AnnotationsShapeOptions>;
            snap: number;
            src: string;
            stroke: ColorString;
            strokeWidth: number;
            type: string;
            width?: number;
        }
        interface AnnotationsShapesOptions extends AnnotationsShapeOptions {
            markerEnd?: string;
            markerStart?: string;
            point?: (string|AnnotationMockPointOptionsObject);
            points?: Array<(string|AnnotationMockPointOptionsObject)>;
        }
        interface AnnotationsTypeOptions {
            background?: AnnotationsShapeOptions;
            height?: number;
            line?: AnnotationsShapeOptions;
            point: AnnotationMockPointOptionsObject;
            points?: Array<AnnotationsTypePointsOptions>;
            xAxis?: number;
            yAxis?: number;
        }
        interface AnnotationsTypePointsOptions {
            controlPoint?: number;
            x?: number;
            xAxis?: number;
            y?: number;
            yAxis?: number;
        }
        interface AnnotationTypesDictionary {
            [key: string]: typeof Annotation;
        }
        function extendAnnotation<T extends typeof Annotation>(
            Constructor: T,
            BaseConstructor: (Function|null),
            prototype: Partial<T['prototype']>,
            defaultOptions?: DeepPartial<T['prototype']['options']>
        ): void;
        interface Options {
            annotations?: (AnnotationsOptions|Array<AnnotationsOptions>);
        }
    }
}

import U from '../parts/Utilities.js';
const {
    addEvent,
    defined,
    destroyObjectProperties,
    erase,
    extend,
    find,
    fireEvent,
    merge,
    pick,
    splat,
    wrap
} = U;

import '../parts/Chart.js';
import controllableMixin from './controllable/controllableMixin.js';
import ControllableRect from './controllable/ControllableRect.js';
import ControllableCircle from './controllable/ControllableCircle.js';
import ControllablePath from './controllable/ControllablePath.js';
import ControllableImage from './controllable/ControllableImage.js';
import ControllableLabel from './controllable/ControllableLabel.js';
import eventEmitterMixin from './eventEmitterMixin.js';
import MockPoint from './MockPoint.js';
import ControlPoint from './ControlPoint.js';

var reduce = H.reduce,
    chartProto: Highcharts.AnnotationChart = H.Chart.prototype as any;

/* *********************************************************************
 *
 * ANNOTATION
 *
 ******************************************************************** */

/**
 * Possible directions for draggable annotations. An empty string (`''`)
 * makes the annotation undraggable.
 *
 * @typedef {''|'x'|'xy'|'y'} Highcharts.AnnotationDraggableValue
 */

/**
 * @private
 * @typedef {
 *          Highcharts.AnnotationControllableCircle|
 *          Highcharts.AnnotationControllableImage|
 *          Highcharts.AnnotationControllablePath|
 *          Highcharts.AnnotationControllableRect
 *          }
 *          Highcharts.AnnotationShapeType
 * @requires modules/annotations
 */

/**
 * @private
 * @typedef {
 *          Highcharts.AnnotationControllableLabel
 *          }
 *          Highcharts.AnnotationLabelType
 * @requires modules/annotations
 */

/**
 * A point-like object, a mock point or a point used in series.
 * @private
 * @typedef {Highcharts.AnnotationMockPoint|Highcharts.Point} Highcharts.AnnotationPointType
 * @requires modules/annotations
 */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * An annotation class which serves as a container for items like labels or
 * shapes. Created items are positioned on the chart either by linking them to
 * existing points or created mock points
 *
 * @class
 * @name Highcharts.Annotation
 *
 * @param {Highcharts.Chart} chart a chart instance
 * @param {Highcharts.AnnotationsOptions} userOptions the options object
 */
var Annotation: (typeof Highcharts.Annotation) = (H as any).Annotation = function (
    this: Highcharts.Annotation,
    chart: Highcharts.AnnotationChart,
    userOptions: Highcharts.AnnotationsOptions
): void {
    var labelsAndShapes;

    /**
     * The chart that the annotation belongs to.
     *
     * @type {Highcharts.Chart}
     */
    this.chart = chart;

    /**
     * The array of points which defines the annotation.
     *
     * @type {Array<Highcharts.Point>}
     */
    this.points = [];

    /**
     * The array of control points.
     *
     * @private
     * @name Highcharts.Annotation#controlPoints
     * @type {Array<Annotation.ControlPoint>}
     */
    this.controlPoints = [];

    this.coll = 'annotations';

    /**
     * The array of labels which belong to the annotation.
     *
     * @private
     * @name Highcharts.Annotation#labels
     * @type {Array<Highcharts.AnnotationLabelType>}
     */
    this.labels = [];

    /**
     * The array of shapes which belong to the annotation.
     *
     * @private
     * @name Highcharts.Annotation#shapes
     * @type {Array<Highcharts.AnnotationShapeType>}
     */
    this.shapes = [];

    /**
     * The options for the annotations.
     *
     * @name Highcharts.Annotation#options
     * @type {Highcharts.AnnotationsOptions}
     */
    this.options = merge(this.defaultOptions, userOptions);

    /**
     * The user options for the annotations.
     *
     * @name Highcharts.Annotation#userOptions
     * @type {Highcharts.AnnotationsOptions}
     */
    this.userOptions = userOptions;

    // Handle labels and shapes - those are arrays
    // Merging does not work with arrays (stores reference)
    labelsAndShapes = this.getLabelsAndShapesOptions(
        this.options,
        userOptions
    );
    this.options.labels = labelsAndShapes.labels;
    this.options.shapes = labelsAndShapes.shapes;

    /**
     * The callback that reports to the overlapping-labels module which
     * labels it should account for.
     * @private
     * @name Highcharts.Annotation#labelCollector
     * @type {Function}
     */

    /**
     * The group svg element.
     *
     * @name Highcharts.Annotation#group
     * @type {Highcharts.SVGElement}
     */

    /**
     * The group svg element of the annotation's shapes.
     *
     * @name Highcharts.Annotation#shapesGroup
     * @type {Highcharts.SVGElement}
     */

    /**
     * The group svg element of the annotation's labels.
     *
     * @name Highcharts.Annotation#labelsGroup
     * @type {Highcharts.SVGElement}
     */

    (this.init as any)(chart, this.options);
} as any;


merge(
    true,
    Annotation.prototype,
    controllableMixin,
    eventEmitterMixin,
    /** @lends Highcharts.Annotation# */
    {

        /**
         * List of events for `annotation.options.events` that should not be
         * added to `annotation.graphic` but to the `annotation`.
         *
         * @private
         * @type {Array<string>}
         */
        nonDOMEvents: ['add', 'afterUpdate', 'drag', 'remove'],

        /**
         * A basic type of an annotation. It allows to add custom labels
         * or shapes. The items  can be tied to points, axis coordinates
         * or chart pixel coordinates.
         *
         * @sample highcharts/annotations/basic/
         *         Basic annotations
         * @sample highcharts/demo/annotations/
         *         Advanced annotations
         * @sample highcharts/css/annotations
         *         Styled mode
         * @sample highcharts/annotations-advanced/controllable
         *         Controllable items
         * @sample {highstock} stock/annotations/fibonacci-retracements
         *         Custom annotation, Fibonacci retracement
         *
         * @type         {Array<*>}
         * @since        6.0.0
         * @requires     modules/annotations
         * @optionparent annotations
         *
         * @private
         */
        defaultOptions: {

            /**
             * Sets an ID for an annotation. Can be user later when removing an
             * annotation in [Chart#removeAnnotation(id)](
             * /class-reference/Highcharts.Chart#removeAnnotation) method.
             *
             * @type      {number|string}
             * @apioption annotations.id
             */

            /**
             * Whether the annotation is visible.
             *
             * @sample highcharts/annotations/visible/
             *         Set annotation visibility
             */
            visible: true,

            /**
             * Allow an annotation to be draggable by a user. Possible
             * values are `'x'`, `'xy'`, `'y'` and `''` (disabled).
             *
             * @sample highcharts/annotations/draggable/
             *         Annotations draggable: 'xy'
             *
             * @type {Highcharts.AnnotationDraggableValue}
             */
            draggable: 'xy',

            /**
             * Options for annotation's labels. Each label inherits options
             * from the labelOptions object. An option from the labelOptions
             * can be overwritten by config for a specific label.
             *
             * @requires modules/annotations
             */
            labelOptions: {

                /**
                 * The alignment of the annotation's label. If right,
                 * the right side of the label should be touching the point.
                 *
                 * @sample highcharts/annotations/label-position/
                 *         Set labels position
                 *
                 * @type {Highcharts.AlignValue}
                 */
                align: 'center',

                /**
                 * Whether to allow the annotation's labels to overlap.
                 * To make the labels less sensitive for overlapping,
                 * the can be set to 0.
                 *
                 * @sample highcharts/annotations/tooltip-like/
                 *         Hide overlapping labels
                 */
                allowOverlap: false,

                /**
                 * The background color or gradient for the annotation's label.
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 *
                 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 */
                backgroundColor: 'rgba(0, 0, 0, 0.75)',

                /**
                 * The border color for the annotation's label.
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 *
                 * @type {Highcharts.ColorString}
                 */
                borderColor: 'black',

                /**
                 * The border radius in pixels for the annotaiton's label.
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 */
                borderRadius: 3,

                /**
                 * The border width in pixels for the annotation's label
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 */
                borderWidth: 1,

                /**
                 * A class name for styling by CSS.
                 *
                 * @sample highcharts/css/annotations
                 *         Styled mode annotations
                 *
                 * @since 6.0.5
                 */
                className: '',

                /**
                 * Whether to hide the annotation's label
                 * that is outside the plot area.
                 *
                 * @sample highcharts/annotations/label-crop-overflow/
                 *         Crop or justify labels
                 */
                crop: false,

                /**
                 * The label's pixel distance from the point.
                 *
                 * @sample highcharts/annotations/label-position/
                 *         Set labels position
                 *
                 * @type      {number}
                 * @apioption annotations.labelOptions.distance
                 */

                /**
                 * A
                 * [format](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
                 * string for the data label.
                 *
                 * @see [plotOptions.series.dataLabels.format](plotOptions.series.dataLabels.format.html)
                 *
                 * @sample highcharts/annotations/label-text/
                 *         Set labels text
                 *
                 * @type      {string}
                 * @apioption annotations.labelOptions.format
                 */

                /**
                 * Alias for the format option.
                 *
                 * @see [format](annotations.labelOptions.format.html)
                 *
                 * @sample highcharts/annotations/label-text/
                 *         Set labels text
                 *
                 * @type      {string}
                 * @apioption annotations.labelOptions.text
                 */

                /**
                 * Callback JavaScript function to format the annotation's
                 * label. Note that if a `format` or `text` are defined, the
                 * format or text take precedence and the formatter is ignored.
                 * `This` refers to a point object.
                 *
                 * @sample highcharts/annotations/label-text/
                 *         Set labels text
                 *
                 * @type    {Highcharts.FormatterCallbackFunction<Highcharts.Point>}
                 * @default function () { return defined(this.y) ? this.y : 'Annotation label'; }
                 */
                formatter: function (this: Highcharts.AnnotationPoint): (number|string) {
                    return defined(this.y) ? this.y : 'Annotation label';
                },

                /**
                 * How to handle the annotation's label that flow outside the
                 * plot area. The justify option aligns the label inside the
                 * plot area.
                 *
                 * @sample highcharts/annotations/label-crop-overflow/
                 *         Crop or justify labels
                 *
                 * @validvalue ["allow", "justify"]
                 */
                overflow: 'justify',

                /**
                 * When either the borderWidth or the backgroundColor is set,
                 * this    is the padding within the box.
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 */
                padding: 5,

                /**
                 * The shadow of the box. The shadow can be an object
                 * configuration containing `color`, `offsetX`, `offsetY`,
                 * `opacity` and `width`.
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 *
                 * @type {boolean|Highcharts.ShadowOptionsObject}
                 */
                shadow: false,

                /**
                 * The name of a symbol to use for the border around the label.
                 * Symbols are predefined functions on the Renderer object.
                 *
                 * @sample highcharts/annotations/shapes/
                 *         Available shapes for labels
                 */
                shape: 'callout',

                /**
                 * Styles for the annotation's label.
                 *
                 * @see [plotOptions.series.dataLabels.style](plotOptions.series.dataLabels.style.html)
                 *
                 * @sample highcharts/annotations/label-presentation/
                 *         Set labels graphic options
                 *
                 * @type {Highcharts.CSSObject}
                 */
                style: {
                    /** @ignore */
                    fontSize: '11px',
                    /** @ignore */
                    fontWeight: 'normal',
                    /** @ignore */
                    color: 'contrast'
                },

                /**
                 * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
                 * to render the annotation's label.
                 */
                useHTML: false,

                /**
                 * The vertical alignment of the annotation's label.
                 *
                 * @sample highcharts/annotations/label-position/
                 *         Set labels position
                 *
                 * @type {Highcharts.VerticalAlignValue}
                 */
                verticalAlign: 'bottom',

                /**
                 * The x position offset of the label relative to the point.
                 * Note that if a `distance` is defined, the distance takes
                 * precedence over `x` and `y` options.
                 *
                 * @sample highcharts/annotations/label-position/
                 *         Set labels position
                 */
                x: 0,

                /**
                 * The y position offset of the label relative to the point.
                 * Note that if a `distance` is defined, the distance takes
                 * precedence over `x` and `y` options.
                 *
                 * @sample highcharts/annotations/label-position/
                 *         Set labels position
                 */
                y: -16
            },

            /**
             * An array of labels for the annotation. For options that apply to
             * multiple labels, they can be added to the
             * [labelOptions](annotations.labelOptions.html).
             *
             * @type      {Array<*>}
             * @extends   annotations.labelOptions
             * @apioption annotations.labels
             */

            /**
             * This option defines the point to which the label will be
             * connected. It can be either the point which exists in the
             * series - it is referenced by the point's id - or a new point with
             * defined x, y properties and optionally axes.
             *
             * @sample highcharts/annotations/mock-point/
             *         Attach annotation to a mock point
             *
             * @declare   Highcharts.AnnotationMockPointOptionsObject
             * @type      {string|*}
             * @requires  modules/annotations
             * @apioption annotations.labels.point
             */

            /**
             * The x position of the point. Units can be either in axis
             * or chart pixel coordinates.
             *
             * @type      {number}
             * @apioption annotations.labels.point.x
             */

            /**
             * The y position of the point. Units can be either in axis
             * or chart pixel coordinates.
             *
             * @type      {number}
             * @apioption annotations.labels.point.y
             */

            /**
             * This number defines which xAxis the point is connected to. It
             * refers to either the axis id or the index of the axis in the
             * xAxis array. If the option is not configured or the axis is not
             * found the point's x coordinate refers to the chart pixels.
             *
             * @type      {number|string|null}
             * @apioption annotations.labels.point.xAxis
             */

            /**
             * This number defines which yAxis the point is connected to. It
             * refers to either the axis id or the index of the axis in the
             * yAxis array. If the option is not configured or the axis is not
             * found the point's y coordinate refers to the chart pixels.
             *
             * @type      {number|string|null}
             * @apioption annotations.labels.point.yAxis
             */


            /**
             * An array of shapes for the annotation. For options that apply to
             * multiple shapes, then can be added to the
             * [shapeOptions](annotations.shapeOptions.html).
             *
             * @type      {Array<*>}
             * @extends   annotations.shapeOptions
             * @apioption annotations.shapes
             */

            /**
             * This option defines the point to which the shape will be
             * connected. It can be either the point which exists in the
             * series - it is referenced by the point's id - or a new point with
             * defined x, y properties and optionally axes.
             *
             * @declare   Highcharts.AnnotationMockPointOptionsObject
             * @type      {string|Highcharts.AnnotationMockPointOptionsObject}
             * @extends   annotations.labels.point
             * @apioption annotations.shapes.point
             */

            /**
             * An array of points for the shape. This option is available for
             * shapes which can use multiple points such as path. A point can be
             * either a point object or a point's id.
             *
             * @see [annotations.shapes.point](annotations.shapes.point.html)
             *
             * @declare   Highcharts.AnnotationMockPointOptionsObject
             * @type      {Array<string|*>}
             * @extends   annotations.labels.point
             * @apioption annotations.shapes.points
             */

            /**
             * The URL for an image to use as the annotation shape. Note,
             * type has to be set to `'image'`.
             *
             * @see [annotations.shapes.type](annotations.shapes.type)
             * @sample highcharts/annotations/shape-src/
             *         Define a marker image url for annotations
             *
             * @type      {string}
             * @apioption annotations.shapes.src
             */

            /**
             * Id of the marker which will be drawn at the final vertex of the
             * path. Custom markers can be defined in defs property.
             *
             * @see [defs.markers](defs.markers.html)
             *
             * @sample highcharts/annotations/custom-markers/
             *         Define a custom marker for annotations
             *
             * @type      {string}
             * @apioption annotations.shapes.markerEnd
             */

            /**
             * Id of the marker which will be drawn at the first vertex of the
             * path. Custom markers can be defined in defs property.
             *
             * @see [defs.markers](defs.markers.html)
             *
             * @sample {highcharts} highcharts/annotations/custom-markers/
             *         Define a custom marker for annotations
             *
             * @type      {string}
             * @apioption annotations.shapes.markerStart
             */


            /**
             * Options for annotation's shapes. Each shape inherits options from
             * the shapeOptions object. An option from the shapeOptions can be
             * overwritten by config for a specific shape.
             *
             * @requires  modules/annotations
             */
            shapeOptions: {

                /**
                 * The width of the shape.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 *
                 * @type      {number}
                 * @apioption annotations.shapeOptions.width
                 **/

                /**
                 * The height of the shape.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 *
                 * @type      {number}
                 * @apioption annotations.shapeOptions.height
                 */

                /**
                 * The type of the shape, e.g. circle or rectangle.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 *
                 * @type      {string}
                 * @default   'rect'
                 * @apioption annotations.shapeOptions.type
                 */

                /**
                 * The URL for an image to use as the annotation shape. Note,
                 * type has to be set to `'image'`.
                 *
                 * @see [annotations.shapeOptions.type](annotations.shapeOptions.type)
                 * @sample highcharts/annotations/shape-src/
                 *         Define a marker image url for annotations
                 *
                 * @type      {string}
                 * @apioption annotations.shapeOptions.src
                 */

                /**
                 * The color of the shape's stroke.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 *
                 * @type {Highcharts.ColorString}
                 */
                stroke: 'rgba(0, 0, 0, 0.75)',

                /**
                 * The pixel stroke width of the shape.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 */
                strokeWidth: 1,

                /**
                 * The color of the shape's fill.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 *
                 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 */
                fill: 'rgba(0, 0, 0, 0.75)',

                /**
                 * The radius of the shape.
                 *
                 * @sample highcharts/annotations/shape/
                 *         Basic shape annotation
                 */
                r: 0,

                /**
                 * Defines additional snapping area around an annotation
                 * making this annotation to focus. Defined in pixels.
                 */
                snap: 2
            },

            /**
             * Options for annotation's control points. Each control point
             * inherits options from controlPointOptions object.
             * Options from the controlPointOptions can be overwritten
             * by options in a specific control point.
             *
             * @declare   Highcharts.AnnotationControlPointOptionsObject
             * @requires  modules/annotations
             * @apioption annotations.controlPointOptions
             */
            controlPointOptions: {

                /**
                 * @type      {Highcharts.AnnotationControlPointPositionerFunction}
                 * @apioption annotations.controlPointOptions.positioner
                 */

                symbol: 'circle',
                width: 10,
                height: 10,
                style: {
                    stroke: 'black',
                    'stroke-width': 2,
                    fill: 'white'
                },
                visible: false,
                events: {}
            },

            /**
             * Event callback when annotation is added to the chart.
             *
             * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
             * @since     7.1.0
             * @apioption annotations.events.add
             */

            /**
             * Event callback when annotation is updated (e.g. drag and
             * droppped or resized by control points).
             *
             * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
             * @since     7.1.0
             * @apioption annotations.events.afterUpdate
             */

            /**
             * Event callback when annotation is removed from the chart.
             *
             * @type      {Highcharts.EventCallbackFunction<Highcharts.Annotation>}
             * @since     7.1.0
             * @apioption annotations.events.remove
             */

            /**
             * Events available in annotations.
             *
             * @requires modules/annotations
             */
            events: {},

            /**
             * The Z index of the annotation.
             */
            zIndex: 6

        },

        /**
         * Initialize the annotation.
         * @private
         */
        init: function (this: Highcharts.Annotation): void {
            this.linkPoints();
            this.addControlPoints();
            this.addShapes();
            this.addLabels();
            this.addClipPaths();
            this.setLabelCollector();
        },

        getLabelsAndShapesOptions: function (
            this: Highcharts.Annotation,
            baseOptions: Highcharts.AnnotationsOptions,
            newOptions: Partial<Highcharts.AnnotationsOptions>
        ): Highcharts.AnnotationsOptions {
            var mergedOptions = {} as Highcharts.AnnotationsOptions;

            (['labels', 'shapes'] as Array<('labels'|'shapes')>).forEach(function (name: ('labels'|'shapes')): void {
                if (baseOptions[name]) {
                    mergedOptions[name] = splat(newOptions[name]).map(
                        function (
                            basicOptions: (Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions),
                            i: number
                        ): (Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions) {
                            return merge(baseOptions[name][i], basicOptions);
                        }
                    ) as any;
                }
            });

            return mergedOptions;
        },

        addShapes: function (this: Highcharts.Annotation): void {
            (this.options.shapes || []).forEach(function (
                shapeOptions: Highcharts.AnnotationsShapesOptions,
                i: number
            ): void {
                var shape = this.initShape(shapeOptions, i);

                merge(true, this.options.shapes[i], shape.options);
            }, this);
        },

        addLabels: function (this: Highcharts.Annotation): void {
            (this.options.labels || []).forEach(function (
                labelsOptions: Highcharts.AnnotationsLabelsOptions,
                i: number
            ): void {
                var labels = this.initLabel(labelsOptions, i);

                merge(true, this.options.labels[i], labels.options);
            }, this);
        },

        addClipPaths: function (this: Highcharts.Annotation): void {
            this.setClipAxes();

            if (this.clipXAxis && this.clipYAxis) {
                this.clipRect = this.chart.renderer.clipRect(
                    this.getClipBox()
                );
            }
        },

        setClipAxes: function (this: Highcharts.Annotation): void {
            var xAxes = this.chart.xAxis,
                yAxes = this.chart.yAxis,
                linkedAxes: Array<Highcharts.Axis> = reduce(
                    ((this.options.labels || []) as Array<(
                        Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions
                    )>).concat(this.options.shapes || []),
                    function (
                        axes: Array<Highcharts.Axis>,
                        labelOrShape: (Highcharts.AnnotationsLabelsOptions|Highcharts.AnnotationsShapesOptions)
                    ): Array<Highcharts.Axis> {
                        return [
                            xAxes[
                                labelOrShape &&
                                labelOrShape.point &&
                                (labelOrShape.point as any).xAxis
                            ] || axes[0],
                            yAxes[
                                labelOrShape &&
                                labelOrShape.point &&
                                (labelOrShape.point as any).yAxis
                            ] || axes[1]
                        ];
                    },
                    []
                );

            this.clipXAxis = linkedAxes[0];
            this.clipYAxis = linkedAxes[1];
        },

        getClipBox: function (this: Highcharts.Annotation): Highcharts.BBoxObject {
            return {
                x: (this.clipXAxis as any).left,
                y: (this.clipYAxis as any).top,
                width: (this.clipXAxis as any).width,
                height: (this.clipYAxis as any).height
            };
        },

        setLabelCollector: function (this: Highcharts.Annotation): void {
            var annotation = this;

            annotation.labelCollector = function (): Array<Highcharts.SVGElement> {
                return annotation.labels.reduce(
                    function (
                        labels: Array<Highcharts.SVGElement>,
                        label: Highcharts.AnnotationLabelType
                    ): Array<Highcharts.SVGElement> {
                        if (!label.options.allowOverlap) {
                            labels.push(label.graphic);
                        }

                        return labels;
                    },
                    []
                );
            };

            annotation.chart.labelCollectors.push(
                annotation.labelCollector
            );
        },

        /**
         * Set an annotation options.
         * @private
         * @param {Highcharts.AnnotationsOptions} - user options for an annotation
         */
        setOptions: function (this: Highcharts.Annotation, userOptions: Highcharts.AnnotationsOptions): void {
            this.options = merge(this.defaultOptions, userOptions);
        },

        redraw: function (this: Highcharts.Annotation, animation?: boolean): void {
            this.linkPoints();

            if (!this.graphic) {
                this.render();
            }

            if (this.clipRect) {
                this.clipRect.animate(this.getClipBox());
            }

            this.redrawItems(this.shapes, animation);
            this.redrawItems(this.labels, animation);


            controllableMixin.redraw.call(this, animation);
        },

        /**
         * @private
         * @param {Array<Highcharts.AnnotationControllable>} items
         * @param {boolean} [animation]
         */
        redrawItems: function (
            this: Highcharts.Annotation,
            items: Array<Highcharts.AnnotationControllable>,
            animation?: boolean
        ): void {
            var i = items.length;

            // needs a backward loop
            // labels/shapes array might be modified
            // due to destruction of the item
            while (i--) {
                this.redrawItem(items[i], animation);
            }
        },

        render: function (this: Highcharts.Annotation): void {
            var renderer = this.chart.renderer;

            this.graphic = renderer
                .g('annotation')
                .attr({
                    zIndex: this.options.zIndex,
                    visibility: this.options.visible ?
                        'visible' :
                        'hidden'
                })
                .add();

            this.shapesGroup = renderer
                .g('annotation-shapes')
                .add(this.graphic)
                .clip(this.chart.plotBoxClip);

            this.labelsGroup = renderer
                .g('annotation-labels')
                .attr({
                    // hideOverlappingLabels requires translation
                    translateX: 0,
                    translateY: 0
                })
                .add(this.graphic);

            if (this.clipRect) {
                this.graphic.clip(this.clipRect);
            }

            this.addEvents();

            controllableMixin.render.call(this);
        },

        /**
         * Set the annotation's visibility.
         * @private
         * @param {boolean} [visible]
         * Whether to show or hide an annotation. If the param is omitted, the
         * annotation's visibility is toggled.
         */
        setVisibility: function (this: Highcharts.Annotation, visible?: boolean): void {
            var options = this.options,
                visibility = pick(visible, !options.visible);

            this.graphic.attr(
                'visibility',
                visibility ? 'visible' : 'hidden'
            );

            if (!visibility) {
                this.setControlPointsVisibility(false);
            }

            options.visible = visibility;
        },

        setControlPointsVisibility: function (this: Highcharts.Annotation, visible: boolean): void {
            var setItemControlPointsVisibility = function (
                item: (Highcharts.AnnotationLabelType|Highcharts.AnnotationShapeType)
            ): void {
                item.setControlPointsVisibility(visible);
            };

            controllableMixin.setControlPointsVisibility.call(
                this,
                visible
            );

            this.shapes.forEach(setItemControlPointsVisibility);
            this.labels.forEach(setItemControlPointsVisibility);
        },

        /**
         * Destroy the annotation. This function does not touch the chart
         * that the annotation belongs to (all annotations are kept in
         * the chart.annotations array) - it is recommended to use
         * {@link Highcharts.Chart#removeAnnotation} instead.
         * @private
         */
        destroy: function (this: Highcharts.Annotation): void {
            var chart = this.chart,
                destroyItem = function (
                    item: (Highcharts.AnnotationLabelType|Highcharts.AnnotationShapeType)
                ): void {
                    item.destroy();
                };

            this.labels.forEach(destroyItem);
            this.shapes.forEach(destroyItem);

            this.clipXAxis = null as any;
            this.clipYAxis = null as any;

            erase(chart.labelCollectors, this.labelCollector);

            eventEmitterMixin.destroy.call(this);
            controllableMixin.destroy.call(this);

            destroyObjectProperties(this, chart);
        },

        /**
         * See {@link Highcharts.Chart#removeAnnotation}.
         * @private
         */
        remove: function (this: Highcharts.Annotation): void {
            // Let chart.update() remove annoations on demand
            return this.chart.removeAnnotation(this);
        },

        /**
         * Updates an annotation.
         *
         * @function Highcharts.Annotation#update
         *
         * @param {Partial<Highcharts.AnnotationsOptions>} userOptions
         * New user options for the annotation.
         *
         * @return {void}
         */
        update: function (this: Highcharts.Annotation, userOptions: Partial<Highcharts.AnnotationsOptions>): void {
            var chart = this.chart,
                labelsAndShapes = this.getLabelsAndShapesOptions(
                    this.userOptions,
                    userOptions
                ),
                userOptionsIndex = chart.annotations.indexOf(this),
                options = merge(true, this.userOptions, userOptions);

            options.labels = labelsAndShapes.labels;
            options.shapes = labelsAndShapes.shapes;

            this.destroy();
            this.constructor(chart, options);

            // Update options in chart options, used in exporting (#9767):
            chart.options.annotations[userOptionsIndex] = options;

            this.isUpdating = true;
            this.redraw();
            this.isUpdating = false;
            fireEvent(this, 'afterUpdate');
        },

        /* *************************************************************
         * ITEM SECTION
         * Contains methods for handling a single item in an annotation
         **************************************************************** */

        /**
         * Initialisation of a single shape
         * @private
         * @param {Object} shapeOptions - a confg object for a single shape
         */
        initShape: function (
            this: Highcharts.Annotation,
            shapeOptions: Partial<Highcharts.AnnotationsShapesOptions>,
            index: number
        ): Highcharts.AnnotationShapeType {
            var options = merge(
                    this.options.shapeOptions,
                    {
                        controlPointOptions: this.options.controlPointOptions
                    },
                    shapeOptions
                ),
                shape = new (Annotation.shapesMap[options.type] as any)(
                    this,
                    options,
                    index
                );

            shape.itemType = 'shape';

            this.shapes.push(shape);

            return shape;
        },

        /**
         * Initialisation of a single label
         * @private
         */
        initLabel: function (
            this: Highcharts.Annotation,
            labelOptions: Partial<Highcharts.AnnotationsLabelsOptions>,
            index: number
        ): Highcharts.AnnotationLabelType {
            var options = merge(
                    this.options.labelOptions,
                    {
                        controlPointOptions: this.options.controlPointOptions
                    },
                    labelOptions
                ),
                label = new ControllableLabel(
                    this,
                    options,
                    index
                );

            label.itemType = 'label';

            this.labels.push(label);

            return label;
        },

        /**
         * Redraw a single item.
         * @private
         * @param {Annotation.Label|Annotation.Shape} item
         * @param {boolean} [animation]
         */
        redrawItem: function (
            this: Highcharts.Annotation,
            item: Highcharts.AnnotationControllable,
            animation?: boolean
        ): void {
            item.linkPoints();

            if (!item.shouldBeDrawn()) {
                this.destroyItem(item);
            } else {
                if (!item.graphic) {
                    this.renderItem(item);
                }

                item.redraw(
                    pick(animation, true) && item.graphic.placed
                );

                if (item.points.length) {
                    this.adjustVisibility(item);
                }
            }
        },

        /**
         * Hide or show annotaiton attached to points.
         * @private
         * @param {Annotation.Label|Annotation.Shape} item
         */

        adjustVisibility: function (
            this: Highcharts.Annotation,
            item: Highcharts.AnnotationControllable
        ): void { // #9481
            var hasVisiblePoints = false,
                label = item.graphic;

            item.points.forEach(function (point: Highcharts.AnnotationPointType): void {
                if (
                    point.series.visible !== false &&
                    point.visible !== false
                ) {
                    hasVisiblePoints = true;
                }
            });

            if (!hasVisiblePoints) {
                label.hide();

            } else if (label.visibility === 'hidden') {
                label.show();
            }
        },

        /**
         * Destroy a single item.
         * @private
         * @param {Annotation.Label|Annotation.Shape} item
         */
        destroyItem: function (this: Highcharts.Annotation, item: Highcharts.AnnotationControllable): void {
            // erase from shapes or labels array
            erase((this as any)[item.itemType + 's'], item);
            item.destroy();
        },

        /**
         * @private
         */
        renderItem: function (this: Highcharts.Annotation, item: Highcharts.AnnotationControllable): void {
            item.render(
                item.itemType === 'label' ?
                    this.labelsGroup :
                    this.shapesGroup
            );
        }
    } as any
);

/**
 * An object uses for mapping between a shape type and a constructor.
 * To add a new shape type extend this object with type name as a key
 * and a constructor as its value.
 */
Annotation.shapesMap = {
    'rect': ControllableRect,
    'circle': ControllableCircle,
    'path': ControllablePath,
    'image': ControllableImage
};

Annotation.types = {} as any;

Annotation.MockPoint = MockPoint;
Annotation.ControlPoint = ControlPoint;

H.extendAnnotation = function <T extends typeof Highcharts.Annotation> (
    Constructor: T,
    BaseConstructor: (Function|null),
    prototype: Partial<T['prototype']>,
    defaultOptions?: DeepPartial<T['prototype']['options']>
): void {
    BaseConstructor = BaseConstructor || Annotation;

    merge(
        true,
        Constructor.prototype,
        BaseConstructor.prototype,
        prototype
    );

    Constructor.prototype.defaultOptions = merge(
        Constructor.prototype.defaultOptions,
        defaultOptions || {}
    );
};

/* *********************************************************************
 *
 * EXTENDING CHART PROTOTYPE
 *
 ******************************************************************** */

extend(chartProto, /** @lends Highcharts.Chart# */ {
    initAnnotation: function (
        this: Highcharts.AnnotationChart,
        userOptions: Highcharts.AnnotationsOptions
    ): Highcharts.Annotation {
        var Constructor = Annotation.types[(userOptions as any).type] || Annotation,
            annotation = new Constructor(this, userOptions);

        this.annotations.push(annotation);

        return annotation;
    },

    /**
     * Add an annotation to the chart after render time.
     *
     * @param  {Highcharts.AnnotationsOptions} options
     *         The annotation options for the new, detailed annotation.
     * @param {boolean} [redraw]
     *
     * @return {Highcharts.Annotation} - The newly generated annotation.
     */
    addAnnotation: function (
        this: Highcharts.AnnotationChart,
        userOptions: Highcharts.AnnotationsOptions,
        redraw?: boolean
    ): Highcharts.Annotation {
        var annotation = this.initAnnotation(userOptions);

        this.options.annotations.push(annotation.options);

        if (pick(redraw, true)) {
            annotation.redraw();
        }

        return annotation;
    },

    /**
     * Remove an annotation from the chart.
     *
     * @param {number|string|Highcharts.Annotation} idOrAnnotation
     * The annotation's id or direct annotation object.
     */
    removeAnnotation: function (
        this: Highcharts.AnnotationChart,
        idOrAnnotation: (number|string|Highcharts.Annotation)
    ): void {
        var annotations = this.annotations,
            annotation: Highcharts.Annotation = (idOrAnnotation as any).coll === 'annotations' ?
                idOrAnnotation :
                find(
                    annotations,
                    function (annotation: Highcharts.Annotation): boolean {
                        return annotation.options.id === idOrAnnotation;
                    }
                ) as any;

        if (annotation) {
            fireEvent(annotation, 'remove');
            erase(this.options.annotations, annotation.options);
            erase(annotations, annotation);
            annotation.destroy();
        }
    },

    drawAnnotations: function (this: Highcharts.AnnotationChart): void {
        this.plotBoxClip.attr(this.plotBox);

        this.annotations.forEach(function (annotation): void {
            annotation.redraw();
        });
    }
});

// Let chart.update() update annotations
chartProto.collectionsWithUpdate.push('annotations');

// Let chart.update() create annoations on demand
chartProto.collectionsWithInit.annotations = [chartProto.addAnnotation];

chartProto.callbacks.push(function (
    this: Highcharts.AnnotationChart,
    chart: Highcharts.AnnotationChart
): void {
    chart.annotations = [];

    if (!chart.options.annotations) {
        chart.options.annotations = [];
    }

    chart.plotBoxClip = this.renderer.clipRect(this.plotBox);

    chart.controlPointsGroup = chart.renderer
        .g('control-points')
        .attr({ zIndex: 99 })
        .clip(chart.plotBoxClip)
        .add();

    chart.options.annotations.forEach(function (
        annotationOptions: Highcharts.AnnotationsOptions,
        i: number
    ): void {
        var annotation = chart.initAnnotation(annotationOptions);

        chart.options.annotations[i] = annotation.options;
    });

    chart.drawAnnotations();
    addEvent(chart, 'redraw', chart.drawAnnotations);
    addEvent(chart, 'destroy', function (): void {
        chart.plotBoxClip.destroy();
        chart.controlPointsGroup.destroy();
    });
} as any);

wrap(
    H.Pointer.prototype,
    'onContainerMouseDown',
    function (this: Highcharts.Annotation, proceed: Function): void {
        if (!this.chart.hasDraggedAnnotation) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
);
