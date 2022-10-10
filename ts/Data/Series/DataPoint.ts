/* eslint-disable brace-style */
/* eslint-disable no-console */
/* eslint-disable no-invalid-this */

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type DataPointOptions from './DataPointOptions';
import type DataSeries from './DataSeries';
import type DataTable from '../DataTable';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        redrawTimer?: number;
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Reconstructs object keys in dot syntax to tree-like objects.
 * @private
 */
function tree(
    flatObj: Record<string, any>
): Record<string, any> {
    const obj: Record<string, any> = {};
    Object
        .getOwnPropertyNames(flatObj)
        .forEach(function (name: string): void {
            if (name.indexOf('.') === -1) {
                if (flatObj[name] instanceof Array) {
                    obj[name] = flatObj[name].map(tree);
                } else {
                    obj[name] = flatObj[name];
                }
            } else {
                const subNames = name.split('.'),
                    subObj = subNames
                        .slice(0, -1)
                        .reduce(function (
                            subObj: Record<string, any>,
                            subName: string
                        ): Record<string, any> {
                            return (subObj[subName] = (subObj[subName] || {}));
                        }, obj);
                subObj[(subNames.pop() || '')] = flatObj[name];
            }
        });
    return obj;
}

/* *
 *
 *  Class
 *
 * */

class DataPoint {

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
        tableRow: DataTable.RowObject
    ): (DataPointOptions|null) {
        return tree(tableRow);
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
            (DataPointOptions&Record<string, any>)|
            PointShortOptions
        ),
        keys: Array<string> = ['y'],
        x: number = 0
    ): DataTable.RowObject {
        let tableRow: DataTable.RowObject;

        keys = keys.slice();

        // Array
        if (pointOptions instanceof Array) {
            tableRow = {};
            if (pointOptions.length > keys.length) {
                keys.unshift(
                    typeof pointOptions[0] === 'string' ?
                        'name' :
                        'x'
                );
            }
            for (let i = 0, iEnd = pointOptions.length; i < iEnd; ++i) {
                tableRow[keys[i] || `${i}`] = pointOptions[i];
            }

        // Object
        } else if (
            typeof pointOptions === 'object'
        ) {
            if (pointOptions === null) {
                tableRow = {};
            } else {
                tableRow = tree(pointOptions);
            }

        // Primitive
        } else {
            tableRow = {
                x,
                [keys[0] || 'y']: pointOptions
            };
        }

        return tableRow;
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        series: DataSeries,
        data?: (DataPointOptions|DataTable.RowObject|PointShortOptions),
        x?: number
    ) {
        console.log('DataPoint.constructor');

        this.options = { x };
        this.series = series;
        this.tableRow = {};

        if (data) {
            this.setTableRow(DataPoint.getTableRowFromPointOptions(data));
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    public graphic?: SVGElement;

    public index?: number;

    public readonly options: DataPointOptions;

    public readonly series: DataSeries;

    public tableRow: DataTable.RowObject;

    private tableRowListener?: Function;

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void {
        console.log('DataPoint.destroy');

        const point = this;

        point.tableRow = {};

        if (point.tableRowListener) {
            point.tableRowListener();
        }
    }

    public render(parent: SVGElement): void {
        console.log('DataPoint.render');

        const point = this,
            tableRow = point.tableRow,
            valueKey = point.series.pointArrayMap[0];

        if (point.graphic) {
            point.graphic.destroy();
        }

        point.graphic = parent.renderer
            .rect(
                tableRow['x'] as number * 10,
                tableRow[valueKey] as number * 10,
                1,
                1
            )
            .addClass('highcharts-data-point')
            .attr({
                fill: '#333',
                stroke: '#000',
                'stroke-width': 1,
                opacity: 1
            })
            .add(parent);
    }

    public setTableRow(
        tableRow: DataTable.RowObject
    ): void {
        console.log('DataPoint.setTableRow');

        const point = this,
            series = point.series,
            chart = series.chart;

        if (point.tableRow !== tableRow) {
            if (point.tableRowListener) {
                point.tableRowListener();
            }

            point.tableRow = tableRow;
            // point.tableRowListener = tableRow.on('afterChangeRow', function (
            //     this: DataTableRow
            // ): void {
            //     point.update(
            //         DataPoint.getPointOptionsFromTableRow(
            //             this,
            //             series.options.keys || series.pointArrayMap
            //         ) || {},
            //         false,
            //         false
            //     );
            //     series.isDirty = true;
            //     series.isDirtyData = true;

            //     // POC by Torstein
            //     if (typeof chart.redrawTimer === 'undefined') {
            //         chart.redrawTimer = setTimeout(function (): void {
            //             chart.redrawTimer = void 0;
            //             chart.redraw();
            //         });
            //     }
            // });
        }

        point.update(
            DataPoint.getPointOptionsFromTableRow(
                tableRow
            ) || {},
            true,
            false
        );
    }

    public update(
        options: DataPointOptions,
        redraw?: boolean,
        animation?: (false|AnimationOptions)
    ): void {
        console.log('DataPoint.update');

        const point = this,
            series = point.series;

        merge(true, point.options, options);

        if (redraw) {
            series.isDirty = true;
            series.isDirtyData = true;
            series.chart.redraw(animation);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoint;
