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
    Chart,
    Highcharts as H,
    Options as HighchartsOptions
} from '../HighchartsTypes';
import type Cell from '../../Layout/Cell';
import type { Options } from './NavigatorComponentOptions';
import type { RangeModifierOptions, RangeModifierRangeOptions } from '../../../Data/Modifiers/RangeModifierOptions';
import type Sync from '../../Components/Sync/Sync';
import type SidebarPopup from '../../EditMode/SidebarPopup';

import Component from '../../Components/Component.js';
import Globals from '../../Globals.js';
import NavigatorComponentDefaults from './NavigatorComponentDefaults.js';
import DataTable from '../../../Data/DataTable.js';
import NavigatorSyncHandler from './NavigatorSyncHandlers.js';
import U from '../../../Core/Utilities.js';
const {
    defined,
    diffObjects,
    isNumber,
    isObject,
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

        this.filterAndAssignSyncOptions(NavigatorSyncHandler);
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

            let values: DataTable.Column = [],
                data: (
                    Array<(number|string|null)>|
                    Array<[number|string, number|null]>
                );

            if (crossfilterOptions === true || (
                isObject(crossfilterOptions) && crossfilterOptions.enabled
            )) {

                const seriesData: Array<[(number|string), number]> = [],
                    xData: Array<(number|string)> = [],
                    modifierOptions = table.getModifier()?.options;

                let index: number,
                    max: number|undefined = void 0,
                    min: number|undefined = void 0;

                if (
                    crossfilterOptions !== true &&
                    crossfilterOptions.affectNavigator &&
                    modifierOptions?.type === 'Range'
                ) {
                    const appliedRanges: RangeModifierRangeOptions[] = [],
                        rangedColumns: DataTable.Column[] = [],
                        { ranges } = (modifierOptions as RangeModifierOptions);

                    for (let i = 0, iEnd = ranges.length; i < iEnd; i++) {
                        if (ranges[i].column !== column[0]) {
                            appliedRanges.push(ranges[i]);
                            rangedColumns.push(table.getColumn(
                                ranges[i].column, true
                            ) || []);
                        }
                    }

                    const appliedRagesLength = appliedRanges.length;
                    for (let i = 0, iEnd = columnValues.length; i < iEnd; i++) {
                        let value = columnValues[i];

                        if (!defined(value) || !isNumber(+value)) {
                            continue;
                        }

                        value = +value;
                        if (max === void 0 || max < value) {
                            max = value;
                        }
                        if (min === void 0 || min > value) {
                            min = value;
                        }

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
                            values.push(value);
                        }
                    }
                } else {
                    values = columnValues;
                }

                for (let i = 0, iEnd = values.length; i < iEnd; i++) {
                    let value = values[i];

                    if (value === null) {
                        continue;
                    } else if (!isNumber(value)) {
                        value = `${value}`;
                    }

                    index = xData.indexOf(value);

                    if (index === -1) {
                        index = xData.length;
                        xData[index] = value;
                        seriesData[index] = [value, 1];
                    } else {
                        seriesData[index][1] = seriesData[index][1] + 1;
                    }
                }

                seriesData.sort((pointA, pointB): number => (
                    pick(pointA[0], NaN) < pick(pointB[0], NaN) ? -1 :
                        pointA[0] === pointB[0] ? 0 : 1
                ));

                data = seriesData;

                // Add a minimum and maximum of the unmodified column with null
                // values to maintain the correct extremes without having to
                // refresh them.
                if (min !== void 0) {
                    data.unshift([min, null]);
                }
                if (max !== void 0) {
                    data.push([max, null]);
                }
            } else if (typeof values[0] === 'string') {
                data = values.slice() as Array<string>;
            } else {
                data = values.slice() as Array<(number|null)>;
            }

            if (!chart.series[0]) {
                chart.addSeries({ id: table.id, data }, false);
            } else {
                chart.series[0].setData(data, false);
            }
        }

        this.redrawNavigator();
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
            this.filterAndAssignSyncOptions(NavigatorSyncHandler);
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

    public getOptionsOnDrop(sidebar: SidebarPopup): Partial<Options> {
        return {};
    }
}


/* *
 *
 *  Default Export
 *
 * */


export default NavigatorComponent;
