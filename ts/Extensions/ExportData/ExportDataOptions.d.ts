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

/* *
 *
 *  Declarations
 *
 * */

declare module '../Exporting/ExportingOptions' {
    interface ExportingOptions {
        csv?: ExportingCsvOptions;
        showTable?: boolean;
        tableCaption?: (boolean|string);
    }
}

declare module '../../Core/Options' {
    interface LangOptions {
        downloadCSV?: string;
        downloadXLS?: string;
        exportData?: ExportDataLangOptions;
        viewData?: string;
        hideData?: string;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        includeInDataExport?: boolean;
    }
}

export interface AnnotationInDataTableOptions {
    itemDelimiter?: string;
    join?: boolean;
}

export interface ExportDataLangOptions {
    annotationHeader?: string;
    categoryHeader?: string;
    categoryDatetimeHeader?: string;
}

export interface ExportDataOptions {
    exporting: ExportingOptions;
    lang: LangOptions;
}

export interface ExportingCsvOptions {
    annotations?: AnnotationInDataTableOptions;
    columnHeaderFormatter?: (Function|null);
    dateFormat?: string;
    decimalPoint?: (string|null);
    itemDelimiter?: (string|null);
    lineDelimiter?: string;
}

export interface ExportingOptions {
    csv?: ExportingCsvOptions;
    showTable?: boolean;
    tableCaption?: (boolean|string);
    useMultiLevelHeaders?: boolean;
    useRowspanHeaders?: boolean;
}

export interface LangOptions {
    downloadCSV?: string;
    downloadXLS?: string;
    exportData?: ExportDataLangOptions;
    viewData?: string;
    hideData?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ExportDataOptions;
