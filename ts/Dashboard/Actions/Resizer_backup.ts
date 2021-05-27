/* eslint-disable */
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
    fireEvent,
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
        enabled: true,
        minWidth: 50,
        minHeight: 50,
        type: 'xy',
        snapX: {
            width: 20
        },
        snapY: {
            height: 20
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
        this.isX = this.resizeOptions.type.indexOf('x') > -1;
        this.isY = this.resizeOptions.type.indexOf('y') > -1;

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
    public currentDimension: string|undefined;
    public isX: boolean;
    public isY: boolean;

    /* *
     *
     *  Functions
     *
     * */
    public init(
        nestedLayout?: Layout
    ): void {
        const rows = (nestedLayout && nestedLayout.rows) || this.layout.rows;

        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

            const cells = rows && rows[i].cells;

            if (cells) {
                for (let j = 0, jEnd = cells.length; j < jEnd; ++j) {

                    if (cells[j].nestedLayout) {
                        this.init(cells[j].nestedLayout);
                    } else {
                        const cellContainer = (cells[j].container as HTMLElement);
                        // set min-size
                        cellContainer.style.minWidth =
                            this.resizeOptions.minWidth + 'px';
                        
                        // convert current width to percent
                        // fix bug when we resize the last cell in a row
                        // cellContainer.style.width = (
                        //     (
                        //         (cellContainer.offsetWidth) /
                        //         ((cells[j].row.container as HTMLElement).offsetWidth || 1)
                        //     ) * 100
                        // ) + '%';               
                        // cellContainer.style.flex = 'auto';

                        // add snaps
                        this.addSnaps(
                            cells[j],
                            this.resizeOptions.minWidth,
                            this.resizeOptions.minHeight
                        );
                    }
                }
            }
        }

    }

    /**
     * Add Snap - create snapXs and add events.
     *
     * @param {Resizer.ResizedCell} cell
     * Reference to cell
     *
     * @param {number} minWidth
     * Minimum width of cell
     *
     * @param {number} minHeight
     * Minimum height of cell
     */
    public addSnaps(
        cell: Resizer.ResizedCell,
        minWidth: number,
        minHeight: number
    ): void {
        cell.resizer = {} as Resizer.Snap;
        cell.styles = {} as Resizer.ElementStyles;

        // not created handlers when nested layouts, only in the child cells
        if (cell.nestedLayout) {
            return;
        }

        if (cell.container) {

            // create HTML snapX
            if (this.isX) {
                const snapWidth = this.resizeOptions.snapX.width || 0;

                cell.resizer.snapX = createElement(
                    'div',
                    {
                        className: EditGlobals.classNames.resizeSnap + ' ' +
                            EditGlobals.classNames.resizeSnapX
                    },
                    {
                        width: snapWidth + 'px',
                        right: (
                            -(snapWidth / 2) -
                            (
                                getStyle(
                                    cell.container,
                                    'border',
                                    true
                                ) as number
                            )
                        ) + 'px'
                    },
                    cell.container
                );

                cell.styles.borderLeft =
                    (getStyle(cell.container, 'border-left', true) as number);
                cell.styles.borderRight =
                    (getStyle(cell.container, 'border-right', true) as number);
                cell.styles.minWidth = minWidth;
            }
            // create HTML snapX
            if (this.isY) {
                const snapHeight = this.resizeOptions.snapY.height || 0;

                cell.resizer.snapY = createElement(
                    'div',
                    {
                        className: EditGlobals.classNames.resizeSnap + ' ' +
                            EditGlobals.classNames.resizeSnapY
                    },
                    {
                        height: snapHeight + 'px',
                        bottom: -(snapHeight / 2) + 'px',
                        left: '0px'
                    },
                    cell.container
                );

                cell.styles.borderTop =
                    (getStyle(cell.container, 'border-top', true) as number);
                cell.styles.borderBottom =
                    (getStyle(cell.container, 'border-bottom', true) as number);
                cell.styles.minHeight = minHeight;
            }

            // attach events
            this.addResizeEvents(
                cell as Resizer.ResizedCell
            );
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
        const snapX = element.resizer && element.resizer.snapX;
        const snapY = element.resizer && element.resizer.snapY;
        const rowContainer = element.row &&
        element.row.container as Resizer.HTMLDOMElementEvents;

        let mouseDownSnapX,
            mouseDownSnapY,
            mouseMoveSnap,
            mouseUpSnap;

        resizer.mouseDownSnapX = mouseDownSnapX = function (
            e: PointerEvent
        ): void {
            resizer.currentCell = element;
            resizer.currentDimension = 'x';
        };

        resizer.mouseDownSnapY = mouseDownSnapY = function (
            e: PointerEvent
        ): void {
            resizer.currentCell = element;
            resizer.currentDimension = 'y';
        };

        resizer.mouseMoveSnap = mouseMoveSnap = function (
            e: PointerEvent
        ): void {
            resizer.onMouseMove(
                resizer.currentCell,
                e as PointerEvent
            );
        };

        resizer.mouseUpSnap = mouseUpSnap = function (
            e: PointerEvent
        ): void {
            resizer.currentCell = void 0;
            resizer.currentDimension = void 0;
        };

        // Add mouse events
        addEvent(snapX, 'mousedown', mouseDownSnapX);
        addEvent(snapY, 'mousedown', mouseDownSnapY);

        if (!rowContainer.hcEvents.mousemove) {
            addEvent(rowContainer, 'mousemove', mouseMoveSnap);
            addEvent(rowContainer, 'mouseup', mouseUpSnap);
        }

        // Touch events
        if (hasTouch) {
            addEvent(snapX, 'touchstart', mouseDownSnapX);
            addEvent(snapY, 'touchstart', mouseDownSnapY);

            if (!rowContainer.hcEvents.mousemove) {
                addEvent(rowContainer, 'touchmove', mouseMoveSnap);
                addEvent(rowContainer, 'touchend', mouseUpSnap);
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
        const currentDimension = this.currentDimension;

        if (
            currentCell &&
            cellContainer &&
            !((currentCell.row.layout.dashboard.editMode || {}).dragDrop || {}).isActive
        ) {
            const parentRow = (cellContainer.parentNode as HTMLDOMElement);
            const parentRowWidth = parentRow.offsetWidth;

            // resize width
            if (currentDimension === 'x') {
                console.log('current dimensions', Math.min(
                    // diff
                    e.clientX - cellContainer.getBoundingClientRect().left
                    // maxSize
                    // parentRowWidth - (
                    //     this.sumCellOuterWidth(
                    //         currentCell.row,
                    //         currentCell
                    //     ) || 0
                    // )
                ) / parentRowWidth);

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
            }

            // resize height
            if (currentDimension === 'y') {
                cellContainer.style.height =
                    (
                        Math.max(
                            // diff
                            e.clientY - cellContainer.getBoundingClientRect().top,
                            // minSize
                            (currentCell.styles || {}).minHeight || 0
                        )
                    ) + 'px';
            }

            // Call cellResize dashboard event.
            fireEvent(this.layout.dashboard, 'cellResize', { cell: currentCell });
            fireEvent(currentCell.row, 'cellChange', { cell: currentCell, row: currentCell.row });
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
                const cellRows = (cells[i].nestedLayout || {}).rows;

                if (cellRows) {
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
                    const cellWidth = rowCellContainer.style.getPropertyValue('width');

                    const cellStylesWidth = (/px$/).test(cellWidth) ?
                        // value in px
                        parseFloat(cellWidth) :
                        // convert % to px
                        (
                            parseFloat(
                                cellWidth
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
                        const minWidth = rowCell.styles.minWidth || 0;

                        sum += (
                            cellStylesWidth && cellStylesWidth > minWidth ?
                                cellStylesWidth : minWidth
                        );

                        // sum += minWidth;
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
                if (currentCell.nestedLayout) {
                    resizer.destroy(
                        currentCell.nestedLayout.rows
                    );
                } else if (
                    currentCell.resizer &&
                    currentCell.resizer.snapX
                ) {
                    this.destroyCellSnaps(currentCell);
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

    public destroyCellSnaps(
        cell: Resizer.ResizedCell
    ): void {
        const resizer = cell.resizer;
        const snapX = resizer && resizer.snapX;
        const snapY = resizer && resizer.snapY;

        if (snapX) {
            // unbind events
            removeEvent(snapX, 'mousedown');
            removeEvent(snapX, 'touchstart');

            // destroy snapX
            snapX.parentNode.removeChild(snapX);
        }

        if (snapY) {
            // unbind events
            removeEvent(snapY, 'mousedown');
            removeEvent(snapY, 'touchstart');

            // destroy snapY
            snapY.parentNode.removeChild(snapY);
        }
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
                enabled: resizeOptions.enabled,
                minWidth: resizeOptions.minWidth,
                minHeight: resizeOptions.minHeight,
                type: resizeOptions.type,
                snapX: {
                    width: resizeOptions.snapX.width
                },
                snapY: {
                    height: resizeOptions.snapY.height
                }
            }
        };
    }
}
interface Resizer {
    mouseDownSnapX?: Function;
    mouseDownSnapY?: Function;
    mouseMoveSnap?: Function;
    mouseUpSnap?: Function;
}
namespace Resizer {
    export interface Options {
        enabled: boolean;
        minWidth: number;
        minHeight: number;
        type: string;
        snapX: SnapOptions;
        snapY: SnapOptions;
    }
    export interface ResizedCell extends Cell {
        resizer?: Snap;
        styles?: ElementStyles;
    }

    export interface ElementStyles {
        borderLeft?: number;
        borderRight?: number;
        borderTop?: number;
        borderBottom?: number;
        minWidth?: number;
        minHeight?: number;
    }
    export interface Snap {
        snapX?: HTMLDOMElement|undefined;
        snapY?: HTMLDOMElement|undefined;
    }

    export interface SnapOptions {
        width?: number;
        height?: number;
    }

    export interface HTMLDOMElementEvents extends HTMLDOMElement {
        hcEvents: Record<string, Array<Function>>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        enabled: boolean;
        minWidth: number;
        minHeight: number;
        type: string;
        snapX: SnapJSON;
        snapY: SnapJSON;
    }
    export interface SnapJSON extends DataJSON.JSONObject {
        width?: number;
        height?: number;
    }
}

export default Resizer;
