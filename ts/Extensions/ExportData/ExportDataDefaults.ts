/* *
 *
 *  Experimental data export module for Highcharts
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

import type {
    ExportingOptions,
    LangOptions
} from './ExportDataOptions';

/* *
 *
 *  Constants
 *
 * */

/**
 * @optionparent exporting
 * @private
 */
const exporting: ExportingOptions = {

    /**
     * Caption for the data table. Same as chart title by default. Set to
     * `false` to disable.
     *
     * @sample highcharts/export-data/multilevel-table
     *         Multiple table headers
     *
     * @type      {boolean|string}
     * @since     6.0.4
     * @requires  modules/export-data
     * @apioption exporting.tableCaption
     */

    /**
     * Options for exporting data to CSV or ExCel, or displaying the data
     * in a HTML table or a JavaScript structure.
     *
     * This module adds data export options to the export menu and provides
     * functions like `Chart.getCSV`, `Chart.getTable`, `Chart.getDataRows`
     * and `Chart.viewData`.
     *
     * The XLS converter is limited and only creates a HTML string that is
     * passed for download, which works but creates a warning before
     * opening. The workaround for this is to use a third party XLSX
     * converter, as demonstrated in the sample below.
     *
     * @sample  highcharts/export-data/categorized/ Categorized data
     * @sample  highcharts/export-data/stock-timeaxis/ Highcharts Stock time axis
     * @sample  highcharts/export-data/xlsx/
     *          Using a third party XLSX converter
     *
     * @since    6.0.0
     * @requires modules/export-data
     */
    csv: {

        /**
         *
         * Options for annotations in the export-data table.
         *
         * @since 8.2.0
         * @requires modules/export-data
         * @requires modules/annotations
         *
         *
         */
        annotations: {
            /**
            * The way to mark the separator for annotations
            * combined in one export-data table cell.
            *
            * @since 8.2.0
            * @requires modules/annotations
            */
            itemDelimiter: '; ',

            /**
            * When several labels are assigned to a specific point,
            * they will be displayed in one field in the table.
            *
            * @sample highcharts/export-data/join-annotations/
            *         Concatenate point annotations with itemDelimiter set.
            *
            * @since 8.2.0
            * @requires modules/annotations
            */
            join: false
        },

        /**
         * Formatter callback for the column headers. Parameters are:
         * - `item` - The series or axis object)
         * - `key` -  The point key, for example y or z
         * - `keyLength` - The amount of value keys for this item, for
         *   example a range series has the keys `low` and `high` so the
         *   key length is 2.
         *
         * If [useMultiLevelHeaders](#exporting.useMultiLevelHeaders) is
         * true, columnHeaderFormatter by default returns an object with
         * columnTitle and topLevelColumnTitle for each key. Columns with
         * the same topLevelColumnTitle have their titles merged into a
         * single cell with colspan for table/Excel export.
         *
         * If `useMultiLevelHeaders` is false, or for CSV export, it returns
         * the series name, followed by the key if there is more than one
         * key.
         *
         * For the axis it returns the axis title or "Category" or
         * "DateTime" by default.
         *
         * Return `false` to use Highcharts' proposed header.
         *
         * @sample highcharts/export-data/multilevel-table
         *         Multiple table headers
         *
         * @type {Function|null}
         */
        columnHeaderFormatter: null,

        /**
         * Which date format to use for exported dates on a datetime X axis.
         * See `Highcharts.dateFormat`.
         */
        dateFormat: '%Y-%m-%d %H:%M:%S',

        /**
         * Which decimal point to use for exported CSV. Defaults to the same
         * as the browser locale, typically `.` (English) or `,` (German,
         * French etc).
         *
         * @type  {string|null}
         * @since 6.0.4
         */
        decimalPoint: null,

        /**
         * The item delimiter in the exported data. Use `;` for direct
         * exporting to Excel. Defaults to a best guess based on the browser
         * locale. If the locale _decimal point_ is `,`, the `itemDelimiter`
         * defaults to `;`, otherwise the `itemDelimiter` defaults to `,`.
         *
         * @type {string|null}
         */
        itemDelimiter: null,

        /**
         * The line delimiter in the exported data, defaults to a newline.
         */
        lineDelimiter: '\n'

    },

    /**
     * Show a HTML table below the chart with the chart's current data.
     *
     * @sample highcharts/export-data/showtable/
     *         Show the table
     * @sample highcharts/studies/exporting-table-html
     *         Experiment with putting the table inside the subtitle to
     *         allow exporting it.
     *
     * @since    6.0.0
     * @requires modules/export-data
     */
    showTable: false,

    /**
     * Use multi level headers in data table. If [csv.columnHeaderFormatter
     * ](#exporting.csv.columnHeaderFormatter) is defined, it has to return
     * objects in order for multi level headers to work.
     *
     * @sample highcharts/export-data/multilevel-table
     *         Multiple table headers
     *
     * @since    6.0.4
     * @requires modules/export-data
     */
    useMultiLevelHeaders: true,

    /**
     * If using multi level table headers, use rowspans for headers that
     * have only one level.
     *
     * @sample highcharts/export-data/multilevel-table
     *         Multiple table headers
     *
     * @since    6.0.4
     * @requires modules/export-data
     */
    useRowspanHeaders: true
};

/**
 * @optionparent lang
 * @private
 */
const lang: LangOptions = {

    /**
     * The text for the menu item.
     *
     * @since    6.0.0
     * @requires modules/export-data
     */
    downloadCSV: 'Download CSV',

    /**
     * The text for the menu item.
     *
     * @since    6.0.0
     * @requires modules/export-data
     */
    downloadXLS: 'Download XLS',

    /**
     * The text for exported table.
     *
     * @since 8.1.0
     * @requires modules/export-data
     */
    exportData: {
        /**
         * The annotation column title.
         */
        annotationHeader: 'Annotations',

        /**
         * The category column title.
         */
        categoryHeader: 'Category',

        /**
         * The category column title when axis type set to "datetime".
         */
        categoryDatetimeHeader: 'DateTime'
    },

    /**
     * The text for the menu item.
     *
     * @since    6.0.0
     * @requires modules/export-data
     */
    viewData: 'View data table',
    /**
     * The text for the menu item.
     *
     * @since 8.2.0
     * @requires modules/export-data
     */
    hideData: 'Hide data table'
};

/* *
 *
 *  Default Export
 *
 * */

const ExportDataDefaults = {
    exporting,
    lang
};

export default ExportDataDefaults;

/* *
 *
 *  API Options
 *
 * */

/**
 * Callback that fires while exporting data. This allows the modification of
 * data rows before processed into the final format.
 *
 * @type      {Highcharts.ExportDataCallbackFunction}
 * @context   Highcharts.Chart
 * @requires  modules/export-data
 * @apioption chart.events.exportData
 */

/**
 * When set to `false` will prevent the series data from being included in
 * any form of data export.
 *
 * Since version 6.0.0 until 7.1.0 the option was existing undocumented
 * as `includeInCSVExport`.
 *
 * @type      {boolean}
 * @since     7.1.0
 * @requires  modules/export-data
 * @apioption plotOptions.series.includeInDataExport
 */

(''); // keep doclets above in JS file
