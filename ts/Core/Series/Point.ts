/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import type PointLike from './PointLike';
import type {
    PointEventsOptions,
    PointMarkerOptions,
    PointOptions,
    PointShortOptions
} from './PointOptions';
import type { PointTypeOptions } from './PointType';
import type Series from './Series';
import type { SeriesZonesOptions } from './SeriesOptions';
import type { StatesOptionsKey } from './StatesOptions';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGElement from '../Renderer/SVG/SVGElement';
import type SVGPath from '../Renderer/SVG/SVGPath';
import AST from '../Renderer/HTML/AST.js';
import A from '../Animation/AnimationUtilities.js';
const { animObject } = A;
import DataTableRow from '../../Data/DataTableRow.js';
import H from '../Globals.js';
import O from '../Options.js';
const { defaultOptions } = O;
import U from '../Utilities.js';
const {
    addEvent,
    defined,
    erase,
    extend,
    fireEvent,
    flat,
    format,
    getNestedProperty,
    isArray,
    isFunction,
    isNumber,
    isObject,
    merge,
    objectEach,
    pick,
    syncTimeout,
    removeEvent,
    unflat,
    uniqueKey
} = U;

/* *
 *
 *  Declarations
 *
 * */

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

declare module './PointLike' {
    interface PointLike {
        className?: string;
        events?: PointEventsOptions;
        hasImportedEvents?: boolean;
        selected?: boolean;
        selectedStaging?: boolean;
        state?: string;
        haloPath(size: number): SVGPath;
        importEvents(): void;
        onMouseOut(): void;
        onMouseOver(e?: PointerEvent): void;
        select(selected?: boolean | null, accumulate?: boolean): void;
        setState(
            state?: string,
            move?: boolean
        ): void;
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

/**
 * @interface Highcharts.PointEventsOptionsObject
 *//**
 * Fires when the point is selected either programmatically or following a click
 * on the point. One parameter, `event`, is passed to the function. Returning
 * `false` cancels the operation.
 * @name Highcharts.PointEventsOptionsObject#select
 * @type {Highcharts.PointSelectCallbackFunction|undefined}
 *//**
 * Fires when the point is unselected either programmatically or following a
 * click on the point. One parameter, `event`, is passed to the function.
 * Returning `false` cancels the operation.
 * @name Highcharts.PointEventsOptionsObject#unselect
 * @type {Highcharts.PointUnselectCallbackFunction|undefined}
 */

/**
 * Information about the select/unselect event.
 *
 * @interface Highcharts.PointInteractionEventObject
 * @extends global.Event
 *//**
 * @name Highcharts.PointInteractionEventObject#accumulate
 * @type {boolean}
 */

/**
 * Gets fired when the point is selected either programmatically or following a
 * click on the point.
 *
 * @callback Highcharts.PointSelectCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointInteractionEventObject} event
 *        Event that occured.
 */

/**
 * Fires when the point is unselected either programmatically or following a
 * click on the point.
 *
 * @callback Highcharts.PointUnselectCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointInteractionEventObject} event
 *        Event that occured.
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
     *  Static Functions
     *
     * */

    /**
     * Converts the DataTableRow instance to common series options.
     *
     * @param {DataTableRow} tableRow
     * Table row to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to extract from the table row.
     *
     * @return {Highcharts.PointOptions}
     * Common point options.
     */
    public static getPointOptionsFromTableRow(
        tableRow: DataTableRow,
        keys?: Array<string>
    ): (PointOptions|null) {
        if (tableRow === DataTableRow.NULL) {
            return null;
        }

        const pointOptions: (PointOptions&Record<string, any>) = {},
            cellNames = tableRow.getCellNames();

        if (!keys || keys.indexOf('id') >= 0) {
            pointOptions.id = tableRow.id;
        }

        let cellName: string;

        for (let j = 0, jEnd = cellNames.length; j < jEnd; ++j) {
            cellName = cellNames[j];
            if (keys && keys.indexOf(cellName) === -1) {
                continue;
            }
            pointOptions[cellName] = tableRow.getCell(cellName);
        }

        return unflat(pointOptions);
    }

