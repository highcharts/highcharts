/* *
 *
 *  (c) 2009-2025 Highsoft, Black Label
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
import type { AnnotationPointType } from './AnnotationSeries';
import type AnnotationOptions from './AnnotationOptions';
import type { AnnotationTypeRegistry } from './Types/AnnotationType';
import type AxisType from '../../Core/Axis/AxisType';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type Chart from '../../Core/Chart/Chart';
import type {
    ControllableLabelType,
    ControllableShapeType,
    ControllableType
} from './Controllables/ControllableType';
import type {
    ControllableLabelOptions,
    ControllableShapeOptions
} from './Controllables/ControllableOptions';
import type { DeepPartial } from '../../Shared/Types';
import type MockPointOptions from './MockPointOptions';
import type NavigationBindings from './NavigationBindings.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

import A from '../../Core/Animation/AnimationUtilities.js';
const { getDeferredAnimation } = A;
import AnnotationChart from './AnnotationChart.js';
import AnnotationDefaults from './AnnotationDefaults.js';
import ControllableRect from './Controllables/ControllableRect.js';
import ControllableCircle from './Controllables/ControllableCircle.js';
import ControllableEllipse from './Controllables/ControllableEllipse.js';
import ControllablePath from './Controllables/ControllablePath.js';
import ControllableImage from './Controllables/ControllableImage.js';
import ControllableLabel from './Controllables/ControllableLabel.js';
import ControlPoint from './ControlPoint.js';
import ControlTarget from './ControlTarget.js';
import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import EventEmitter from './EventEmitter.js';
import MockPoint from './MockPoint.js';
import Pointer from '../../Core/Pointer.js';
import PopupComposition from './Popup/PopupComposition.js';
import U from '../../Core/Utilities.js';
const {
    destroyObjectProperties,
    erase,
    fireEvent,
    merge,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options'{
    interface DefaultOptions {
        annotations?: AnnotationOptions;
    }
    interface Options {
        /**
         * A collection of annotations to add to the chart. The basic annotation
         * allows adding custom labels or shapes. The items can be tied to
         * points, axis coordinates or chart pixel coordinates.
         *
         * General options for all annotations can be set using the
         * `Highcharts.setOptions` function. In this case only single objects
         * are supported, because it alters the defaults for all items. For
         * initialization in the chart constructors however, arrays of
         * annotations are supported.
         *
         * See more in the [general docs](https://www.highcharts.com/docs/advanced-chart-features/annotations).
         *
         * @sample highcharts/annotations/basic/ Basic annotations
         * @sample highcharts/demo/annotations/ Annotated chart
         * @sample highcharts/css/annotations Styled mode
         * @sample highcharts/annotations-advanced/controllable
         *         Controllable items
         * @sample {highstock} stock/annotations/fibonacci-retracements
         *         Custom annotation, Fibonacci retracement
         * @sample highcharts/annotations/shape/
         *         Themed crooked line annotation
         *
         * @type         {Array<*>}
         * @since        6.0.0
         * @requires     modules/annotations
         * @optionparent annotations
         */
        annotations?: (AnnotationOptions|Array<AnnotationOptions>);
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Hide or show annotation attached to points.
 * @internal
 */
function adjustVisibility(
    item: ControllableType
): void { // #9481
    const label = item.graphic,
        hasVisiblePoints = item.points.some((point): boolean => (
            point.series.visible !== false &&
            point.visible !== false
        ));

    if (label) {
        if (!hasVisiblePoints) {
            label.hide();

        } else if (label.visibility === 'hidden') {
            label.show();
        }
    }
}

/** @internal */
function getLabelsAndShapesOptions(
    baseOptions: AnnotationOptions,
    newOptions: DeepPartial<AnnotationOptions>
): AnnotationOptions {
    const mergedOptions = {} as AnnotationOptions;

    (['labels', 'shapes'] as Array<('labels'|'shapes')>).forEach((
        name
    ): void => {
        const someBaseOptions = baseOptions[name],
            newOptionsValue = newOptions[name];

        type ControllableOptions = (
            ControllableLabelOptions|
            ControllableShapeOptions
        );

        if (someBaseOptions) {
            if (newOptionsValue) {
                mergedOptions[name] = splat(newOptionsValue).map(
                    (basicOptions, i): ControllableOptions =>
                        merge(someBaseOptions[i], basicOptions)
                ) as any;
            } else {
                mergedOptions[name] = baseOptions[name] as any;
            }
        }
    });

    return mergedOptions;
}

/* *
 *
 *  Class
 *
 * */

