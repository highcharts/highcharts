/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type {
    AnnotationPoint,
    AnnotationPointType
} from './AnnotationPoint';
import type {
    AnnotationOptions,
    Options
} from './AnnotationOptions';
import type { AnnotationTypeRegistry } from './Types/AnnotationType';
import type AxisType from '../../Core/Axis/AxisType';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type {
    ControllableLabelType,
    ControllableShapeType,
    ControllableType
} from './Controllables/ControllableType';
import type {
    ControllableLabelOptions,
    ControllableShapeOptions
} from './Controllables/ControllableOptions';
import type NavigationBindings from './NavigationBindings';
import type Series from '../../Core/Series/Series';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

import A from '../../Core/Animation/AnimationUtilities.js';
const { getDeferredAnimation } = A;
import AnnotationDefaults from './AnnotationDefaults.js';
import Chart from '../../Core/Chart/Chart.js';
const chartProto: AnnotationChart = Chart.prototype as any;
import Controllable from './Controllables/Controllable.js';
const controllableProto = Controllable.prototype;
import ControllableRect from './Controllables/ControllableRect.js';
import ControllableCircle from './Controllables/ControllableCircle.js';
import ControllableEllipse from './Controllables/ControllableEllipse.js';
import ControllablePath from './Controllables/ControllablePath.js';
import ControllableImage from './Controllables/ControllableImage.js';
import ControllableLabel from './Controllables/ControllableLabel.js';
import ControlPoint from './ControlPoint.js';
import EventEmitter from './EventEmitter.js';
import H from '../../Core/Globals.js';
import MockPoint from './MockPoint.js';
import Pointer from '../../Core/Pointer.js';
import PopupComposition from './Popup/PopupComposition.js';
import U from '../../Core/Utilities.js';
import { Palette } from '../../Core/Color/Palettes.js';
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

/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Options'{
    interface Options {
        annotations?: (AnnotationOptions|Array<AnnotationOptions>);
    }
}

export interface AnnotationChart extends Chart {
    annotations: Array<Annotation>;
    controlPointsGroup: SVGElement;
    navigationBindings: NavigationBindings;
    options: Options;
    plotBoxClip: SVGElement;
    addAnnotation(
        userOptions: AnnotationOptions,
        redraw?: boolean
    ): Annotation;
    drawAnnotations(): void;
    initAnnotation(userOptions: AnnotationOptions): Annotation;
    removeAnnotation(idOrAnnotation: (number|string|Annotation)): void;
}

export interface AnnotationSeries extends Series {
    chart: AnnotationChart;
    points: Array<AnnotationPoint>;
}

/* *********************************************************************
 *
 * ANNOTATION
 *
 ******************************************************************** */


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
class Annotation extends EventEmitter implements Controllable {

    /**
     * @private
     */
    public static ControlPoint = ControlPoint;

    /**
     * @private
     */
    public static MockPoint = MockPoint;

    /**
     * An object uses for mapping between a shape type and a constructor.
     * To add a new shape type extend this object with type name as a key
     * and a constructor as its value.
     */
    public static shapesMap: Record<string, Function> = {
        'rect': ControllableRect,
        'circle': ControllableCircle,
        'ellipse': ControllableEllipse,
        'path': ControllablePath,
        'image': ControllableImage
    };

    /**
     * @private
     */
    public static types = {} as AnnotationTypeRegistry;

    /* *
     *
     *  Static Functions
     *
     * */

