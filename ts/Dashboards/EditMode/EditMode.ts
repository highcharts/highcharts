/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Imports
 *
 * */
import type Layout from '../Layout/Layout';
import type Cell from '../Layout/Cell';
import type Row from '../Layout/Row';
import type Board from '../Board';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

import U from '../../Core/Utilities.js';
import EditGlobals from './EditGlobals.js';
import EditRenderer from './EditRenderer.js';
import CellEditToolbar from './Toolbar/CellEditToolbar.js';
import RowEditToolbar from './Toolbar/RowEditToolbar.js';
import SidebarPopup from './SidebarPopup.js';
import EditContextMenu from './EditContextMenu.js';
import DragDrop from '../Actions/DragDrop.js';
import Resizer from '../Actions/Resizer.js';
import ConfirmationPopup from './ConfirmationPopup.js';
import ContextDetection from '../Actions/ContextDetection.js';
import GUIElement from '../Layout/GUIElement.js';

const {
    merge,
    addEvent,
    createElement,
    css
} = U;

/* *
 *
 *  Class
 *
 * */
class EditMode {
    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        board: Board,
        options?: EditMode.Options
    ) {
        this.iconsURLPrefix =
            (options && options.iconsURLPrefix) || this.iconsURLPrefix;

        this.options = merge(
            // Default options.
            {
                enabled: true,
                contextMenu: {
                    icon: this.iconsURLPrefix + 'menu.svg'
                },
                tools: {
                    addComponentBtn: {
                        icon: this.iconsURLPrefix + 'add.svg'
                    },
                    rwdIcons: {
                        small: this.iconsURLPrefix + 'smartphone.svg',
                        medium: this.iconsURLPrefix + 'tablet.svg',
                        large: this.iconsURLPrefix + 'computer.svg'
                    }
                },
                confirmationPopup: {
                    close: {
                        icon: this.iconsURLPrefix + 'close.svg'
                    }
                }
            },
            options || {});

        this.board = board;
        this.lang = merge({}, EditGlobals.lang, this.options.lang);

        this.contextPointer = {
            isVisible: false,
            element: createElement(
                'div',
                { className: EditGlobals.classNames.contextDetectionPointer },
                {},
                this.board.container
            )
        };

        this.isInitialized = false;
        this.isContextDetectionActive = false;
        this.tools = {};
        this.rwdMenu = [];
        this.rwdMode = this.board.getLayoutContainerSize();

        this.createTools();

        this.confirmationPopup = new ConfirmationPopup(
            board.container,
            this.iconsURLPrefix,
            this,
            this.options.confirmationPopup
        );

        // Create edit overlay.
        this.editOverlay = createElement(
            'div', {
                className: EditGlobals.classNames.editOverlay
            }, {},
            board.container
        );
        this.isEditOverlayActive = false;
    }

    /* *
    *
    *  Properties
    *
    * */

    private active: boolean = false;
    public options: EditMode.Options;
    public iconsURLPrefix: string = EditGlobals.iconsURLPrefix;
    public board: Board;
    public lang: EditGlobals.LangOptions;
    public cellToolbar?: CellEditToolbar;
    public rowToolbar?: RowEditToolbar;
    public sidebar?: SidebarPopup;
    public dragDrop?: DragDrop;
    public resizer?: Resizer;
    public isInitialized: boolean;
    public addComponentBtn?: HTMLDOMElement;
    public rwdMode: string;
    public rwdMenu: Array<HTMLDOMElement>;
    public tools: EditMode.Tools;
    public confirmationPopup?: ConfirmationPopup;
    public isContextDetectionActive: boolean;
    public mouseCellContext?: Cell;
    public mouseRowContext?: Row;
    public potentialCellContext?: Cell;
    public editCellContext?: Cell;
    public contextPointer: EditMode.ContextPointer;
    public editOverlay: HTMLDOMElement;
    public isEditOverlayActive: boolean;

    /* *
    *
    *  Functions
    *
    * */

    public onContextBtnClick(
        editMode: EditMode
    ): void {
        // Init contextMenu if doesn't exist.
        if (!editMode.tools.contextMenu) {
            editMode.tools.contextMenu = new EditContextMenu(
                editMode.board.container,
                editMode.options.contextMenu || {},
                editMode
            );
        }

        // Show context menu.
        if (editMode.tools.contextMenu) {
            if (!editMode.tools.contextMenu.isVisible) {
                editMode.tools.contextMenu
                    .updatePosition(editMode.tools.contextButtonElement);
            }

            editMode.tools.contextMenu.setVisible(
                !editMode.tools.contextMenu.isVisible
            );
        }
    }

    public onEditModeToggle(): void {
        const editMode = this;

        if (editMode.active) {
            editMode.deactivate();
        } else {
            editMode.activate();
        }
    }

    public initEditMode(): void {
        const editMode = this;

        if (
            !(editMode.options.resize &&
                !editMode.options.resize.enabled)
        ) {
            editMode.resizer = new Resizer(editMode);
        }

        // Init dragDrop.
        if (
            !(editMode.options.dragDrop &&
                !editMode.options.dragDrop.enabled)
        ) {
            editMode.dragDrop = new DragDrop(editMode);
        }

        // Init rowToolbar.
        if (!editMode.rowToolbar) {
            editMode.rowToolbar = new RowEditToolbar(editMode);
        }

        // Init cellToolbar.
        if (!editMode.cellToolbar) {
            editMode.cellToolbar = new CellEditToolbar(editMode);
        }

        // Init Sidebar.
        if (!editMode.sidebar) {
            editMode.sidebar = new SidebarPopup(
                this.board.container,
                this.iconsURLPrefix,
                editMode
            );
        }

        editMode.isInitialized = true;
    }

    private initEvents(): void {
        const editMode = this,
            board = editMode.board;

        for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
            editMode.setLayoutEvents(board.layouts[i]);
        }

        if (editMode.cellToolbar) {
            // Stop context detection when mouse on cell toolbar.
            addEvent(
                editMode.cellToolbar.container,
                'mouseenter',
                function (): void {
                    editMode.stopContextDetection();
                }
            );

            addEvent(
                editMode.cellToolbar.container,
                'mouseleave',
                function (): void {
                    editMode.isContextDetectionActive = true;
                }
            );
        }

        if (editMode.rowToolbar) {
            // Stop context detection when mouse on row toolbar.
            addEvent(
                editMode.rowToolbar.container,
                'mouseenter',
                function (): void {
                    editMode.stopContextDetection();
                }
            );

            addEvent(
                editMode.rowToolbar.container,
                'mouseleave',
                function (): void {
                    editMode.isContextDetectionActive = true;
                }
            );
        }

        addEvent(
            board.layoutsWrapper,
            'mousemove',
            editMode.onDetectContext.bind(editMode)
        );
        addEvent(
            board.layoutsWrapper,
            'click',
            editMode.onContextConfirm.bind(editMode)
        );
        addEvent(board.layoutsWrapper, 'mouseleave', (): void => {
            editMode.hideContextPointer();
        });
    }

    private setLayoutEvents(
        layout: Layout
    ): void {
        const editMode = this;

        for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
            const row = layout.rows[j];
            editMode.setRowEvents(row);

            for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                editMode.setCellEvents(row.cells[k]);
            }
        }
    }

    public setRowEvents(
        row: Row
    ): void {
        const editMode = this;

        // Init dragDrop row events.
        if (editMode.dragDrop) {
            const dragDrop = editMode.dragDrop;
            addEvent(row.container, 'mouseenter', function (): void {
                if (editMode.isContextDetectionActive) {
                    editMode.mouseRowContext = row;
                }
            });

            addEvent(
                row.container,
                'mousemove',
                function (e: PointerEvent): void {
                    if (dragDrop.isActive && e.target === row.container) {
                        dragDrop.mouseRowContext = row;
                    }
                }
            );

            addEvent(
                row.container,
                'mouseleave',
                function (e: PointerEvent): void {
                    if (dragDrop.isActive && dragDrop.mouseRowContext === row) {
                        dragDrop.mouseRowContext = void 0;
                    }

                    if (editMode.isContextDetectionActive) {
                        editMode.mouseRowContext = void 0;
                    }
                }
            );
        }
    }

    public setCellEvents(
        cell: Cell
    ): void {
        const editMode = this;

        if (cell.nestedLayout) {
            editMode.setLayoutEvents(cell.nestedLayout);
        } else if (editMode.cellToolbar && cell.container) {
            // Init dragDrop cell events.
            if (editMode.dragDrop || editMode.resizer) {
                const dragDrop = editMode.dragDrop;

                addEvent(
                    cell.container,
                    'mouseenter',
                    function (e: PointerEvent): void {
                        if (editMode.isContextDetectionActive) {
                            editMode.mouseCellContext = cell;
                        }
                    }
                );

                addEvent(
                    cell.container,
                    'mousemove',
                    function (e: PointerEvent): void {
                        if (
                            dragDrop &&
                            dragDrop.isActive &&
                            e.target === cell.container
                        ) {
                            dragDrop.mouseCellContext = cell;
                            dragDrop.mouseRowContext = void 0;
                        }
                    }
                );

                addEvent(cell.container, 'mouseleave', function (): void {
                    if (
                        dragDrop &&
                        dragDrop.isActive &&
                        dragDrop.mouseCellContext === cell
                    ) {
                        dragDrop.mouseCellContext = void 0;
                    }

                    if (editMode.isContextDetectionActive) {
                        editMode.mouseCellContext = void 0;
                    }
                });
            }
        }
    }

    public activate(): void {
        const editMode = this;

        // Init edit mode.
        if (!editMode.isInitialized) {
            editMode.initEditMode();
            editMode.initEvents();
        }

        // Set edit mode active class to dashboard.
        editMode.board.container.classList.add(
            EditGlobals.classNames.editModeEnabled
        );

        // TODO all buttons should be activated, add some wrapper?
        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'block';
        }

        // Sets proper rwd mode.
        editMode.rwdMode = editMode.board.getLayoutContainerSize();

        // Show responsive buttons.
        this.showRwdButtons();

        editMode.active = true;
        editMode.isContextDetectionActive = true;
    }

    public deactivate(): void {
        const editMode = this,
            dashboardCnt = editMode.board.container;

        dashboardCnt.classList.remove(
            EditGlobals.classNames.editModeEnabled
        );

        // Hide toolbars.
        editMode.hideToolbars();

        // Remove highlight from the context row if exists.
        if (this.editCellContext) {
            this.editCellContext.row.setHighlight(true);
        }

        // TODO all buttons should be deactivated.
        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'none';
        }

        if (editMode.resizer) {
            editMode.resizer.disableResizer();
        }

        // Hide responsive buttons.
        this.hideRwdButtons();

        // Disable responsive width and restore elements to their original
        // positions and sizes.
        this.board.layoutsWrapper.style.width = '100%';
        this.board.reflow();

        editMode.active = false;
        editMode.stopContextDetection();

        this.editCellContext = void 0;
        this.potentialCellContext = void 0;
    }

    public isActive(): boolean {
        return this.active;
    }

    /**
     * Method for hiding edit toolbars.
     *
     * @param {Array<string>} toolbarTypes
     * The array of toolbar names to hide ('cell', 'row', 'sidebar').
     */
    public hideToolbars(
        toolbarTypes?: Array<string>
    ): void {
        const editMode = this,
            toolbarsToHide = toolbarTypes || ['cell', 'row', 'sidebar'];

        for (let i = 0, iEnd = toolbarsToHide.length; i < iEnd; ++i) {
            switch (toolbarsToHide[i]) {
                case 'cell': {
                    if (
                        editMode.cellToolbar &&
                        editMode.cellToolbar.isVisible
                    ) {
                        editMode.cellToolbar.hide();
                    }
                    break;
                }
                case 'row': {
                    if (editMode.rowToolbar && editMode.rowToolbar.isVisible) {
                        editMode.rowToolbar.hide();
                    }
                    break;
                }
                case 'sidebar': {
                    if (editMode.sidebar && editMode.sidebar.isVisible) {
                        editMode.sidebar.hide();
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    /**
     * Method for hiding edit toolbars.
     *
     * @param {Array<string>} toolbarTypes
     * The array of toolbar names to hide ('cell', 'row', 'sidebar').
     *
     * @param {Cell} currentCell
     * The cell reference for toolbar
     *
     * @param {Row} currentRow
     * The row reference for toolbar
     */
    public showToolbars(
        toolbarTypes?: Array<string>,
        currentCell?: Cell
    ): void {
        const editMode = this,
            toolbarsToShow = toolbarTypes || ['cell', 'row', 'sidebar'];

        for (let i = 0, iEnd = toolbarsToShow.length; i < iEnd; ++i) {
            switch (toolbarsToShow[i]) {
                case 'cell': {
                    if (currentCell && editMode.cellToolbar) {
                        editMode.cellToolbar.isVisible = true;
                        editMode.cellToolbar.showToolbar(currentCell);
                    }
                    break;
                }
                case 'row': {
                    if (currentCell && currentCell.row && editMode.rowToolbar) {
                        editMode.rowToolbar.isVisible = true;
                        editMode.rowToolbar.showToolbar(currentCell.row);
                    }
                    break;
                }
                case 'sidebar': {
                    if (editMode.sidebar && !editMode.sidebar.isVisible) {
                        editMode.sidebar.show();
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    public createTools(): void {
        const editMode = this;
        const options = this.options;

        // create tools container
        this.tools.container = document.createElement('div');
        this.tools.container.classList.add(EditGlobals.classNames.editTools);

        this.board.layoutsWrapper.parentNode.insertBefore(
            this.tools.container,
            this.board.layoutsWrapper
        );

        // create context menu button
        if (
            options.contextMenu &&
            options.contextMenu.enabled
        ) {
            this.tools.contextButtonElement = EditRenderer.renderContextButton(
                this.tools.container,
                editMode
            );
        }

        // create rwd menu
        this.createRwdMenu();

        // create add button
        const addIconURL = options && options.tools &&
        options.tools.addComponentBtn && options.tools.addComponentBtn.icon;

        this.addComponentBtn = EditRenderer.renderButton(
            this.tools.container,
            {
                className: EditGlobals.classNames.editToolsBtn,
                icon: addIconURL,
                value: 'Add Component',
                callback: (): void => {
                    // sidebar trigger
                    if (editMode.sidebar) {
                        editMode.sidebar.show();
                        editMode.setEditOverlay();
                    }
                },
                style: {
                    display: 'none'
                }
            }
        );
    }

    private createRwdMenu(): void {
        const rwdBreakingPoints = this.board.options.responsiveBreakpoints;
        const toolsContainer = this.tools.container;
        const options = this.options;
        const rwdIcons =
            (options && options.tools && options.tools.rwdIcons) || {};

        for (const key in rwdBreakingPoints) {
            if (toolsContainer) {
                const btn = EditRenderer.renderButton(
                    toolsContainer,
                    {
                        className: EditGlobals.classNames.editToolsBtn,
                        icon: (rwdIcons as any)[key] || '',
                        value: key,
                        callback: (): void => {
                            this.board.layoutsWrapper.style.width =
                                rwdBreakingPoints[key] + 'px';
                            this.rwdMode = key;

                            // reflow elements
                            this.board.reflow();
                        },
                        style: {
                            display: 'none'
                        }
                    }
                );

                if (btn) {
                    this.rwdMenu.push(btn);
                }
            }
        }
    }

    public showRwdButtons(): void {
        for (let i = 0, iEnd = this.rwdMenu.length; i < iEnd; ++i) {
            (this.rwdMenu[i] as HTMLDOMElement).style.display = 'block';
        }
    }

    public hideRwdButtons(): void {
        for (let i = 0, iEnd = this.rwdMenu.length; i < iEnd; ++i) {
            (this.rwdMenu[i] as HTMLDOMElement).style.display = 'none';
        }
    }

    public onDetectContext(e: PointerEvent): void {
        const editMode = this,
            offset = 50; // TODO - add it from options.

        if (
            editMode.isActive() &&
            editMode.isContextDetectionActive &&
            (editMode.mouseCellContext || editMode.mouseRowContext) &&
            !(editMode.dragDrop || {}).isActive
        ) {
            let cellContext,
                rowContext;

            if (editMode.mouseCellContext) {
                cellContext = ContextDetection
                    .getContext(editMode.mouseCellContext, e, offset).cell;
            } else if (editMode.mouseRowContext) {
                rowContext = editMode.mouseRowContext;
                cellContext = rowContext.layout.parentCell;
            }

            this.potentialCellContext = cellContext;

            if (cellContext) {
                const cellContextOffsets = GUIElement
                    .getOffsets(cellContext, editMode.board.container);
                const { width, height } = GUIElement
                    .getDimFromOffsets(cellContextOffsets);

                editMode.showContextPointer(
                    cellContextOffsets.left,
                    cellContextOffsets.top,
                    width,
                    height
                );
            }
        }
    }

    public stopContextDetection(): void {
        this.isContextDetectionActive = false;
        this.hideContextPointer();
    }

    public onContextConfirm(): void {
        if (
            this.isContextDetectionActive &&
            this.potentialCellContext &&
            this.editCellContext !== this.potentialCellContext
        ) {
            this.setEditCellContext(
                this.potentialCellContext,
                this.editCellContext
            );
        }
    }

    public setEditCellContext(
        editCellContext: Cell,
        oldEditCellContext?: Cell
    ): void {
        const editMode = this,
            oldContextRow = oldEditCellContext && oldEditCellContext.row;

        editMode.editCellContext = editCellContext;
        editMode.showToolbars(['row', 'cell'], editCellContext);

        if (!oldContextRow || oldContextRow !== editCellContext.row) {
            if (oldContextRow) {
                // Remove highlight from the previous row.
                oldContextRow.setHighlight(true);
            }

            // Add highlight to the context row.
            editCellContext.row.setHighlight();
        }

        if (editMode.resizer) {
            editMode.resizer.setSnapPositions(editCellContext);
        }
    }

    /**
     * Method for showing and positioning context pointer.
     *
     * @param {number} left
     * Context pointer left position.
     *
     * @param {number} top
     * Context pointer top position.
     *
     * @param {number} width
     * Context pointer width.
     *
     * @param {number} height
     * Context pointer height.
     */
    private showContextPointer(
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        this.contextPointer.isVisible = true;

        css(this.contextPointer.element, {
            display: 'block',
            left: left + 'px',
            top: top + 'px',
            height: height + 'px',
            width: width + 'px'
        });
    }

    /**
     * Method for hiding context pointer.
     */
    public hideContextPointer(): void {
        if (this.contextPointer.isVisible) {
            this.contextPointer.isVisible = false;
            this.contextPointer.element.style.display = 'none';
        }
    }

    public setEditOverlay(
        remove?: boolean
    ): void {
        const editMode = this,
            cnt = editMode.editOverlay,
            isSet = cnt.classList.contains(
                EditGlobals.classNames.editOverlayActive
            );

        if (!remove && !isSet) {
            cnt.classList.add(EditGlobals.classNames.editOverlayActive);
            editMode.isEditOverlayActive = true;
        } else if (remove && isSet) {
            cnt.classList.remove(EditGlobals.classNames.editOverlayActive);
            editMode.isEditOverlayActive = false;
        }
    }
}

/* *
 *
 *  Namespace
 *
 * */
namespace EditMode {
    export interface Options {
        enabled: boolean;
        /**
         * The URL prefix for the icons used in the edit mode like the context
         * menu icons, the row and cell edit toolbar icons, etc.
         *
         * @default 'https://code.highcharts.com/@product.version@/gfx/dashboard-icons/'
         */
        iconsURLPrefix?: string;
        lang?: EditGlobals.LangOptions|string;
        toolbars?: EditMode.Toolbars;
        dragDrop?: DragDrop.Options;
        resize?: Resizer.Options;
        tools: Tools;
        contextMenu?: EditContextMenu.Options;
        confirmationPopup: ConfirmationPopup.Options;
    }

    export interface Toolbars {
        cell?: CellEditToolbar.Options;
        row?: RowEditToolbar.Options;
        settings?: SidebarPopup.Options;
    }

    export interface Tools {
        contextMenu?: EditContextMenu;
        contextButtonElement?: HTMLDOMElement;
        addComponentBtn?: AddComponentBtn;
        container?: HTMLDOMElement;
        rwdIcons?: RwdIcons;
    }

    export interface AddComponentBtn {
        icon: string;
    }

    export interface RwdIcons {
        small: string;
        medium: string;
        large: string;
    }

    export interface ContextPointer {
        isVisible: boolean;
        element: HTMLDOMElement;
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default EditMode;
