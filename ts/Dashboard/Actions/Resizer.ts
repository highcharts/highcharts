import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type DataJSON from '../../Data/DataJSON';
import type Column from '../Layout/Column.js';
import type Row from '../Layout/Row.js';
import type Layout from '../Layout/Layout.js';
import Dashboard from '../Dashboard.js';

import U from '../../Core/Utilities.js';

const {
    merge,
    addEvent,
    createElement,
    getStyle,
    pick,
    fireEvent
} = U;

import H from '../../Core/Globals.js';

const {
    hasTouch
} = H;

class Resizer {
    /* *
    *
    *  Static Properties
    *
    * */
    public static fromJSON(
        layout: Layout,
        json: Resizer.ClassJSON
    ): Resizer|undefined {
        return new Resizer(layout, json.options);
    }

    protected static readonly defaultOptions: Resizer.Options = {
        columns: {
            enabled: true,
            minSize: 50
        },
        rows: {
            enabled: true,
            minSize: 50
        },
        snap: {
            width: 20
        }
    };

    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        layout: Layout,
        options?: Resizer.Options
    ) {
        this.resizeOptions = merge(
            {},
            Resizer.defaultOptions,
            layout.options.resize,
            options
        );

        this.layout = layout;
        this.currentColumn = void 0; // consider naming for example currentColumn
        this.eventsToUnbind = [];

        this.init();
    }

    /* *
    *
    *  Properties
    *
    * */
    public resizeOptions: Resizer.Options;
    public layout: Layout;
    public currentColumn: Column|undefined;
    public eventsToUnbind: Array<Function>

    /* *
     *
     *  Functions
     *
     * */
    public init(): void {
        const rows = this.layout.rows;

        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

            const columns = rows && rows[i].columns;

            if (columns) {
                for (let j = 0, jEnd = columns.length; j < jEnd; ++j) {
                    // set min-size
                    (columns[j].container as HTMLElement).style.minWidth =
                        this.resizeOptions.columns.minSize + 'px';

                    this.addSnap(
                        columns[j],
                        this.resizeOptions.columns.minSize
                    );
                }
            }
        }
    }
    /**
     * Add Snap - create handlers and add events.
     *
     * @param {Resizer.ResizedColumn} column
     * Reference to column
     *
     * @param {number} minSize
     * Minimum width of column
     *
     */
    public addSnap(
        column: Resizer.ResizedColumn,
        minSize: number
    ): void {
        const snapWidth = this.resizeOptions.snap.width;

        column.resizer = {} as Resizer.Snap;
        column.styles = {} as Resizer.ColumnStyles;

        if (column.container) {

            // create HTML handler
            column.resizer.handler = createElement(
                'div',
                {
                    className: Dashboard.prefix + 'resize-handler'
                },
                {
                    width: snapWidth + 'px',
                    right: (
                        -(snapWidth / 2) -
                        (
                            getStyle(
                                column.container,
                                'border',
                                true
                            ) as number
                        )
                    ) + 'px'
                },
                column.container
            );

            column.styles.borderLeft =
                (getStyle(column.container, 'border-left', true) as number);
            column.styles.borderRight =
                (getStyle(column.container, 'border-right', true) as number);
            column.styles.minSize = minSize;

            // attach events
            this.addResizeEvents(
                column
            );
        }
    }
    /**
     * Add events
     *
     * @param {Resizer.ResizedColumn} column
     * Reference to column
     *
     */
    public addResizeEvents(
        column: Resizer.ResizedColumn
    ): void {
        const resizer = this;
        const handler = column.resizer && column.resizer.handler;
        const rowContainer = column.row &&
            column.row.container as Resizer.HTMLDOMElementEvents;

        let mouseDownHandler,
            mouseMoveHandler,
            mouseUpHandler;

        resizer.mouseDownHandler = mouseDownHandler = function (
            e: PointerEvent
        ): void {
            resizer.currentColumn = column;
        };

        resizer.mouseMoveHandler = mouseMoveHandler = function (
            e: PointerEvent
        ): void {
            resizer.onMouseMove(
                resizer.currentColumn,
                e as PointerEvent
            );
        };

        resizer.mouseUpHandler = mouseUpHandler = function (
            e: PointerEvent
        ): void {
            resizer.currentColumn = void 0;
        };

        // Add mouse events
        resizer.eventsToUnbind.push(
            addEvent(handler, 'mousedown', mouseDownHandler)
        );

        if (!rowContainer.hcEvents.mousemove) {
            resizer.eventsToUnbind.push(
                addEvent(rowContainer, 'mousemove', mouseMoveHandler),
                addEvent(rowContainer, 'mouseup', mouseUpHandler)
            );
        }

        // Touch events
        if (hasTouch) {
            resizer.eventsToUnbind.push(
                addEvent(handler, 'touchstart', mouseDownHandler)
            );

            if (!rowContainer.hcEvents.mousemove) {
                resizer.eventsToUnbind.push(
                    addEvent(rowContainer, 'touchmove', mouseMoveHandler),
                    addEvent(rowContainer, 'touchend', mouseUpHandler)
                );
            }
        }
    }
    /**
     * Mouse move function
     *
     * @param {boolean} currentColumn
     * Flag determinates allowance to grab or not
     *
     * @param {global.Event} e
     * A mouse event.
     *
     * @param {Resizer.ResizedColumn} column
     * Reference to column
     *
     */
    public onMouseMove(
        currentColumn: Resizer.ResizedColumn|undefined,
        e: PointerEvent
    ): void {
        const columnContainer = currentColumn && currentColumn.container;

        if (currentColumn && columnContainer) {
            const parentRow = (columnContainer.parentNode as HTMLDOMElement);
            const parentRowWidth = parentRow.offsetWidth;

            columnContainer.style.width =
                (
                    Math.min(
                        // diff
                        e.clientX - columnContainer.getBoundingClientRect().left,
                        // maxSize
                        parentRowWidth - (
                            this.sumColumnOuterWidth(
                                currentColumn.row,
                                currentColumn
                            ) || 0
                        )
                    ) / parentRowWidth
                ) * 100 + '%';

            columnContainer.style.flex = 'none';

            // call component resize
            if (currentColumn.mountedComponent) {
                currentColumn.mountedComponent.resize(null);
            }
        }
    }
    /**
     * Sum min width and current width of columns in the row.
     *
     * @param {Row} row
     * Row contains columns
     *
     * @param {column} column
     * Optional parameter, the column which is resized and should be excluded
     * in calculations. In case of nested layouts, we calculate all columns.
     *
     * @return {number}
     * Sum
     */
    public sumColumnOuterWidth(
        row: Row,
        column?: Column
    ): number {

        // const convertToPercent = this.convertToPercent;
        const columnContainer = column && column.container as HTMLElement;
        const parentRowWidth = row.container && row.container.offsetWidth;
        const columns = row.columns;

        let sum = 0;
        let rowColumn;
        let rowColumnContainer;

        for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {

            rowColumn = columns[i] as Resizer.ResizedColumn;
            rowColumnContainer = rowColumn.container as HTMLDOMElement;

            if (rowColumnContainer !== columnContainer) {

                // find all columns in nested layout to calculate
                // min-width / width each of them
                if (columns[i].layout) {

                    const columnRows = columns[i].layout.rows;

                    let maxRow = row;
                    let maxColumns = 0;

                    // find a row with maximum columns
                    for (let j = 0, jEnd = columnRows.length; j < jEnd; ++j) {
                        if (columnRows[j].columns.length > maxColumns) {
                            maxColumns = columnRows[j].columns.length;
                            maxRow = columnRows[j];
                        }
                    }

                    // call reccurent calculation of columns (nested layouts)
                    if (maxRow) {
                        sum = this.sumColumnOuterWidth(
                            maxRow,
                            void 0
                        );
                    }
                } else {
                    const columnStylesWidth = (
                        // convert % to px
                        parseFloat(
                            rowColumnContainer.style.getPropertyValue('width')
                        ) / 100
                    ) * (parentRowWidth || 1);

                    // add borders width
                    if (rowColumn.styles) {
                        sum += (
                            (rowColumn.styles.borderLeft || 0) +
                            (rowColumn.styles.borderRight || 0)
                        );

                        // add min-size if "resized" width does not exist or is
                        // bigger then width
                        const minSize = rowColumn.styles.minSize || 0;

                        sum += (
                            columnStylesWidth && columnStylesWidth > minSize ?
                                columnStylesWidth : minSize
                        );
                    }
                }
            }
        }

        return sum;
    }
    /**
     * Destroy Resizer
     */
    public destroy(): void {

        this.destroyHandler(this.layout.rows);

        // unbind events
        if (this.eventsToUnbind) {

            for (let i = 0, iEnd = this.eventsToUnbind.length; i < iEnd; ++i) {
                this.eventsToUnbind[i](); // unbind
                delete this.eventsToUnbind[i];
            }
        }
    }

    /**
     * Destroy HTML handlers elements
     *
     * @param {Array<Row>} rows
     * Reference to rows in the layout
     *
     */
    public destroyHandler(
        rows: Array<Row>
    ): void {
        const resizer = this;
        let currentColumn: Resizer.ResizedColumn;

        // loop over rows
        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

            // loop over columns
            for (let j = 0, jEnd = rows[i].columns.length; j < jEnd; ++j) {

                currentColumn = rows[i].columns[j];

                // run reccurent if nested layouts
                if (currentColumn.layout) {
                    resizer.destroyHandler(
                        currentColumn.layout.rows
                    );
                } else if (
                    currentColumn.resizer &&
                    currentColumn.resizer.handler
                ) {
                    currentColumn.resizer.handler.remove();
                }
            }
        }
    }

    public toJSON(): Resizer.ClassJSON {
        const resizeOptions = this.resizeOptions;

        return {
            $class: 'Resizer',
            options: {
                columns: {
                    enabled: resizeOptions.columns.enabled,
                    minSize: resizeOptions.columns.minSize
                },
                rows: {
                    enabled: resizeOptions.rows.enabled,
                    minSize: resizeOptions.rows.minSize
                },
                snap: {
                    width: resizeOptions.snap.width
                }
            }
        }
    }
}
interface Resizer {
    mouseDownHandler?: Function;
    mouseMoveHandler?: Function;
    mouseUpHandler?: Function;
}
namespace Resizer {
    export interface Options {
        columns: ColumnsRowsOptions;
        rows: ColumnsRowsOptions;
        snap: SnapOptions;
    }
    export interface ColumnsRowsOptions {
        enabled: boolean;
        minSize: number;
    }

    export interface ResizedColumn extends Column {
        resizer?: Snap;
        styles?: ColumnStyles;
    }

    export interface ColumnStyles {
        borderLeft?: number;
        borderRight?: number;
        minSize?: number;
    }
    export interface Snap {
        handler: HTMLDOMElement|undefined;
    }

    export interface SnapOptions {
        width: number;
    }

    export interface HTMLDOMElementEvents extends HTMLDOMElement {
        hcEvents: Record<string, Array<Highcharts.EventWrapperObject<HTMLDOMElement>>>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        columns: ColumnsRowsOptionsJSON;
        rows: ColumnsRowsOptionsJSON;
        snap: SnapJSON;
    }

    export interface ColumnsRowsOptionsJSON extends DataJSON.JSONObject {
        enabled: boolean;
        minSize: number;
    }

    export interface SnapJSON extends DataJSON.JSONObject {
        width: number;
    }
}

export default Resizer;
