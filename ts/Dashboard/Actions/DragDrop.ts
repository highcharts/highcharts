import U from './../../Core/Utilities.js';
import type Row from './../Layout/Row.js';
import type Cell from './../Layout/Cell.js';
import DashboardGlobals from './../DashboardGlobals.js';
import EditGlobals from './../EditMode/EditGlobals.js';
import EditMode from './../EditMode/EditMode.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import GUIElement from '../Layout/GUIElement.js';
import ContextDetection from './ContextDetection.js';

const {
    addEvent,
    merge,
    css,
    createElement
} = U;

/**
 * Class providing a drag and drop functionality.
 */
class DragDrop {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: DragDrop.Options = {
        enabled: true,
        rowDropOffset: 30,
        cellDropOffset: 30,
        dropPointerSize: 16
    }

    /* *
    *
    *  Constructors
    *
    * */

    /**
     * Constructor for the DragDrop class.
     *
     * @param {EditMode} editMode
     * The parent editMode reference.
     *
     * @param {DragDrop.Options} options
     * Options for the DragDrop.
     */
    constructor(
        editMode: EditMode,
        options?: DragDrop.Options
    ) {
        this.editMode = editMode;
        this.options = merge(DragDrop.defaultOptions, options);

        this.mockElement = createElement(
            'div',
            { className: EditGlobals.classNames.dragMock },
            {},
            editMode.dashboard.container
        );

        this.dropPointer = {
            isVisible: false,
            align: '',
            element: createElement(
                'div',
                { className: EditGlobals.classNames.dropPointer },
                {},
                editMode.dashboard.container
            )
        };

        this.isActive = false;
        this.initEvents();
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The editMode reference.
     */
    public editMode: EditMode;

    /**
     * DragDrop options.
     */
    public options: DragDrop.Options;

    /**
     * Dragged element reference.
     */
    public context?: Cell|Row;

    /**
     * Pending drag flag.
     */
    public isActive?: boolean;

    /**
     * Reference to the Cell that is under the dragging mock element.
     */
    public mouseCellContext?: Cell;

    /**
     * Reference to the Row that is under the dragging mock element.
     */
    public mouseRowContext?: Row;

    /**
     * Reference to the element that is used on drop to mount dragged element.
     * In most cases the context is the same as mouseContext. Could be different
     * in nested layout when elements overlapps.
     */
    public dropContext?: Cell|Row;

    /**
     * Dragged element mock.
     */
    public mockElement: HTMLDOMElement;

    /**
     * Element to visualize a drop spot.
     */
    public dropPointer: DragDrop.DropPointer;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Method for getting overlapped layout level.
     *
     * @param {Cell} mouseContext
     * Reference to the mouse context.
     *
     * @param {number} offset
     * Drop offset from the element edge.
     *
     * @param {number} mouseDropEdgeOffset
     * Mouse offset from the drop edge.
     *
     * @return {number}
     * Overlapped layout level.
     */
    private getDropContextLevel(
        mouseContext: Cell,
        offset: number,
        mouseDropEdgeOffset: number
    ): number {
        // Array of overlapped levels.
        const overlappedLevels = mouseContext.getOverlappingLevels(this.dropPointer.align, offset / 2);

        // Divide offset to level sections (eg 3 nested layouts -
        // cell edge will have 3 sections each 1/3 offset width).
        const divOffset = offset / overlappedLevels.length;

        // Overlapped nested layout level.
        const lastOverlappedLevel = overlappedLevels[overlappedLevels.length - 1];

        let level = mouseContext.row.layout.level - Math.floor(mouseDropEdgeOffset / divOffset);
        level = level < lastOverlappedLevel ? lastOverlappedLevel : (
            level > mouseContext.row.layout.level ?
                mouseContext.row.layout.level : level
        );

        return level;
    }

    /**
     * Method for showing and positioning drop pointer.
     *
     * @param {number} left
     * Drop pointer left position.
     *
     * @param {number} top
     * Drop pointer top position.
     *
     * @param {number} width
     * Drop pointer width.
     *
     * @param {number} height
     * Drop pointer height.
     */
    private showDropPointer(
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        this.dropPointer.isVisible = true;
        css(this.dropPointer.element, {
            display: 'block',
            left: left + 'px',
            top: top + 'px',
            height: height + 'px',
            width: width + 'px'
        });
    }

    /**
     * Method for hiding drop pointer.
     */
    private hideDropPointer(): void {
        if (this.dropPointer.isVisible) {
            this.dropPointer.isVisible = false;
            this.dropPointer.align = '';
            this.dropPointer.element.style.display = 'none';
        }
    }

    /**
     * Method for checking if gui element is on parent edge.
     *
     * @param {Cell} mouseContext
     * Reference to the mouseContext.
     *
     * @return {boolean}
     */
    private isGUIElementOnEdge(
        mouseContext: Cell
    ): boolean {
        const dragDrop = this,
            align = dragDrop.dropPointer.align;

        const visibleElements = (align === 'top' || align === 'bottom') ? mouseContext.row.layout.getVisibleRows() :
            (align === 'left' || align === 'right') ? mouseContext.row.getVisibleCells() : [];

        return (
            (visibleElements[visibleElements.length - 1] === mouseContext && align === 'right') ||
            (visibleElements[visibleElements.length - 1] === mouseContext.row && align === 'bottom') ||
            (visibleElements[0] === mouseContext && align === 'left') ||
            (visibleElements[0] === mouseContext.row && align === 'top')
        );
    }

    /**
     * Method for positioning drag mock element.
     *
     * @param {PointerEvent} mouseEvent
     * Mouse event.
     */
    public setMockElementPosition(
        mouseEvent: PointerEvent
    ): void {
        const dragDrop = this,
            dashBoundingRect =
                dragDrop.editMode.dashboard.container.getBoundingClientRect(),
            offset = dragDrop.mockElement.clientWidth / 2,
            x = mouseEvent.clientX - dashBoundingRect.left - offset,
            y = mouseEvent.clientY - dashBoundingRect.top - offset;

        css(this.mockElement, { left: x + 'px', top: y + 'px' });
    }

    /**
     * Method for initializing drag drop events.
     */
    public initEvents(): void {
        const dragDrop = this;

        // DragDrop events.
        addEvent(document, 'mousemove', dragDrop.onDrag.bind(dragDrop));
        addEvent(document, 'mouseup', dragDrop.onDragEnd.bind(dragDrop));
    }

    /**
     * General method used on drag start.
     *
     * @param {Cell|Row} context
     * Reference to the dragged context.
     *
     * @param {PointerEvent} e
     * Mouse event.
     */
    public onDragStart(
        context: Cell|Row,
        e: PointerEvent
    ): void {
        this.context = context;
        this.isActive = true;
        this.editMode.hideToolbars();
        this.setMockElementPosition(e);
        context.hide();

        css(this.mockElement, {
            cursor: 'grabbing',
            display: 'block'
        });
    }

    /**
     * General method used while dragging.
     *
     * @param {PointerEvent} e
     * Mouse event.
     */
    public onDrag(e: PointerEvent): void {
        const dragDrop = this;

        if (dragDrop.isActive) {
            dragDrop.setMockElementPosition(e);

            if (dragDrop.context) {
                if (dragDrop.context.getType() === DashboardGlobals.guiElementType.cell) {
                    dragDrop.onCellDrag(e);
                } else if (dragDrop.context.getType() === DashboardGlobals.guiElementType.row) {
                    dragDrop.onRowDrag(e);
                }
            }
        }
    }

    /**
     * General method used when drag finish.
     */
    public onDragEnd(): void {
        const dragDrop = this;

        if (dragDrop.isActive) {
            dragDrop.isActive = false;
            css(dragDrop.mockElement, {
                cursor: 'grab',
                display: 'none'
            });

            if (dragDrop.context) {
                if (dragDrop.context.getType() === DashboardGlobals.guiElementType.cell) {
                    dragDrop.onCellDragEnd();
                } else if (dragDrop.context.getType() === DashboardGlobals.guiElementType.row) {
                    dragDrop.onRowDragEnd();
                }
            }
        }
    }

    /**
     * Sets appropriate drop context and refresh drop pointer position when
     * row is dragged or cell is dragged as a row.
     *
     * @param {PointerEvent} e
     * Mouse event.
     *
     * @param {ContextDetection.ContextDetails} contextDetails
     * Context details (cell, side)
     */
    public onRowDrag(
        e: PointerEvent,
        contextDetails?: ContextDetection.ContextDetails
    ): void {
        const dragDrop = this,
            mouseCellContext = dragDrop.mouseCellContext,
            dropPointerSize = dragDrop.options.dropPointerSize,
            offset = dragDrop.options.rowDropOffset;

        let updateDropPointer = false;

        if (mouseCellContext) {
            const context = contextDetails || ContextDetection.getContext(mouseCellContext, e, offset);
            const align = context.side;

            if (
                dragDrop.dropPointer.align !== align ||
                dragDrop.dropContext !== context.cell.row
            ) {
                updateDropPointer = true;
                dragDrop.dropPointer.align = align;
                dragDrop.dropContext = context.cell.row;
            }

            if (align) {
                const dropContextRowOffsets = GUIElement.getOffsets(
                    dragDrop.dropContext, dragDrop.editMode.dashboard.container);
                const { width, height } = GUIElement.getDimFromOffsets(dropContextRowOffsets);

                // Update or show drop pointer.
                if (!dragDrop.dropPointer.isVisible || updateDropPointer) {
                    dragDrop.showDropPointer(
                        dropContextRowOffsets.left,
                        dropContextRowOffsets.top + (dragDrop.dropPointer.align === 'bottom' ? height : 0) -
                            dropPointerSize / 2,
                        width,
                        dropPointerSize
                    );
                }
            } else {
                dragDrop.dropContext = void 0;
                dragDrop.hideDropPointer();
            }
        }
    }

    /**
     * Unmounts dropped row and mounts it in a new position.
     */
    public onRowDragEnd(): void {
        const dragDrop = this,
            draggedRow = dragDrop.context as Row,
            dropContext = dragDrop.dropContext as Row;

        if (dragDrop.dropPointer.align) {
            draggedRow.layout.unmountRow(draggedRow);

            // Destroy layout when empty.
            if (draggedRow.layout.rows.length === 0) {
                draggedRow.layout.destroy();
            }

            dropContext.layout.mountRow(
                draggedRow,
                (dropContext.layout.getRowIndex(dropContext) || 0) +
                    (dragDrop.dropPointer.align === 'bottom' ? 1 : 0)
            );
        }

        dragDrop.hideDropPointer();
        draggedRow.show();
    }

    /**
     * Sets appropriate drop context and refresh drop pointer
     * position when cell is dragged.
     *
     * @param {PointerEvent} e
     * Mouse event.
     *
     * @param {ContextDetection.ContextDetails} contextDetails
     * Context details (cell, side)
     */
    public onCellDrag(
        e: PointerEvent,
        contextDetails?: ContextDetection.ContextDetails
    ): void {
        const dragDrop = this,
            mouseCellContext = dragDrop.mouseCellContext,
            dropPointerSize = dragDrop.options.dropPointerSize,
            offset = dragDrop.options.cellDropOffset;

        let updateDropPointer = false;

        if (mouseCellContext || contextDetails) {
            const context = contextDetails || ContextDetection.getContext(mouseCellContext as Cell, e, offset);
            const align = context.side;

            if (
                dragDrop.dropPointer.align !== align ||
                dragDrop.dropContext !== context.cell
            ) {
                updateDropPointer = true;
                dragDrop.dropPointer.align = align;
                dragDrop.dropContext = context.cell;
            }

            if (align === 'right' || align === 'left') {
                const dropContextOffsets = GUIElement.getOffsets(
                    dragDrop.dropContext, dragDrop.editMode.dashboard.container);
                const { width, height } = GUIElement.getDimFromOffsets(dropContextOffsets);

                // Update or show drop pointer.
                if (!dragDrop.dropPointer.isVisible || updateDropPointer) {
                    dragDrop.showDropPointer(
                        dropContextOffsets.left + (align === 'right' ? width : 0) -
                            dropPointerSize / 2,
                        dropContextOffsets.top,
                        dropPointerSize,
                        height
                    );
                }
            } else if (align === 'top' || align === 'bottom') {
                // Check if cell is dragged as row.
                dragDrop.onRowDrag(e, context);
            } else {
                dragDrop.dropContext = void 0;
                dragDrop.hideDropPointer();
            }
        } else if (dragDrop.mouseRowContext) {
            let cell, cellOffsets;

            for (let i = 0, iEnd = dragDrop.mouseRowContext.cells.length; i < iEnd; ++i) {
                cell = dragDrop.mouseRowContext.cells[i];
                cellOffsets = GUIElement.getOffsets(cell);

                if (cellOffsets.left <= e.clientX && cellOffsets.right >= e.clientX) {
                    // @ToDo - Mouse below or above the cell.
                } else if (
                    (i === 0 && cellOffsets.left > e.clientX) ||
                    (i === dragDrop.mouseRowContext.cells.length - 1 && cellOffsets.right < e.clientX)
                ) {
                    dragDrop.onCellDrag(e, {
                        cell,
                        side: (i === 0 && cellOffsets.left > e.clientX) ? 'left' : 'right'
                    });
                }
            }
        }
    }

    /**
     * Unmounts dropped cell and mounts it in a new position.
     * When cell is dragged as a row also creates a new row
     * and mounts cell there.
     */
    public onCellDragEnd(): void {
        const dragDrop = this,
            draggedCell = dragDrop.context as Cell;

        let dropContext = dragDrop.dropContext;

        if (dragDrop.dropPointer.align && dropContext) {
            draggedCell.row.unmountCell(draggedCell);

            // Destroy row when empty.
            if (draggedCell.row.cells.length === 0) {
                draggedCell.row.destroy();
            }

            if (
                (dragDrop.dropPointer.align === 'top' ||
                dragDrop.dropPointer.align === 'bottom') &&
                dropContext.getType() === DashboardGlobals.guiElementType.row
            ) {
                dropContext = dropContext as Row;
                const newRow = dropContext.layout.addRow(
                    {},
                    void 0,
                    (dropContext.layout.getRowIndex(dropContext) || 0) +
                        (dragDrop.dropPointer.align === 'bottom' ? 1 : 0)
                );

                newRow.mountCell(draggedCell, 0);
            } else if (
                dropContext.getType() === DashboardGlobals.guiElementType.cell
            ) {
                dropContext = dropContext as Cell;
                dropContext.row.mountCell(
                    draggedCell,
                    (dropContext.row.getCellIndex(dropContext) || 0) +
                        (dragDrop.dropPointer.align === 'right' ? 1 : 0)
                );
            }
        }

        dragDrop.hideDropPointer();
        draggedCell.show();
    }
}

namespace DragDrop {
    export interface Options {
        enabled: boolean;
        rowDropOffset: number;
        cellDropOffset: number;
        dropPointerSize: number;
    }

    export interface DropPointer {
        isVisible: boolean;
        element: HTMLDOMElement;
        align: string;
    }
}

export default DragDrop;
