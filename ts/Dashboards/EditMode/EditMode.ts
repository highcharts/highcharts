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
/**
 * Edit mode class.
 */
class EditMode {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Edit mode constructor.
     *
     * @param board
     * Board instance
     * @param options
     * Edit mode options
     */
    constructor(board: Board, options?: EditMode.Options) {
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
            options || {}
        );

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
            'div',
            {
                className: EditGlobals.classNames.editOverlay
            },
            {},
            board.container
        );
        this.isEditOverlayActive = false;
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    private active: boolean = false;
    /**
     * Edit mode options.
     */
    public options: EditMode.Options;
    /**
     * Url from which the icons will be fetched.
     */
    public iconsURLPrefix: string = EditGlobals.iconsURLPrefix;
    /**
     * Dashboards' board instance.
     */
    public board: Board;
    /**
     * Language dictionary.
     */
    public lang: EditGlobals.LangOptions;
    /**
     * Instance of the toolbar, which is displayed for the cell.
     */
    public cellToolbar?: CellEditToolbar;
    /**
     * Instance of the toolbar, which is displayed for the row.
     */
    public rowToolbar?: RowEditToolbar;
    /**
     * Intance of the sidebar.
     */
    public sidebar?: SidebarPopup;
    /**
     * @internal
     */
    public dragDrop?: DragDrop;
    /**
     * @internal
     */
    public resizer?: Resizer;
    /**
     * Whether the instance of edit mode was initialized.
     */
    public isInitialized: boolean;
    /**
     * HTML Element responsible for adding the component.
     */
    public addComponentBtn?: HTMLDOMElement;
    /**
     * Current selected mode, for emulating different screen width for
     * responsive web design.
     */
    public rwdMode: string;
    /**
     * HTML elements responsible for changing the container width.
     */
    public rwdMenu: Array<HTMLDOMElement>;
    /**
     * @internal
     */
    public tools: EditMode.Tools;
    /**
     * Instance of the confirmation popup
     */
    public confirmationPopup?: ConfirmationPopup;
    /**
     * @internal
     * Whether the context detection is active.
     */
    public isContextDetectionActive: boolean;
    /**
     * @internal
     */
    public mouseCellContext?: Cell;
    /**
     * @internal
     */
    public mouseRowContext?: Row;
    /**
     * @internal
     */
    public potentialCellContext?: Cell;
    /**
     * @internal
     */
    public editCellContext?: Cell;
    /**
     * @internal
     */
    public contextPointer: EditMode.ContextPointer;
    /**
     * @internal
     */
    public editOverlay: HTMLDOMElement;
    /**
     * @internal
     */
    public isEditOverlayActive: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Event to fire on click of the context button.
     */
    public onContextBtnClick(): void {
        // Init contextMenu if doesn't exist.
        const editMode = this;
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
                editMode.tools.contextMenu.updatePosition(
                    editMode.tools.contextButtonElement
                );
            }

            editMode.tools.contextMenu.setVisible(
                !editMode.tools.contextMenu.isVisible
            );
        }
    }

    /**
     * Activate/Deactivate edit mode.
     */
    public onEditModeToggle(): void {
        const editMode = this;

        if (editMode.active) {
            editMode.deactivate();
        } else {
            editMode.activate();
        }
    }

    /**
     * Init the instance of edit mode.
     */
    public init(): void {
        const editMode = this;

        if (!(editMode.options.resize && !editMode.options.resize.enabled)) {
            editMode.resizer = new Resizer(editMode);
        }

        // Init dragDrop.
        if (
            !(editMode.options.dragDrop && !editMode.options.dragDrop.enabled)
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

    /**
     * @intenal
     */
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

    /**
     * @internal
     */
    private setLayoutEvents(layout: Layout): void {
        const editMode = this;

        for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
            const row = layout.rows[j];
            editMode.setRowEvents(row);

            for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                editMode.setCellEvents(row.cells[k]);
            }
        }
    }

    public setRowEvents(row: Row): void {
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

    public setCellEvents(cell: Cell): void {
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

    /**
     * Activate the edit mode.
     */
    public activate(): void {
        const editMode = this;

        // Init edit mode.
        if (!editMode.isInitialized) {
            editMode.init();
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

        dashboardCnt.classList.remove(EditGlobals.classNames.editModeEnabled);

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

    /**
     * Function to check whether the edit mode is activated.
     *
     * @returns
     * Whether the edit mode is activated.
     */
    public isActive(): boolean {
        return this.active;
    }

    /**
     * Method for hiding edit toolbars.
     *
     * @param {Array<string>} toolbarTypes
     * The array of toolbar names to hide ('cell', 'row', 'sidebar').
     */
    public hideToolbars(toolbarTypes?: Array<string>): void {
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

    /**
     * Creates the buttons such as `addComponent` button, rwd buttons and
     * context menu button.
     */
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
        if (options.contextMenu && options.contextMenu.enabled) {
            this.tools.contextButtonElement = EditRenderer.renderContextButton(
                this.tools.container,
                editMode
            );
        }

        // create rwd menu
        this.createRwdMenu();

        // create add button
        const addIconURL =
            options &&
            options.tools &&
            options.tools.addComponentBtn &&
            options.tools.addComponentBtn.icon;

        this.addComponentBtn = EditRenderer.renderButton(this.tools.container, {
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
        });
    }

    /**
     * @internal
     */
    private createRwdMenu(): void {
        const rwdBreakingPoints = this.board.options.responsiveBreakpoints;
        const toolsContainer = this.tools.container;
        const options = this.options;
        const rwdIcons =
            (options && options.tools && options.tools.rwdIcons) || {};

        for (const key in rwdBreakingPoints) {
            if (toolsContainer) {
                const btn = EditRenderer.renderButton(toolsContainer, {
                    className: EditGlobals.classNames.editToolsBtn,
                    icon: (rwdIcons as any)[key] || '',
                    value: key,
                    callback: (e: PointerEvent): void => {
                        const button = e.target as HTMLElement,
                            isSelected = button.classList.contains('selected');

                        // Deselect given button and reset board width.
                        if (isSelected) {
                            button.classList.remove('selected');
                            this.board.layoutsWrapper.style.width = '';
                            this.rwdMode = '';
                        } else {
                            // Deselect all buttons.
                            this.rwdMenu.forEach((btn: HTMLElement): void => {
                                btn.classList.remove('selected');
                            });

                            // Select given button and change board width.
                            button.classList.add('selected');
                            this.board.layoutsWrapper.style.width =
                                rwdBreakingPoints[key] + 'px';
                            this.rwdMode = key;
                        }

                        // Reflow elements.
                        this.board.reflow();
                    },
                    style: {
                        display: 'none'
                    }
                });

                if (btn) {
                    this.rwdMenu.push(btn);
                }
            }
        }
    }

    /**
     * Shows the rwdButtons
     */
    public showRwdButtons(): void {
        for (let i = 0, iEnd = this.rwdMenu.length; i < iEnd; ++i) {
            (this.rwdMenu[i] as HTMLDOMElement).style.display = 'block';
        }
    }

    /**
     * hides the rwdButtons
     */
    public hideRwdButtons(): void {
        for (let i = 0, iEnd = this.rwdMenu.length; i < iEnd; ++i) {
            (this.rwdMenu[i] as HTMLDOMElement).style.display = 'none';
        }
    }

    /**
     * Event fired when detecting context on drag&drop
     *
     * @param e
     * Mouse pointer event
     */
    public onDetectContext(e: PointerEvent): void {
        const editMode = this,
            offset = 50; // TODO - add it from options.

        if (
            editMode.isActive() &&
            editMode.isContextDetectionActive &&
            (editMode.mouseCellContext || editMode.mouseRowContext) &&
            !(editMode.dragDrop || {}).isActive
        ) {
            let cellContext, rowContext;

            if (editMode.mouseCellContext) {
                cellContext = ContextDetection.getContext(
                    editMode.mouseCellContext,
                    e,
                    offset
                ).cell;
            } else if (editMode.mouseRowContext) {
                rowContext = editMode.mouseRowContext;
                cellContext = rowContext.layout.parentCell;
            }

            this.potentialCellContext = cellContext;

            if (cellContext) {
                const cellContextOffsets = GUIElement.getOffsets(
                    cellContext,
                    editMode.board.container
                );
                const { width, height } =
                    GUIElement.getDimFromOffsets(cellContextOffsets);

                editMode.showContextPointer(
                    cellContextOffsets.left,
                    cellContextOffsets.top,
                    width,
                    height
                );
            }
        }
    }

    /**
     * Stops the context detection.
     */
    public stopContextDetection(): void {
        this.isContextDetectionActive = false;
        this.hideContextPointer();
    }

    /**
     * Confirms the selected context.
     */
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

    /**
     * @internal
     */
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

    /**
     * Adds/Removes the edit mode overlay.
     *
     * @param remove
     * Whether the edit overlay should be removed.
     */
    public setEditOverlay(remove?: boolean): void {
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
    /**
     * Edit mode options.
     */
    export interface Options {
        /**
         * Whether the edit mode should be enabled for the dashboards.
         */
        enabled: boolean;
        /**
         * The URL prefix for the icons used in the edit mode like the context
         * menu icons, the row and cell edit toolbar icons, etc.
         *
         * @default 'https://code.highcharts.com/@product.version@/gfx/dashboard-icons/'
         */
        iconsURLPrefix?: string;
        /**
         * Additional Language options.
         */
        lang?: EditGlobals.LangOptions|string;
        /**
         * Toolbar options.
         */
        toolbars?: Toolbars;
        /**
         * Drag&Drop options.
         */
        dragDrop?: DragDrop.Options;
        /**
         * Resize options.
         */
        resize?: Resizer.Options;
        /**
         * @internal
         */
        tools: Tools;
        /**
         * Context menu options.
         */
        contextMenu?: EditContextMenu.Options;
        /**
         * Confirmation popup options.
         */
        confirmationPopup: ConfirmationPopup.Options;
    }

    /**
     * Toolbar options.
     */
    export interface Toolbars {
        /**
         * Options of the cell toolbar.
         */
        cell?: CellEditToolbar.Options;
        /**
         * Options of the row toolbar.
         */
        row?: RowEditToolbar.Options;
        /**
         * options of the sidebar.
         */
        sidebar?: SidebarPopup.Options;
    }

    /**
     * @Internal
     */
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
