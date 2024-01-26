/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type {
    Axis,
    Chart,
    Highcharts as H,
    Options as HighchartsOptions
} from './HighchartsTypes';
import type Cell from '../Layout/Cell';
import type DataCursor from '../../Data/DataCursor';
import type { Options } from './NavigatorComponentOptions';
import type { RangeModifierOptions, RangeModifierRangeOptions } from '../../Data/Modifiers/RangeModifierOptions';
import type Sync from '../Components/Sync/Sync';
import type SidebarPopup from '../EditMode/SidebarPopup';

import Component from '../Components/Component.js';
import DataModifier from '../../Data/Modifiers/DataModifier.js';
const { Range: RangeModifier } = DataModifier.types;
import Globals from '../Globals.js';
import NavigatorComponentDefaults from './NavigatorComponentDefaults.js';
import DataTable from '../../Data/DataTable.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    diffObjects,
    isNumber,
    isObject,
    isString,
    merge,
    pick
} = U;


/* *
 *
 *  Constants
 *
 * */


const navigatorComponentSync = {
    crossfilter: {
        emitter: crossfilterEmitter
    },
    extremes: {
        emitter: extremesEmitter,
        handler: extremesReceiver
    }
};


/* *
 *
 *  Functions
 *
 * */


/** @internal */
function crossfilterEmitter(
    this: Component
): (Function|undefined) {
    const component = this as NavigatorComponent;

    const afterSetExtremes = async (
        extremes: Axis.ExtremesObject
    ): Promise<void> => {
        if (component.connector) {
            const table = component.connector.table,
                dataCursor = component.board.dataCursor,
                filterColumn = component.getColumnAssignment()[0],
                [min, max] = component.getAxisExtremes();

            let modifier = table.getModifier();

            if (modifier instanceof RangeModifier) {
                setRangeOptions(
                    modifier.options.ranges,
                    filterColumn,
                    min,
                    max
                );
            } else {
                modifier = new RangeModifier({
                    ranges: [{
                        column: filterColumn,
                        maxValue: max,
                        minValue: min
                    }]
                });
            }

            await table.setModifier(modifier);

            dataCursor.emitCursor(
                table,
                {
                    type: 'range',
                    columns: [filterColumn],
                    firstRow: 0,
                    lastRow: table.getRowCount() - 1,
                    state: 'crossfilter'
                },
                extremes as unknown as Event
            );
        }
    };

    let delay: number;

    return addEvent(
        component.chart.xAxis[0],
        'afterSetExtremes',
        function (extremes: Axis.ExtremesObject): void {
            clearTimeout(delay);
            delay = setTimeout(afterSetExtremes, 50, this, extremes);
        }
    );
}


/** @internal */
function extremesEmitter(
    this: Component
): (Function|undefined) {
    const component = this as NavigatorComponent;

    const afterSetExtremes = (
        extremes: Axis.ExtremesObject
    ): void => {
        if (component.connector) {
            const table = component.connector.table,
                dataCursor = component.board.dataCursor,
                filterColumn = component.getColumnAssignment()[0],
                [min, max] = component.getAxisExtremes();

            dataCursor.emitCursor(
                table,
                {
                    type: 'position',
                    column: filterColumn,
                    row: table.getRowIndexBy(filterColumn, min),
                    state: 'xAxis.extremes.min'
                },
                extremes as unknown as Event
            );

            dataCursor.emitCursor(
                table,
                {
                    type: 'position',
                    column: filterColumn,
                    row: table.getRowIndexBy(filterColumn, max),
                    state: 'xAxis.extremes.max'
                },
                extremes as unknown as Event
            );
        }
    };

    let delay: number;

    return addEvent(
        component.chart.xAxis[0],
        'afterSetExtremes',
        function (extremes: Axis.ExtremesObject): void {
            clearTimeout(delay);
            delay = setTimeout(afterSetExtremes, 50, this, extremes);
        }
    );
}


