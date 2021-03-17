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

        this.init();
    }

    /* *
    *
    *  Properties
    *
    * */
    public resizeOptions: Resizer.Options;
    public layout: Layout;
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

    public addSnap(
        column: Resizer.ResizedColumn,
        snapParams: Resizer.SnapParams
        // snapOptions: Resizer.SnapOptions
    ): void {

        column.resizer = this.createHandlers(
            column,
            snapParams
        );

        // add mouse down event
        
        // add mouse move event

        // add mouse up event
    }
    /**
     * Create HTML snap elements
     */
    public createHandlers(
        column: Resizer.ResizedColumn,
        snapParams: Resizer.SnapParams
    ): Resizer.Snap {
        let resizerHandlers = {} as Resizer.Snap;

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
        resizer?: Resizer.Snap
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

