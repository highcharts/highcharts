/* *
 *
 *  Experimental data export module for Highcharts
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

// @todo
// - Set up systematic tests for all series types, paired with tests of the data
//   module importing the same data.

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import type Exporting from '../Exporting/Exporting';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';

import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import D from '../../Core/Defaults.js';
const {
    getOptions,
    setOptions
} = D;
import DownloadURL from '../../Shared/DownloadURL.js';
const { downloadURL, getBlobFromContent } = DownloadURL;
import ExportDataDefaults from './ExportDataDefaults.js';
import G from '../../Core/Globals.js';
const {
    composed,
    doc,
    win
} = G;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    extend,
    find,
    fireEvent,
    isNumber,
    pick,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartBase'{
    interface ChartBase {
        /**
         * Deprecated in favor of [Exporting.downloadCSV](https://api.highcharts.com/class-reference/Highcharts.Exporting#downloadCSV).
         *
         * @deprecated */
        downloadCSV(): void;

        /**
         * Deprecated in favor of [Exporting.downloadXLS](https://api.highcharts.com/class-reference/Highcharts.Exporting#downloadXLS).
         *
         * @deprecated */
        downloadXLS(): void;

        /**
         * Deprecated in favor of [Exporting.getCSV](https://api.highcharts.com/class-reference/Highcharts.Exporting#getCSV).
         *
         * @deprecated */
        getCSV(
            useLocalDecimalPoint?: boolean
        ): (string | undefined);

        /**
         * Deprecated in favor of [Exporting.getDataRows](https://api.highcharts.com/class-reference/Highcharts.Exporting#getDataRows).
         *
         * @deprecated */
        getDataRows(
            multiLevelHeaders?: boolean
        ): (Array<Array<(number | string)>> | undefined);

        /**
         * Deprecated in favor of [Exporting.getTable](https://api.highcharts.com/class-reference/Highcharts.Exporting#getTable).
         *
         * @deprecated */
        getTable(
            useLocalDecimalPoint?: boolean
        ): (string | undefined);

        /**
         * Deprecated in favor of [Exporting.getTableAST](https://api.highcharts.com/class-reference/Highcharts.Exporting#getTableAST).
         *
         * @deprecated */
        getTableAST(
            useLocalDecimalPoint?: boolean
        ): (AST.Node | undefined);

        /**
         * Deprecated in favor of [Exporting.hideData](https://api.highcharts.com/class-reference/Highcharts.Exporting#hideData).
         *
         * @deprecated */
        hideData(): void;

        /**
         * Deprecated in favor of [Exporting.toggleDataTable](https://api.highcharts.com/class-reference/Highcharts.Exporting#toggleDataTable).
         *
         * @deprecated */
        toggleDataTable(
            show?: boolean
        ): void;

        /**
         * Deprecated in favor of [Exporting.viewData](https://api.highcharts.com/class-reference/Highcharts.Exporting#viewData).
         *
         * @deprecated */
        viewData(): void;
    }
}

declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        exportKey?: string;
        keyToAxis?: Record<string, string>;
    }
}

