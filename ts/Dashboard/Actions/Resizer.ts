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
    css,
    createElement,
    fireEvent,
    removeEvent,
    pick
} = U;

import H from '../../Core/Globals.js';
import EditMode from '../EditMode/EditMode';
import ContextDetection from './ContextDetection.js';

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
        editMode: EditMode,
        json: Resizer.ClassJSON
    ): Resizer|undefined {
        return new Resizer(editMode, json.options);
    }

    protected static readonly defaultOptions: Resizer.Options = {
        enabled: true,
        styles: {
            minWidth: 20,
            minHeight: 50
        },
        type: 'xy',
        snap: {
            width: 20,
            height: 20
        }
    };

    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        editMode: EditMode,
        options?: Resizer.Options
    ) {
        this.editMode = editMode;
        this.options = merge(
            {},
            Resizer.defaultOptions,
            editMode.options.resize,
            options
        );

        this.currentCell = void 0; // consider naming for example currentCell
        this.isX = this.options.type.indexOf('x') > -1;
        this.isY = this.options.type.indexOf('y') > -1;
        this.isActive = false;
        this.startX = 0;

        this.init();

        this.addSnaps(
            this.options
        );

        this.resizePointer = {
            isVisible: false,
            element: createElement(
                'div',
                { className: EditGlobals.classNames.resizePointer },
                {},
                editMode.dashboard.container
            )
        };

        this.isResizerDetectionActive = false;
        this.initEvents();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Resizer.Options;
    public currentCell: Cell|undefined;
    public currentDimension: string|undefined;
    public isX: boolean;
    public isY: boolean;
    public snapXL: HTMLDOMElement|undefined;
    public snapXR: HTMLDOMElement|undefined;
    public snapYT: HTMLDOMElement|undefined;
    public snapYB: HTMLDOMElement|undefined;
    public isActive: boolean;
    public editMode: EditMode;
    public mouseCellContext?: Cell;
    public resizeCellContext?: Cell;
    public isResizerDetectionActive: boolean;
    public resizePointer: Resizer.ResizePointer;
    public startX: number;

    /* *
     *
     *  Functions
     *
     * */
    public init(): void {
        const layouts = this.editMode.dashboard.layouts;

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            this.setInitWidth(layouts[i]);
        }
    }

    public initEvents(): void {
        const resizer = this;

        // Resizer events.
        addEvent(document, 'mousemove', resizer.onDetectContext.bind(resizer));
        addEvent(document, 'click', resizer.onResizeElementConfirm.bind(resizer));
    }

    public setInitWidth(
        layout?: Layout
    ): void {
        const rows = layout && layout.rows;
        let cellStyle;
        let sumMinWidth;
        let prevIndexRow = 0;

        for (let i = 0, iEnd = (rows || []).length; i < iEnd; ++i) {

            const cells = rows && rows[i].cells;
            
            if (cells) {
                for (let j = 0, jEnd = cells.length; j < jEnd; ++j) {

                    const cellContainer = (cells[j].container as HTMLElement);
                    sumMinWidth = 0;

                    for (let k = 0, kEnd = cells[j].row.cells.length; k < kEnd; ++k) {
                        const prevCell = cells[j].row.cells[k];

                        if (k <= j) {
                            sumMinWidth += (
                                ((cells[j].row.cells[k].options.style?.minWidth as number) || 0) || ((this.options.styles || {}).minWidth || 0)
                            );
                        }
                    }

                    if (cells[j].nestedLayout) {
                        this.setInitWidth(cells[j].nestedLayout);
                    } else {
                        // set min-size
                        cellContainer.style.minWidth =
                            this.options.styles.minWidth + 'px';

                        cellStyle = cells[j].options.style;

                        if (cellStyle) {
                            cellStyle.minWidth = this.options.styles.minWidth;
                        } else {
                            cells[j].options.style = {
                                minWidth: this.options.styles.minWidth
                            }
                        }

                        this.updateParentMinWidth(
                            cells[j],
                            sumMinWidth
                        );
                    }

                    cellContainer.style.width = (
                        (
                            (cellContainer.offsetWidth) /
                            ((cells[j].row.container as HTMLElement).offsetWidth || 1)
                        ) * 100
                    ) + '%';               
                    cellContainer.style.flex = 'none';
                }
            }

            prevIndexRow = i;
        }
    }

    public updateParentMinWidth(
        cell: Cell,
        sumMinWidth: number,
        sumParentMinWidth?: boolean
    ): void {
        const parentCell = cell.row.layout.parentCell;

        if (!parentCell) {
            return;
        }

        const parentCellStyle = parentCell.options.style;

        if (parentCellStyle) {
            if (sumParentMinWidth) {
                if ((parentCellStyle.minWidth || 0) <= sumMinWidth) {
                    parentCellStyle.minWidth = (
                        ((parentCellStyle.minWidth as number) || 0) + (this.options.styles.minWidth || 0)
                    );
                }
            } else {
                if ((parentCellStyle.minWidth || 0) <= sumMinWidth) {
                    parentCellStyle.minWidth = (
                        sumMinWidth
                    );
                }
            }
        } else {

            parentCell.options.style = {
                minWidth: (sumMinWidth || 0)
            }
        }

        if (parentCell.container) {

            parentCell.container.style.minWidth =
                (parentCell.options.style || {}).minWidth + 'px';
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
        options: Resizer.Options
    ): void {
        const minWidth = options.styles.minWidth;
        const minHeight = options.styles.minHeight;
        const snapWidth = this.options.snap.width || 0;
        const snapHeight = this.options.snap.height || 0;
        const dashboardContainer = this.editMode.dashboard.container;

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
            dashboardContainer
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
            dashboardContainer
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
            dashboardContainer
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
            dashboardContainer
        );

        this.addResizeEvents();

    }

    public resizeElement(
        cell: Cell
    ): void {
        // set current cell
        this.currentCell = cell;

        // set position of snaps
        const cellOffsets = GUIElement.getOffsets(
            cell,
            this.editMode.dashboard.container
        );
        const cellContainer = cell.container;
        const left = cellOffsets.left || 0;
        const top = cellOffsets.top || 0;
        const width = (cellContainer && cellContainer.offsetWidth) || 0;
        const height = (cellContainer && cellContainer.offsetHeight) || 0;
        const snapWidth = (this.options.snap.width || 0);
        const snapHeight = (this.options.snap.height || 0);

        if (this.snapXL) {
            this.snapXL.style.left = left + 'px';
            this.snapXL.style.top = top + (
                height / 2
            ) - (snapHeight / 2) + 'px';
        }

        if (this.snapXR) {
            this.snapXR.style.left = (left + width - snapWidth) + 'px';
            this.snapXR.style.top = top + (
                height / 2
            ) - (snapHeight / 2) + 'px';
        }

        if (this.snapYT) {
            this.snapYT.style.top = top + 'px';
            this.snapYT.style.left = (
                left + (
                    width / 2
                ) - (snapWidth / 2)
            ) + 'px';
        }

        if (this.snapYB) {
            this.snapYB.style.top = (top + height - snapHeight) + 'px';
            this.snapYB.style.left = (
                left + (
                    width / 2
                ) - (snapWidth / 2)
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
            resizer.deactivateResizerDetection();

            resizer.startX = e.clientX;
        };

        resizer.mouseDownSnapY = mouseDownSnapY = function (
            e: PointerEvent
        ): void {
            resizer.isActive = true;
            resizer.currentDimension = 'y';
            resizer.deactivateResizerDetection();
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
            if (resizer.isActive) {
                resizer.isActive = false;
                resizer.currentDimension = void 0;
                resizer.activateResizerDetection();
            }
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
            const cellSiblings = this.getSiblings(currentCell);

            // resize width
            if (currentDimension === 'x') {

                const maxWidth = parentRowWidth -
                    this.sumCellOuterWidth(
                        cellSiblings,
                        currentCell.row,
                        currentCell
                    ) || 0;

                cellContainer.style.width =
                    (
                        Math.min(
                            // diff
                            e.clientX +
                            this.editMode.dashboard.container.getBoundingClientRect().left -
                            cellContainer.getBoundingClientRect().left,
                            // maxSize
                            maxWidth
                        ) / parentRowWidth
                    ) * 100 + '%';

                cellContainer.style.flex = 'none';

                // resize snaps
                if (this.snapXR) {

                    // TODO -> margins / paddings
                    const minWidth = (cellContainer.offsetLeft || 0) +
                        (this.options.styles.minWidth || 0);

                    const currentWidth = (
                        e.clientX - (this.options.snap.width || 0)
                    );
                    
                    this.snapXR.style.left = Math.min(
                        currentWidth > minWidth ? currentWidth : minWidth,
                        maxWidth - (this.options.snap.width || 0)
                    ) + 'px';
                }

                this.resizeCellSiblings(
                    ((e.clientX - this.startX) / parentRowWidth) * 100,
                    cellSiblings.next
                );

                this.startX = e.clientX;
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
            fireEvent(this.editMode.dashboard, 'cellResize', { cell: currentCell });
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
        cellSiblings: Resizer.CellSiblings,
        row: Row,
        cell?: Cell
    ): number {

        const cellContainer = cell && cell.container as HTMLElement;
        const parentRowWidth = row.container && row.container.offsetWidth;

        let sum = 0;
        let rowCell;
        let rowCellContainer;

        // TEMP
        let prevCellsWidth = 0;
        let prevCellContainer;

        // sum prev
        for (let i = 0, iEnd = cellSiblings.prev.length; i < iEnd; ++i) {

            prevCellContainer = cellSiblings.prev[i].container;

            if (prevCellContainer) {
                prevCellsWidth += prevCellContainer.offsetWidth;
            }
        }

        // sum next
        // let nextCellsWidth = 0;

        // for (let i = 0, iEnd = cellSiblings.next.length; i < iEnd; ++i) {
        //     nextCellsWidth += (this.options.styles || {}).minWidth || 0;
        // }
        // END TEMP

        const cells = cellSiblings.next;

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
                            {
                                next: maxRow.cells,
                                prev: []
                            },
                            maxRow,
                            void 0
                        );
                    }
                } else {
                    // add min-size if "resized" width does not exist or is
                    // bigger then width
                    sum += (this.options.styles || {}).minWidth || 0;
                }
            }
        }

        sum += prevCellsWidth;

        return sum;
    }

    public getSiblings(
        currentCell: Cell|undefined
    ): Resizer.CellSiblings {
        const siblings = {
            prev: [] as Array<Cell>,
            next: [] as Array<Cell>
        };

        if (!currentCell) {
            return siblings;
        }

        const row = currentCell.row;
        const cells = row.cells;
        let currentCellIndex = Infinity;

        
        for (let i = 0, iEnd = cells.length; i < iEnd; i++) {
            if (cells[i].id !== currentCell.id) {
                // detect prev or next sibbling
                if (i < currentCellIndex) {
                    siblings.prev.push(
                        cells[i]
                    );
                } else {
                    siblings.next.push(
                        cells[i]
                    );
                }
            } else {
                // make breaking point for detection of prev / next
                currentCellIndex = i;
            }
        }

        return siblings;
    }

    public resizeCellSiblings(
        diffWidth: number,
        cellSiblings: Array<Cell>
    ): void {
        let cellsToChange = cellSiblings.length;
        let cellContainer;

        for (let i = 0, iEnd = cellSiblings.length; i < iEnd; ++i) {
            cellContainer = cellSiblings[i].container;
            const cellStyle = cellSiblings[i].options.style;
            const cellWidth = cellContainer && parseFloat(cellContainer.style.getPropertyValue('width')) || 0;
            const minWidthPercent =
                (
                    (((cellStyle || {}).minWidth as number) || 0) /
                    (((cellSiblings[i].row.container as HTMLDOMElement).offsetWidth) || 0)
                ) * 100

            // detect achieve the minWidth
            if (minWidthPercent >= cellWidth) {
                cellsToChange--;
            }

            if (cellContainer) {
                (cellContainer).style.width =
                    // bug, missing padding/margin
                    cellWidth +
                        -(diffWidth / cellsToChange) + '%'; 
            }

        }

    }

    private updateCellWidth(): void {

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
        const options = this.options;

        return {
            $class: 'Resizer',
            options: {
                enabled: options.enabled,
                styles: {
                    minWidth: options.styles.minWidth,
                    minHeight: options.styles.minHeight,
                },
                type: options.type,
                snap: {
                    width: options.snap.width,
                    height: options.snap.height
                }
            }
        };
    }

    public activateResizerDetection(): void {
        this.isResizerDetectionActive = true;
        this.editMode.hideToolbars();
    }

    public deactivateResizerDetection(): void {
        this.isResizerDetectionActive = false;
        this.mouseCellContext = void 0;
        this.hideResizePointer();
    }

    public onDetectContext(e: PointerEvent): void {
        const resizer = this,
            offset = 50; // TODO - add it from options.

        if (resizer.isResizerDetectionActive && resizer.mouseCellContext) {
            const resizeCellContext = this.resizeCellContext =
                ContextDetection.getContext(resizer.mouseCellContext, e, offset).cell;

            if (resizeCellContext) {
                const resizeCellContextOffsets = GUIElement.getOffsets(
                    resizeCellContext, resizer.editMode.dashboard.container);
                const { width, height } = GUIElement.getDimFromOffsets(resizeCellContextOffsets);

                resizer.showResizePointer(
                    resizeCellContextOffsets.left, resizeCellContextOffsets.top, width, height
                );
            }
        }
    }

    // Used when gui element is selected and resizing is confirmed by click.
    public onResizeElementConfirm(): void {
        if (this.isResizerDetectionActive && this.resizeCellContext) {
            this.resizeElement(this.resizeCellContext);
        }
    }

    /**
     * Method for showing and positioning resize pointer.
     *
     * @param {number} left
     * Resize pointer left position.
     *
     * @param {number} top
     * Resize pointer top position.
     *
     * @param {number} width
     * Resize pointer width.
     *
     * @param {number} height
     * Resize pointer height.
     */
    private showResizePointer(
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        this.resizePointer.isVisible = true;
        css(this.resizePointer.element, {
            display: 'block',
            left: left + 'px',
            top: top + 'px',
            height: height + 'px',
            width: width + 'px'
        });
    }

    /**
     * Method for hiding resize pointer.
     */
    private hideResizePointer(): void {
        if (this.resizePointer.isVisible) {
            this.resizePointer.isVisible = false;
            this.resizePointer.element.style.display = 'none';
        }
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
        type: string;
        snap: SnapOptions;
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
        snap: SnapJSON;
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

    export interface ResizePointer {
        isVisible: boolean;
        element: HTMLDOMElement;
    }

    export interface CellSiblings {
        prev: Array<Cell>;
        next: Array<Cell>;
    }
}

export default Resizer;
