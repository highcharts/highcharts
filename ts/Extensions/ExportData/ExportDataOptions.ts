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

import type { Exporting } from '../Exporting/Exporting.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Exporting/ExportingOptions' {
    interface ExportMenuItemDefinitionsDefaults {
        /**
         * @requires modules/export-data
         */
        downloadCSV?: Exporting.MenuObject & {
            /**
             * @see [lang.downloadCSV](#lang.downloadCSV)
             * @default 'downloadCSV'
             */
            textKey?: Exporting.MenuObject['textKey'];
        };

        /**
         * @requires modules/export-data
         */
        downloadXLS?: Exporting.MenuObject & {
            /**
             * @see [lang.downloadXLS](#lang.downloadXLS)
             * @default 'downloadXLS'
             */
            textKey?: Exporting.MenuObject['textKey'];
        };

        /**
         * @requires modules/export-data
         */
        viewData?: Exporting.MenuObject & {
            /**
             * @see [lang.viewData](#lang.viewData)
             * @default 'viewData'
             */
            textKey?: Exporting.MenuObject['textKey'];
        };
    }
}

declare module '../Exporting/ExportingOptions' {
    interface ExportingOptions {
        /**
         * Options for exporting data to CSV or Excel, or displaying the data
         * in a HTML table or a JavaScript structure.
         *
         * This module adds data export options to the export menu and provides
         * functions like `Exporting.getCSV`, `Exporting.getTable`,
         * `Exporting.getDataRows` and `Exporting.viewData`.
         *
         * The XLS converter is limited and only creates a HTML string that is
         * passed for download, which works but creates a warning before
         * opening. The workaround for this is to use a third party XLSX
         * converter, as demonstrated in the sample below.
         *
         * @sample  highcharts/export-data/categorized/
         *          Categorized data
         * @sample  highcharts/export-data/stock-timeaxis/
         *          Highcharts Stock time axis
         * @sample  highcharts/export-data/xlsx/
         *          Using a third party XLSX converter
         *
         * @since    6.0.0
         * @requires modules/export-data
         */
        csv?: ExportingCsvOptions;

        /**
         * Display a message when export is in progress. Uses
         * [Chart.showLoading()](/class-reference/Highcharts.Chart#showLoading).
         *
         * The message can be altered by changing
         * [lang.exportInProgress](#lang.exportInProgress).
         *
         * @since    11.3.0
         * @requires modules/export-data
         */
        showExportInProgress?: boolean;

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
        showTable?: boolean;

        /**
         * Caption for the data table. Same as chart title by default. Set to
         * `false` to disable.
         *
         * @sample highcharts/export-data/multilevel-table
         *         Multiple table headers
         *
         * @type      {boolean | string}
         * @since     6.0.4
         * @requires  modules/export-data
         * @apioption exporting.tableCaption
         */
        tableCaption?: (boolean | string);

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
        useMultiLevelHeaders?: boolean;

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
        useRowspanHeaders?: boolean;
    }
}

declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * The text for the menu item.
         *
         * @since    6.0.0
         * @requires modules/export-data
         * @default 'Download CSV'
         */
        downloadCSV?: string;

        /**
         * The text for the menu item.
         *
         * @since    6.0.0
         * @requires modules/export-data
         * @default 'Download XLS'
         */
        downloadXLS?: string;

        /**
         * The text for exported table.
         *
         * @since    8.1.0
         * @requires modules/export-data
         */
        exportData?: ExportDataLangOptions;

        /**
         * The text for the menu item.
         *
         * @since    6.0.0
         * @requires modules/export-data
         * @default 'View data table'
         */
        viewData?: string;

        /**
         * The text for the menu item.
         *
         * @since    8.2.0
         * @requires modules/export-data
         * @default 'Hide data table'
         */
        hideData?: string;

        /**
         * Text to show when export is in progress.
         *
         * @since    11.3.0
         * @requires modules/export-data
         * @default 'Exporting...'
         */
        exportInProgress?: string;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        /**
         * When set to `false` will prevent the series data from being included
         * in any form of data export.
         *
         * Since version 6.0.0 until 7.1.0 the option was existing undocumented
         * as `includeInCSVExport`.
         *
         * @type      {boolean}
         * @since     7.1.0
         * @requires  modules/export-data
         * @apioption plotOptions.series.includeInDataExport
         */
        includeInDataExport?: boolean;
    }
}

export interface AnnotationInDataTableOptions {
    /**
     * The way to mark the separator for annotations
     * combined in one export-data table cell.
     *
     * @since    8.2.0
     * @requires modules/annotations
     */
    itemDelimiter?: string;

    /**
     * When several labels are assigned to a specific point,
     * they will be displayed in one field in the table.
     *
     * @sample highcharts/export-data/join-annotations/
     *         Concatenate point annotations with itemDelimiter set.
     *
     * @since    8.2.0
     * @requires modules/annotations
     */
    join?: boolean;
}

export interface ExportDataLangOptions {
    /**
     * The annotation column title.
     *
     * @default 'Annotations'
     */
    annotationHeader?: string;

    /**
     * The category column title.
     *
     * @default 'Category'
     */
    categoryHeader?: string;

    /**
     * The category column title when axis type set to "datetime".
     *
     * @default 'DateTime'
     */
    categoryDatetimeHeader?: string;
}

export interface ExportingCsvOptions {
    /**
     * Options for annotations in the export-data table.
     *
     * @since    8.2.0
     * @requires modules/export-data
     * @requires modules/annotations
     */
    annotations?: AnnotationInDataTableOptions;

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
     * @type {Function | null}
     */
    columnHeaderFormatter?: (Function | null);

    /**
     * Which date format to use for exported dates on a datetime X axis.
     * See `Highcharts.dateFormat`.
     */
    dateFormat?: string;

    /**
     * Which decimal point to use for exported CSV. Defaults to the same
     * as the browser locale, typically `.` (English) or `,` (German,
     * French etc).
     *
     * @type  {string | null}
     * @since 6.0.4
     */
    decimalPoint?: (string | null);

    /**
     * The item delimiter in the exported data. Use `;` for direct
     * exporting to Excel. Defaults to a best guess based on the browser
     * locale. If the locale _decimal point_ is `,`, the `itemDelimiter`
     * defaults to `;`, otherwise the `itemDelimiter` defaults to `,`.
     *
     * @type {string | null}
     */
    itemDelimiter?: (string | null);

    /**
     * The line delimiter in the exported data, defaults to a newline.
     */
    lineDelimiter?: string;
}