/** @internal */
function extremesReceiver(
    this: Component
): void {
    const component = this as NavigatorComponent,
        dataCursor = component.board.dataCursor;

    const extremesListener = (e: DataCursor.Event): void => {
        const cursor = e.cursor;

        if (!component.connector) {
            return;
        }

        const table = component.connector.table;

        // assume first column with unique keys as fallback
        let extremesColumn = table.getColumnNames()[0],
            maxIndex = table.getRowCount(),
            minIndex = 0;

        if (cursor.type === 'range') {
            maxIndex = cursor.lastRow;
            minIndex = cursor.firstRow;

            if (cursor.columns) {
                extremesColumn = pick(cursor.columns[0], extremesColumn);
            }
        } else if (cursor.state === 'xAxis.extremes.max') {
            extremesColumn = pick(cursor.column, extremesColumn);
            maxIndex = pick(cursor.row, maxIndex);
        } else {
            extremesColumn = pick(cursor.column, extremesColumn);
            minIndex = pick(cursor.row, minIndex);
        }

        const modifier = table.getModifier();

        if (
            typeof extremesColumn === 'string' &&
            modifier instanceof RangeModifier
        ) {
            const ranges = modifier.options.ranges,
                min = table.getCell(extremesColumn, minIndex),
                max = table.getCell(extremesColumn, maxIndex);

            if (
                max !== null && typeof max !== 'undefined' &&
                min !== null && typeof min !== 'undefined'
            ) {
                unsetRangeOptions(ranges, extremesColumn);
                ranges.unshift({
                    column: extremesColumn,
                    maxValue: max,
                    minValue: min
                });
                table.setModifier(modifier);
            }
        }
    };

    const registerCursorListeners = (): void => {
        const table = component.connector && component.connector.table;

        if (table) {
            dataCursor.addListener(
                table.id,
                'xAxis.extremes',
                extremesListener
            );
            dataCursor.addListener(
                table.id,
                'xAxis.extremes.max',
                extremesListener
            );
            dataCursor.addListener(
                table.id,
                'xAxis.extremes.min',
                extremesListener
            );
        }
    };

    const unregisterCursorListeners = (): void => {
        const table = component.connector && component.connector.table;

        if (table) {
            dataCursor.removeListener(
                table.id,
                'xAxis.extremes',
                extremesListener
            );
            dataCursor.removeListener(
                table.id,
                'xAxis.extremes.max',
                extremesListener
            );
            dataCursor.removeListener(
                table.id,
                'xAxis.extremes.min',
                extremesListener
            );
        }
    };

    registerCursorListeners();

    component.on('setConnector', (): void => unregisterCursorListeners());
    component.on('afterSetConnector', (): void => registerCursorListeners());
}


/** @internal */
function setRangeOptions(
    ranges: Array<RangeModifierRangeOptions>,
    column: string,
    minValue: (boolean|number|string),
    maxValue: (boolean|number|string)
): void {
    let changed = false;

    for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
        if (ranges[i].column === column) {
            ranges[i].maxValue = maxValue;
            ranges[i].minValue = minValue;
            changed = true;
            break;
        }
    }

    if (!changed) {
        ranges.push({ column, maxValue, minValue });
    }
}


/** @internal */
function unsetRangeOptions(
    ranges: Array<RangeModifierRangeOptions>,
    column: string
): (RangeModifierRangeOptions|undefined) {
    for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
        if (ranges[i].column === column) {
            return ranges.splice(i, 1)[0];
        }
    }
}


/* *
 *
 *  Class
 *
 * */


/**
 * Setup a component with data navigation.
 */
class NavigatorComponent extends Component {


    /* *
     *
     *  Static Properties
     *
     * */


    /** @private */
    public static charter: H;


    /**
     * Default options of the Navigator component.
     */
    public static defaultOptions: Partial<Options> = merge(
        Component.defaultOptions,
        NavigatorComponentDefaults as Partial<Options>
    );


    /* *
     *
     *  Static Functions
     *
     * */


