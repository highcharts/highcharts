/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type AnimationOptions from '../Animation/AnimationOptions';
import type ColorType from '../Color/ColorType';
import type { EventCallback } from '../Callback';
import type LineSeries from '../../Series/Line/LineSeries';
import type PointLike from './PointLike';
import type {
    PointMarkerOptions,
    PointOptions,
    PointShortOptions
} from './PointOptions';
import type { PointTypeOptions } from './PointType';
import type { SeriesZonesOptions } from './SeriesOptions';
import type { StatesOptionsKey } from './StatesOptions';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGElement from '../Renderer/SVG/SVGElement';
import A from '../Animation/AnimationUtilities.js';
const { animObject } = A;
import H from '../Globals.js';
import U from '../Utilities.js';
const {
    defined,
    erase,
    extend,
    fireEvent,
    format,
    getNestedProperty,
    isArray,
    isNumber,
    isObject,
    syncTimeout,
    pick,
    removeEvent,
    uniqueKey
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface PointGraphicalProps {
            singular: Array<string>;
            plural: Array<string>;
        }
        interface PlotSeriesPointOptions {
            events?: PointEventsOptionsObject;
        }
        interface PointUpdateCallbackFunction {
            (this: Point, event: PointUpdateEventObject): void;
        }
        interface PointUpdateEventObject {
            options?: PointTypeOptions;
        }
    }
}

/**
 * Function callback when a series point is clicked. Return false to cancel the
 * action.
 *
 * @callback Highcharts.PointClickCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        The point where the event occured.
 *
 * @param {Highcharts.PointClickEventObject} event
 *        Event arguments.
 */

/**
 * Common information for a click event on a series point.
 *
 * @interface Highcharts.PointClickEventObject
 * @extends Highcharts.PointerEventObject
 *//**
 * Clicked point.
 * @name Highcharts.PointClickEventObject#point
 * @type {Highcharts.Point}
 */

/**
 * Configuration hash for the data label and tooltip formatters.
 *
 * @interface Highcharts.PointLabelObject
 *//**
 * The point's current color.
 * @name Highcharts.PointLabelObject#color
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
 *//**
 * The point's current color index, used in styled mode instead of `color`. The
 * color index is inserted in class names used for styling.
 * @name Highcharts.PointLabelObject#colorIndex
 * @type {number}
 *//**
 * The name of the related point.
 * @name Highcharts.PointLabelObject#key
 * @type {string|undefined}
 *//**
 * The percentage for related points in a stacked series or pies.
 * @name Highcharts.PointLabelObject#percentage
 * @type {number}
 *//**
 * The related point. The point name, if defined, is available through
 * `this.point.name`.
 * @name Highcharts.PointLabelObject#point
 * @type {Highcharts.Point}
 *//**
 * The related series. The series name is available through `this.series.name`.
 * @name Highcharts.PointLabelObject#series
 * @type {Highcharts.Series}
 *//**
 * The total of values in either a stack for stacked series, or a pie in a pie
 * series.
 * @name Highcharts.PointLabelObject#total
 * @type {number|undefined}
 *//**
 * For categorized axes this property holds the category name for the point. For
 * other axes it holds the X value.
 * @name Highcharts.PointLabelObject#x
 * @type {number|string|undefined}
 *//**
 * The y value of the point.
 * @name Highcharts.PointLabelObject#y
 * @type {number|undefined}
 */

/**
 * Gets fired when the mouse leaves the area close to the point.
 *
 * @callback Highcharts.PointMouseOutCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {global.PointerEvent} event
 *        Event that occured.
 */

/**
 * Gets fired when the mouse enters the area close to the point.
 *
 * @callback Highcharts.PointMouseOverCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {global.Event} event
 *        Event that occured.
 */

/**
 * The generic point options for all series.
 *
 * In TypeScript you have to extend `PointOptionsObject` with an additional
 * declaration to allow custom data options:
 *
 * ```
 * declare interface PointOptionsObject {
 *     customProperty: string;
 * }
 * ```
 *
 * @interface Highcharts.PointOptionsObject
 */

/**
 * Possible option types for a data point. Use `null` to indicate a gap.
 *
 * @typedef {number|string|Highcharts.PointOptionsObject|Array<(number|string|null)>|null} Highcharts.PointOptionsType
 */

