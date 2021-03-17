import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type Column from '../Layout/Column.js';
import type Layout from '../Layout/Layout.js';
import Dashboard from '../Dashboard.js';

import U from '../../Core/Utilities.js';

const {
    merge,
    addEvent,
    createElement
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
            rows: true
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
        this.isGrabbed = false;
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
    public isGrabbed: boolean;
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
                    this.addSnap(
                        columns[j],
                        {
                            isFirst: j === 0, // is first
                            isLast: j === columns.length - 1 // is last
                        }
                    );
                }
            }
        }
    }
    /**
     * Add Snap - create handlers and add events.
     */
    public addSnap(
        column: Resizer.ResizedColumn,
        snapParams: Resizer.SnapParams
    ): void {

        column.resizer = this.createHandlers(
            column,
            snapParams
        );

        // left handler
        /*this.addResizeEvents(
            column.resizer.leftHandler,
            column
        );*/

        // right handler
        this.addResizeEvents(
            column.resizer.rightHandler,
            column
        );

    }
    /**
     * Create HTML snap elements
     */
    public createHandlers(
        column: Resizer.ResizedColumn,
        snapParams: Resizer.SnapParams
    ): Resizer.Snap {
        const resizerHandlers = {} as Resizer.Snap;

        // generate HTML snap element
        // left handler
        if (!snapParams.isFirst) {
            resizerHandlers.leftHandler = createElement(
                'div',
                {
                    className: Dashboard.prefix + 'resize-handler ' +
                    Dashboard.prefix + 'resize-handler-left'
                },
                {},
                column.container
            );
        }
        // right handler
        if (!snapParams.isLast) {
            resizerHandlers.rightHandler = createElement(
                'div',
                {
                    className: Dashboard.prefix + 'resize-handler'
                },
                {},
                column.container
            );
        }

        return resizerHandlers;
    }
    /**
     * Add events
     */
    public addResizeEvents(
        handler: HTMLDOMElement|undefined,
        column: Resizer.ResizedColumn
    ): void {
        const resizer = this;

        let mouseDownHandler,
            mouseMoveHandler,
            mouseUpHandler;

        resizer.mouseDownHandler = mouseDownHandler = function (
            e: PointerEvent
        ): void {
            resizer.isGrabbed = true;
        };

        resizer.mouseMoveHandler = mouseMoveHandler = function (
            e: PointerEvent
        ): void {
            resizer.onMouseMove(
                resizer.isGrabbed,
                e as PointerEvent,
                column
            );
        };

        resizer.mouseUpHandler = mouseUpHandler = function (
            e: PointerEvent
        ): void {
            resizer.isGrabbed = false;
        };

        if (handler) {
            // Add mouse events
            resizer.eventsToUnbind?.push(
                addEvent(handler, 'mousedown', mouseDownHandler),
                addEvent(
                    column.row?.container,
                    'mousemove',
                    mouseMoveHandler
                ),
                addEvent(handler, 'mouseup', mouseUpHandler)
            );

            // Touch events
            if (hasTouch) {
                resizer.eventsToUnbind?.push(
                    addEvent(handler, 'touchstart', mouseDownHandler),
                    addEvent(
                        column.row?.container,
                        'touchmove',
                        mouseMoveHandler
                    ),
                    addEvent(handler, 'touchend', mouseUpHandler)
                );
            }
        }
    }
    /**
     * Mouse move function
     */
    public onMouseMove(
        isGrabbed: boolean,
        e: PointerEvent,
        column: Resizer.ResizedColumn
    ): void {

        if (isGrabbed && column.container) {
            // update size
            const parentContainerWidth =
                (column.container.parentNode as HTMLDOMElement).offsetWidth;

            column.container.style.width =
                (
                    (
                        (e.clientX - column.container.offsetLeft) /
                        parentContainerWidth
                    ) * 100
                ) + '%';
            column.container.style.flex = 'none';

            // call component redraw
            column.mountedComponent?.redraw();
        }
    }

    /**
     * Destroy Resizer
     */
    public destroy(): void {
        // @TODO destroy HTML elements
        /*
        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

        }
        */

        // unbind events
        if (this.eventsToUnbind) {
            // @TODO replace forEach with more efficient way
            this.eventsToUnbind.forEach(function (unbind: Function): void {
                unbind();
            });
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
        resize: ResizeOptions;
    }

    export interface ResizeOptions {
        columns: boolean;
        rows: boolean;
    }

    export interface ResizedColumn extends Column {
        resizer?: Resizer.Snap;
    }

    export interface Snap {
        leftHandler: HTMLDOMElement|undefined;
        rightHandler: HTMLDOMElement|undefined;
    }

    export interface SnapParams {
        isFirst: boolean;
        isLast: boolean;
    }
}

export default Resizer;