    /**
     * Creates component from JSON.
     *
     * @param json
     * Set of component options, used for creating the Highcharts component.
     *
     * @returns
     * Highcharts component based on config from JSON.
     *
     * @private
     */
    public static fromJSON(
        json: Component.JSON,
        cell: Cell
    ): NavigatorComponent {
        const options = json.options,
            component = new NavigatorComponent(
                cell,
                options as unknown as Options
            );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }


    /* *
     *
     *  Constructor
     *
     * */


    public constructor(
        cell: Cell,
        options: Options
    ) {
        super(cell, options);

        this.options = merge(NavigatorComponent.defaultOptions, options);

        const charter = (
            NavigatorComponent.charter.Chart ||
            Globals.win.Highcharts
        );

        this.chartContainer = Globals.win.document.createElement('div');
        this.chart = charter
            .chart(this.chartContainer, (this.options.chartOptions || {}));
        this.chartContainer.classList
            .add(Globals.classNamePrefix + 'navigator');

        this.filterAndAssignSyncOptions(navigatorComponentSync);
        this.sync = new NavigatorComponent.Sync(this, this.syncHandlers);

        const crossfilterOptions = this.options.sync?.crossfilter;
        if (crossfilterOptions === true || (
            isObject(crossfilterOptions) && crossfilterOptions.enabled
        )) {
            this.chart.update(
                { navigator: { xAxis: { labels: { format: '{value}' } } } },
                false
            );
        }
    }


    /* *
     *
     *  Properties
     *
     * */


    /**
     * Reference to the navigator chart.
     */
    public chart: Chart;


    /**
     * HTML element where the navigator is created.
     */
    public chartContainer: HTMLElement;


    /**
     * Options for the navigator component
     */
    public options: Options;


    /**
     * Reference to the sync system that allow to sync i.e tooltips.
     * @private
     */
    public sync: Sync;


    /**
     * The content of the navigator is of type string.
     * @private
     */
    private stringData?: boolean;


    /**
     * An array of virtual x-axis categories. Index is value on the x-axis.
     * @private
     */
    private categories?: string[];


    /* *
     *
     *  Functions
     *
     * */


    /** @private */
    private adjustNavigator(): void {
        const chart = this.chart,
            height = pick(
                chart.chartHeight,
                this.contentElement.clientHeight
            ),
            width = this.contentElement.clientWidth,
            chartUpdates: Globals.DeepPartial<HighchartsOptions> = {};

        if (
            chart.chartHeight !== height ||
            chart.chartWidth !== width
        ) {
            chartUpdates.chart = {
                height,
                width
            };
        }

        if (chart.navigator) {
            const navigator = chart.navigator,
                navigatorHeight =
                    (navigator.top - chart.plotTop + navigator.height);

            if (navigator.height !== navigatorHeight) {
                chartUpdates.navigator = {
                    handles: {
                        height: Math.round(height / 4)
                    },
                    height: navigatorHeight
                };
            }

            if (Object.keys(chartUpdates).length) {
                chart.update(chartUpdates as Partial<HighchartsOptions>, false);
            }

            if (navigator.series && navigator.series[0]) {
                navigator.series[0].update({
                    type: chart.series[0].type
                }, false);
            }
        } else if (Object.keys(chartUpdates).length) {
            chart.update(chartUpdates as Partial<HighchartsOptions>, false);
        }
    }


    /**
     * Returns the first column of columnAssignments to use for navigator data.
     * @private
     *
     * @return
     * Navigator column assignment.
     */
    public getColumnAssignment(): [string, string] {
        const columnAssignments = (this.options.columnAssignments || {});

        let columnsAssignment: (string|null);

        for (const column of Object.keys(columnAssignments)) {
            columnsAssignment = columnAssignments[column];

            if (columnsAssignment !== null) {
                return [column, columnsAssignment];
            }
        }

        if (this.connector) {
            const columns = this.connector.table.getColumnNames();

            if (columns.length) {
                return [columns[0], 'y'];
            }
        }

        return ['', 'y'];
    }