    /**
     * Converts series options to a DataTable instance.
     *
     * @param {Highcharts.PointOptions} pointOptions
     * Point options to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to convert options.
     *
     * @param {number} [x]
     * Point index for x value.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    public static getTableRowFromPointOptions(
        pointOptions: (
            (PointOptions&Record<string, any>)|
            PointShortOptions
        ),
        keys: Array<string> = ['y'],
        x: number = 0
    ): DataTableRow {
        let tableRow: DataTableRow;

        keys = keys.slice();

        // Array
        if (pointOptions instanceof Array) {
            const tableRowOptions: (PointOptions&Record<string, any>) = {};
            if (pointOptions.length > keys.length) {
                keys.unshift(
                    typeof pointOptions[0] === 'string' ?
                        'name' :
                        'x'
                );
            }
            for (let i = 0, iEnd = pointOptions.length; i < iEnd; ++i) {
                tableRowOptions[keys[i] || `${i}`] = pointOptions[i];
            }
            tableRow = new DataTableRow(tableRowOptions);

        // Object
        } else if (
            typeof pointOptions === 'object'
        ) {
            if (pointOptions === null) {
                tableRow = DataTableRow.NULL;
            } else {
                tableRow = new DataTableRow(flat(pointOptions));
            }

        // Primitive
        } else {
            tableRow = new DataTableRow({
                x,
                [keys[0] || 'y']: pointOptions
            });
        }

        return tableRow;
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(series?: Series, tableRow?: DataTableRow) {
        if (series) {
            this.series = series;
        }

        if (series && tableRow) {
            this.applyOptions(Point.getPointOptionsFromTableRow(tableRow));
            this.attachTableRow(tableRow);

            // Add a unique ID to the point if none is assigned
            this.id = tableRow.id;

            this.resolveColor();

            series.chart.pointCount++;
        }
    }

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
    public series: Series = void 0 as any;

    public shapeArgs?: SVGAttributes;

    public shapeType?: string;

    public startXPos?: number;

    public state?: StatesOptionsKey;

    public tableRow?: DataTableRow;

    public tableRowEventRemover?: Function;

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

    public attachTableRow(tableRow: DataTableRow): this {
        const point = this,
            series = point.series;

        if (point.tableRow) {
            point.detachTableRow();
        }

        let keys: (Array<string>|undefined);

        if (series.options.keys) {
            keys = series.options.keys.slice();
        } else if (series.pointArrayMap) {
            keys = ['x', ...series.pointArrayMap];
        }

        point.tableRow = tableRow;
        point.tableRowEventRemover = tableRow.on(
            'afterChangeRow',
            function (e): void {
                const detail = (e.detail || {});
                point.update(
                    this,
                    detail.redraw === 'true',
                    detail.animation === 'true',
                    false
                );
            }
        );

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

    public detachTableRow(): (DataTableRow|undefined) {
        const point = this,
            tableRow = point.tableRow,
            tableRowEventRemover = point.tableRowEventRemover;

        if (tableRow) {
            point.tableRow = void 0;
        }

        if (tableRowEventRemover) {
            tableRowEventRemover();
        }

        return tableRow;
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
            props.push('graphic', 'upperGraphic', 'shadowGroup');
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
        series: Series,
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
            colorIndex: number,
            color;

        // remove points nonZonedColor for later recalculation
        delete (this as any).nonZonedColor;

        if (series.options.colorByPoint) {
            if (!styledMode) {
                colors = series.options.colors || series.chart.options.colors;
                color = (colors as any)[series.colorCounter];
                colorCount = (colors as any).length;
            }
            colorIndex = series.colorCounter;
            series.colorCounter++;
            // loop back to zero
            if (series.colorCounter === colorCount) {
                series.colorCounter = 0;
            }
        } else {
            if (!styledMode) {
                color = series.color;
            }
            colorIndex = series.colorIndex as any;
        }

        this.colorIndex = pick(this.options.colorIndex, colorIndex);

        /**
         * The point's current color.
         *
         * @name Highcharts.Point#color
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
         */
        this.color = pick(this.options.color, color);
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
        options: (DataTableRow|PointOptions|PointShortOptions),
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>),
        runEvent?: boolean
    ): void {
        var point = this,
            series = point.series,
            graphic = point.graphic,
            i: number,
            chart = series.chart,
            pointOptions = (
                options instanceof DataTableRow ?
                    Point.getPointOptionsFromTableRow(options) :
                    options
            ),
            seriesOptions = series.options;

        /**
         * @private
         */
        function update(): void {

            point.applyOptions(pointOptions);

            // Update visuals, #4146
            // Handle dummy graphic elements for a11y, #12718
            const hasDummyGraphic = graphic && point.hasDummyGraphic;
            const shouldDestroyGraphic = point.y === null ? !hasDummyGraphic : hasDummyGraphic;
            if (graphic && shouldDestroyGraphic) {
                point.graphic = graphic.destroy();
                delete point.hasDummyGraphic;
            }

            if (isObject(pointOptions, true)) {
                // Destroy so we can get new elements
                if (graphic && graphic.element) {
                    // "null" is also a valid symbol
                    if (
                        pointOptions &&
                        pointOptions.marker &&
                        typeof pointOptions.marker.symbol !== 'undefined'
                    ) {
                        point.graphic = graphic.destroy();
                    }
                }
                if (
                    pointOptions &&
                    pointOptions.dataLabels &&
                    point.dataLabel
                ) {
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
                    isObject(pointOptions, true)
            ) ?
                point.options :
                pick(pointOptions, (seriesOptions.data as any)[i]);

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
            point.firePointEvent('update', { options: pointOptions }, update);
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

    /**
     * Toggle the selection status of a point.
     *
     * @see Highcharts.Chart#getSelectedPoints
     *
     * @sample highcharts/members/point-select/
     *         Select a point from a button
     * @sample highcharts/chart/events-selection-points/
     *         Select a range of points through a drag selection
     * @sample maps/series/data-id/
     *         Select a point in Highmaps
     *
     * @function Highcharts.Point#select
     *
     * @param {boolean} [selected]
     * When `true`, the point is selected. When `false`, the point is
     * unselected. When `null` or `undefined`, the selection state is toggled.
     *
     * @param {boolean} [accumulate=false]
     * When `true`, the selection is added to other selected points.
     * When `false`, other selected points are deselected. Internally in
     * Highcharts, when
     * [allowPointSelect](https://api.highcharts.com/highcharts/plotOptions.series.allowPointSelect)
     * is `true`, selected points are accumulated on Control, Shift or Cmd
     * clicking the point.
     *
     * @fires Highcharts.Point#event:select
     * @fires Highcharts.Point#event:unselect
     */
    public select(
        selected?: boolean,
        accumulate?: boolean
    ): void {
        var point = this,
            series = point.series,
            chart = series.chart;

        selected = pick(selected, !point.selected);

        this.selectedStaging = selected;

        // fire the event with the default handler
        point.firePointEvent(
            selected ? 'select' : 'unselect',
            { accumulate: accumulate },
            function (): void {

                /**
                 * Whether the point is selected or not.
                 *
                 * @see Point#select
                 * @see Chart#getSelectedPoints
                 *
                 * @name Highcharts.Point#selected
                 * @type {boolean}
                 */
                point.selected = point.options.selected = selected;
                (series.options.data as any)[series.data.indexOf(point)] =
                    point.options;

                point.setState((selected as any) && 'select');

                // unselect all other points unless Ctrl or Cmd + click
                if (!accumulate) {
                    chart.getSelectedPoints().forEach(function (
                        loopPoint: Point
                    ): void {
                        var loopSeries = loopPoint.series;

                        if (loopPoint.selected && loopPoint !== point) {
                            loopPoint.selected = loopPoint.options.selected =
                                false;
                            (loopSeries.options.data as any)[
                                loopSeries.data.indexOf(loopPoint)
                            ] = loopPoint.options;

                            // Programatically selecting a point should restore
                            // normal state, but when click happened on other
                            // point, set inactive state to match other points
                            loopPoint.setState(
                                chart.hoverPoints &&
                                    loopSeries.options.inactiveOtherPoints ?
                                    'inactive' : ''
                            );
                            loopPoint.firePointEvent('unselect');
                        }
                    });
                }
            }
        );

        delete this.selectedStaging;
    }

    /**
     * Runs on mouse over the point. Called internally from mouse and touch
     * events.
     *
     * @function Highcharts.Point#onMouseOver
     *
     * @param {Highcharts.PointerEventObject} [e]
     *        The event arguments.
     */
    public onMouseOver(e?: PointerEvent): void {
        var point = this,
            series = point.series,
            chart = series.chart,
            pointer = chart.pointer;

        e = e ?
            pointer.normalize(e) :
            // In cases where onMouseOver is called directly without an event
            pointer.getChartCoordinatesFromPoint(point, chart.inverted) as any;
        pointer.runPointActions(e as any, point);
    }

    /**
     * Runs on mouse out from the point. Called internally from mouse and touch
     * events.
     *
     * @function Highcharts.Point#onMouseOut
     * @fires Highcharts.Point#event:mouseOut
     */
    public onMouseOut(): void {
        var point = this,
            chart = point.series.chart;

        point.firePointEvent('mouseOut');

        if (!point.series.options.inactiveOtherPoints) {
            (chart.hoverPoints || []).forEach(function (
                p: Point
            ): void {
                p.setState();
            });
        }

        chart.hoverPoints = chart.hoverPoint = null as any;
    }

    /**
     * Import events from the series' and point's options. Only do it on
     * demand, to save processing time on hovering.
     *
     * @private
     * @function Highcharts.Point#importEvents
     */
    public importEvents(): void {
        if (!this.hasImportedEvents) {
            var point = this,
                options = merge(
                    point.series.options.point as PointOptions,
                    point.options
                ),
                events = options.events;

            point.events = events;

            objectEach(events, function (
                event: Function,
                eventType: string
            ): void {
                if (isFunction(event)) {
                    addEvent(point, eventType, event);
                }
            });
            this.hasImportedEvents = true;

        }
    }

    /**
     * Set the point's state.
     *
     * @function Highcharts.Point#setState
     *
     * @param {Highcharts.PointStateValue|""} [state]
     *        The new state, can be one of `'hover'`, `'select'`, `'inactive'`,
     *        or `''` (an empty string), `'normal'` or `undefined` to set to
     *        normal state.
     * @param {boolean} [move]
     *        State for animation.
     *
     * @fires Highcharts.Point#event:afterSetState
     */
    public setState(
        state?: (StatesOptionsKey|''),
        move?: boolean
    ): void {
        var point = this,
            series = point.series,
            previousState = point.state,
            stateOptions = (
                (series.options.states as any)[state || 'normal'] ||
                {}
            ),
            markerOptions = (
                (defaultOptions.plotOptions as any)[series.type as any].marker &&
                series.options.marker
            ),
            normalDisabled = (markerOptions && markerOptions.enabled === false),
            markerStateOptions = ((
                markerOptions &&
                markerOptions.states &&
                (markerOptions.states as any)[state || 'normal']
            ) || {}),
            stateDisabled = (markerStateOptions as any).enabled === false,
            stateMarkerGraphic = series.stateMarkerGraphic,
            pointMarker = point.marker || {},
            chart = series.chart,
            halo = series.halo,
            haloOptions,
            markerAttribs,
            pointAttribs: SVGAttributes,
            pointAttribsAnimation: AnimationOptions,
            hasMarkers = (markerOptions && series.markerAttribs),
            newSymbol;

        state = state || ''; // empty string

        if (
            // already has this state
            (state === point.state && !move) ||

            // selected points don't respond to hover
            (point.selected && state !== 'select') ||

            // series' state options is disabled
            (stateOptions.enabled === false) ||

            // general point marker's state options is disabled
            (state && (
                stateDisabled ||
                (normalDisabled &&
                (markerStateOptions as any).enabled === false)
            )) ||

            // individual point marker's state options is disabled
            (
                state &&
                pointMarker.states &&
                (pointMarker.states as any)[state] &&
                (pointMarker.states as any)[state].enabled === false
            ) // #1610

        ) {
            return;
        }

        point.state = state;

        if (hasMarkers) {
            markerAttribs = series.markerAttribs(point, state);
        }

        // Apply hover styles to the existing point
        // Prevent from dummy null points (#14966)
        if (point.graphic && !point.hasDummyGraphic) {

            if (previousState) {
                point.graphic.removeClass('highcharts-point-' + previousState);
            }
            if (state) {
                point.graphic.addClass('highcharts-point-' + state);
            }

            if (!chart.styledMode) {
                pointAttribs = series.pointAttribs(point, state);
                pointAttribsAnimation = pick(
                    (chart.options.chart as any).animation,
                    stateOptions.animation
                );

                // Some inactive points (e.g. slices in pie) should apply
                // oppacity also for it's labels
                if (series.options.inactiveOtherPoints && pointAttribs.opacity) {
                    (point.dataLabels || []).forEach(function (
                        label: SVGElement
                    ): void {
                        if (label) {
                            label.animate(
                                {
                                    opacity: pointAttribs.opacity
                                },
                                pointAttribsAnimation
                            );
                        }
                    });

                    if (point.connector) {
                        point.connector.animate(
                            {
                                opacity: pointAttribs.opacity
                            },
                            pointAttribsAnimation
                        );
                    }
                }

                point.graphic.animate(
                    pointAttribs,
                    pointAttribsAnimation
                );
            }

            if (markerAttribs) {
                point.graphic.animate(
                    markerAttribs,
                    pick(
                        // Turn off globally:
                        (chart.options.chart as any).animation,
                        (markerStateOptions as any).animation,
                        (markerOptions as any).animation
                    )
                );
            }

            // Zooming in from a range with no markers to a range with markers
            if (stateMarkerGraphic) {
                stateMarkerGraphic.hide();
            }
        } else {
            // if a graphic is not applied to each point in the normal state,
            // create a shared graphic for the hover state
            if (state && markerStateOptions) {
                newSymbol = pointMarker.symbol || series.symbol;

                // If the point has another symbol than the previous one, throw
                // away the state marker graphic and force a new one (#1459)
                if (stateMarkerGraphic &&
                    stateMarkerGraphic.currentSymbol !== newSymbol
                ) {
                    stateMarkerGraphic = stateMarkerGraphic.destroy();
                }

                // Add a new state marker graphic
                if (markerAttribs) {
                    if (!stateMarkerGraphic) {
                        if (newSymbol) {
                            series.stateMarkerGraphic = stateMarkerGraphic =
                                chart.renderer
                                    .symbol(
                                        newSymbol,
                                        markerAttribs.x,
                                        markerAttribs.y,
                                        markerAttribs.width,
                                        markerAttribs.height
                                    )
                                    .add(series.markerGroup);
                            stateMarkerGraphic.currentSymbol = newSymbol;
                        }

                    // Move the existing graphic
                    } else {
                        stateMarkerGraphic[move ? 'animate' : 'attr']({ // #1054
                            x: markerAttribs.x,
                            y: markerAttribs.y
                        });
                    }
                }

                if (!chart.styledMode && stateMarkerGraphic) {
                    stateMarkerGraphic.attr(series.pointAttribs(point, state));
                }
            }

            if (stateMarkerGraphic) {
                stateMarkerGraphic[
                    state && point.isInside ? 'show' : 'hide'
                ](); // #2450
                (stateMarkerGraphic.element as any).point = point; // #4310
            }
        }

        // Show me your halo
        haloOptions = stateOptions.halo;
        const markerGraphic = (point.graphic || stateMarkerGraphic);
        const markerVisibility = (
            markerGraphic && markerGraphic.visibility || 'inherit'
        );

        if (haloOptions &&
            haloOptions.size &&
            markerGraphic &&
            markerVisibility !== 'hidden' &&
            !point.isCluster
        ) {
            if (!halo) {
                series.halo = halo = chart.renderer.path()
                    // #5818, #5903, #6705
                    .add(markerGraphic.parentGroup);
            }
            halo.show()[move ? 'animate' : 'attr']({
                d: point.haloPath(haloOptions.size) as any
            });
            halo.attr({
                'class': 'highcharts-halo highcharts-color-' +
                    pick(point.colorIndex, series.colorIndex) +
                    (point.className ? ' ' + point.className : ''),
                'visibility': markerVisibility,
                'zIndex': -1 // #4929, #8276
            });
            halo.point = point; // #6055

            if (!chart.styledMode) {
                halo.attr(extend<SVGAttributes>(
                    {
                        'fill': point.color || series.color,
                        'fill-opacity': haloOptions.opacity
                    },
                    AST.filterUserAttributes(haloOptions.attributes || {})
                ));
            }

        } else if (halo && halo.point && halo.point.haloPath) {
            // Animate back to 0 on the current halo point (#6055)
            halo.animate(
                { d: halo.point.haloPath(0) },
                null as any,
                // Hide after unhovering. The `complete` callback runs in the
                // halo's context (#7681).
                halo.hide
            );
        }

        fireEvent(point, 'afterSetState');
    }

    /**
     * Get the path definition for the halo, which is usually a shadow-like
     * circle around the currently hovered point.
     *
     * @function Highcharts.Point#haloPath
     *
     * @param {number} size
     *        The radius of the circular halo.
     *
     * @return {Highcharts.SVGPathArray}
     *         The path definition.
     */
    public haloPath(size: number): SVGPath {
        var series = this.series,
            chart = series.chart;

        return chart.renderer.symbols.circle(
            Math.floor(this.plotX as any) - size,
            (this.plotY as any) - size,
            size * 2,
            size * 2
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
        series: Series;
        point: Point;
        percentage?: number;
        total?: number;
    }
}

(H as any).Point = Point;

export default Point;