    // @todo use NavigationBindings as internal parameter
    public static compose(
        ChartClass: typeof Chart,
        NavigationBindingsClass: typeof NavigationBindings,
        PointerClass: typeof Pointer,
        SVGRendererClass: typeof SVGRenderer
    ): void {
        ControllableLabel.compose(SVGRendererClass);
        ControllablePath.compose(ChartClass, SVGRendererClass);
        NavigationBindingsClass.compose(Annotation, ChartClass);
        PopupComposition.compose(NavigationBindingsClass, PointerClass);
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        chart: AnnotationChart,
        userOptions: AnnotationOptions
    ) {
        super();

        let labelsAndShapes;

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

        this.init(chart, this.options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public annotation: Controllable['annotation'] = void 0 as any;
    public chart: AnnotationChart;
    public clipRect?: SVGElement;
    public clipXAxis?: AxisType;
    public clipYAxis?: AxisType;
    public coll: 'annotations' = 'annotations';
    public collection: Controllable['collection'] = void 0 as any;
    public controlPoints: Array<ControlPoint>;
    public animationConfig: Partial<AnimationOptions> = void 0 as any;
    public graphic: SVGElement = void 0 as any;
    public group: SVGElement = void 0 as any;
    public isUpdating?: boolean;
    public labelCollector: Chart.LabelCollectorFunction = void 0 as any;
    public labels: Array<ControllableLabelType>;
    public labelsGroup: SVGElement = void 0 as any;
    public options: AnnotationOptions;
    public points: Array<AnnotationPointType>;
    public shapes: Array<ControllableShapeType>;
    public shapesGroup: SVGElement = void 0 as any;
    public userOptions: AnnotationOptions;

    /* *
     *
     *  Functions
     *
     * */

    public init(
        annotationOrChart: (Annotation|AnnotationChart),
        userOptions: AnnotationOptions,
        index?: number
    ): void;

    /**
     * Initialize the annotation.
     * @private
     */
    public init(): void {
        const chart = this.chart,
            animOptions = this.options.animation;

        this.linkPoints();
        this.addControlPoints();
        this.addShapes();
        this.addLabels();
        this.setLabelCollector();
        this.animationConfig = getDeferredAnimation(chart, animOptions);
    }

    public getLabelsAndShapesOptions(
        baseOptions: AnnotationOptions,
        newOptions: DeepPartial<AnnotationOptions>
    ): AnnotationOptions {
        const mergedOptions = {} as AnnotationOptions;

        (['labels', 'shapes'] as Array<('labels'|'shapes')>).forEach(function (
            name: ('labels'|'shapes')
        ): void {
            const someBaseOptions = baseOptions[name];

            if (someBaseOptions) {
                if (newOptions[name]) {
                    mergedOptions[name] = splat(newOptions[name]).map(
                        function (
                            basicOptions: (
                                ControllableLabelOptions|
                                ControllableShapeOptions
                            ),
                            i: number
                        ): (
                            ControllableLabelOptions|
                            ControllableShapeOptions
                            ) {
                            return merge(someBaseOptions[i], basicOptions);
                        }
                    ) as any;
                } else {
                    mergedOptions[name] = baseOptions[name] as any;
                }
            }
        });

        return mergedOptions;
    }

    public addShapes(): void {
        const shapes = this.options.shapes || [];
        shapes.forEach((shapeOptions, i): void => {
            const shape = this.initShape(shapeOptions, i);

            merge(true, shapes[i], shape.options);
        });
    }

    public addLabels(): void {
        const labelsOptions = (this.options.labels || []);

        labelsOptions.forEach((labelOptions, i): void => {
            const label = this.initLabel(labelOptions, i);

            merge(true, labelsOptions[i], label.options);
        });
    }

    public addClipPaths(): void {
        this.setClipAxes();

        if (
            this.clipXAxis &&
            this.clipYAxis &&
            this.options.crop // #15399
        ) {
            this.clipRect = this.chart.renderer.clipRect(
                this.getClipBox() as any
            );
        }
    }

    public setClipAxes(): void {
        const xAxes = this.chart.xAxis,
            yAxes = this.chart.yAxis,
            linkedAxes: Array<AxisType> = ((
                this.options.labels || []
            ) as Array<(ControllableLabelOptions|ControllableShapeOptions)>)
                .concat(this.options.shapes || [])
                .reduce((
                    axes: Array<AxisType>,
                    labelOrShape
                ): Array<AxisType> => {
                    const point = labelOrShape &&
                        (
                            labelOrShape.point ||
                            (labelOrShape.points && labelOrShape.points[0])
                        );

                    return [
                        xAxes[point && (point as any).xAxis] || axes[0],
                        yAxes[point && (point as any).yAxis] || axes[1]
                    ];
                }, []);

        this.clipXAxis = linkedAxes[0];
        this.clipYAxis = linkedAxes[1];
    }

    public getClipBox(): (BBoxObject|void) {
        if (this.clipXAxis && this.clipYAxis) {
            return {
                x: this.clipXAxis.left,
                y: this.clipYAxis.top,
                width: this.clipXAxis.width,
                height: this.clipYAxis.height
            };
        }
    }

    public setLabelCollector(): void {
        const annotation = this;

        annotation.labelCollector = function (): Array<SVGElement> {
            return annotation.labels.reduce(
                function (
                    labels: Array<SVGElement>,
                    label: ControllableLabelType
                ): Array<SVGElement> {
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
    }

    /**
     * Set an annotation options.
     * @private
     * @param {Highcharts.AnnotationsOptions} - user options for an annotation
     */
    public setOptions(userOptions: AnnotationOptions): void {
        this.options = merge(this.defaultOptions, userOptions);
    }

    public redraw(animation?: boolean): void {
        this.linkPoints();

        if (!this.graphic) {
            this.render();
        }

        if (this.clipRect) {
            this.clipRect.animate(this.getClipBox() as any);
        }

        this.redrawItems(this.shapes, animation);
        this.redrawItems(this.labels, animation);


        controllableProto.redraw.call(this, animation);
    }

    /**
     * @private
     * @param {Array<Highcharts.AnnotationControllable>} items
     * @param {boolean} [animation]
     */
    public redrawItems(
        items: Array<ControllableType>,
        animation?: boolean
    ): void {
        let i = items.length;

        // needs a backward loop
        // labels/shapes array might be modified
        // due to destruction of the item
        while (i--) {
            this.redrawItem(items[i], animation);
        }
    }

    /**
     * @private
     * @param {Array<Highcharts.AnnotationControllable>} items
     */
    public renderItems(
        items: Array<ControllableType>
    ): void {
        let i = items.length;

        while (i--) {
            this.renderItem(items[i]);
        }
    }

    public render(): void {
        const renderer = this.chart.renderer;

        this.graphic = renderer
            .g('annotation')
            .attr({
                opacity: 0,
                zIndex: this.options.zIndex,
                visibility: this.options.visible ?
                    'inherit' :
                    'hidden'
            })
            .add();

        this.shapesGroup = renderer
            .g('annotation-shapes')
            .add(this.graphic);

        if (this.options.crop) { // #15399
            this.shapesGroup.clip(this.chart.plotBoxClip);
        }

        this.labelsGroup = renderer
            .g('annotation-labels')
            .attr({
                // hideOverlappingLabels requires translation
                translateX: 0,
                translateY: 0
            })
            .add(this.graphic);

        this.addClipPaths();

        if (this.clipRect) {
            this.graphic.clip(this.clipRect);
        }

        // Render shapes and labels before adding events (#13070).
        this.renderItems(this.shapes);
        this.renderItems(this.labels);

        this.addEvents();

        controllableProto.render.call(this);
    }

    /**
     * Set the annotation's visibility.
     * @private
     * @param {boolean} [visible]
     * Whether to show or hide an annotation. If the param is omitted, the
     * annotation's visibility is toggled.
     */
    public setVisibility(visible?: boolean): void {
        const options = this.options,
            navigation = this.chart.navigationBindings,
            visibility = pick(visible, !options.visible);

        this.graphic.attr(
            'visibility',
            visibility ? 'inherit' : 'hidden'
        );

        if (!visibility) {
            this.setControlPointsVisibility(false);

            if (
                navigation.activeAnnotation === this &&
                navigation.popup &&
                navigation.popup.formType === 'annotation-toolbar'
            ) {
                fireEvent(navigation, 'closePopup');
            }
        }

        options.visible = visibility;
    }

    public setControlPointsVisibility(visible: boolean): void {
        const setItemControlPointsVisibility = function (
            item: ControllableType
        ): void {
            item.setControlPointsVisibility(visible);
        };

        controllableProto.setControlPointsVisibility.call(this, visible);

        this.shapes.forEach(setItemControlPointsVisibility);
        this.labels.forEach(setItemControlPointsVisibility);
    }

    /**
     * Destroy the annotation. This function does not touch the chart
     * that the annotation belongs to (all annotations are kept in
     * the chart.annotations array) - it is recommended to use
     * {@link Highcharts.Chart#removeAnnotation} instead.
     * @private
     */
    public destroy(): void {
        const chart = this.chart,
            destroyItem = function (
                item: ControllableType
            ): void {
                item.destroy();
            };

        this.labels.forEach(destroyItem);
        this.shapes.forEach(destroyItem);

        this.clipXAxis = null as any;
        this.clipYAxis = null as any;

        erase(chart.labelCollectors, this.labelCollector);

        super.destroy();
        controllableProto.destroy.call(this);

        destroyObjectProperties(this, chart);
    }

    /**
     * See {@link Highcharts.Chart#removeAnnotation}.
     * @private
     */
    public remove(): void {
        // Let chart.update() remove annoations on demand
        return this.chart.removeAnnotation(this);
    }

    /**
     * Updates an annotation.
     *
     * @function Highcharts.Annotation#update
     *
     * @param {Partial<Highcharts.AnnotationsOptions>} userOptions
     * New user options for the annotation.
     *
     */
    public update(
        userOptions: DeepPartial<AnnotationOptions>,
        redraw? : boolean
    ): void {
        const chart = this.chart,
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
        if (pick(redraw, true)) {
            chart.redraw();
        }

        fireEvent(this, 'afterUpdate');
        this.isUpdating = false;
    }

    /* *************************************************************
        * ITEM SECTION
        * Contains methods for handling a single item in an annotation
        **************************************************************** */

    /**
     * Initialisation of a single shape
     * @private
     * @param {Object} shapeOptions
     * a confg object for a single shape
     * @param {number} index
     * annotation may have many shapes, this is the shape's index saved in
     * shapes.index.
     */
    public initShape(
        shapeOptions: Partial<ControllableShapeOptions>,
        index: number
    ): ControllableShapeType {
        const options = merge(
                this.options.shapeOptions,
                {
                    controlPointOptions: this.options.controlPointOptions
                },
                shapeOptions
            ),
            shape = new ((Annotation as any).shapesMap[options.type as any])(
                this,
                options,
                index
            );

        shape.itemType = 'shape';

        this.shapes.push(shape);

        return shape;
    }

    /**
     * Initialisation of a single label
     * @private
     */
    public initLabel(
        labelOptions: Partial<ControllableLabelOptions>,
        index: number
    ): ControllableLabelType {
        const options = merge<ControllableLabelOptions>(
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
    }

    /**
     * Redraw a single item.
     * @private
     * @param {Annotation.Label|Annotation.Shape} item
     * @param {boolean} [animation]
     */
    public redrawItem(
        item: ControllableType,
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
    }

    /**
     * Hide or show annotaiton attached to points.
     * @private
     * @param {Annotation.Label|Annotation.Shape} item
     */

    public adjustVisibility(
        item: ControllableType
    ): void { // #9481
        let hasVisiblePoints = false,
            label = item.graphic;

        item.points.forEach(function (
            point: AnnotationPointType
        ): void {
            if (
                point.series.visible !== false &&
                point.visible !== false
            ) {
                hasVisiblePoints = true;
            }
        });

        if (label) {
            if (!hasVisiblePoints) {
                label.hide();

            } else if (label.visibility === 'hidden') {
                label.show();
            }
        }
    }

    /**
     * Destroy a single item.
     * @private
     * @param {Annotation.Label|Annotation.Shape} item
     */
    public destroyItem(item: ControllableType): void {
        // erase from shapes or labels array
        erase((this as any)[item.itemType + 's'], item);
        item.destroy();
    }

    /**
     * @private
     */
    public renderItem(item: ControllableType): void {
        item.render(
            item.itemType === 'label' ?
                this.labelsGroup :
                this.shapesGroup
        );
    }
}

interface Annotation extends Controllable {
    defaultOptions: AnnotationOptions;
    nonDOMEvents: Array<string>;
    translate(dx: number, dy: number): void;
}

merge<Annotation>(
    true,
    Annotation.prototype,
    Controllable.prototype as any,
    // restore original Annotation implementation after mixin overwrite
    merge(
        Annotation.prototype,
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

            defaultOptions: AnnotationDefaults
        }
    )
);

function extendAnnotation<T extends typeof Annotation>(
    Constructor: T,
    BaseConstructor: (Function|null),
    prototype: Partial<T['prototype']>,
    defaultOptions?: DeepPartial<T['prototype']['options']>
): void {
    BaseConstructor = BaseConstructor || Annotation;

    extend(
        Constructor.prototype,
        merge(
            BaseConstructor.prototype,
            prototype
        )
    );

    Constructor.prototype.defaultOptions = merge(
        Constructor.prototype.defaultOptions,
        defaultOptions || {}
    );
}

/* *********************************************************************
 *
 * EXTENDING CHART PROTOTYPE
 *
 ******************************************************************** */

extend(chartProto, /** @lends Highcharts.Chart# */ {
    initAnnotation: function (
        this: AnnotationChart,
        userOptions: AnnotationOptions
    ): Annotation {
        const Constructor = (Annotation as any)
                .types[(userOptions as any).type] || Annotation,
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
     * @sample highcharts/annotations/add-annotation/
     *         Add annotation
     * @return {Highcharts.Annotation} - The newly generated annotation.
     */
    addAnnotation: function (
        this: AnnotationChart,
        userOptions: AnnotationOptions,
        redraw?: boolean
    ): Annotation {
        const annotation = this.initAnnotation(userOptions);

        this.options.annotations.push(annotation.options);

        if (pick(redraw, true)) {
            annotation.redraw();
            annotation.graphic.attr({
                opacity: 1
            });
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
        this: AnnotationChart,
        idOrAnnotation: (number|string|Annotation)
    ): void {
        const annotations = this.annotations,
            annotation: Annotation = (
                (idOrAnnotation as any).coll === 'annotations'
            ) ?
                idOrAnnotation :
                find(
                    annotations,
                    function (annotation: Annotation): boolean {
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

    drawAnnotations: function (this: AnnotationChart): void {
        this.plotBoxClip.attr(this.plotBox);

        this.annotations.forEach(function (annotation): void {
            annotation.redraw();
            annotation.graphic.animate({
                opacity: 1
            }, annotation.animationConfig);
        });
    }
});

// Let chart.update() update annotations
chartProto.collectionsWithUpdate.push('annotations');

// Let chart.update() create annoations on demand
chartProto.collectionsWithInit.annotations = [chartProto.addAnnotation];

// Create lookups initially
addEvent(
    Chart as unknown as AnnotationChart,
    'afterInit',
    function (this): void {
        this.annotations = [];

        if (!this.options.annotations) {
            this.options.annotations = [];
        }

    }
);

chartProto.callbacks.push(function (
    this: AnnotationChart,
    chart: AnnotationChart
): void {

    chart.plotBoxClip = this.renderer.clipRect(this.plotBox);

    chart.controlPointsGroup = chart.renderer
        .g('control-points')
        .attr({ zIndex: 99 })
        .clip(chart.plotBoxClip)
        .add();

    chart.options.annotations.forEach(function (annotationOptions, i): void {
        if (
            // Verify that it has not been previously added in a responsive rule
            !chart.annotations.some((annotation): boolean =>
                annotation.options === annotationOptions
            )
        ) {
            const annotation = chart.initAnnotation(annotationOptions);

            chart.options.annotations[i] = annotation.options;
        }
    });

    chart.drawAnnotations();
    addEvent(chart, 'redraw', chart.drawAnnotations);
    addEvent(chart, 'destroy', function (): void {
        chart.plotBoxClip.destroy();
        chart.controlPointsGroup.destroy();
    });
    addEvent(chart, 'exportData', function (this, event: any): void {
        const annotations = chart.annotations,
            csvColumnHeaderFormatter = ((
                this.options.exporting &&
                this.options.exporting.csv) ||
                {}).columnHeaderFormatter,
            // If second row doesn't have xValues
            // then it is a title row thus multiple level header is in use.
            multiLevelHeaders = !event.dataRows[1].xValues,
            annotationHeader = (
                chart.options.lang &&
                chart.options.lang.exportData &&
                chart.options.lang.exportData.annotationHeader
            ),
            columnHeaderFormatter = function (index: any): any {
                let s;
                if (csvColumnHeaderFormatter) {
                    s = csvColumnHeaderFormatter(index);
                    if (s !== false) {
                        return s;
                    }
                }

                s = annotationHeader + ' ' + index;

                if (multiLevelHeaders) {
                    return {
                        columnTitle: s,
                        topLevelColumnTitle: s
                    };
                }

                return s;
            },
            startRowLength = event.dataRows[0].length,
            annotationSeparator = (
                chart.options.exporting &&
                chart.options.exporting.csv &&
                chart.options.exporting.csv.annotations &&
                chart.options.exporting.csv.annotations.itemDelimiter
            ),
            joinAnnotations = (
                chart.options.exporting &&
                chart.options.exporting.csv &&
                chart.options.exporting.csv.annotations &&
                chart.options.exporting.csv.annotations.join
            );

        annotations.forEach((annotation): void => {

            if (
                annotation.options.labelOptions &&
                annotation.options.labelOptions.includeInDataExport
            ) {

                annotation.labels.forEach((label): void => {
                    if (label.options.text) {
                        const annotationText = label.options.text;

                        label.points.forEach((points): void => {
                            const annotationX = points.x,
                                xAxisIndex = points.series.xAxis ?
                                    points.series.xAxis.options.index :
                                    -1;
                            let wasAdded = false;

                            // Annotation not connected to any xAxis -
                            // add new row.
                            if (xAxisIndex === -1) {
                                const n = event.dataRows[0].length,
                                    newRow: any = new Array(n);

                                for (let i = 0; i < n; ++i) {
                                    newRow[i] = '';
                                }
                                newRow.push(annotationText);
                                newRow.xValues = [];
                                newRow.xValues[xAxisIndex] = annotationX;
                                event.dataRows.push(newRow);
                                wasAdded = true;
                            }

                            // Annotation placed on a exported data point
                            // - add new column
                            if (!wasAdded) {
                                event.dataRows.forEach((row: any): void => {
                                    if (
                                        !wasAdded &&
                                        row.xValues &&
                                        xAxisIndex !== void 0 &&
                                        annotationX === row.xValues[xAxisIndex]
                                    ) {
                                        if (
                                            joinAnnotations &&
                                            row.length > startRowLength
                                        ) {
                                            row[row.length - 1] += (
                                                annotationSeparator +
                                                annotationText
                                            );
                                        } else {
                                            row.push(annotationText);
                                        }
                                        wasAdded = true;
                                    }
                                });
                            }

                            // Annotation not placed on any exported data point,
                            // but connected to the xAxis - add new row
                            if (!wasAdded) {
                                const n = event.dataRows[0].length,
                                    newRow: any = new Array(n);

                                for (let i = 0; i < n; ++i) {
                                    newRow[i] = '';
                                }
                                newRow[0] = annotationX;
                                newRow.push(annotationText);
                                newRow.xValues = [];

                                if (xAxisIndex !== void 0) {
                                    newRow.xValues[xAxisIndex] = annotationX;
                                }
                                event.dataRows.push(newRow);
                            }
                        });
                    }
                });
            }
        });

        let maxRowLen = 0;

        event.dataRows.forEach((row: any): void => {
            maxRowLen = Math.max(maxRowLen, row.length);
        });

        const newRows = maxRowLen - event.dataRows[0].length;

        for (let i = 0; i < newRows; i++) {
            const header = columnHeaderFormatter(i + 1);

            if (multiLevelHeaders) {
                event.dataRows[0].push(header.topLevelColumnTitle);
                event.dataRows[1].push(header.columnTitle);
            } else {
                event.dataRows[0].push(header);
            }
        }
    });
} as any);

wrap(
    Pointer.prototype,
    'onContainerMouseDown',
    function (this: Annotation, proceed: Function): void {
        if (!this.chart.hasDraggedAnnotation) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
);

/* *
 *
 *  Default Export
 *
 * */

export default Annotation;

/* *
 *
 *  API Options
 *
 * */


/**
 * Possible directions for draggable annotations. An empty string (`''`)
 * makes the annotation undraggable.
 *
 * @typedef {''|'x'|'xy'|'y'} Highcharts.AnnotationDraggableValue
 * @requires modules/annotations
 */

/**
 * @private
 * @typedef {
 *          Highcharts.AnnotationControllableCircle|
 *          Highcharts.AnnotationControllableImage|
 *          Highcharts.AnnotationControllablePath|
 *          Highcharts.AnnotationControllableRect
 *     } Highcharts.AnnotationShapeType
 * @requires modules/annotations
 */

/**
 * @private
 * @typedef {
 *          Highcharts.AnnotationControllableLabel
 *     } Highcharts.AnnotationLabelType
 * @requires modules/annotations
 */

/**
 * A point-like object, a mock point or a point used in series.
 * @private
 * @typedef {
 *          Highcharts.AnnotationMockPoint|
 *          Highcharts.Point
 *     } Highcharts.AnnotationPointType
 * @requires modules/annotations
 */
/**
 * Shape point as string, object or function.
 *
 * @typedef {
 *          string|
 *          Highcharts.AnnotationMockPointOptionsObject|
 *          Highcharts.AnnotationMockPointFunction
 *     } Highcharts.AnnotationShapePointOptions
 */

(''); // keeps doclets above in JS file