    /**
     * Gets the component's options.
     * @internal
     */
    public getOptions(): Partial<Options> {
        return {
            ...diffObjects(this.options, NavigatorComponentDefaults),
            type: 'Navigator'
        };
    }

    /**
     * Gets the extremes of the navigator's x-axis.
     */
    public getAxisExtremes(): [number, number] | [string, string] {
        const axis = this.chart.xAxis[0],
            extremes = axis.getExtremes(),
            min = isNumber(extremes.min) ? extremes.min : extremes.dataMin,
            max = isNumber(extremes.max) ? extremes.max : extremes.dataMax;

        if (this.categories) {
            return [
                this.categories[Math.max(
                    0,
                    Math.ceil(min)
                )],
                this.categories[Math.min(
                    this.categories.length - 1,
                    Math.floor(max)
                )]
            ];
        }

        if (axis.hasNames) {
            return [
                axis.names[Math.ceil(min)],
                axis.names[Math.floor(max)]
            ];
        }

        return [min, max];
    }

    /** @private */
    public async load(): Promise<this> {
        await super.load();

        this.contentElement.appendChild(this.chartContainer);
        this.parentElement.appendChild(this.element);

        this.adjustNavigator();

        this.emit({ type: 'afterLoad' });

        return this;
    }


    public onTableChanged(): void {
        this.renderNavigator();
    }


    /** @private */
    private redrawNavigator(): void {
        const timeouts = this.resizeTimeouts;

        for (let i = 0, iEnd = timeouts.length; i < iEnd; ++i) {
            clearTimeout(timeouts[i]);
        }

        timeouts.length = 0;

        timeouts.push(setTimeout((): void => {
            this.adjustNavigator();
            this.chart.redraw();
        }, 33));
    }


    /** @private */
    public render(): this {
        const component = this;

        super.render();
        component.renderNavigator();
        component.sync.start();

        component.emit({ type: 'afterRender' });

        return component;
    }


    /** @private */
    private renderNavigator(): void {
        const chart = this.chart;

        if (this.connector) {
            const table = this.connector.table,
                options = this.options,
                column = this.getColumnAssignment(),
                columnValues = table.getColumn(column[0], true) || [],
                crossfilterOptions = options.sync?.crossfilter;

            let data: (
                Array<(number|string|null)>|
                Array<[number|string, number|null]>
            );

            if (crossfilterOptions === true || (
                isObject(crossfilterOptions) && crossfilterOptions.enabled
            )) {
                data = this.generateCrossfilterData();
            } else {
                data = columnValues.slice() as Array<string|number|null>;
            }

            if (!chart.series[0]) {
                chart.addSeries({ id: table.id, data }, false);
            } else {
                chart.series[0].setData(data, false);
            }
        }

        this.redrawNavigator();
    }