/**
 * An annotation class which serves as a container for items like labels or
 * shapes. Created items are positioned on the chart either by linking them to
 * existing points or created mock points.
 *
 * @requires modules/annotations
 *
 * @class
 * @name Highcharts.Annotation
 *
 * @param {Highcharts.Chart} chart
 *        A chart instance
 * @param {Highcharts.AnnotationsOptions} userOptions
 *        The annotation options
 */
class Annotation extends EventEmitter implements ControlTarget {
    /** @internal */
    public static readonly ControlPoint = ControlPoint;

    /** @internal */
    public static readonly MockPoint = MockPoint;

    /**
     * An object uses for mapping between a shape type and a constructor.
     * To add a new shape type extend this object with type name as a key
     * and a constructor as its value.
     *
     * @internal
     */
    public static readonly shapesMap: Record<string, Function> = {
        'rect': ControllableRect,
        'circle': ControllableCircle,
        'ellipse': ControllableEllipse,
        'path': ControllablePath,
        'image': ControllableImage
    };

    /** @internal */
    public static readonly types = {} as AnnotationTypeRegistry;

    /* *
     *
     *  Static Functions
     *
     * */

    /** @internal */
    public static compose(
        ChartClass: typeof Chart,
        NavigationBindingsClass: typeof NavigationBindings,
        PointerClass: typeof Pointer,
        SVGRendererClass: typeof SVGRenderer
    ): void {
        AnnotationChart.compose(Annotation, ChartClass, PointerClass);
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

        /**
         * The chart that the annotation belongs to.
         *
         * @name Highcharts.Annotation#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;

        /**
         * The array of points which defines the annotation.
         *
         * @name Highcharts.Annotation#points
         * @type {Array<Highcharts.Point>}
         */
        this.points = [];

        /**
         * The array of control points.
         *
         * @internal
         * @name Highcharts.Annotation#controlPoints
         * @type {Array<Annotation.ControlPoint>}
         */
        this.controlPoints = [];

        this.coll = 'annotations';

        this.index = -1;

        /**
         * The array of labels which belong to the annotation.
         *
         * @internal
         * @name Highcharts.Annotation#labels
         * @type {Array<Highcharts.AnnotationLabelType>}
         */
        this.labels = [];

        /**
         * The array of shapes which belong to the annotation.
         *
         * @internal
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
        this.setOptions(userOptions);

        /**
         * The user options for the annotations.
         *
         * @name Highcharts.Annotation#userOptions
         * @type {Highcharts.AnnotationsOptions}
         */
        this.userOptions = userOptions;

        // Handle labels and shapes - those are arrays
        // Merging does not work with arrays (stores reference)
        const labelsAndShapes = getLabelsAndShapesOptions(
            this.options,
            userOptions
        );
        this.options.labels = labelsAndShapes.labels;
        this.options.shapes = labelsAndShapes.shapes;

        /**
         * The callback that reports to the overlapping labels logic which
         * labels it should account for.
         *
         * @internal
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

    /**
     * The chart that the annotation belongs to.
     *
     * @name Highcharts.Annotation#chart
     * @type {Highcharts.Chart}
     */
    public chart: AnnotationChart;

    /** @internal */
    public clipRect?: SVGElement;

    /** @internal */
    public clipXAxis?: AxisType;

    /** @internal */
    public clipYAxis?: AxisType;

    /** @internal */
    public coll: 'annotations' = 'annotations';

    /** @internal */
    public animationConfig!: Partial<AnimationOptions>;

    /** @internal */
    public graphic!: SVGElement;

    /**
     * The group svg element.
     *
     * @name Highcharts.Annotation#group
     * @type {Highcharts.SVGElement}
     */
    public group!: SVGElement;

    /** @internal */
    public index: number;

    /** @internal */
    public isUpdating?: boolean;

    /** @internal */
    public labelCollector!: Chart.LabelCollectorFunction;

    /** @internal */
    public labels: Array<ControllableLabelType>;

    /**
     * The group svg element of the annotation's labels.
     *
     * @name Highcharts.Annotation#labelsGroup
     * @type {Highcharts.SVGElement}
     */
    public labelsGroup!: SVGElement;

    /**
     * The options for the annotations.
     *
     * @name Highcharts.Annotation#options
     * @type {Highcharts.AnnotationsOptions}
     */
    public options!: AnnotationOptions;

    /**
     * The array of points which defines the annotation.
     *
     * @name Highcharts.Annotation#points
     * @type {Array<Highcharts.AnnotationPointType>}
     */
    public points: Array<AnnotationPointType>;

    /**
     * The array of shapes which belong to the annotation.
     * @internal
     */
    public shapes: Array<ControllableShapeType>;

    /**
     * The group svg element of the annotation's shapes.
     *
     * @name Highcharts.Annotation#shapesGroup
     * @type {Highcharts.SVGElement}
     */
    public shapesGroup!: SVGElement;

    /**
     * The user options for the annotations.
     *
     * @name Highcharts.Annotation#userOptions
     * @type {Highcharts.AnnotationsOptions}
     */
    public userOptions: AnnotationOptions;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
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

    /** @internal */
    public addLabels(): void {
        const labelsOptions = (this.options.labels || []);

        labelsOptions.forEach((labelOptions, i): void => {
            const label = this.initLabel(labelOptions, i);

            merge(true, labelsOptions[i], label.options);
        });
    }

    /** @internal */
    public addShapes(): void {
        const shapes = this.options.shapes || [];
        shapes.forEach((shapeOptions, i): void => {
            const shape = this.initShape(shapeOptions, i);

            merge(true, shapes[i], shape.options);
        });
    }

    /**
     * Destroy the annotation. This function does not touch the chart
     * that the annotation belongs to (all annotations are kept in
     * the chart.annotations array) - it is recommended to use
     * {@link Highcharts.Chart#removeAnnotation} instead.
     *
     * @internal
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
        this.destroyControlTarget();

        destroyObjectProperties(this, chart);
    }

    /**
     * Destroy a single item.
     * @internal
     */
    public destroyItem(
        item: ControllableType
    ): void {
        // Erase from shapes or labels array
        erase((this as any)[item.itemType + 's'], item);
        item.destroy();
    }

    /** @internal */
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

    /**
     * Initialize the annotation properties.
     * @internal
     */
    public initProperties(
        chart: AnnotationChart,
        userOptions: AnnotationOptions
    ): void {
        this.setOptions(userOptions);

        const labelsAndShapes = getLabelsAndShapesOptions(
            this.options,
            userOptions
        );
        this.options.labels = labelsAndShapes.labels;
        this.options.shapes = labelsAndShapes.shapes;

        this.chart = chart;
        this.points = [];
        this.controlPoints = [];
        this.coll = 'annotations';
        this.userOptions = userOptions;
        this.labels = [];
        this.shapes = [];
    }

    /**
     * Initialize the annotation.
     * @internal
     */
    public init(
        _annotationOrChart: (Annotation|AnnotationChart),
        _userOptions: AnnotationOptions,
        index: number = this.index
    ): void {
        const chart = this.chart,
            animOptions = this.options.animation;

        this.index = index;
        this.linkPoints();
        this.addControlPoints();
        this.addShapes();
        this.addLabels();
        this.setLabelCollector();
        this.animationConfig = getDeferredAnimation(chart, animOptions);
    }

    /**
     * Initialization of a single label.
     * @internal
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
     * Initialization of a single shape.
     *
     * @internal
     * @param {Object} shapeOptions
     * a config object for a single shape
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

    /** @internal */
    public redraw(
        animation?: boolean
    ): void {
        this.linkPoints();

        if (!this.graphic) {
            this.render();
        }

        if (this.clipRect) {
            this.clipRect.animate(this.getClipBox() as any);
        }

        this.redrawItems(this.shapes, animation);
        this.redrawItems(this.labels, animation);

        this.redrawControlPoints(animation);
    }

    /**
     * Redraw a single item.
     * @internal
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
                adjustVisibility(item);
            }
        }
    }

    /** @internal */
    public redrawItems(
        items: Array<ControllableType>,
        animation?: boolean
    ): void {
        let i = items.length;

        // Needs a backward loop. Labels/shapes array might be modified due to
        // destruction of the item
        while (i--) {
            this.redrawItem(items[i], animation);
        }
    }

    /**
     * See {@link Highcharts.Chart#removeAnnotation}.
     * @internal
     */
    public remove(): void {
        // Let chart.update() remove annotations on demand
        return this.chart.removeAnnotation(this);
    }

    /** @internal */
    public render(): void {
        const renderer = this.chart.renderer;

        this.graphic = renderer
            .g('annotation')
            .addClass(this.options.className || '')
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
                // `hideOverlappingLabels` requires translation
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

        this.renderControlPoints();
    }

    /** @internal */
    public renderItem(item: ControllableType): void {
        item.render(
            item.itemType === 'label' ?
                this.labelsGroup :
                this.shapesGroup
        );
    }

    /** @internal */
    public renderItems(
        items: Array<ControllableType>
    ): void {
        let i = items.length;

        while (i--) {
            this.renderItem(items[i]);
        }
    }

    /** @internal */
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

    /** @internal */
    public setControlPointsVisibility(visible: boolean): void {
        const setItemControlPointsVisibility = function (
            item: ControllableType
        ): void {
            item.setControlPointsVisibility(visible);
        };

        this.controlPoints.forEach((controlPoint): void => {
            controlPoint.setVisibility(visible);
        });

        this.shapes.forEach(setItemControlPointsVisibility);
        this.labels.forEach(setItemControlPointsVisibility);
    }

    /** @internal */
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
     *
     * @internal
     * @param {Highcharts.AnnotationsOptions} userOptions
     *        User options for an annotation
     */
    public setOptions(userOptions: AnnotationOptions): void {
        this.options = merge(
            // Shared for all annotation types
            this.defaultOptions,
            // The static typeOptions from the class
            (
                userOptions.type &&
                this.defaultOptions.types[userOptions.type]
            ) || {},
            userOptions
        );
    }

    /**
     * Set the annotation's visibility.
     *
     * @internal
     * @param {boolean} [visible]
     * Whether to show or hide an annotation. If the param is omitted, the
     * annotation's visibility is toggled.
     */
    public setVisibility(
        visible?: boolean
    ): void {
        const options = this.options,
            navigation = this.chart.navigationBindings,
            visibility = pick(visible, !options.visible);

        this.graphic.attr(
            'visibility',
            visibility ? 'inherit' : 'hidden'
        );

        if (!visibility) {
            const setItemControlPointsVisibility = function (
                item: ControllableType
            ): void {
                item.setControlPointsVisibility(visibility);
            };

            this.shapes.forEach(setItemControlPointsVisibility);
            this.labels.forEach(setItemControlPointsVisibility);

            if (
                navigation.activeAnnotation === this &&
                navigation.popup &&
                navigation.popup.type === 'annotation-toolbar'
            ) {
                fireEvent(navigation, 'closePopup');
            }
        }

        options.visible = visibility;
    }

    /**
     * Updates an annotation.
     *
     * @function Highcharts.Annotation#update
     *
     * @param {Partial<Highcharts.AnnotationsOptions>} userOptions
     *        New user options for the annotation.
     */
    public update(
        userOptions: DeepPartial<AnnotationOptions>,
        redraw? : boolean
    ): void {
        const chart = this.chart,
            labelsAndShapes = getLabelsAndShapesOptions(
                this.userOptions,
                userOptions
            ),
            userOptionsIndex = chart.annotations.indexOf(this),
            options = merge(true, this.userOptions, userOptions);

        options.labels = labelsAndShapes.labels;
        options.shapes = labelsAndShapes.shapes;

        this.destroy();
        this.initProperties(chart, options);
        this.init(chart, options);
        // Update options in chart options, used in exporting (#9767, #21507):
        chart.options.annotations[userOptionsIndex] = this.options;

        this.isUpdating = true;
        if (pick(redraw, true)) {
            chart.drawAnnotations();
        }

        fireEvent(this, 'afterUpdate');
        this.isUpdating = false;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface Annotation extends ControlTarget {
    defaultOptions: AnnotationOptions;
    nonDOMEvents: Array<string>;
    getPointsOptions(): Array<MockPointOptions>;
    linkPoints(): (Array<AnnotationPointType>|undefined);
}

Annotation.prototype.defaultOptions = AnnotationDefaults;
defaultOptions.annotations = AnnotationDefaults;

/**
 * List of events for `annotation.options.events` that should not be
 * added to `annotation.graphic` but to the `annotation`.
 *
 * @internal
 * @type {Array<string>}
 */
Annotation.prototype.nonDOMEvents = ['add', 'afterUpdate', 'drag', 'remove'];

ControlTarget.compose(Annotation);

/* *
 *
 *  Default Export
 *
 * */

export default Annotation;

/* *
 *
 *  API Declarations
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
 * @internal
 * @typedef {
 *          Highcharts.AnnotationControllableCircle|
 *          Highcharts.AnnotationControllableImage|
 *          Highcharts.AnnotationControllablePath|
 *          Highcharts.AnnotationControllableRect
 *     } Highcharts.AnnotationShapeType
 * @requires modules/annotations
 */

/**
 * @internal
 * @typedef {
 *          Highcharts.AnnotationControllableLabel
 *     } Highcharts.AnnotationLabelType
 * @requires modules/annotations
 */

/**
 * A point-like object, a mock point or a point used in series.
 * @internal
 * @typedef {
 *          Highcharts.AnnotationMockPoint|
 *          Highcharts.Point
 *     } Highcharts.AnnotationPointType
 * @requires modules/annotations
 */

// TODO: Unable to copy into native due to type mismatch between TS and Docs.
/**
 * Shape point as string, object or function.
 *
 * @typedef {
 *          string|
 *          Highcharts.AnnotationMockPointOptionsObject|
 *          Highcharts.AnnotationMockPointFunction
 *     } Highcharts.AnnotationShapePointOptions
 */

(''); // Keeps doclets above in JS file