/**
 * Gets fired when the point is removed using the `.remove()` method.
 *
 * @callback Highcharts.PointRemoveCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {global.Event} event
 *        Event that occured.
 */

/**
 * Possible key values for the point state options.
 *
 * @typedef {"hover"|"inactive"|"normal"|"select"} Highcharts.PointStateValue
 */

/**
 * Gets fired when the point is updated programmatically through the `.update()`
 * method.
 *
 * @callback Highcharts.PointUpdateCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointUpdateEventObject} event
 *        Event that occured.
 */

/**
 * Information about the update event.
 *
 * @interface Highcharts.PointUpdateEventObject
 * @extends global.Event
 *//**
 * Options data of the update event.
 * @name Highcharts.PointUpdateEventObject#options
 * @type {Highcharts.PointOptionsType}
 */

''; // detach doclet above

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The Point object. The point objects are generated from the `series.data`
 * configuration objects or raw numbers. They can be accessed from the
 * `Series.points` array. Other ways to instantiate points are through {@link
 * Highcharts.Series#addPoint} or {@link Highcharts.Series#setData}.
 *
 * @class
 * @name Highcharts.Point
 */
class Point {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * For categorized axes this property holds the category name for the
     * point. For other axes it holds the X value.
     *
     * @name Highcharts.Point#category
     * @type {string}
     */
    public category: string = void 0 as any;

    public color?: ColorType;

    /**
     * The point's current color index, used in styled mode instead of
     * `color`. The color index is inserted in class names used for styling.
     *
     * @name Highcharts.Point#colorIndex
     * @type {number}
     */
    public colorIndex?: number = void 0;

    public dataLabels?: Array<SVGElement>;

    public formatPrefix: string = 'point';

    public id: string = void 0 as any;

    public isNew?: boolean;

    public isNull: boolean = false;

    public marker?: PointMarkerOptions;

    /**
     * The name of the point. The name can be given as the first position of the
     * point configuration array, or as a `name` property in the configuration:
     *
     * @example
     * // Array config
     * data: [
     *     ['John', 1],
     *     ['Jane', 2]
     * ]
     *
     * // Object config
     * data: [{
     *        name: 'John',
     *        y: 1
     * }, {
     *     name: 'Jane',
     *     y: 2
     * }]
     *
     * @name Highcharts.Point#name
     * @type {string}
     */
    public name: string = void 0 as any;

    public nonZonedColor?: ColorType;

    /**
     * The point's options as applied in the initial configuration, or
     * extended through `Point.update`.
     *
     * In TypeScript you have to extend `PointOptionsObject` via an
     * additional interface to allow custom data options:
     *
     * ```
     * declare interface PointOptionsObject {
     *     customProperty: string;
     * }
     * ```
     *
     * @name Highcharts.Point#options
     * @type {Highcharts.PointOptionsObject}
     */
    public options: PointOptions = void 0 as any;

    /**
     * The percentage for points in a stacked series or pies.
     *
     * @name Highcharts.Point#percentage
     * @type {number|undefined}
     */
    public percentage?: number = void 0;

    public selected?: boolean = false;

    /**
     * The series object associated with the point.
     *
     * @name Highcharts.Point#series
     * @type {Highcharts.Series}
     */
    public series: LineSeries = void 0 as any;

    public shapeArgs?: SVGAttributes;

    public shapeType?: string;

    public startXPos?: number;

    public state?: StatesOptionsKey;

    /**
     * The total of values in either a stack for stacked series, or a pie in a
     * pie series.
     *
     * @name Highcharts.Point#total
     * @type {number|undefined}
     */
    public total?: number = void 0;

    public touched?: boolean;

    /**
     * For certain series types, like pie charts, where individual points can
     * be shown or hidden.
     *
     * @name Highcharts.Point#visible
     * @type {boolean}
     * @default true
     */
    public visible: boolean = true;

    public x: (number|null) = void 0 as any;

    public y?: (number|null);

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Animate SVG elements associated with the point.
     *
     * @private
     * @function Highcharts.Point#animateBeforeDestroy
     */
    public animateBeforeDestroy(): void {
        var point = this,
            animateParams = { x: point.startXPos, opacity: 0 },
            isDataLabel,
            graphicalProps = point.getGraphicalProps();

        graphicalProps.singular.forEach(function (prop: string): void {
            isDataLabel = prop === 'dataLabel';

            (point as any)[prop] = (point as any)[prop].animate(
                isDataLabel ? {
                    x: (point as any)[prop].startXPos,
                    y: (point as any)[prop].startYPos,
                    opacity: 0
                } : animateParams
            );
        });

        graphicalProps.plural.forEach(function (plural: any): void {
            (point as any)[plural].forEach(function (item: any): void {
                if (item.element) {
                    item.animate(extend(
                        { x: point.startXPos },
                        (item.startYPos ? {
                            x: item.startXPos,
                            y: item.startYPos
                        } : {})
                    ));
                }
            });
        });
    }

    /**
     * Apply the options containing the x and y data and possible some extra
     * properties. Called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {Highcharts.PointOptionsType} options
     *        The point options as defined in series.data.
     *
     * @param {number} [x]
     *        Optionally, the x value.
     *
     * @return {Highcharts.Point}
     *         The Point instance.
     */
    public applyOptions(
        options: (PointOptions|PointShortOptions),
        x?: number
    ): Point {
        var point = this,
            series = point.series,
            pointValKey = series.options.pointValKey || series.pointValKey;

        options = Point.prototype.optionsToObject.call(this, options);

        // copy options directly to point
        extend(point, options as any);

        point.options = point.options ? extend(point.options, options as any) : options;

        // Since options are copied into the Point instance, some accidental
        // options must be shielded (#5681)
        if ((options as any).group) {
            delete (point as any).group;
        }
        if (options.dataLabels) {
            delete point.dataLabels;
        }

        /**
         * The y value of the point.
         * @name Highcharts.Point#y
         * @type {number|undefined}
         */
        // For higher dimension series types. For instance, for ranges, point.y
        // is mapped to point.low.
        if (pointValKey) {
            point.y = Point.prototype.getNestedProperty.call(point, pointValKey) as (number|null|undefined);
        }
        point.isNull = pick(
            point.isValid && !point.isValid(),
            point.x === null || !isNumber(point.y)
        ); // #3571, check for NaN

        point.formatPrefix = point.isNull ? 'null' : 'point'; // #9233, #10874

        // The point is initially selected by options (#5777)
        if (point.selected) {
            point.state = 'select';
        }

        /**
         * The x value of the point.
         * @name Highcharts.Point#x
         * @type {number}
         */
        // If no x is set by now, get auto incremented value. All points must
        // have an x value, however the y value can be null to create a gap in
        // the series
        if (
            'name' in point &&
            typeof x === 'undefined' &&
            series.xAxis &&
            series.xAxis.hasNames
        ) {
            point.x = series.xAxis.nameToX(point);
        }
        if (typeof point.x === 'undefined' && series) {
            if (typeof x === 'undefined') {
                point.x = (series.autoIncrement as any)(point);
            } else {
                point.x = x;
            }
        }

        return point;
    }

    /**
     * Destroy a point to clear memory. Its reference still stays in
     * `series.data`.
     *
     * @private
     * @function Highcharts.Point#destroy
     */
    public destroy(): void {
        var point = this,
            series = point.series,
            chart = series.chart,
            dataSorting = series.options.dataSorting,
            hoverPoints = chart.hoverPoints,
            globalAnimation = point.series.chart.renderer.globalAnimation,
            animation = animObject(globalAnimation),
            prop;

        /**
         * Allow to call after animation.
         * @private
         */
        function destroyPoint(): void {
            // Remove all events and elements
            if (point.graphic || point.dataLabel || point.dataLabels) {
                removeEvent(point);
                point.destroyElements();
            }

            for (prop in point) { // eslint-disable-line guard-for-in
                (point as any)[prop] = null;
            }
        }

        if (point.legendItem) { // pies have legend items
            chart.legend.destroyItem(point);
        }

        if (hoverPoints) {
            point.setState();
            erase(hoverPoints, point);
            if (!hoverPoints.length) {
                chart.hoverPoints = null as any;
            }

        }
        if (point === chart.hoverPoint) {
            point.onMouseOut();
        }

        // Remove properties after animation
        if (!dataSorting || !dataSorting.enabled) {
            destroyPoint();

        } else {
            this.animateBeforeDestroy();
            syncTimeout(destroyPoint, animation.duration);
        }

        chart.pointCount--;
    }

    /**
     * Destroy SVG elements associated with the point.
     *
     * @private
     * @function Highcharts.Point#destroyElements
     * @param {Highcharts.Dictionary<number>} [kinds]
     */
    public destroyElements(kinds?: Record<string, number>): void {
        var point = this,
            props = point.getGraphicalProps(kinds);

        props.singular.forEach(function (prop: string): void {
            (point as any)[prop] = (point as any)[prop].destroy();
        });

        props.plural.forEach(function (plural: any): void {
            (point as any)[plural].forEach(function (item: any): void {
                if (item.element) {
                    item.destroy();
                }
            });

            delete (point as any)[plural];
        });
    }

    /**
     * Fire an event on the Point object.
     *
     * @private
     * @function Highcharts.Point#firePointEvent
     *
     * @param {string} eventType
     *        Type of the event.
     *
     * @param {Highcharts.Dictionary<any>|Event} [eventArgs]
     *        Additional event arguments.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.Point>|Function} [defaultFunction]
     *        Default event handler.
     *
     * @fires Highcharts.Point#event:*
     */
    public firePointEvent<T extends Record<string, any>|Event>(
        eventType: string,
        eventArgs?: T,
        defaultFunction?: (
            EventCallback<Point, T>|Function
        )
    ): void {
        var point = this,
            series = this.series,
            seriesOptions = series.options;

        // load event handlers on demand to save time on mouseover/out
        if ((seriesOptions.point as any).events[eventType] ||
            (
                point.options &&
                point.options.events &&
                (point.options.events as any)[eventType]
            )
        ) {
            point.importEvents();
        }

        // add default handler if in selection mode
        if (eventType === 'click' && seriesOptions.allowPointSelect) {
            defaultFunction = function (event: MouseEvent): void {
                // Control key is for Windows, meta (= Cmd key) for Mac, Shift
                // for Opera.
                if (point.select) { // #2911
                    point.select(
                        null as any,
                        event.ctrlKey || event.metaKey || event.shiftKey
                    );
                }
            };
        }

        fireEvent(point, eventType, eventArgs, defaultFunction);
    }

    /**
     * Get the CSS class names for individual points. Used internally where the
     * returned value is set on every point.
     *
     * @function Highcharts.Point#getClassName
     *
     * @return {string}
     *         The class names.
     */
    public getClassName(): string {
        const point = this;
        return 'highcharts-point' +
            (point.selected ? ' highcharts-point-select' : '') +
            (point.negative ? ' highcharts-negative' : '') +
            (point.isNull ? ' highcharts-null-point' : '') +
            (typeof point.colorIndex !== 'undefined' ?
                ' highcharts-color-' + point.colorIndex : '') +
            (point.options.className ? ' ' + point.options.className : '') +
            (point.zone && point.zone.className ? ' ' +
                point.zone.className.replace('highcharts-negative', '') : '');
    }

    /**
     * Get props of all existing graphical point elements.
     *
     * @private
     * @function Highcharts.Point#getGraphicalProps
     * @param {Highcharts.Dictionary<number>} [kinds]
     * @return {Highcharts.PointGraphicalProps}
     */
    public getGraphicalProps(kinds?: Record<string, number>): Highcharts.PointGraphicalProps {
        var point = this,
            props = [],
            prop,
            i,
            graphicalProps: Highcharts.PointGraphicalProps =
                { singular: [], plural: [] };

        kinds = kinds || { graphic: 1, dataLabel: 1 };

        if (kinds.graphic) {
            props.push('graphic', 'shadowGroup');
        }
        if (kinds.dataLabel) {
            props.push('dataLabel', 'dataLabelUpper', 'connector');
        }

        i = props.length;
        while (i--) {
            prop = props[i];
            if ((point as any)[prop]) {
                graphicalProps.singular.push(prop);
            }
        }

        ['dataLabel', 'connector'].forEach(function (prop: string): void {
            var plural = prop + 's';
            if ((kinds as any)[prop] && (point as any)[plural]) {
                graphicalProps.plural.push(plural);
            }
        });

        return graphicalProps;
    }

    /**
     * Return the configuration hash needed for the data label and tooltip
     * formatters.
     *
     * @function Highcharts.Point#getLabelConfig
     *
     * @return {Highcharts.PointLabelObject}
     *         Abstract object used in formatters and formats.
     */
    public getLabelConfig(): Point.PointLabelObject {
        return {
            x: this.category,
            y: this.y,
            color: this.color,
            colorIndex: this.colorIndex,
            key: this.name || this.category,
            series: this.series,
            point: this as any,
            percentage: this.percentage,
            total: this.total || (this as any).stackTotal
        };
    }

    /**
     * Returns the value of the point property for a given value.
     * @private
     */
    public getNestedProperty(key?: string): unknown {
        if (!key) {
            return;
        }
        if (key.indexOf('custom.') === 0) {
            return getNestedProperty(key, this.options);
        }
        return (this as any)[key];
    }

    /**
     * In a series with `zones`, return the zone that the point belongs to.
     *
     * @function Highcharts.Point#getZone
     *
     * @return {Highcharts.SeriesZonesOptionsObject}
     *         The zone item.
     */
    public getZone(): SeriesZonesOptions {
        var series = this.series,
            zones = series.zones,
            zoneAxis = series.zoneAxis || 'y',
            i = 0,
            zone;

        zone = zones[i];
        while ((this as any)[zoneAxis] >= (zone.value as any)) {
            zone = zones[++i];
        }

        // For resetting or reusing the point (#8100)
        if (!this.nonZonedColor) {
            this.nonZonedColor = this.color;
        }

        if (zone && zone.color && !this.options.color) {
            this.color = zone.color;
        } else {
            this.color = this.nonZonedColor;
        }

        return zone;
    }

    /**
     * Utility to check if point has new shape type. Used in column series and
     * all others that are based on column series.
     *
     * @return boolean|undefined
     */
    public hasNewShapeType(): boolean|undefined {
        const point = this;
        const oldShapeType = point.graphic &&
            (point.graphic.symbolName || point.graphic.element.nodeName);
        return oldShapeType !== this.shapeType;
    }

    /**
     * Initialize the point. Called internally based on the `series.data`
     * option.
     *
     * @function Highcharts.Point#init
     *
     * @param {Highcharts.Series} series
     *        The series object containing this point.
     *
     * @param {Highcharts.PointOptionsType} options
     *        The data in either number, array or object format.
     *
     * @param {number} [x]
     *        Optionally, the X value of the point.
     *
     * @return {Highcharts.Point}
     *         The Point instance.
     *
     * @fires Highcharts.Point#event:afterInit
     */
    public init(
        series: LineSeries,
        options: (PointOptions|PointShortOptions),
        x?: number
    ): Point {

        this.series = series;

        this.applyOptions(options, x);

        // Add a unique ID to the point if none is assigned
        this.id = defined(this.id) ? this.id : uniqueKey();

        this.resolveColor();

        series.chart.pointCount++;

        fireEvent(this, 'afterInit');

        return this;
    }

    /**
     * @private
     */
    public isValid?(): boolean;

    /**
     * Transform number or array configs into objects. Also called for object
     * configs. Used internally to unify the different configuration formats for
     * points. For example, a simple number `10` in a line series will be
     * transformed to `{ y: 10 }`, and an array config like `[1, 10]` in a
     * scatter series will be transformed to `{ x: 1, y: 10 }`.
     *
     * @function Highcharts.Point#optionsToObject
     *
     * @param {Highcharts.PointOptionsType} options
     *        The input option.
     *
     * @return {Highcharts.Dictionary<*>}
     *         Transformed options.
     */
    public optionsToObject(
        options: (PointOptions|PointShortOptions)
    ): this['options'] {
        var ret = {} as Record<string, any>,
            series = this.series,
            keys = series.options.keys,
            pointArrayMap = keys || series.pointArrayMap || ['y'],
            valueCount = pointArrayMap.length,
            firstItemType,
            i = 0,
            j = 0;

        if (isNumber(options) || options === null) {
            ret[pointArrayMap[0]] = options;

        } else if (isArray(options)) {
            // with leading x value
            if (!keys && (options as any).length > valueCount) {
                firstItemType = typeof (options as any)[0];
                if (firstItemType === 'string') {
                    ret.name = (options as any)[0];
                } else if (firstItemType === 'number') {
                    ret.x = (options as any)[0];
                }
                i++;
            }
            while (j < valueCount) {
                // Skip undefined positions for keys
                if (!keys || typeof (options as any)[i] !== 'undefined') {
                    if (pointArrayMap[j].indexOf('.') > 0) {
                        // Handle nested keys, e.g. ['color.pattern.image']
                        // Avoid function call unless necessary.
                        Point.prototype.setNestedProperty(
                            ret, (options as any)[i], pointArrayMap[j]
                        );
                    } else {
                        ret[pointArrayMap[j]] = (options as any)[i];
                    }
                }
                i++;
                j++;
            }
        } else if (typeof options === 'object') {
            ret = options;

            // This is the fastest way to detect if there are individual point
            // dataLabels that need to be considered in drawDataLabels. These
            // can only occur in object configs.
            if ((options as any).dataLabels) {
                series._hasPointLabels = true;
            }

            // Same approach as above for markers
            if ((options as any).marker) {
                series._hasPointMarkers = true;
            }
        }
        return ret;
    }

    /**
     * @private
     * @function Highcharts.Point#resolveColor
     * @return {void}
     */
    public resolveColor(): void {
        var series = this.series,
            colors,
            optionsChart =
                series.chart.options.chart as Highcharts.ChartOptions,
            colorCount = optionsChart.colorCount,
            styledMode = series.chart.styledMode,
            colorIndex: number;

        // remove points nonZonedColor for later recalculation
        delete (this as any).nonZonedColor;

        /**
         * The point's current color.
         *
         * @name Highcharts.Point#color
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
         */
        if (!styledMode && !(this.options as any).color) {
            this.color = series.color; // #3445
        }

        if (series.options.colorByPoint) {
            if (!styledMode) {
                colors = series.options.colors || series.chart.options.colors;
                this.color = this.color || (colors as any)[series.colorCounter];
                colorCount = (colors as any).length;
            }
            colorIndex = series.colorCounter;
            series.colorCounter++;
            // loop back to zero
            if (series.colorCounter === colorCount) {
                series.colorCounter = 0;
            }
        } else {
            colorIndex = series.colorIndex as any;
        }

        this.colorIndex = pick(this.options.colorIndex, colorIndex);
    }

    /**
     * Set a value in an object, on the property defined by key. The key
     * supports nested properties using dot notation. The function modifies the
     * input object and does not make a copy.
     *
     * @function Highcharts.Point#setNestedProperty<T>
     *
     * @param {T} object
     *        The object to set the value on.
     *
     * @param {*} value
     *        The value to set.
     *
     * @param {string} key
     *        Key to the property to set.
     *
     * @return {T}
     *         The modified object.
     */
    public setNestedProperty<T>(
        object: T,
        value: any,
        key: string
    ): T {
        var nestedKeys = key.split('.');

        nestedKeys.reduce(function (
            result: any,
            key: string,
            i: number,
            arr: Array<string>
        ): T {
            var isLastKey = arr.length - 1 === i;

            result[key] = (
                isLastKey ?
                    value :
                    isObject(result[key], true) ?
                        result[key] :
                        {}
            );
            return result[key];
        }, object);
        return object;
    }

    /**
     * Extendable method for formatting each point's tooltip line.
     *
     * @function Highcharts.Point#tooltipFormatter
     *
     * @param {string} pointFormat
     *        The point format.
     *
     * @return {string}
     *         A string to be concatenated in to the common tooltip text.
     */
    public tooltipFormatter(pointFormat: string): string {

        // Insert options for valueDecimals, valuePrefix, and valueSuffix
        var series = this.series,
            seriesTooltipOptions = series.tooltipOptions,
            valueDecimals = pick(seriesTooltipOptions.valueDecimals, ''),
            valuePrefix = seriesTooltipOptions.valuePrefix || '',
            valueSuffix = seriesTooltipOptions.valueSuffix || '';

        // Replace default point style with class name
        if (series.chart.styledMode) {
            pointFormat =
                (series.chart.tooltip as any).styledModeFormat(pointFormat);
        }

        // Loop over the point array map and replace unformatted values with
        // sprintf formatting markup
        (series.pointArrayMap || ['y']).forEach(function (key: string): void {
            key = '{point.' + key; // without the closing bracket
            if (valuePrefix || valueSuffix) {
                pointFormat = pointFormat.replace(
                    RegExp(key + '}', 'g'),
                    valuePrefix + key + '}' + valueSuffix
                );
            }
            pointFormat = pointFormat.replace(
                RegExp(key + '}', 'g'),
                key + ':,.' + valueDecimals + 'f}'
            );
        });

        return format(pointFormat, {
            point: this,
            series: this.series
        }, series.chart);
    }

    /**
     * Update point with new options (typically x/y data) and optionally redraw
     * the series.
     *
     * @sample highcharts/members/point-update-column/
     *         Update column value
     * @sample highcharts/members/point-update-pie/
     *         Update pie slice
     * @sample maps/members/point-update/
     *         Update map area value in Highmaps
     *
     * @function Highcharts.Point#update
     *
     * @param {Highcharts.PointOptionsType} options
     *        The point options. Point options are handled as described under
     *        the `series.type.data` item for each series type. For example
     *        for a line series, if options is a single number, the point will
     *        be given that number as the marin y value. If it is an array, it
     *        will be interpreted as x and y values respectively. If it is an
     *        object, advanced options are applied.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is updated. If doing
     *        more operations on the chart, it is best practice to set
     *        `redraw` to false and call `chart.redraw()` after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @fires Highcharts.Point#event:update
     */
    public update(
        options: (PointOptions|PointShortOptions),
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>),
        runEvent?: boolean
    ): void {
        var point = this,
            series = point.series,
            graphic = point.graphic,
            i: number,
            chart = series.chart,
            seriesOptions = series.options;

        redraw = pick(redraw, true);

        /**
         * @private
         */
        function update(): void {

            point.applyOptions(options);

            // Update visuals, #4146
            // Handle dummy graphic elements for a11y, #12718
            const hasDummyGraphic = graphic && point.hasDummyGraphic;
            const shouldDestroyGraphic = point.y === null ? !hasDummyGraphic : hasDummyGraphic;
            if (graphic && shouldDestroyGraphic) {
                point.graphic = graphic.destroy();
                delete point.hasDummyGraphic;
            }

            if (isObject(options, true)) {
                // Destroy so we can get new elements
                if (graphic && graphic.element) {
                    // "null" is also a valid symbol
                    if (
                        options &&
                        (options as any).marker &&
                        typeof (options as any).marker.symbol !== 'undefined'
                    ) {
                        point.graphic = graphic.destroy();
                    }
                }
                if (options && (options as any).dataLabels && point.dataLabel) {
                    point.dataLabel = point.dataLabel.destroy(); // #2468
                }
                if (point.connector) {
                    point.connector = point.connector.destroy(); // #7243
                }
            }

            // record changes in the parallel arrays
            i = point.index as any;
            series.updateParallelArrays(point, i);

            // Record the options to options.data. If the old or the new config
            // is an object, use point options, otherwise use raw options
            // (#4701, #4916).
            (seriesOptions.data as any)[i] = (
                isObject((seriesOptions.data as any)[i], true) ||
                    isObject(options, true)
            ) ?
                point.options :
                pick(options, (seriesOptions.data as any)[i]);

            // redraw
            series.isDirty = series.isDirtyData = true;
            if (!series.fixedBox && series.hasCartesianSeries) { // #1906, #2320
                chart.isDirtyBox = true;
            }

            if (seriesOptions.legendType === 'point') { // #1831, #1885
                chart.isDirtyLegend = true;
            }
            if (redraw) {
                chart.redraw(animation);
            }
        }

        // Fire the event with a default handler of doing the update
        if (runEvent === false) { // When called from setData
            update();
        } else {
            point.firePointEvent('update', { options: options }, update);
        }
    }

    /**
     * Remove a point and optionally redraw the series and if necessary the axes
     *
     * @sample highcharts/plotoptions/series-point-events-remove/
     *         Remove point and confirm
     * @sample highcharts/members/point-remove/
     *         Remove pie slice
     * @sample maps/members/point-remove/
     *         Remove selected points in Highmaps
     *
     * @function Highcharts.Point#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call. When
     *        doing more operations on the chart, for example running
     *        `point.remove()` in a loop, it is best practice to set `redraw`
     *        to false and call `chart.redraw()` after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=false]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     */
    public remove(
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        this.series.removePoint(
            this.series.data.indexOf(this),
            redraw,
            animation
        );
    }
}

interface Point extends PointLike {
    // merge extensions with point class
}

namespace Point {
    export interface PointLabelObject {
        x?: string;
        y?: (number|null);
        color?: ColorType;
        colorIndex?: number;
        key?: string;
        series: LineSeries;
        point: Point;
        percentage?: number;
        total?: number;
    }
}

(H as any).Point = Point;

export default Point;
