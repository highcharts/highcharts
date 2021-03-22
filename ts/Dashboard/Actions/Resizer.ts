import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
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
    pick
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
    protected static readonly defaultOptions: Resizer.Options = {
        resize: {
            columns: true,
            rows: true,
            snap: {
                width: 20
            }
        }
    };

    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        layout: Layout
    ) {
        this.resizeOptions = merge(
            {},
            Resizer.defaultOptions,
            layout.options.resize
        );

        this.layout = layout;
        this.parentColumn = void 0;
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
    public parentColumn: Column|undefined;
    public eventsToUnbind?: Array<Function>
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
                    if (j < columns.length - 1) {
                        this.addSnap(
                            columns[j]
                        );
                    }
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
     */
    public addSnap(
        column: Resizer.ResizedColumn
    ): void {

        const snapWidth = this.resizeOptions.resize.snap.width;

        column.resizer = {} as Resizer.Snap;

        // create HTML handler
        if (column.container) {
            column.resizer.handler = createElement(
                'div',
                {
                    className: Dashboard.prefix + 'resize-handler'
                },
                {
                    width: snapWidth + 'px',
                    right: (
                        -(snapWidth / 2) +
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
        const handler = column.resizer?.handler;
        const rowContainer =
            column.row?.container as Resizer.HTMLDOMElementEvents;

        let mouseDownHandler,
            mouseMoveHandler,
            mouseUpHandler;

        resizer.mouseDownHandler = mouseDownHandler = function (
            e: PointerEvent
        ): void {
            resizer.parentColumn = column;
        };

        resizer.mouseMoveHandler = mouseMoveHandler = function (
            e: PointerEvent
        ): void {
            resizer.onMouseMove(
                resizer.parentColumn,
                e as PointerEvent
            );
        };

        resizer.mouseUpHandler = mouseUpHandler = function (
            e: PointerEvent
        ): void {
            resizer.parentColumn = void 0;
        };

        // Add mouse events
        resizer.eventsToUnbind?.push(
            addEvent(handler, 'mousedown', mouseDownHandler),
        );

        if (!rowContainer.hcEvents.mousemove) {
            resizer.eventsToUnbind?.push(
                addEvent(rowContainer, 'mousemove', mouseMoveHandler),
                addEvent(rowContainer, 'mouseup', mouseUpHandler)
            );
        }

        // Touch events
        if (hasTouch) {
            resizer.eventsToUnbind?.push(
                addEvent(handler, 'touchstart', mouseDownHandler)
            );

            if (!rowContainer.hcEvents.mousemove) {
                resizer.eventsToUnbind?.push(
                    addEvent(rowContainer, 'touchmove', mouseMoveHandler),
                    addEvent(rowContainer, 'touchend', mouseUpHandler)
                );
            }
        }
    }
    /**
     * Mouse move function
     *
     * @param {boolean} parentColumn
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
        parentColumn: Column|undefined,
        e: PointerEvent
    ): void {

        const colDiv = parentColumn && parentColumn.container;

        if (parentColumn && colDiv) {
            const parentRow = (colDiv.parentNode as HTMLDOMElement);
            const parentRowWidth = parentRow.offsetWidth;

            colDiv.style.width =
                Math.min(
                    (
                        (
                            e.clientX -
                            colDiv.getBoundingClientRect().left
                        ) / parentRowWidth
                    ) * 100,
                    // 100% - (xcolumns * min-width) 
                    100 - (
                        parentRow.childNodes.length *
                        (
                            (getStyle(colDiv, 'min-width', true) as number)
                            /*
                            (getStyle(colDiv, 'padding-left', true) as number) +
                            (getStyle(colDiv, 'padding-right', true) as number) +
                            (getStyle(colDiv, 'margin-right', true) as number) +
                            (getStyle(colDiv, 'margin-left', true) as number)
                            */
                        )
                    )
                ) + '%';

            colDiv.style.flex = 'none';

            // call component redraw
            parentColumn.mountedComponent?.redraw();
        }
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
                } else {
                    currentColumn.resizer?.handler?.remove();
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
        resize: Resizer.ResizeOptions;
    }

    export interface ResizeOptions {
        columns: boolean;
        rows: boolean;
        snap: SnapOptions;
    }

    export interface ResizedColumn extends Column {
        resizer?: Snap;
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
}

export default Resizer;
