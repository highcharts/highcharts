/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
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

import type DataEventEmitter from '../DataEventEmitter';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import DataJSON from '../DataJSON.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import AST from '../../Core/Renderer/HTML/AST.js';
import H from '../../Core/Globals.js';
const { win } = H;
import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import U from '../../Core/Utilities.js';
const { merge, objectEach, extend, pick, createElement } = U;

/** eslint-disable valid-jsdoc */

/**
 * Class that handles creating a datastore from an HTML table
 *
 * @private
 */
class HTMLTableStore extends DataStore<HTMLTableStore.Event> implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: HTMLTableStore.Options = {
        table: ''
    };

    static readonly defaultExportOptions: HTMLTableStore.ExportOptions = {
        decimalPoint: null,
        exportIDColumn: false,
        useRowspanHeaders: true,
        useMultiLevelHeaders: true,
        usePresentationOrder: true
    }
    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates an HTMLTableStore from ClassJSON
     *
     * @param {HTMLTableStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {HTMLTableStore}
     * HTMLTableStore from the ClassJSON
     */
    public static fromJSON(json: HTMLTableStore.ClassJSON): HTMLTableStore {
        const options = json.options,
            parser = HTMLTableParser.fromJSON(json.parser),
            table = DataTable.fromJSON(json.table),
            store = new HTMLTableStore(table, options, parser);

        store.metadata = merge(json.metadata);

        return store;
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Constructs an instance of HTMLTableDataStore
     *
     * @param {DataTable} table
     * Optional table to create the store from
     *
     * @param {HTMLTableStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: HTMLTableStore.OptionsType = {},
        parser?: HTMLTableParser
    ) {
        super(table);

        this.tableElement = null;


        this.options = merge(HTMLTableStore.defaultOptions, options);
        this.parserOptions = this.options;
        this.parser = parser || new HTMLTableParser(this.options, this.tableElement);
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Options for the HTMLTable datastore
     * @todo this should not include parsing options
     */
    public readonly options: (HTMLTableStore.Options & HTMLTableParser.OptionsType);

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: HTMLTableParser;

    /**
     * The table element to create the store from.
     * Is either supplied directly or is fetched by an ID.
     */
    public tableElement: (HTMLElement | null);

    public tableID?: string;

    /**
     * The options that were passed to the parser.
     */
    private parserOptions: HTMLTableParser.OptionsType;

    /**
     * Handles retrieving the HTML table by ID if an ID is provided
     */
    private fetchTable(): void {
        const store = this,
            { table: tableHTML } = store.options;

        let tableElement: (HTMLElement | null);

        if (typeof tableHTML === 'string') {
            store.tableID = tableHTML;
            tableElement = win.document.getElementById(tableHTML);
        } else {
            tableElement = tableHTML;
            store.tableID = tableElement.id;
        }

        store.tableElement = tableElement;
    }

    /**
     * Initiates creating the datastore from the HTML table
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits HTMLTableDataStore#load
     * @emits HTMLTableDataStore#afterLoad
     * @emits HTMLTableDataStore#loadError
     */
    public load(eventDetail?: DataEventEmitter.EventDetail): void {
        const store = this;

        store.fetchTable();

        // If already loaded, clear the current rows
        store.table.deleteColumns();

        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });

        if (!store.tableElement) {
            store.emit({
                type: 'loadError',
                detail: eventDetail,
                error: 'HTML table not provided, or element with ID not found',
                table: store.table
            });
            return;
        }

        store.parser.parse(
            merge({ tableHTML: store.tableElement }, store.options),
            eventDetail
        );

        store.table.setColumns(store.parser.getTable().getColumns());

        store.emit({
            type: 'afterLoad',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });
    }

    /**
     * Creates an HTML table from the datatable on the store instance.
     *
     * @param {HTMLTableStore.ExportOptions} [exportOptions]
     * Options used for exporting.
     *
     * @return {string}
     * The HTML table.
     */
    public getTableAST(
        exportOptions: HTMLTableStore.ExportOptions = {}
    ): AST.Node {

        // Merge in the provided parser options
        objectEach(this.parserOptions, function (value, key): void {
            if (key in exportOptions) {
                exportOptions[key] = value;
            }
        });

        const treeChildren: AST.Node[] = [];
        const options = exportOptions,
            decimalPoint = options.useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.',
            exportNames = (this.parserOptions.firstRowAsNames !== false),
            useMultiLevelHeaders = options.useMultiLevelHeaders,
            useRowspanHeaders = options.useRowspanHeaders;

        const isRowEqual = function (
            row1: Array<(number | string | undefined)>,
            row2: Array<(number | string | undefined)>
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
        };

        // Get table header markup from row data
        const getTableHeaderHTML = function (
            topheaders: (Array<(number|string)>|null|undefined),
            subheaders: Array<(number|string | undefined)>,
            rowLength?: number
        ): AST.Node {
            const theadChildren: AST.Node[] = [];

            let i = 0,
                len = rowLength || subheaders && subheaders.length,
                next,
                cur,
                curColspan = 0,
                rowspan;

            // Clean up multiple table headers. Chart.getDataRows() returns two
            // levels of headers when using multilevel, not merged. We need to
            // merge identical headers, remove redundant headers, and keep it
            // all marked up nicely.
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
                            if (useRowspanHeaders) {
                                rowspan = 2;
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

            // Add the subheaders (the only headers if not using multilevels)
            if (subheaders) {
                const trChildren = [];

                for (i = 0, len = subheaders.length; i < len; ++i) {
                    const subheader = subheaders[i];
                    if (typeof subheader !== 'undefined') {
                        trChildren.push(
                            getCellHTMLFromValue(
                                'th', null, { scope: 'col' }, subheader
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

        const getCellHTMLFromValue = function (
            tagName: string,
            classes: (string|null),
            attributes: HTMLAttributes & SVGAttributes,
            value: (number|string)
        ): AST.Node {
            let textContent = pick(value, ''),
                className = 'text' + (classes ? ' ' + classes : '');

            // Convert to string if number
            if (typeof textContent === 'number') {
                textContent = textContent.toString();
                if (decimalPoint === ',') {
                    textContent = textContent.replace('.', decimalPoint);
                }
                className = 'number';
            } else if (!value) {
                className = 'empty';
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
        };

        const {
            columnNames,
            columnValues
        } = this.getColumnsForExport(options.usePresentationOrder);
        const columnsCount = columnNames.length;

        const rowArray: AST.Node[][] = [];

        // Add table caption
        // Current exportdata falls back to chart title
        // but that should probably be handled in the export module
        if (options.tableCaption) {
            treeChildren.push({
                tagName: 'caption',
                attributes: {
                    'class': 'highcharts-table-caption'
                },
                textContent: options.tableCaption
            });
        }
        // Add the names as the first row if they should be exported
        if (exportNames) {
            const subcategories: (string | number)[] = [];

            // If using multilevel headers, the first value
            // of each column is a subcategory
            if (useMultiLevelHeaders) {
                columnValues.forEach((column): void => {
                    const subhead = (column.shift() || '').toString();
                    subcategories.push(subhead);
                });

                treeChildren.push(getTableHeaderHTML(columnNames, subcategories));
            } else {
                treeChildren.push(getTableHeaderHTML(null, columnNames));
            }
        }

        const astRows = [];
        let longestColumn = 0;
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const columnName = columnNames[columnIndex],
                column = columnValues[columnIndex],
                columnLength = column.length;

            if (columnLength > longestColumn) {
                longestColumn = columnLength;
            }


            const columnMeta = this.whatIs(columnName);
            let columnDataType;

            if (columnMeta) {
                columnDataType = columnMeta.dataType;
            }

            for (let rowIndex = 0; rowIndex < longestColumn; rowIndex++) {
                let cellValue = column[rowIndex];

                if (!rowArray[rowIndex]) {
                    rowArray[rowIndex] = [];
                }

                // Handle datatype
                // if(columnDataType && typeof cellValue !== columnDataType) {
                //     do something?
                // }
                if (
                    !(
                        typeof cellValue === 'string' ||
                        typeof cellValue === 'number' ||
                        typeof cellValue === 'undefined'
                    )
                ) {
                    cellValue = (cellValue || '').toString();
                }

                rowArray[rowIndex][columnIndex] = getCellHTMLFromValue(
                    columnIndex ? 'td' : 'th',
                    null,
                    columnIndex ? {} : { scope: 'row' },
                    cellValue !== void 0 ? cellValue : ''
                );

                // On the final column, push the row to the array
                if (columnIndex === columnsCount - 1) {
                    astRows.push({
                        tagName: 'tr',
                        children: rowArray[rowIndex]
                    });
                }
            }
        }

        treeChildren.push({
            tagName: 'tbody',
            children: astRows
        });

        const tree = {
            tagName: 'table',
            children: treeChildren
        };
        // Add table caption
        // Current exportdata falls back to chart title
        // but that should probably be handled elsewhere?
        // if (options.tableCaption) {
        //     caption = '<caption class="highcharts-table-caption">' +
        //         options.tableCaption +
        //         '</caption>';
        // }

        return tree;
    }

    /**
     * Exports the datastore as an HTML string, using the options
     * provided on import unless other options are provided.
     *
     * @param {HTMLTableStore.ExportOptions} [htmlExportOptions]
     * Options that override default or existing export options.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {string}
     * HTML from the current dataTable.
     *
     */
    public save(
        htmlExportOptions: Partial<HTMLTableStore.ExportOptions>,
        eventDetail?: DataEventEmitter.EventDetail
    ): string | AST.Node {
        const exportOptions = HTMLTableStore.defaultExportOptions;

        const element = createElement('div');

        const nodes = [this.getTableAST(merge(exportOptions, htmlExportOptions))];
        (new AST(nodes)).addToDOM(element);
        return element.innerHTML;
    }

    /**
     * Converts the store to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this store.
     */
    public toJSON(): HTMLTableStore.ClassJSON {
        const store = this,
            json: HTMLTableStore.ClassJSON = {
                $class: 'HTMLTableStore',
                metadata: merge(store.metadata),
                options: merge(this.options),
                parser: store.parser.toJSON(),
                table: store.table.toJSON(),
                tableElementID: store.tableID || ''
            };

        return json;
    }
}


/**
 *
 *  Namespace
 *
 */

/**
 * Types for class-specific options and events
 */
namespace HTMLTableStore {

    /**
     * Type for event object fired from HTMLTableDataStore
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * Options used in the constructor of HTMLTableDataStore
     */
    export type OptionsType = Partial<(HTMLTableStore.Options & HTMLTableParser.OptionsType)>

    /**
     * The ClassJSON used to import/export HTMLTableDataStore
     */
    export interface ClassJSON extends DataStore.ClassJSON {
        options: HTMLTableStore.OptionsType;
        parser: HTMLTableParser.ClassJSON;
        tableElementID: string;
    }

    /**
     * Options for exporting the store as an HTML table
     */
    export interface ExportOptions extends Record<string, unknown> {
        decimalPoint?: string | null;
        exportIDColumn?: boolean;
        tableCaption?: string;
        useLocalDecimalPoint?: boolean;
        useMultiLevelHeaders?: boolean;
        useRowspanHeaders?: boolean;
        usePresentationOrder?: boolean;
    }

    /**
     * Provided event object on errors within HTMLTableDataStore
     */
    export interface ErrorEvent extends DataStore.Event {
        type: 'loadError';
        error: (string | Error);
    }

    /**
     * Provided event object on load events within HTMLTableDataStore
     */
    export interface LoadEvent extends DataStore.Event {
        type: ('load' | 'afterLoad');
        tableElement?: (HTMLElement | null);
    }

    /**
     * Internal options for the HTMLTableDataStore class
     */
    export interface Options {
        table: (string | HTMLElement);
    }

}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(HTMLTableStore);
DataStore.addStore(HTMLTableStore);

declare module './StoreType' {
    interface StoreTypeRegistry {
        HTMLTable: typeof HTMLTableStore;
    }
}

/* *
 *
 *  Export
 *
 * */

export default HTMLTableStore;