    /**
     * Generates the data for the crossfilter navigator.
     */
    private generateCrossfilterData(): [number, number | null][] {
        let crossfilterOptions = this.options.sync?.crossfilter;
        const table = this.connector?.table;
        const columnValues = table?.getColumn(
            this.getColumnAssignment()[0], true
        ) || [];

        // TODO: Remove this when merging to v2.
        if (crossfilterOptions === true) {
            crossfilterOptions = {
                affectNavigator: false
            };
        }

        if (
            !table ||
            columnValues.length < 1 ||
            !isObject(crossfilterOptions)
        ) {
            return [];
        }

        const values: (number | string)[] = [];
        const uniqueXValues: (number | string)[] = [];
        for (let i = 0, iEnd = columnValues.length; i < iEnd; i++) {
            let value = columnValues[i];

            if (value === null) {
                continue;
            } else if (!isNumber(value)) {
                value = `${value}`;
            }

            // Check if the x-axis data is not of mixed type.
            if (this.stringData === void 0) {
                this.stringData = isString(value);
            } else if (this.stringData !== isString(value)) {
                throw new Error(
                    'Mixed data types in crossfilter navigator are ' +
                    'not supported.'
                );
            }

            values.push(value);
            if (uniqueXValues.indexOf(value) === -1) {
                uniqueXValues.push(value);
            }
        }

        uniqueXValues.sort((a, b): number => (
            pick(a, NaN) < pick(b, NaN) ? -1 : a === b ? 0 : 1
        ));

        let filteredValues: (number | string)[];

        const modifierOptions = table.getModifier()?.options;
        if (crossfilterOptions.affectNavigator && modifierOptions) {
            const appliedRanges: RangeModifierRangeOptions[] = [],
                rangedColumns: DataTable.Column[] = [],
                { ranges } = (modifierOptions as RangeModifierOptions);

            for (let i = 0, iEnd = ranges.length; i < iEnd; i++) {
                if (ranges[i].column !== this.getColumnAssignment()[0]) {
                    appliedRanges.push(ranges[i]);
                    rangedColumns.push(table.getColumn(
                        ranges[i].column, true
                    ) || []);
                }
            }

            filteredValues = [];
            const appliedRagesLength = appliedRanges.length;
            for (let i = 0, iEnd = values.length; i < iEnd; i++) {
                const value = values[i];

                let allConditionsMet = true;
                for (let j = 0; j < appliedRagesLength; j++) {
                    const range = appliedRanges[j];
                    if (!(
                        rangedColumns[j][i] as string|number|boolean >=
                            (range.minValue ?? -Infinity) &&
                        rangedColumns[j][i] as string|number|boolean <=
                            (range.maxValue ?? Infinity)
                    )) {
                        allConditionsMet = false;
                        break;
                    }
                }

                if (allConditionsMet) {
                    filteredValues.push(value);
                }
            }
        } else {
            filteredValues = values;
        }

        const seriesData: [number, number | null][] = [];
        if (this.stringData) {
            this.categories = uniqueXValues as string[];
            for (let i = 0, iEnd = uniqueXValues.length; i < iEnd; i++) {
                seriesData.push([i, null]);
            }
        } else {
            for (let i = 0, iEnd = uniqueXValues.length; i < iEnd; i++) {
                seriesData.push([uniqueXValues[i] as number, null]);
            }
        }

        for (let i = 0, iEnd = filteredValues.length; i < iEnd; i++) {
            const index = uniqueXValues.indexOf(filteredValues[i]);
            seriesData[index][1] = (seriesData[index][1] || 0) + 1;
        }

        return seriesData;
    }


    /** @private */
    public resize(
        width?: (number|string|null),
        height?: (number|string|null)
    ): this {
        super.resize(width, height);
        this.redrawNavigator();
        return this;
    }


    /**
     * Handles updating via options.
     *
     * @param options
     * The options to apply.
     */
    public async update(
        options: Partial<Options>,
        shouldRerender: boolean = true
    ): Promise<void> {
        const chart = this.chart,
            crossfilterOptions = this.options.sync?.crossfilter;

        await super.update(options, false);

        if (options.sync) {
            this.filterAndAssignSyncOptions(navigatorComponentSync);
        }

        if (options.chartOptions) {
            chart.update(
                merge(
                    (
                        crossfilterOptions === true || (
                            isObject(crossfilterOptions) &&
                            crossfilterOptions.enabled
                        ) ?
                            {
                                navigator: {
                                    xAxis: {
                                        labels: {
                                            format: '{value}'
                                        }
                                    }
                                }
                            } :
                            {}
                    ),
                    options.chartOptions
                ),
                false
            );
        }

        this.emit({ type: 'afterUpdate' });

        if (shouldRerender) {
            this.render();
        }
    }

    public getOptionsOnDrop(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sidebar: SidebarPopup
    ): Partial<Options> {
        return {};
    }
}


/* *
 *
 *  Default Export
 *
 * */


export default NavigatorComponent;
