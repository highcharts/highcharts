/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
    Chart,
    Highcharts as H,
    Options as HighchartsOptions
} from '../../Plugins/HighchartsTypes';
import type Cell from '../../Layout/Cell';
import type {
    CrossfilterSyncOptions,
    Options
} from './NavigatorComponentOptions';
import type { DeepPartial } from '../../../Shared/Types';
import type {
    FilterModifierOptions
} from '../../../Data/Modifiers/FilterModifierOptions';


import Component from '../Component.js';
import Globals from '../../Globals.js';
import NavigatorComponentDefaults from './NavigatorComponentDefaults.js';
import DataTable from '../../../Data/DataTable.js';
import NavigatorSyncs from './NavigatorSyncs/NavigatorSyncs.js';
import NavigatorSyncUtils from './NavigatorSyncs/NavigatorSyncUtils.js';

import U from '../../../Core/Utilities.js';
const {
    diffObjects,
    isNumber,
    isString,
    merge,
    pick
} = U;


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

    /**
     * Predefined sync configuration for the Navigator component.
     */
    public static predefinedSyncConfig = NavigatorSyncs;

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
        this.type = 'Navigator';

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

        if (this.sync.syncConfig.crossfilter?.enabled) {
            this.chart.update(
                merge(
                    { navigator: { xAxis: { labels: { format: '{value}' } } } },
                    this.options.chartOptions || {}
                ),
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
            chartUpdates: DeepPartial<HighchartsOptions> = {};

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
     * Returns the first column of columnAssignment to use for navigator data.
     * @private
     *
     * @return
     * Navigator column assignment.
     */
    public getColumnAssignment(): [string, string] {
        const columnAssignment = this.options.columnAssignment ?? {};

        let columnsAssignment: (string|null);

        for (const column of Object.keys(columnAssignment)) {
            columnsAssignment = columnAssignment[column];

            if (columnsAssignment !== null) {
                return [column, columnsAssignment];
            }
        }

        const table = this.getDataTable();
        if (table) {
            const columns = table.getColumnIds();

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
        const table = this.getDataTable();

        if (table) {
            const column = this.getColumnAssignment(),
                columnValues = table.getColumn(column[0], true) || [];

            let data: (
                Array<(number|string|null)>|
                Array<[number|string, number|null]>
            );

            if (this.sync.syncConfig.crossfilter?.enabled) {
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
        const crossfilterOptions =
            this.sync.syncConfig.crossfilter as CrossfilterSyncOptions;
        const table = this.getDataTable();
        const columnValues = table?.getColumn(
            this.getColumnAssignment()[0], true
        ) || [];

        if (!table || columnValues.length < 1 || !crossfilterOptions) {
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

        if (
            crossfilterOptions.affectNavigator &&
            modifierOptions?.type === 'Filter'
        ) {
            const appliedRanges: NavigatorSyncUtils.Range[] = [];
            const rangedColumns: DataTable.Column[] = [];
            const ranges = NavigatorSyncUtils.toRange(
                modifierOptions as FilterModifierOptions
            );

            for (let i = 0, iEnd = ranges.length; i < iEnd; i++) {
                if (ranges[i].columnId !== this.getColumnAssignment()[0]) {
                    appliedRanges.push(ranges[i]);
                    rangedColumns.push(table.getColumn(
                        ranges[i].columnId, true
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
        const chart = this.chart;

        await super.update(options, false);

        if (options.chartOptions) {
            chart.update(
                merge(this.sync.syncConfig.crossfilter?.enabled ? (
                    { navigator: { xAxis: { labels: { format: '{value}' } } } }
                ) : {}, options.chartOptions),
                false
            );
        }

        this.emit({ type: 'afterUpdate' });

        if (shouldRerender) {
            this.render();
        }
    }

    public getOptionsOnDrop(): Partial<Options> {
        return {};
    }
}

/* *
 *
 *  Default Export
 *
 * */


export default NavigatorComponent;