declare module '../../Extensions/Exporting/ExportingBase' {
    interface ExportingBase {
        ascendingOrderInTable?: boolean
        dataTableDiv?: HTMLDivElement;
        isDataTableVisible?: boolean;
        /** @requires modules/export-data */
        downloadCSV(): void;
        /** @requires modules/export-data */
        downloadXLS(): void;
        /** @requires modules/export-data */
        getCSV(
            useLocalDecimalPoint?: boolean
        ): string;
        /** @requires modules/export-data */
        getDataRows(
            multiLevelHeaders?: boolean
        ): Array<Array<(number | string)>>;
        /** @requires modules/export-data */
        getTable(
            useLocalDecimalPoint?: boolean
        ): string;
        /** @requires modules/export-data */
        getTableAST(
            useLocalDecimalPoint?: boolean
        ): AST.Node;
        /** @requires modules/export-data */
        hideData(): void;
        /** @requires modules/export-data */
        toggleDataTable(
            show?: boolean
        ): void;
        /** @requires modules/export-data */
        viewData(): void;
        /** @requires modules/export-data */
        wrapLoading(
            fn: Function
        ): void
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace ExportData {

    /* *
     *
     *  Declarations
     *
     * */

    type ExportingCategoryMap = Record<string, Array<(number | string | null)>>;

    type ExportingDateTimeMap = Record<string, Array<string>>;

    interface ExportingCategoryDateTimeMap {
        categoryMap: ExportingCategoryMap;
        dateTimeValueAxisMap: ExportingDateTimeMap;
    }

    interface ExportDataPoint {
        series: ExportDataSeries;
        x?: number;
        x2?: number;
    }

    interface ExportDataSeries {
        autoIncrement: Series['autoIncrement'];
        chart: Chart;
        options: SeriesOptions;
        pointArrayMap?: Array<string>;
        index: number;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Composition function.
     *
     * @private
     * @function Highcharts.Exporting#compose
     *
     * @param {ChartClass} ChartClass
     * Chart class.
     * @param {ExportingClass} ExportingClass
     * Exporting class.
     * @param {SeriesClass} SeriesClass
     * Series class.
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    export function compose(
        ChartClass: typeof Chart,
        ExportingClass: typeof Exporting,
        SeriesClass: typeof Series
    ): void {
        // Check the composition registry for the Exporting
        if (!pushUnique(composed, 'ExportData')) {
            return;
        }

        // Adding wrappers for the deprecated functions
        extend(Chart.prototype, {
            downloadCSV: function (
                this: Chart
            ): void {
                return this.exporting?.downloadCSV();
            },
            downloadXLS: function (
                this: Chart
            ): void {
                return this.exporting?.downloadXLS();
            },
            getCSV: function (
                this: Chart,
                useLocalDecimalPoint?: boolean
            ): (string | undefined) {
                return this.exporting?.getCSV(useLocalDecimalPoint);
            },
            getDataRows: function (
                this: Chart,
                multiLevelHeaders?: boolean
            ): (Array<Array<(number | string)>> | undefined) {
                return this.exporting?.getDataRows(multiLevelHeaders);
            },
            getTable: function (
                this: Chart,
                useLocalDecimalPoint?: boolean
            ): (string | undefined) {
                return this.exporting?.getTable(useLocalDecimalPoint);
            },
            getTableAST: function (
                this: Chart,
                useLocalDecimalPoint?: boolean
            ): (AST.Node | undefined) {
                return this.exporting?.getTableAST(useLocalDecimalPoint);
            },
            hideData: function (
                this: Chart
            ): void {
                return this.exporting?.hideData();
            },
            toggleDataTable: function (
                this: Chart,
                show?: boolean
            ): void {
                return this.exporting?.toggleDataTable(show);
            },
            viewData: function (
                this: Chart
            ): void {
                return this.exporting?.viewData();
            }
        });

        const exportingProto = ExportingClass.prototype;
        if (!exportingProto.downloadCSV) {
            // Add an event listener to handle the showTable option
            addEvent(ChartClass, 'afterViewData', onChartAfterViewData);
            addEvent(ChartClass, 'render', onChartRenderer);
            addEvent(ChartClass, 'destroy', onChartDestroy);

            // Adding functions to the Exporting prototype
            exportingProto.downloadCSV = downloadCSV;
            exportingProto.downloadXLS = downloadXLS;
            exportingProto.getCSV = getCSV;
            exportingProto.getDataRows = getDataRows;
            exportingProto.getTable = getTable;
            exportingProto.getTableAST = getTableAST;
            exportingProto.hideData = hideData;
            exportingProto.toggleDataTable = toggleDataTable;
            exportingProto.wrapLoading = wrapLoading;
            exportingProto.viewData = viewData;

            // Update with defaults of the export data module
            setOptions(ExportDataDefaults);

            // Additionaly, extend the menuItems with the export data variants
            const menuItems =
                getOptions().exporting?.buttons?.contextButton?.menuItems;
            menuItems && menuItems.push(
                'separator',
                'downloadCSV',
                'downloadXLS',
                'viewData'
            );

            const {
                arearange: AreaRangeSeries,
                gantt: GanttSeries,
                map: MapSeries,
                mapbubble: MapBubbleSeries,
                treemap: TreemapSeries,
                xrange: XRangeSeries
            } = SeriesClass.types;

            if (AreaRangeSeries) {
                AreaRangeSeries.prototype.keyToAxis = {
                    low: 'y',
                    high: 'y'
                };
            }

            if (GanttSeries) {
                GanttSeries.prototype.exportKey = 'name';
                GanttSeries.prototype.keyToAxis = {
                    start: 'x',
                    end: 'x'
                };
            }

            if (MapSeries) {
                MapSeries.prototype.exportKey = 'name';
            }

            if (MapBubbleSeries) {
                MapBubbleSeries.prototype.exportKey = 'name';
            }

            if (TreemapSeries) {
                TreemapSeries.prototype.exportKey = 'name';
            }

            if (XRangeSeries) {
                XRangeSeries.prototype.keyToAxis = {
                    x2: 'x'
                };
            }
        }
    }

    /**
     * Generates a data URL of CSV for local download in the browser. This is
     * the default action for a click on the 'Download CSV' button.
     *
     * See {@link Highcharts.Exporting#getCSV} to get the CSV data itself.
     *
     * @function Highcharts.Exporting#downloadCSV
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function downloadCSV(
        this: Exporting
    ): void {
        this.wrapLoading((): void => {
            const csv = this.getCSV(true);

            downloadURL(
                getBlobFromContent(csv, 'text/csv') ||
                    'data:text/csv,\uFEFF' + encodeURIComponent(csv),
                this.getFilename() + '.csv'
            );
        });
    }

    /**
     * Generates a data URL of an XLS document for local download in the
     * browser. This is the default action for a click on the 'Download XLS'
     * button.
     *
     * See {@link Highcharts.Exporting#getTable} to get the table data itself.
     *
     * @function Highcharts.Exporting#downloadXLS
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function downloadXLS(
        this: Exporting
    ): void {
        this.wrapLoading((): void => {
            const uri = 'data:application/vnd.ms-excel;base64,',
                template =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
                'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                'xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
                '<x:ExcelWorksheets><x:ExcelWorksheet>' +
                '<x:Name>Ark1</x:Name>' +
                '<x:WorksheetOptions><x:DisplayGridlines/>' +
                '</x:WorksheetOptions>' +
                '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
                '</xml><![endif]-->' +
                '<style>td{border:none;font-family: Calibri, sans-serif;} ' +
                '.number{mso-number-format:"0.00";} ' +
                '.text{ mso-number-format:"\@";}</style>' +
                '<meta name=ProgId content=Excel.Sheet>' +
                '<meta charset=UTF-8>' +
                '</head><body>' +
                this.getTable(true) +
                '</body></html>',
                base64 = function (s: string): string {
                    return win.btoa(unescape(encodeURIComponent(s))); // #50
                };

            downloadURL(
                getBlobFromContent(template, 'application/vnd.ms-excel') ||
                    uri + base64(template),
                this.getFilename() + '.xls'
            );
        });
    }

    /**
     * Returns the current chart data as a CSV string.
     *
     * @function Highcharts.Exporting#getCSV
     *
     * @param {boolean} [useLocalDecimalPoint]
     * Whether to use the local decimal point as detected from the browser. This
     * makes it easier to export data to Excel in the same locale as the user
     * is.
     *
     * @return {string}
     * CSV representation of the data.
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function getCSV(
        this: Exporting,
        useLocalDecimalPoint?: boolean
    ): string {
        let csv = '';
        const rows = this.getDataRows(),
            csvOptions = this.options?.csv,
            decimalPoint = pick(
                csvOptions?.decimalPoint,
                csvOptions?.itemDelimiter !== ',' && useLocalDecimalPoint ?
                    (1.1).toLocaleString()[1] :
                    '.'
            ),
            // Use ';' for direct to Excel
            itemDelimiter = pick(
                csvOptions?.itemDelimiter,
                decimalPoint === ',' ? ';' : ','
            ),
            // '\n' isn't working with the js csv data extraction
            lineDelimiter = csvOptions?.lineDelimiter;

        // Transform the rows to CSV
        rows.forEach((row: Array<(number | string | undefined)>, i: number): void => {
            let val: (number | string | undefined) = '',
                j = row.length;

            while (j--) {
                val = row[j];
                if (typeof val === 'string') {
                    val = `"${val}"`;
                }
                if (typeof val === 'number') {
                    if (decimalPoint !== '.') {
                        val = val.toString().replace('.', decimalPoint);
                    }
                }
                row[j] = val;
            }

            // The first row is the header - it defines the number of columns.
            // Empty columns between not-empty cells are covered in the
            // getDataRows method.
            // Now add empty values only to the end of the row so all rows have
            // the same number of columns, #17186
            row.length = rows.length ? rows[0].length : 0;

            // Add the values
            csv += row.join(itemDelimiter);

            // Add the line delimiter
            if (i < rows.length - 1) {
                csv += lineDelimiter;
            }
        });
        return csv;
    }

    /**
     * Returns a two-dimensional array containing the current chart data.
     *
     * @function Highcharts.Exporting#getDataRows
     *
     * @param {boolean} [multiLevelHeaders]
     * Use multilevel headers for the rows by default. Adds an extra row with
     * top level headers. If a custom columnHeaderFormatter is defined, this can
     * override the behavior.
     *
     * @return {Array<Array<(number | string)>>}
     * The current chart data
     *
     * @emits Highcharts.Chart#event:exportData
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function getDataRows(
        this: Exporting,
        multiLevelHeaders?: boolean
    ): Array<Array<(number | string)>> {
        const chart = this.chart,
            hasParallelCoords = chart.hasParallelCoordinates,
            time = chart.time,
            csvOptions = this.options?.csv || {},
            xAxes = chart.xAxis,
            rows: Record<string, (Array<any> & AnyRecord)> = {},
            rowArr = [],
            topLevelColumnTitles: Array<string> = [],
            columnTitles: Array<string> = [],
            langOptions = chart.options.lang,
            exportDataOptions = langOptions.exportData,
            categoryHeader = exportDataOptions?.categoryHeader,
            categoryDatetimeHeader = exportDataOptions?.categoryDatetimeHeader,
            // Options
            columnHeaderFormatter = function (
                item: (Axis | Series),
                key?: string,
                keyLength?: number
            ): (string | Record<string, string>) {
                if (csvOptions.columnHeaderFormatter) {
                    const s = csvOptions.columnHeaderFormatter(
                        item,
                        key,
                        keyLength
                    );

                    if (s !== false) {
                        return s;
                    }
                }

                if (!item && categoryHeader) {
                    return categoryHeader;
                }

                if (
                    !(item as Series).bindAxes &&
                    categoryDatetimeHeader &&
                    categoryHeader
                ) {
                    return (
                        (item as Axis).options.title &&
                        (item as Axis).options.title.text
                    ) || (
                        (item as Axis).dateTime ?
                            categoryDatetimeHeader :
                            categoryHeader
                    );
                }

                if (multiLevelHeaders) {
                    return {
                        columnTitle: ((keyLength || 0) > 1 ?
                            key :
                            item.name) || '',
                        topLevelColumnTitle: (item as Series).name
                    };
                }

                return item.name + (
                    (keyLength || 0) > 1 ? ' (' + key + ')' : ''
                );
            },
            // Map the categories for value axes
            getCategoryAndDateTimeMap = function (
                series: Series,
                pointArrayMap: Array<string>,
                pIdx?: number
            ): ExportingCategoryDateTimeMap {
                const categoryMap: ExportingCategoryMap = {},
                    dateTimeValueAxisMap: ExportingDateTimeMap = {};

                pointArrayMap.forEach(function (prop: string): void {
                    const axisName = (
                            (series.keyToAxis && series.keyToAxis[prop]) ||
                            prop
                        ) + 'Axis',
                        // Points in parallel coordinates refers to all yAxis
                        // not only `series.yAxis`
                        axis = isNumber(pIdx) ?
                            (series as AnyRecord).chart[axisName][pIdx] :
                            (series as AnyRecord)[axisName];

                    categoryMap[prop] = (
                        axis && axis.categories
                    ) || [];
                    dateTimeValueAxisMap[prop] = (
                        axis && axis.dateTime
                    );
                });

                return {
                    categoryMap: categoryMap,
                    dateTimeValueAxisMap: dateTimeValueAxisMap
                };
            },
            // Create point array depends if xAxis is category
            // or point.name is defined #13293
            getPointArray = function (
                series: Series,
                xAxis: Axis
            ): string[] {
                const pointArrayMap = series.pointArrayMap || ['y'],
                    namedPoints = series.data.some((d): (string | false) =>
                        (typeof d.y !== 'undefined') && d.name
                    );

                // If there are points with a name, we also want the x value in
                // the table
                if (
                    namedPoints &&
                    xAxis &&
                    !xAxis.categories &&
                    series.exportKey !== 'name'
                ) {
                    return ['x', ...pointArrayMap];
                }
                return pointArrayMap;
            },
            xAxisIndices: Array<Array<number>> = [];

        let xAxis: Axis,
            dataRows,
            columnTitleObj: (string | Record<string, string>),
            i = 0, // Loop the series and index values
            x,
            xTitle: string;

        chart.series.forEach(function (series: Series): void {
            const keys = series.options.keys,
                xAxis = series.xAxis,
                pointArrayMap = keys || getPointArray(series, xAxis),
                valueCount = pointArrayMap.length,
                xTaken: (false | Record<string, unknown>) =
                    !series.requireSorting && {},
                xAxisIndex = xAxes.indexOf(xAxis);

            let categoryAndDatetimeMap = getCategoryAndDateTimeMap(
                    series,
                    pointArrayMap
                ),
                mockSeries: ExportDataSeries,
                j: number;

            if (
                series.options.includeInDataExport !== false &&
                !series.options.isInternal &&
                series.visible !== false // #55
            ) {

                // Build a lookup for X axis index and the position of the first
                // series that belongs to that X axis. Includes -1 for non-axis
                // series types like pies.
                if (
                    !find(
                        xAxisIndices,
                        function (index: Array<number>): boolean {
                            return index[0] === xAxisIndex;
                        }
                    )
                ) {
                    xAxisIndices.push([xAxisIndex, i]);
                }

                // Compute the column headers and top level headers, usually the
                // same as series names
                j = 0;
                while (j < valueCount) {
                    columnTitleObj = columnHeaderFormatter(
                        series,
                        pointArrayMap[j],
                        pointArrayMap.length
                    );

                    columnTitles.push(
                        (columnTitleObj as Record<string, string>).columnTitle ||
                        columnTitleObj as string
                    );
                    if (multiLevelHeaders) {
                        topLevelColumnTitles.push(
                            (columnTitleObj as Record<string, string>).topLevelColumnTitle ||
                            columnTitleObj as string
                        );
                    }
                    j++;
                }

                mockSeries = {
                    chart: series.chart,
                    autoIncrement: series.autoIncrement,
                    options: series.options,
                    pointArrayMap: series.pointArrayMap,
                    index: series.index
                };

                // Export directly from options.data because we need the
                // uncropped data (#7913), and we need to support Boost (#7026).
                series.options.data?.forEach(function eachData(
                    options: (PointOptions | PointShortOptions),
                    pIdx: number
                ): void {
                    const mockPoint: ExportDataPoint = { series: mockSeries };

                    let key: (number | string),
                        prop: string,
                        val: number;

                    // In parallel coordinates chart, each data point is
                    // connected to a separate yAxis, conform this
                    if (hasParallelCoords) {
                        categoryAndDatetimeMap = getCategoryAndDateTimeMap(
                            series,
                            pointArrayMap,
                            pIdx
                        );
                    }

                    series.pointClass.prototype.applyOptions.apply(
                        mockPoint,
                        [options]
                    );

                    const name = series.data[pIdx] && series.data[pIdx].name;

                    key = (mockPoint.x ?? '') + ',' + name;

                    j = 0;

                    // Pies, funnels, geo maps etc. use point name in X row
                    if (
                        !xAxis ||
                        series.exportKey === 'name' ||
                        (!hasParallelCoords && xAxis && xAxis.hasNames) && name
                    ) {
                        key = name;
                    }

                    if (xTaken) {
                        if (xTaken[key]) {
                            key += '|' + pIdx;
                        }
                        xTaken[key] = true;
                    }

                    if (!rows[key]) {
                        rows[key] = [];
                        rows[key].xValues = [];

                        // ES5 replacement for Array.from / fill.
                        const arr = [];
                        for (let i = 0; i < series.chart.series.length; i++) {
                            arr[i] = 0;
                        }

                        // Create pointers array, holding information how many
                        // duplicates of specific x occurs in each series.
                        // Used for creating rows with duplicates.
                        rows[key].pointers = arr;
                        rows[key].pointers[series.index] = 1;
                    } else {
                        // Handle duplicates (points with the same x), by
                        // creating extra rows based on pointers for better
                        // performance.
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        const modifiedKey = `${key},${rows[key].pointers[series.index]}`,
                            originalKey = key;

                        if (rows[key].pointers[series.index]) {
                            if (!rows[modifiedKey]) {
                                rows[modifiedKey] = [];
                                rows[modifiedKey].xValues = [];
                                rows[modifiedKey].pointers = [];
                            }

                            key = modifiedKey;
                        }

                        rows[originalKey].pointers[series.index] += 1;
                    }

                    rows[key].x = mockPoint.x;
                    rows[key].name = name;
                    rows[key].xValues[xAxisIndex] = mockPoint.x;

                    while (j < valueCount) {
                        prop = pointArrayMap[j]; // `y`, `z` etc
                        val =
                            series.pointClass.prototype.getNestedProperty.apply(
                                mockPoint,
                                [prop]
                            ) as number;
                        // Allow values from nested properties (#20470)
                        rows[key][i + j] = pick(
                            // Y axis category if present
                            categoryAndDatetimeMap.categoryMap[prop][val],
                            // Datetime yAxis
                            categoryAndDatetimeMap.dateTimeValueAxisMap[prop] ?
                                time.dateFormat(csvOptions.dateFormat, val) :
                                null,
                            // Linear/log yAxis
                            val
                        );
                        j++;
                    }
                });
                i = i + j;
            }
        });

        // Make a sortable array
        for (x in rows) {
            if (Object.hasOwnProperty.call(rows, x)) {
                rowArr.push(rows[x]);
            }
        }

        let xAxisIndex: number, column: number;

        // Add computed column headers and top level headers to final row set
        dataRows = multiLevelHeaders ? [topLevelColumnTitles, columnTitles] :
            [columnTitles];

        i = xAxisIndices.length;
        while (i--) { // Start from end to splice in
            xAxisIndex = xAxisIndices[i][0];
            column = xAxisIndices[i][1];
            xAxis = xAxes[xAxisIndex];

            // Sort it by X values
            rowArr.sort(function ( // eslint-disable-line no-loop-func
                a: AnyRecord,
                b: AnyRecord
            ): number {
                return a.xValues[xAxisIndex] - b.xValues[xAxisIndex];
            });

            // Add header row
            xTitle = columnHeaderFormatter(xAxis) as string;
            dataRows[0].splice(column, 0, xTitle);
            if (multiLevelHeaders && dataRows[1]) {
                // If using multi level headers, we just added top level header.
                // Also add for sub level
                dataRows[1].splice(column, 0, xTitle);
            }

            // Add the category column
            rowArr.forEach(function ( // eslint-disable-line no-loop-func
                row: AnyRecord
            ): void {
                let category = row.name;

                if (xAxis && !defined(category)) {
                    if (xAxis.dateTime) {
                        if (row.x instanceof Date) {
                            row.x = row.x.getTime();
                        }
                        category = time.dateFormat(
                            csvOptions.dateFormat,
                            row.x
                        );
                    } else if (xAxis.categories) {
                        category = pick(
                            xAxis.names[row.x],
                            xAxis.categories[row.x],
                            row.x
                        );
                    } else {
                        category = row.x;
                    }
                }

                // Add the X/date/category
                row.splice(column, 0, category);
            });
        }
        dataRows = dataRows.concat(rowArr);

        fireEvent(chart, 'exportData', { dataRows: dataRows });

        return dataRows;
    }

    /**
     * Build a HTML table with the chart's current data.
     *
     * @sample highcharts/export-data/viewdata/
     * View the data from the export menu
     *
     * @function Highcharts.Exporting#getTable
     *
     * @param {boolean} [useLocalDecimalPoint]
     * Whether to use the local decimal point as detected from the browser. This
     * makes it easier to export data to Excel in the same locale as the user
     * is.
     *
     * @return {string}
     * HTML representation of the data.
     *
     * @emits Highcharts.Chart#event:afterGetTable
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function getTable(
        this: Exporting,
        useLocalDecimalPoint?: boolean
    ): string {
        const serialize = (node: AST.Node): string => {
            if (!node.tagName || node.tagName === '#text') {
                // Text node
                return node.textContent || '';
            }

            const attributes = node.attributes;
            let html = `<${node.tagName}`;

            if (attributes) {
                (Object.keys(attributes) as Array<keyof typeof attributes>)
                    .forEach((key): void => {
                        const value = attributes[key];
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        html += ` ${key}="${value}"`;
                    });
            }
            html += '>';

            html += node.textContent || '';

            (node.children || []).forEach((child): void => {
                html += serialize(child);
            });

            html += `</${node.tagName}>`;
            return html;
        };

        const tree = this.getTableAST(useLocalDecimalPoint);
        return serialize(tree);
    }

    /**
     * Get the AST of a HTML table representing the chart data.
     *
     * @private
     * @function Highcharts.Exporting#getTableAST
     *
     * @param {boolean} [useLocalDecimalPoint]
     * Whether to use the local decimal point as detected from the browser. This
     * makes it easier to export data to Excel in the same locale as the user
     * is.
     *
     * @return {Highcharts.ASTNode}
     * The abstract syntax tree
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function getTableAST(
        this: Exporting,
        useLocalDecimalPoint?: boolean
    ): AST.Node {
        let rowLength = 0;
        const treeChildren: AST.Node[] = [],
            exporting = this,
            chart = exporting.chart,
            options = chart.options,
            decimalPoint =
                useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.',
            useMultiLevelHeaders = pick(
                exporting.options.useMultiLevelHeaders, true
            ),
            rows = exporting.getDataRows(useMultiLevelHeaders),
            topHeaders = useMultiLevelHeaders ? rows.shift() : null,
            subHeaders = rows.shift(),
            // Compare two rows for equality
            isRowEqual = function (
                row1: Array<(number | string)>,
                row2: Array<(number | string)>
            ): boolean {
                let i = row1.length;

                if (row2.length === i) {
                    while (i--) {
                        if (row1[i] !== row2[i]) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                return true;
            },
            // Get table cell HTML from value
            getCellHTMLFromValue = function (
                tagName: string,
                classes: (string | null),
                attributes: HTMLAttributes,
                value: (number | string)
            ): AST.Node {
                let textContent = pick(value, ''),
                    className =
                        'highcharts-text' + (classes ? ' ' + classes : '');

                // Convert to string if number
                if (typeof textContent === 'number') {
                    textContent = chart.numberFormatter(
                        textContent,
                        -1,
                        decimalPoint,
                        tagName === 'th' ? '' : void 0
                    );

                    className = 'highcharts-number';
                } else if (!value) {
                    className = 'highcharts-empty';
                }

                attributes = extend(
                    { 'class': className },
                    attributes
                );

                return {
                    tagName,
                    attributes,
                    textContent
                };

            },
            // Get table header markup from row data
            getTableHeaderHTML = function (
                topheaders: (Array<(number | string)> | null | undefined),
                subheaders: Array<(number | string)>,
                rowLength?: number
            ): AST.Node {
                const theadChildren: AST.Node[] = [];

                let i = 0,
                    len = rowLength || subheaders && subheaders.length,
                    next,
                    cur,
                    curColspan = 0,
                    rowspan;

                // Clean up multiple table headers. Chart.getDataRows() returns
                // two levels of headers when using multilevel, not merged. We
                // need to merge identical headers, remove redundant headers,
                // and keep it all marked up nicely.
                if (
                    useMultiLevelHeaders &&
                    topheaders &&
                    subheaders &&
                    !isRowEqual(topheaders, subheaders)
                ) {
                    const trChildren = [];
                    for (; i < len; ++i) {
                        cur = topheaders[i];
                        next = topheaders[i + 1];
                        if (cur === next) {
                            ++curColspan;
                        } else if (curColspan) {
                            // Ended colspan
                            // Add cur to HTML with colspan.
                            trChildren.push(getCellHTMLFromValue(
                                'th',
                                'highcharts-table-topheading',
                                {
                                    scope: 'col',
                                    colspan: curColspan + 1
                                },
                                cur
                            ));
                            curColspan = 0;
                        } else {
                            // Cur is standalone. If it is same as sublevel,
                            // remove sublevel and add just toplevel.
                            if (cur === subheaders[i]) {
                                if (exporting.options.useRowspanHeaders) {
                                    rowspan = 2;
                                    // eslint-disable-next-line @typescript-eslint/no-array-delete
                                    delete subheaders[i];
                                } else {
                                    rowspan = 1;
                                    subheaders[i] = '';
                                }
                            } else {
                                rowspan = 1;
                            }

                            const cell = getCellHTMLFromValue(
                                'th',
                                'highcharts-table-topheading',
                                { scope: 'col' },
                                cur
                            );
                            if (rowspan > 1 && cell.attributes) {
                                cell.attributes.valign = 'top';
                                cell.attributes.rowspan = rowspan;
                            }

                            trChildren.push(cell);
                        }
                    }

                    theadChildren.push({
                        tagName: 'tr',
                        children: trChildren
                    });
                }

                // Add the subheaders (the only headers if not using
                // multilevels)
                if (subheaders) {
                    const trChildren = [];

                    for (i = 0, len = subheaders.length; i < len; ++i) {
                        if (typeof subheaders[i] !== 'undefined') {
                            trChildren.push(
                                getCellHTMLFromValue(
                                    'th', null, { scope: 'col' }, subheaders[i]
                                )
                            );
                        }
                    }

                    theadChildren.push({
                        tagName: 'tr',
                        children: trChildren
                    });
                }
                return {
                    tagName: 'thead',
                    children: theadChildren
                };
            };

        // Add table caption
        const { tableCaption } = exporting.options || {};
        if (tableCaption !== false) {
            treeChildren.push({
                tagName: 'caption',
                attributes: {
                    'class': 'highcharts-table-caption'
                },
                textContent: typeof tableCaption === 'string' ?
                    tableCaption :
                    options.title?.text || options.lang.chartTitle
            });
        }

        // Find longest row
        for (let i = 0, len = rows.length; i < len; ++i) {
            if (rows[i].length > rowLength) {
                rowLength = rows[i].length;
            }
        }

        // Add header
        treeChildren.push(getTableHeaderHTML(
            topHeaders,
            subHeaders || [],
            Math.max(rowLength, subHeaders?.length || 0)
        ));

        // Transform the rows to HTML
        const trs: AST.Node[] = [];
        rows.forEach(function (row: Array<(number | string)>): void {
            const trChildren = [];
            for (let j = 0; j < rowLength; j++) {
                // Make first column a header too. Especially important for
                // category axes, but also might make sense for datetime? Should
                // await user feedback on this.
                trChildren.push(getCellHTMLFromValue(
                    j ? 'td' : 'th',
                    null,
                    j ? {} : { scope: 'row' },
                    row[j]
                ));
            }
            trs.push({
                tagName: 'tr',
                children: trChildren
            });
        });
        treeChildren.push({
            tagName: 'tbody',
            children: trs
        });

        const e = {
            tree: {
                tagName: 'table',
                id: `highcharts-data-table-${chart.index}`,
                children: treeChildren
            } as AST.Node
        };
        fireEvent(chart, 'afterGetTableAST', e);

        return e.tree;
    }

    /**
     * Hide the data table when visible.
     *
     * @function Highcharts.Exporting#hideData
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function hideData(
        this: Exporting
    ): void {
        this.toggleDataTable(false);
    }

    /**
     * Toggle showing data table.
     *
     * @private
     * @function Highcharts.Exporting#hideData
     *
     * @param {boolean} [show]
     * Whether to show data table or not.
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function toggleDataTable(
        this: Exporting,
        show?: boolean
    ): void {
        const chart = this.chart,
            // Create the div
            createContainer =
                (show = pick(show, !this.isDataTableVisible)) &&
                !this.dataTableDiv;

        if (createContainer) {
            this.dataTableDiv = doc.createElement('div');
            this.dataTableDiv.className = 'highcharts-data-table';
            // Insert after the chart container
            chart.renderTo.parentNode.insertBefore(
                this.dataTableDiv,
                chart.renderTo.nextSibling
            );
        }

        // Toggle the visibility
        if (this.dataTableDiv) {
            const style = this.dataTableDiv.style,
                oldDisplay = style.display;

            style.display = show ? 'block' : 'none';

            // Generate the data table
            if (show) {
                this.dataTableDiv.innerHTML = AST.emptyHTML;
                const ast = new AST([this.getTableAST()]);
                ast.addToDOM(this.dataTableDiv);
                fireEvent(chart, 'afterViewData', {
                    element: this.dataTableDiv,
                    wasHidden: createContainer || oldDisplay !== style.display
                });
            } else {
                fireEvent(chart, 'afterHideData');
            }
        }

        // Set the flag
        this.isDataTableVisible = show;

        // Change the menu item text
        const exportDivElements = this.divElements,
            options = this.options,
            menuItems = options.buttons?.contextButton.menuItems,
            lang = chart.options.lang;

        if (
            options &&
                options.menuItemDefinitions &&
                lang &&
                lang.viewData &&
                lang.hideData &&
                menuItems &&
                exportDivElements
        ) {
            const exportDivElement = exportDivElements[
                menuItems.indexOf('viewData')
            ];
            if (exportDivElement) {
                AST.setElementHTML(
                    exportDivElement,
                    this.isDataTableVisible ? lang.hideData : lang.viewData
                );
            }
        }
    }

    /**
     * View the data in a table below the chart.
     *
     * @function Highcharts.Exporting#viewData
     *
     * @emits Highcharts.Chart#event:afterViewData
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function viewData(
        this: Exporting
    ): void {
        this.toggleDataTable(true);
    }

    /**
     * Wrapper function for the download functions, which handles showing and
     * hiding the loading message
     *
     * @private
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function wrapLoading(
        this: Exporting,
        fn: Function
    ): void {
        const chart = this.chart,
            showMessage = Boolean(this.options.showExportInProgress);

        // Prefer requestAnimationFrame if available
        const timeoutFn = win.requestAnimationFrame || setTimeout;

        // Outer timeout avoids menu freezing on click
        timeoutFn((): void => {
            showMessage &&
            chart.showLoading(chart.options.lang.exportInProgress);
            timeoutFn((): void => {
                try {
                    fn.call(this);
                } finally {
                    showMessage && chart.hideLoading();
                }
            });
        });
    }

    /**
     * Function that runs on the chart's 'afterViewData' event.
     *
     * @private
     * @function Highcharts.Chart#onChartAfterViewData
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function onChartAfterViewData(
        this: Chart
    ): void {
        const exporting = this.exporting,
            dataTableDiv = exporting?.dataTableDiv,
            getCellValue =
                (tr: HTMLDOMElement, index: number): (string | null) =>
                    tr.children[index].textContent,
            comparer = (index: number, ascending: boolean) =>
                (a: HTMLDOMElement, b: HTMLDOMElement): number => {
                    const sort = (v1: any, v2: any): number => (
                        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ?
                            v1 - v2 :
                            v1.toString().localeCompare(v2)
                    );

                    return sort(
                        getCellValue(ascending ? a : b, index),
                        getCellValue(ascending ? b : a, index)
                    );
                };

        if (dataTableDiv && exporting.options.allowTableSorting) {
            const row = dataTableDiv.querySelector('thead tr');
            if (row) {
                row.childNodes.forEach((th: any): void => {
                    const tableBody = dataTableDiv.querySelector('tbody');

                    th.addEventListener('click', function (): void {
                        const rows = [...dataTableDiv.querySelectorAll(
                                'tr:not(thead tr)'
                            ) as unknown as Array<HTMLElement>],
                            headers = [...th.parentNode.children];

                        if (exporting) {
                            rows.sort(
                                comparer(
                                    headers.indexOf(th),
                                    exporting.ascendingOrderInTable =
                                        !exporting.ascendingOrderInTable
                                )
                            ).forEach((tr: HTMLDOMElement): void => {
                                tableBody?.appendChild(tr);
                            });

                            headers.forEach((th): void => {
                                [
                                    'highcharts-sort-ascending',
                                    'highcharts-sort-descending'
                                ].forEach((className): void => {
                                    if (th.classList.contains(className)) {
                                        th.classList.remove(className);
                                    }
                                });
                            });

                            th.classList.add(
                                exporting.ascendingOrderInTable ?
                                    'highcharts-sort-ascending' :
                                    'highcharts-sort-descending'
                            );
                        }
                    });
                });
            }
        }
    }

    /**
     * Function that runs on the chart's 'render' event. Handle the showTable
     * option.
     *
     * @private
     * @function Highcharts.Chart#onChartRenderer
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function onChartRenderer(
        this: Chart
    ): void {
        if (
            this.options?.exporting?.showTable &&
            !this.options.chart.forExport
        ) {
            this.exporting?.viewData();
        }
    }

    /**
     * Function that runs on the chart's 'destroy' event. Handle cleaning up the
     * dataTableDiv element.
     *
     * @private
     * @function Highcharts.Chart#onChartDestroy
     *
     * @requires modules/exporting
     * @requires modules/export-data
     */
    function onChartDestroy(
        this: Chart
    ): void {
        this.exporting?.dataTableDiv?.remove();
    }
}

/* *
 *
 * Default Export
 *
 * */

export default ExportData;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Function callback to execute while data rows are processed for exporting.
 * This allows the modification of data rows before processed into the final
 * format.
 *
 * @callback Highcharts.ExportDataCallbackFunction
 * @extends Highcharts.EventCallbackFunction<Highcharts.Chart>
 *
 * @param {Highcharts.Chart} this
 * Chart context where the event occurred.
 *
 * @param {Highcharts.ExportDataEventObject} event
 * Event object with data rows that can be modified.
 */

/**
 * Contains information about the export data event.
 *
 * @interface Highcharts.ExportDataEventObject
 *//**
 * Contains the data rows for the current export task and can be modified.
 * @name Highcharts.ExportDataEventObject#dataRows
 * @type {Array<Array<string>>}
 */

(''); // Keeps doclets above in JS file
