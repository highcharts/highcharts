import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type DataJSON from '../../Data/DataJSON';
import type Cell from '../Layout/Cell.js';
import type Row from '../Layout/Row.js';
import type Layout from '../Layout/Layout.js';
import EditGlobals from '../EditMode/EditGlobals.js';

import U from '../../Core/Utilities.js';

const {
    merge,
    addEvent,
    createElement,
    getStyle,
    removeEvent
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
        cells: {
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
        this.currentCell = void 0; // consider naming for example currentCell

        this.init();
    }

    /* *
    *
    *  Properties
    *
    * */
    public resizeOptions: Resizer.Options;
    public layout: Layout;
    public currentCell: Cell|undefined;

    /* *
     *
     *  Functions
     *
     * */
    public init(): void {
        const rows = this.layout.rows;

        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

            const cells = rows && rows[i].cells;

            if (cells) {
                for (let j = 0, jEnd = cells.length; j < jEnd; ++j) {
                    // set min-size
                    (cells[j].container as HTMLElement).style.minWidth =
                        this.resizeOptions.cells.minSize + 'px';

                    this.addSnap(
                        cells[j],
                        this.resizeOptions.cells.minSize,
                        true
                    );
                }
            }

            // add row snap
            this.addSnap(
                rows[i],
                this.resizeOptions.rows.minSize
            );
        }
    }
    /**
     * Add Snap - create snapXs and add events.
     *
     * @param {Resizer.ResizedCell} element
     * Reference to cell
     *
     * @param {number} minSize
     * Minimum width of cell
     *
     * @param {boolean} isX
     * Optional parameter defines if its cell or row resizer
     *
     */
    public addSnap(
        element: Resizer.ResizedCell|Resizer.ResizedRow,
        minSize: number,
        isX?: boolean
    ): void {
        const snapWidth = this.resizeOptions.snap.width;

        element.resizer = {} as Resizer.Snap;
        element.styles = {} as Resizer.ElementStyles;

        if (element.container) {
            let attribs = {};

            // create HTML snap attribs
            if (isX) {
                attribs = {
                    width: snapWidth + 'px',
                    right: (
                        -(snapWidth / 2) -
                        (
                            getStyle(
                                element.container,
                                'border',
                                true
                            ) as number
                        )
                    ) + 'px'
                };
            } else {
                attribs = {
                    height: snapWidth + 'px',
                    bottom: -(snapWidth / 2) + 'px'
                };
            }

            // create HTML snapX
            element.resizer.snap = createElement(
                'div',
                {
                    className: EditGlobals.classNames.resizeSnap + ' ' +
                    EditGlobals.classNames[isX ? 'resizeSnapX' : 'resizeSnapY']
                },
                attribs,
                element.container
            );

            element.styles.borderLeft =
                (getStyle(element.container, 'border-left', true) as number);
            element.styles.borderRight =
                (getStyle(element.container, 'border-right', true) as number);
            element.styles.minSize = minSize;

            // attach events
            if (isX) {
                this.addResizeEvents(
                    element as Resizer.ResizedCell
                );
            }
        }
    }
    /**
     * Add events
     *
     * @param {Resizer.ResizedCell} element
     * Reference to cell
     *
     */
    public addResizeEvents(
        element: Resizer.ResizedCell
    ): void {
        const resizer = this;
        const snapX = element.resizer && element.resizer.snap;
        const rowContainer = element.row &&
        element.row.container as Resizer.HTMLDOMElementEvents;

        let mouseDownsnapX,
            mouseMovesnapX,
            mouseUpsnapX;

        resizer.mouseDownsnapX = mouseDownsnapX = function (
            e: PointerEvent
        ): void {
            resizer.currentCell = element;
        };

        resizer.mouseMovesnapX = mouseMovesnapX = function (
            e: PointerEvent
        ): void {
            resizer.onMouseMove(
                resizer.currentCell,
                e as PointerEvent
            );
        };

        resizer.mouseUpsnapX = mouseUpsnapX = function (
            e: PointerEvent
        ): void {
            resizer.currentCell = void 0;
        };

        // Add mouse events
        addEvent(snapX, 'mousedown', mouseDownsnapX);

        if (!rowContainer.hcEvents.mousemove) {
            addEvent(rowContainer, 'mousemove', mouseMovesnapX);
            addEvent(rowContainer, 'mouseup', mouseUpsnapX);
        }

        // Touch events
        if (hasTouch) {
            addEvent(snapX, 'touchstart', mouseDownsnapX);

            if (!rowContainer.hcEvents.mousemove) {
                addEvent(rowContainer, 'touchmove', mouseMovesnapX);
                addEvent(rowContainer, 'touchend', mouseUpsnapX);
            }
        }
    }
    /**
     * Mouse move function
     *
     * @param {boolean} currentCell
     * Flag determinates allowance to grab or not
     *
     * @param {global.Event} e
     * A mouse event.
     *
     * @param {Resizer.ResizedCell} cell
     * Reference to cell
     *
     */
    public onMouseMove(
        currentCell: Resizer.ResizedCell|undefined,
        e: PointerEvent
    ): void {
        const cellContainer = currentCell && currentCell.container;

        if (currentCell && cellContainer) {
            const parentRow = (cellContainer.parentNode as HTMLDOMElement);
            const parentRowWidth = parentRow.offsetWidth;

            cellContainer.style.width =
                (
                    Math.min(
                        // diff
                        e.clientX - cellContainer.getBoundingClientRect().left,
                        // maxSize
                        parentRowWidth - (
                            this.sumCellOuterWidth(
                                currentCell.row,
                                currentCell
                            ) || 0
                        )
                    ) / parentRowWidth
                ) * 100 + '%';

            cellContainer.style.flex = 'none';

            // call component resize
            if (currentCell.mountedComponent) {
                currentCell.mountedComponent.resize(null);
            }
        }
    }
    /**
     * Sum min width and current width of cells in the row.
     *
     * @param {Row} row
     * Row contains cells
     *
     * @param {cell} cell
     * Optional parameter, the cell which is resized and should be excluded
     * in calculations. In case of nested layouts, we calculate all cells.
     *
     * @return {number}
     * Sum
     */
    public sumCellOuterWidth(
        row: Row,
        cell?: Cell
    ): number {

        // const convertToPercent = this.convertToPercent;
        const cellContainer = cell && cell.container as HTMLElement;
        const parentRowWidth = row.container && row.container.offsetWidth;
        const cells = row.cells;

        let sum = 0;
        let rowCell;
        let rowCellContainer;

        for (let i = 0, iEnd = cells.length; i < iEnd; ++i) {

            rowCell = cells[i] as Resizer.ResizedCell;
            rowCellContainer = rowCell.container as HTMLDOMElement;

            if (rowCellContainer !== cellContainer) {

                // find all cells in nested layout to calculate
                // min-width / width each of them
                if (cells[i].layout) {

                    const cellRows = cells[i].layout.rows;

                    let maxRow = row;
                    let maxCells = 0;

                    // find a row with maximum cells
                    for (let j = 0, jEnd = cellRows.length; j < jEnd; ++j) {
                        if (cellRows[j].cells.length > maxCells) {
                            maxCells = cellRows[j].cells.length;
                            maxRow = cellRows[j];
                        }
                    }

                    // call reccurent calculation of cells (nested layouts)
                    if (maxRow) {
                        sum = this.sumCellOuterWidth(
                            maxRow,
                            void 0
                        );
                    }
                } else {
                    const cellStylesWidth = (
                        // convert % to px
                        parseFloat(
                            rowCellContainer.style.getPropertyValue('width')
                        ) / 100
                    ) * (parentRowWidth || 1);

                    // add borders width
                    if (rowCell.styles) {
                        sum += (
                            (rowCell.styles.borderLeft || 0) +
                            (rowCell.styles.borderRight || 0)
                        );

                        // add min-size if "resized" width does not exist or is
                        // bigger then width
                        const minSize = rowCell.styles.minSize || 0;

                        sum += (
                            cellStylesWidth && cellStylesWidth > minSize ?
                                cellStylesWidth : minSize
                        );
                    }
                }
            }
        }

        return sum;
    }
    /**
     * Destroy resizer
     *
     * @param {Array<Row>} nestedRows
     * Reference to rows in the layout
     *
     */
    public destroy(
        nestedRows: Array<Row>
    ): void {
        const rows = nestedRows || this.layout.rows;
        const resizer = this;
        let currentCell: Resizer.ResizedCell;

        // loop over rows
        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

            // loop over cells
            for (let j = 0, jEnd = rows[i].cells.length; j < jEnd; ++j) {

                currentCell = rows[i].cells[j];

                // run reccurent if nested layouts
                if (currentCell.layout) {
                    resizer.destroy(
                        currentCell.layout.rows
                    );
                } else if (
                    currentCell.resizer &&
                    currentCell.resizer.snap
                ) {
                    this.destroyCellSnapX(currentCell);
                    // currentCell.resizer.snapX.remove();
                }
            }

            // unbind rows events
            removeEvent(rows[i].container, 'mousemove');
            removeEvent(rows[i].container, 'mousedown');
            removeEvent(rows[i].container, 'touchmove');
            removeEvent(rows[i].container, 'touchend');
        }
    }

    public destroyCellSnapX(
        cell: Resizer.ResizedCell
    ): void {
        const snap = cell.resizer && cell.resizer.snap;

        if (!snap) {
            return;
        }

        // unbind events
        removeEvent(snap, 'mousedown');
        removeEvent(snap, 'touchstart');

        // destroy snapX
        snap.remove();
    }
    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Resizer.ClassJSON}
     * Class JSON of this Resizer instance.
     */
    public toJSON(): Resizer.ClassJSON {
        const resizeOptions = this.resizeOptions;

        return {
            $class: 'Resizer',
            options: {
                cells: {
                    enabled: resizeOptions.cells.enabled,
                    minSize: resizeOptions.cells.minSize
                },
                rows: {
                    enabled: resizeOptions.rows.enabled,
                    minSize: resizeOptions.rows.minSize
                },
                snap: {
                    width: resizeOptions.snap.width
                }
            }
        };
    }
}
interface Resizer {
    mouseDownsnapX?: Function;
    mouseMovesnapX?: Function;
    mouseUpsnapX?: Function;
}
namespace Resizer {
    export interface Options {
        cells: CellsRowsOptions;
        rows: CellsRowsOptions;
        snap: SnapOptions;
    }
    export interface CellsRowsOptions {
        enabled: boolean;
        minSize: number;
    }

    export interface ResizedCell extends Cell {
        resizer?: Snap;
        styles?: ElementStyles;
    }

    export interface ResizedRow extends Row {
        resizer?: Snap;
        styles?: ElementStyles;
    }

    export interface ElementStyles {
        borderLeft?: number;
        borderRight?: number;
        minSize?: number;
    }
    export interface Snap {
        snap?: HTMLDOMElement|undefined;
    }

    export interface SnapOptions {
        width: number;
    }

    export interface HTMLDOMElementEvents extends HTMLDOMElement {
        hcEvents: Record<string, Array<Function>>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        cells: CellsRowsOptionsJSON;
        rows: CellsRowsOptionsJSON;
        snap: SnapJSON;
    }

    export interface CellsRowsOptionsJSON extends DataJSON.JSONObject {
        enabled: boolean;
        minSize: number;
    }

    export interface SnapJSON extends DataJSON.JSONObject {
        width: number;
    }
}

export default Resizer;
