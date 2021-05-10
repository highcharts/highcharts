import U from './../../Core/Utilities.js';
import type Row from './../Layout/Row.js';
import type Cell from './../Layout/Cell.js';
import DashboardGlobals from './../DashboardGlobals.js';
import EditMode from './../EditMode/EditMode.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import GUIElement from '../Layout/GUIElement.js';

const {
    addEvent,
    merge,
    css,
    createElement
} = U;

class DragDrop {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: DragDrop.Options = {
        enabled: true
    }

    /* *
    *
    *  Constructors
    *
    * */
    constructor(
        editMode: EditMode,
        options?: DragDrop.Options
    ) {
        this.editMode = editMode;
        this.options = merge(DragDrop.defaultOptions, options);

        this.mockElement = createElement(
            'div', {
                className: 'drag-mock-element'
            }, {
                position: 'absolute',
                top: '100px',
                left: '100px',
                height: '50px',
                width: '50px',
                zIndex: 99999,
                display: 'none',
                cursor: 'grab',
                pointerEvents: 'none',
                backgroundColor: 'rgb(255, 255, 255)',
                boxShadow: 'rgb(4 9 20 / 3%) 0px 0.46875rem 2.1875rem, rgb(4 9 20 / 3%) 0px 0.9375rem 1.40625rem, ' +
                  'rgb(4 9 20 / 5%) 0px 0.25rem 0.53125rem, rgb(4 9 20 / 3%) 0px 0.125rem 0.1875rem'
            },
            editMode.dashboard.container
        );

        this.dropPointer = {
            isVisible: false,
            align: '',
            element: createElement(
                'div', {
                    className: 'drop-pointer'
                }, {
                    position: 'absolute',
                    zIndex: 9999,
                    display: 'none',
                    pointerEvents: 'none',
                    background: `repeating-linear-gradient(
                        45deg,
                        rgba(3, 104, 8, 0.58),
                        rgba(3, 104, 8, 0.58) 10px,
                        rgba(4, 134, 11, 0.2) 10px,
                        rgba(4, 134, 11, 0.2) 20px
                      )`,
                    opacity: 0.5,
                    transition: '0.1s',
                    borderRadius: '2px'
                },
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
    public editMode: EditMode;
    public options: DragDrop.Options;
    public context?: Cell|Row; // Component icon from the sidebar
    public mockElement: HTMLDOMElement;
    public isActive?: boolean;
    public mouseContext?: Cell|Row;
    public dropContext?: Cell|Row;
    public dropPointer: DragDrop.DropPointer;

    /* *
     *
     *  Functions
     *
     * */

    // Get overlapped layout level.
    private getDropContextLevel(
        mouseContext: Cell,
        offset: number,
        dropEdgeOffset: number
    ): number {
        // Array of overlapped levels.
        const overlappedLevels = mouseContext.getOverlappingLevels(this.dropPointer.align, offset / 2);

        // Divide offset to level sections (eg 3 nested layouts -
        // cell edge will have 3 sections each 1/3 offset width).
        const divOffset = offset / overlappedLevels.length;

        // Overlapped nested layout level.
        const lastOverlappedLevel = overlappedLevels[overlappedLevels.length - 1];

        let level = mouseContext.row.layout.level - Math.floor(dropEdgeOffset / divOffset);
        level = level < lastOverlappedLevel ? lastOverlappedLevel : (
            level > mouseContext.row.layout.level ?
                mouseContext.row.layout.level : level
        );

        return level;
    }

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

    private hideDropPointer(): void {
        if (this.dropPointer.isVisible) {
            this.dropPointer.isVisible = false;
            this.dropPointer.align = '';
            this.dropPointer.element.style.display = 'none';
        }
    }

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

    public initEvents(): void {
        const dragDrop = this;

        // DragDrop events.
        addEvent(document, 'mousemove', dragDrop.onDrag.bind(dragDrop));
        addEvent(document, 'mouseup', dragDrop.onDragEnd.bind(dragDrop));
    }

    public onDragStart(
        context: Cell|Row,
        e?: any
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

    public onDrag(e: any): void {
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

    public onRowDrag(e: any): void {
        const dragDrop = this,
            mouseContext = dragDrop.mouseContext as Cell,
            mouseContextRow = mouseContext && mouseContext.row,
            height = 16;

        let offset = 30,
            updateDropPointer = false;

        if (mouseContextRow && mouseContextRow.container) {
            let dropContextRowOffsets = GUIElement.getOffsets(mouseContextRow);
            let { width: rowWidth, height: rowHeight } = GUIElement.getDimFromOffsets(dropContextRowOffsets);

            // Correct offset when row to small.
            if (rowHeight < 2 * offset) {
                offset = rowHeight / 2;
            }

            // Get mouse position relative to the mouseContext top edge.
            const topEdgeY = e.clientY - dropContextRowOffsets.top;
            dragDrop.dropPointer.align = topEdgeY >= -offset && topEdgeY <= offset ? 'top' :
                (topEdgeY - rowHeight >= -offset && topEdgeY - rowHeight <= offset ? 'bottom' : '');

            if (dragDrop.dropPointer.align) {
                dragDrop.dropContext = mouseContextRow;

                // Get appropriate dropContext on nested layouts edge.
                if (mouseContext.row.layout.level && dragDrop.isGUIElementOnEdge(mouseContext)) {
                    // Mouse position relative to the drop context offset.
                    const dropEdgeOffset = dragDrop.dropPointer.align === 'bottom' ?
                            topEdgeY - rowHeight + offset : offset - topEdgeY,
                        level = dragDrop.getDropContextLevel(mouseContext, offset, dropEdgeOffset),
                        dropContextCell = mouseContext.getParentCell(level);

                    // Get nested drop context offsets.
                    if (dropContextCell) {
                        // Set nested drop context.
                        dragDrop.dropContext = dropContextCell.row;
                        updateDropPointer = true;

                        dropContextRowOffsets = GUIElement.getOffsets(dragDrop.dropContext);
                        ({ width: rowWidth, height: rowHeight } = GUIElement.getDimFromOffsets(dropContextRowOffsets));
                    }
                }

                // Update or show drop pointer.
                if (!dragDrop.dropPointer.isVisible || updateDropPointer) {
                    const dashBoundingRect = dragDrop.editMode.dashboard.container.getBoundingClientRect();
                    dragDrop.showDropPointer(
                        dropContextRowOffsets.left - dashBoundingRect.left,
                        dropContextRowOffsets.top - dashBoundingRect.top +
                            (dragDrop.dropPointer.align === 'bottom' ? rowHeight : 0) - height / 2,
                        rowWidth,
                        height
                    );
                }
            } else {
                dragDrop.dropContext = void 0;
                dragDrop.hideDropPointer();
            }
        }
    }

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

    public onCellDrag(e: any): void {
        const dragDrop = this,
            mouseContext = dragDrop.mouseContext as Cell,
            width = 16;

        let updateDropPointer = false,
            offset = 50;

        if (mouseContext && mouseContext.container) {
            let dropContextOffsets = GUIElement.getOffsets(
                mouseContext, dragDrop.editMode.dashboard.container);
            let { width: cellWidth, height: cellHeight } = GUIElement.getDimFromOffsets(dropContextOffsets);

            // Correct offset when cell to small.
            if (cellWidth < 2 * offset) {
                offset = cellWidth / 2;
            }

            // Get mouse position relative to the mouseContext left edge.
            const leftEdgeX = e.clientX - dropContextOffsets.left;
            dragDrop.dropPointer.align = leftEdgeX >= -offset && leftEdgeX <= offset ? 'left' :
                (leftEdgeX - cellWidth >= -offset && leftEdgeX - cellWidth <= offset ? 'right' : '');

            if (!dragDrop.dropPointer.align) {
                // Check if cell is dragged as row.
                dragDrop.onRowDrag(e);
            } else {
                dragDrop.dropContext = mouseContext;

                // Get appropriate dropContext on nested layouts edge.
                if (mouseContext.row.layout.level && dragDrop.isGUIElementOnEdge(mouseContext)) {
                    // Mouse position relative to the drop context offset.
                    const dropEdgeOffset = dragDrop.dropPointer.align === 'right' ?
                            leftEdgeX - cellWidth + offset : offset - leftEdgeX,
                        level = dragDrop.getDropContextLevel(mouseContext, offset, dropEdgeOffset);

                    // Set nested drop context.
                    dragDrop.dropContext = mouseContext.getParentCell(level);

                    // Get nested drop context offsets.
                    if (dragDrop.dropContext) {
                        updateDropPointer = true;

                        dropContextOffsets = GUIElement.getOffsets(
                            dragDrop.dropContext, dragDrop.editMode.dashboard.container);
                        ({ width: cellWidth, height: cellHeight } = GUIElement.getDimFromOffsets(dropContextOffsets));
                    }
                }

                // Update or show drop pointer.
                if (!dragDrop.dropPointer.isVisible || updateDropPointer) {
                    dragDrop.showDropPointer(
                        dropContextOffsets.left + (dragDrop.dropPointer.align === 'right' ? cellWidth : 0) -
                            width / 2,
                        dropContextOffsets.top,
                        width,
                        cellHeight
                    );
                }
            }
        }
    }

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
                dropContext.type === DashboardGlobals.guiElementType.row
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
                dropContext.type === DashboardGlobals.guiElementType.cell
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

    public setMockElementPosition(
        mouseEvent: any
    ): void {
        const dragDrop = this,
            dashBoundingRect =
                dragDrop.editMode.dashboard.container.getBoundingClientRect(),
            offset = dragDrop.mockElement.clientWidth / 2,
            x = mouseEvent.clientX - dashBoundingRect.left - offset,
            y = mouseEvent.clientY - dashBoundingRect.top - offset;

        css(this.mockElement, { left: x + 'px', top: y + 'px' });
    }
}

namespace DragDrop {
    export interface Options {
        enabled: boolean;
    }

    export interface DropPointer {
        isVisible: boolean;
        element: HTMLDOMElement;
        align: string;
    }
}

export default DragDrop;
