/* eslint-disable */
import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type DataJSON from '../../Data/DataJSON';
import type Cell from '../Layout/Cell.js';
import type Row from '../Layout/Row.js';
import type Layout from '../Layout/Layout.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import GUIElement from '../Layout/GUIElement.js';

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
        styles: {
            minWidth: 50,
            minHeight: 50
        },
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
        this.isActive = false;

        this.init();

        this.addSnaps(
            this.resizeOptions
        );

        // temp for testing
        if (this.layout.rows && this.layout.rows[1]) {
            this.resizeElement(this.layout.rows[1].cells[0]);
        } else {
            this.resizeElement(this.layout.rows[0].cells[0]);
        }
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
    public snapXL: HTMLDOMElement|undefined;
    public snapXR: HTMLDOMElement|undefined;
    public snapYT: HTMLDOMElement|undefined;
    public snapYB: HTMLDOMElement|undefined;
    public isActive: boolean;

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
                            this.resizeOptions.styles.minWidth + 'px';
                        
                        // convert current width to percent
                        // fix bug when we resize the last cell in a row
                        cellContainer.style.width = (
                            (
                                (cellContainer.offsetWidth) /
                                ((cells[j].row.container as HTMLElement).offsetWidth || 1)
                            ) * 100
                        ) + '%';               
                        cellContainer.style.flex = 'auto';
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
     */
    public addSnaps(
        // cell: Resizer.ResizedCell,
        // minWidth: number,
        // minHeight: number
        resizeOptions: Resizer.Options
    ): void {
        const minWidth = resizeOptions.styles.minWidth;
        const minHeight = resizeOptions.styles.minHeight;
        const snapWidth = this.resizeOptions.snapX.width || 0;
        const snapHeight = this.resizeOptions.snapY.height || 0;

        // left snap
        this.snapXL = createElement(
            'div',
            {
                className: EditGlobals.classNames.resizeSnap + ' ' +
                    EditGlobals.classNames.resizeSnapX
            },
            {
                width: snapWidth + 'px',
                left: -9999 + 'px' 
            },
            this.layout.container
        );

        // right snap
        this.snapXR = createElement(
            'div',
            {
                className: EditGlobals.classNames.resizeSnap + ' ' +
                    EditGlobals.classNames.resizeSnapX
            },
            {
                width: snapWidth + 'px',
                left: -9999 + 'px'
            },
            this.layout.container
        );

        // top snap
        this.snapYT = createElement(
            'div',
            {
                className: EditGlobals.classNames.resizeSnap + ' ' +
                    EditGlobals.classNames.resizeSnapY
            },
            {
                height: snapHeight + 'px',
                top: -9999 + 'px',
                left: '0px' 
            },
            this.layout.container
        );

        // bottom snap
        this.snapYB = createElement(
            'div',
            {
                className: EditGlobals.classNames.resizeSnap + ' ' +
                    EditGlobals.classNames.resizeSnapY
            },
            {
                height: snapHeight + 'px',
                top: -9999 + 'px',
                left: '0px'
            },
            this.layout.container
        );

        this.addResizeEvents();

    }

    public resizeElement(
        cell: Cell
    ): void {
        // set current cell
        this.currentCell = cell;

        // set position of snaps
        const cellOffsets = GUIElement.getOffsets(cell, this.layout.container)
        const cellContainer = cell.container;
        const left = cellOffsets.left || 0;
        const top = cellOffsets.top || 0;
        const width = (cellContainer && cellContainer.offsetWidth) || 0;
        const height = (cellContainer && cellContainer.offsetHeight) || 0;
        const snapXwidth = (this.resizeOptions.snapX.width || 0);
        const snapYheight = (this.resizeOptions.snapY.height || 0);

        if (this.snapXL) {
            this.snapXL.style.left = left + 'px';
            this.snapXL.style.top = top + (
                height / 2
            ) - (snapYheight / 2) + 'px';
        }

        if (this.snapXR) {
            this.snapXR.style.left = (left + width - snapXwidth) + 'px';
            this.snapXR.style.top = top + (
                height / 2
            ) - (snapYheight / 2) + 'px';
        }

        if (this.snapYT) {
            this.snapYT.style.top = top + 'px';
            this.snapYT.style.left = (
                left + (
                    width / 2
                ) - (snapXwidth / 2)
            ) + 'px';
        }

        if (this.snapYB) {
            this.snapYB.style.top = (top + height - snapYheight) + 'px';
            this.snapYB.style.left = (
                left + (
                    width / 2
                ) - (snapXwidth / 2)
            ) + 'px';
        }
    }

    /**
     * Add events
     *
     * @param {Resizer.ResizedCell} element
     * Reference to cell
     *
     */
    public addResizeEvents(): void {
        const resizer = this;
        let mouseDownSnapX,
            mouseDownSnapY,
            mouseMoveSnap,
            mouseUpSnap;

        resizer.mouseDownSnapX = mouseDownSnapX = function (
            e: PointerEvent
        ): void {
            resizer.isActive = true;
            resizer.currentDimension = 'x';
            // set snap position
        };

        resizer.mouseDownSnapY = mouseDownSnapY = function (
            e: PointerEvent
        ): void {
            resizer.isActive = true;
            resizer.currentDimension = 'y';
        };

        resizer.mouseMoveSnap = mouseMoveSnap = function (
            e: PointerEvent
        ): void {
            if (resizer.isActive) {
                resizer.onMouseMove(
                    e as PointerEvent
                );
            }
        };

        resizer.mouseUpSnap = mouseUpSnap = function (
            e: PointerEvent
        ): void {
            resizer.isActive = false;
            resizer.currentDimension = void 0;
        };

        // Add mouse events
        addEvent(this.snapXR, 'mousedown', mouseDownSnapX);
        addEvent(this.snapXL, 'mousedown', mouseDownSnapX);
        addEvent(this.snapYT, 'mousedown', mouseDownSnapY);
        addEvent(this.snapYB, 'mousedown', mouseDownSnapY);

        addEvent(document, 'mousemove', mouseMoveSnap);
        addEvent(document, 'mouseup', mouseUpSnap);

        // Touch events
        // if (hasTouch) {
        //     addEvent(snapX, 'touchstart', mouseDownSnapX);
        //     addEvent(snapY, 'touchstart', mouseDownSnapY);

        //     if (!rowContainer.hcEvents.mousemove) {
        //         addEvent(rowContainer, 'touchmove', mouseMoveSnap);
        //         addEvent(rowContainer, 'touchend', mouseUpSnap);
        //     }
        // }
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
        // currentCell: Resizer.ResizedCell|undefined,
        e: PointerEvent
    ): void {
        const currentCell = this.currentCell as Resizer.ResizedCell;
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

                const maxWidth = parentRowWidth - (
                    this.sumCellOuterWidth(
                        currentCell.row,
                        currentCell
                    ) || 0
                );

                cellContainer.style.width =
                    (
                        Math.min(
                            // diff
                            e.clientX - cellContainer.getBoundingClientRect().left,
                            // maxSize
                            maxWidth
                        ) / parentRowWidth
                    ) * 100 + '%';

                cellContainer.style.flex = 'none';

                // resize snaps
                if (this.snapXR) {
                    const minWidth = (cellContainer.offsetLeft || 0) +
                        (this.resizeOptions.styles.minWidth || 0) -
                        (this.resizeOptions.snapX.width || 0);

                    const currentWidth = (
                        e.clientX -
                        (this.resizeOptions.snapX.width || 0) -
                        (cellContainer?.getBoundingClientRect().left || 0)
                    );
                    
                    this.snapXR.style.left = Math.min(
                        currentWidth > minWidth ? currentWidth : minWidth,
                        maxWidth - (this.resizeOptions.snapX.width || 0)
                    ) + 'px';
                }
            }

            // resize height
            if (currentDimension === 'y') {
                cellContainer.style.height =
                    (
                        Math.max(
                            // diff
                            e.clientY - cellContainer.getBoundingClientRect().top//,
                            
                            // minSize
                            // (currentCell.styles || {}).minHeight || 0
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
                    // const cellWidth = rowCellContainer.style.getPropertyValue('width');

                    // const cellStylesWidth = (/px$/).test(cellWidth) ?
                    //     // value in px
                    //     parseFloat(cellWidth) :
                    //     // convert % to px
                    //     (
                    //         parseFloat(
                    //             cellWidth
                    //         ) / 100
                    //     ) * (parentRowWidth || 1);

                    // add borders width
                    // sum += (
                    //     ((rowCell.styles || {}).borderLeft || 0) +
                    //     ((rowCell.styles || {}).borderRight || 0)
                    // );

                    // add min-size if "resized" width does not exist or is
                    // bigger then width
                    const minWidth = (this.resizeOptions.styles || {}).minWidth || 0;

                    // sum += (
                    //     cellStylesWidth && cellStylesWidth > minWidth ?
                    //         cellStylesWidth : minWidth
                    // );

                    sum += minWidth;
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
    public destroy(): void {
        const snaps = ['snapXL', 'snapXR', 'snapYT', 'snapYB'];
        let snap;

        // unbind events
        removeEvent(document, 'mousemove');
        removeEvent(document, 'mouseup');

        for (let i = 0, iEnd = snaps.length; i < iEnd; ++i) {
            snap = (this as any)[snaps[i]];

            // unbind event
            removeEvent(snap, 'mousedown');

            // destroy snap
            snap.remove();
        };
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
                styles: {
                    minWidth: resizeOptions.styles.minWidth,
                    minHeight: resizeOptions.styles.minHeight,
                },
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
        // minWidth: number;
        // minHeight: number;
        type: string;
        snapX: SnapOptions;
        snapY: SnapOptions;
        styles: ElementStyles
    }
    export interface ResizedCell extends Cell {
        resizer?: Snap;
        // styles?: ElementStyles;
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
        styles: ElementStylesJSON;
        type: string;
        snapX: SnapJSON;
        snapY: SnapJSON;
    }
    export interface SnapJSON extends DataJSON.JSONObject {
        width?: number;
        height?: number;
    }
    export interface ElementStylesJSON extends DataJSON.JSONObject {
        borderLeft?: number;
        borderRight?: number;
        borderTop?: number;
        borderBottom?: number;
        minWidth?: number;
        minHeight?: number;
    }
}

export default Resizer;
