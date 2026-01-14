/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type Row from '../Layout/Row';
import type Board from '../Board';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

import Cell from '../Layout/Cell.js';
import CellHTML from '../Layout/CellHTML.js';
import EditGlobals from './EditGlobals.js';
import EditRenderer from './EditRenderer.js';
import CellEditToolbar from './Toolbar/CellEditToolbar.js';
import RowEditToolbar from './Toolbar/RowEditToolbar.js';
import SidebarPopup from './SidebarPopup.js';
import EditContextMenu from './EditContextMenu.js';
import DragDrop from '../Actions/DragDrop.js';
import Resizer from '../Actions/Resizer.js';
import ConfirmationPopup from './ConfirmationPopup.js';
import GUIElement from '../Layout/GUIElement.js';
import Globals from '../Globals.js';
import Layout from '../Layout/Layout.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    css,
    merge
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

    /**
     * Edit mode constructor.
     * @internal
     *
     * @param board
     * Board instance
     *
     * @param options
     * Edit mode options
     */
    constructor(
        board: Board,
        options?: EditMode.Options
    ) {
        this.iconsURLPrefix =
            (options && options.iconsURLPrefix) || this.iconsURLPrefix;

        this.options = merge(
            // Default options.
            {
                confirmationPopup: {
                    close: {
                        icon: this.iconsURLPrefix + 'close.svg'
                    }
                },
                contextMenu: {
                    icon: this.iconsURLPrefix + 'menu.svg'
                },
                dragDrop: {
                    enabled: true
                },
                viewFullscreen: {
                    enabled: true
                },
                enabled: true,
                resize: {
                    enabled: true
                },
                settings: {
                    enabled: true
                },
                toolbars: {
                    cell: {
                        enabled: true
                    },
                    row: {
                        enabled: true
                    }
                },
                tools: {
                    addComponentBtn: {
                        enabled: true,
                        icon: this.iconsURLPrefix + 'add.svg'
                    }
                }
            } as EditMode.Options,
            options || {}
        );

        this.board = board;
        this.lang = merge({}, EditGlobals.lang, this.options.lang);

        board.boardWrapper = board.container;
        if (board.guiEnabled) {
            this.initLayout();
        }

        this.isInitialized = false;
        this.isContextDetectionActive = false;
        this.tools = {};

        if (board.editModeEnabled) {
            this.customHTMLMode = !this.board.layoutsWrapper;

            this.contextPointer = {
                isVisible: false,
                element: createElement(
                    'div',
                    {
                        className:
                            EditGlobals.classNames.contextDetectionPointer
                    },
                    {},
                    board.container
                )
            };

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

            board.fullscreen = new Globals.win.Dashboards.Fullscreen(board);

            if (this.customHTMLMode) {
                board.container.classList.add(
                    Globals.classNames.boardContainer
                );
            }
        }
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * @internal
     */
    private active: boolean = false;
    /**
     * Whether the board is generated with custom HTML.
     */
    public customHTMLMode: boolean = false;
    /**
     * Edit mode options.
     */
    public options: EditMode.Options;
    /**
     * URL from which the icons will be fetched.
     */
    public iconsURLPrefix: string = 'https://code.highcharts.com/dashboards/@product.version@/gfx/dashboards-icons/';
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
     * Instance of the sidebar.
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
     * @internal
     */
    public isInitialized: boolean;
    /**
     * HTML Element responsible for adding the component.
     * @internal
     */
    public addComponentBtn?: HTMLDOMElement;
    /**
     * @internal
     */
    public tools: EditMode.Tools;
    /**
     * Instance of the confirmation popup.
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
    public mouseCellContext?: Cell | CellHTML;
    /**
     * @internal
     */
    public mouseRowContext?: Row;
    /**
     * @internal
     */
    public potentialCellContext?: Cell | CellHTML;
    /**
     * @internal
     */
    public editCellContext?: Cell | CellHTML;
    /**
     * @internal
     */
    public contextPointer?: EditMode.ContextPointer;
    /**
     * @internal
     */
    public editOverlay?: HTMLDOMElement;
    /**
     * @internal
     */
    public isEditOverlayActive?: boolean;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Event to fire on click of the context button.
     * @internal
     */
    public onContextBtnClick(): void {
        const editMode = this;

        // Toggle context menu visibility.
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

    /**
     * Activate or deactivate edit mode.
     */
    public toggleEditMode(): void {
        const editMode = this;

        if (editMode.active) {
            editMode.deactivate();
        } else {
            editMode.activate();
        }
    }

    /**
     * Init the instance of edit mode.
     * @internal
     */
    public init(): void {
        const editMode = this;

        if (this.options.resize?.enabled && !editMode.customHTMLMode) {
            editMode.resizer = new Resizer(editMode, editMode.options.resize);
        }

        editMode.dragDrop = new DragDrop(
            editMode,
            editMode.options.dragDrop
        );

        // Init rowToolbar.
        if (
            editMode.options.toolbars?.row?.enabled &&
            !editMode.rowToolbar &&
            !editMode.customHTMLMode
        ) {
            editMode.rowToolbar = new RowEditToolbar(editMode);
        }

        // Init cellToolbar.
        if (editMode.options.toolbars?.cell?.enabled && !editMode.cellToolbar) {
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
     * Init events for edit mode.
     * @internal
     */
    private initEvents(): void {
        const editMode = this,
            board = editMode.board;

        if (this.customHTMLMode) {
            const length = board.mountedComponents.length;

            for (let i = 0, iEnd = length; i < iEnd; ++i) {
                editMode.setCellEvents(board.mountedComponents[i].cell);
            }
        } else {
            for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
                editMode.setLayoutEvents(board.layouts[i]);
            }
        }

        addEvent(document, 'keydown', (e: KeyboardEvent): void => {
            if (e.key === 'Escape' && editMode.isActive()) {
                editMode.hideToolbars(['cell', 'row']);
                editMode.editCellContext = void 0;
                editMode.resizer?.disableResizer();
            }
        });

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

        const elementForEvents = this.customHTMLMode ?
            board.container : board.layoutsWrapper;

        addEvent(
            elementForEvents,
            'mousemove',
            editMode.onDetectContext.bind(editMode)
        );
        addEvent(
            elementForEvents,
            'click',
            editMode.onContextConfirm.bind(editMode)
        );
        addEvent(
            elementForEvents,
            'mouseleave',
            (): void => {
                editMode.hideContextPointer();
            }
        );
    }

    /**
     * Initialize the container for the layouts.
     * @internal
     *
     */
    private initLayout(): void {
        const board = this.board;

        // Clear the container from any content.
        board.container.innerHTML = '';

        // Add container for the board.
        board.container = createElement(
            'div', {
                className: Globals.classNames.boardContainer
            }, {},
            board.boardWrapper
        );

        // Create layouts wrapper.
        board.layoutsWrapper = createElement(
            'div', {
                className: Globals.classNames.layoutsWrapper
            }, {},
            board.container
        );

        if (board.options.gui) {
            this.setLayouts(board.options.gui);
        }
    }

    /**
     * Creates a new layouts and adds it to the dashboard based on the options.
     * @internal
     *
     * @param guiOptions
     * The GUI options for the layout.
     *
     */
    private setLayouts(guiOptions: Board.GUIOptions): void {
        const board = this.board,
            layoutsOptions = guiOptions.layouts;

        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            board.layouts.push(
                new Layout(
                    board,
                    merge({}, guiOptions.layoutOptions, layoutsOptions[i])
                )
            );
        }
    }

    /**
     * Set events for the layout.
     * @internal
     */
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

    /**
     * Set events for the row.
     * @internal
     */
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
                function (): void {
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

    /**
     * Set events for the cell.
     * @internal
     */
    public setCellEvents(cell: Cell | CellHTML): void {
        const editMode = this;

        if (CellHTML.isCellHTML(cell)) {
            addEvent(
                cell.container,
                'mouseenter',
                function (): void {
                    if (editMode.isContextDetectionActive) {
                        editMode.mouseCellContext = cell;
                    }
                }
            );
        } else {
            if (cell.nestedLayout) {
                editMode.setLayoutEvents(cell.nestedLayout);
            } else if (editMode.cellToolbar && cell.container) {
                addEvent(
                    cell.container,
                    'mouseenter',
                    function (): void {
                        if (editMode.isContextDetectionActive) {
                            editMode.mouseCellContext = cell;
                        }
                    }
                );

                // Init dragDrop cell events only when using layouts.
                if ((editMode.dragDrop || editMode.resizer)) {
                    const dragDrop = editMode.dragDrop;

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

                    addEvent(
                        cell.container,
                        'mouseleave',
                        function (): void {
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
                        }
                    );
                }
            }
        }

    }
    /**
     * Activate the edit mode.
     * @internal
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

        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'block';
        }

        editMode.active = true;
        editMode.isContextDetectionActive = true;
    }

    /**
     * Deactivate the edit mode.
     * @internal
     */
    public deactivate(): void {
        const editMode = this,
            dashboardCnt = editMode.board.container;

        dashboardCnt.classList.remove(
            EditGlobals.classNames.editModeEnabled
        );

        // Hide toolbars.
        editMode.hideToolbars();

        // Remove highlight from the context row if exists.
        if (this.editCellContext && Cell.isCell(this.editCellContext)) {
            this.editCellContext.row?.setHighlight();
        }

        // TODO all buttons should be deactivated.
        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'none';
        }

        if (editMode.resizer) {
            editMode.resizer.disableResizer();
        }

        // Disable responsive width and restore elements to their original
        // positions and sizes.
        if (this.board.layoutsWrapper) {
            this.board.layoutsWrapper.style.width = '100%';
        }
        this.board.reflow();

        editMode.active = false;
        editMode.stopContextDetection();

        this.editCellContext = void 0;
        this.potentialCellContext = void 0;
    }

    /**
     * Function to check whether the edit mode is activated.
     * @internal
     *
     * @returns
     * Whether the edit mode is activated.
     */
    public isActive(): boolean {
        return this.active;
    }

    /**
     * Method for hiding edit toolbars.
     * @internal
     *
     * @param toolbarTypes
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
     * @internal
     *
     * @param toolbarTypes
     * The array of toolbar names to hide ('cell', 'row', 'sidebar').
     *
     * @param currentCell
     * The cell reference for toolbar.
     *
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
                        editMode.cellToolbar.showToolbar(currentCell);
                    }
                    break;
                }
                case 'row': {
                    if (currentCell && currentCell.row && editMode.rowToolbar) {
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
     * Creates the buttons such as `addComponent` button, context menu button
     * and its container.
     * @internal
     */
    public createTools(): void {
        const editMode = this;
        const { board, options, tools } = editMode;

        // Create tools container
        tools.container = document.createElement('div');
        tools.container.classList.add(EditGlobals.classNames.editTools);

        if (board.layoutsWrapper) {
            // For the generated layout
            board.layoutsWrapper.parentNode.insertBefore(
                tools.container,
                board.layoutsWrapper
            );
        } else {
            // For the custom layout
            board.container.insertBefore(
                tools.container,
                board.container.firstChild
            );
        }

        // Create context a menu button or edit mode toggle
        if (options.contextMenu && options.contextMenu.enabled) {
            if (options.contextMenu.items?.length) {
                tools.contextButtonElement = EditRenderer.renderContextButton(
                    tools.container,
                    editMode
                );

                // Init contextMenu if doesn't exist.
                if (!editMode.tools.contextMenu) {
                    editMode.tools.contextMenu = new EditContextMenu(
                        editMode.board.container,
                        editMode.options.contextMenu || {},
                        editMode
                    );
                }
            } else {
                // Render the edit mode toggle when no items are provided
                tools.standaloneEditToggle =
                    EditRenderer.renderToggle(tools.container, {
                        id: EditContextMenu.items.editMode.id,
                        name: EditContextMenu.items.editMode.id,
                        className: EditGlobals.classNames.editStandaloneToggle,
                        title: editMode.lang.editMode,
                        value: editMode.isActive(),
                        lang: editMode.lang,
                        langKey: 'editMode',
                        onchange(): void {
                            editMode.toggleEditMode();
                        }
                    });
            }
        }

        // Create add component button
        if (
            options.tools?.addComponentBtn?.enabled &&
            options.toolbars?.cell?.enabled &&
            !this.customHTMLMode
        ) {
            const addIconURL = options.tools.addComponentBtn.icon;

            this.addComponentBtn = EditRenderer.renderButton(
                tools.container,
                {
                    className: EditGlobals.classNames.editToolsBtn,
                    icon: addIconURL,
                    text: this.lang.addComponent,
                    callback: (): void => {
                        // Sidebar trigger
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
    }

    /**
     * Event fired when detecting context on drag&drop.
     */
    public onDetectContext(): void {
        const editMode = this;

        if (
            !editMode.isActive() ||
            !editMode.isContextDetectionActive ||
            (!editMode.mouseCellContext && !editMode.mouseRowContext) ||
            (editMode.dragDrop || {}).isActive
        ) {
            return;
        }

        let cellContext: Cell | CellHTML | undefined;
        let rowContext: Row | undefined;

        if (editMode.mouseCellContext) {
            cellContext = editMode.mouseCellContext;
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


    /**
     * Stops the context detection.
     */
    public stopContextDetection(): void {
        this.isContextDetectionActive = false;
        if (this.dragDrop) {
            this.dragDrop.mouseCellContext = void 0;
        }
        this.mouseCellContext = void 0;
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
     * Sets the edit cell context.
     * @internal
     */
    public setEditCellContext(
        editCellContext: Cell | CellHTML,
        oldEditCellContext?: Cell | CellHTML
    ): void {
        const editMode = this;
        const oldContext = oldEditCellContext;

        if (
            CellHTML.isCellHTML(editCellContext) ||
            CellHTML.isCellHTML(oldContext)
        ) {
            editMode.editCellContext = editCellContext;
            editMode.cellToolbar?.showToolbar(editCellContext);

        } else {
            const oldContextRow = oldContext?.row;

            editMode.editCellContext = editCellContext;
            editMode.showToolbars(['row', 'cell'], editCellContext);

            if (!oldContextRow || oldContextRow !== editCellContext.row) {
                if (oldContextRow) {
                    // Remove highlight from the previous row.
                    oldContextRow.setHighlight(true);
                }

                // Add highlight to the context row.
                if (editCellContext.row) {
                    editCellContext.row.setHighlight();
                }
            }

            if (editMode.resizer) {
                editMode.resizer.setSnapPositions(editCellContext);
            }
        }

    }

    /**
     * Method for showing and positioning context pointer.
     * @internal
     */
    private showContextPointer(
        left: number,
        top: number,
        width: number,
        height: number
    ): void {
        if (!this.contextPointer) {
            return;
        }

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
     * @internal
     */
    public hideContextPointer(): void {
        if (this.contextPointer?.isVisible) {
            this.contextPointer.isVisible = false;
            this.contextPointer.element.style.display = 'none';
        }
    }


    /**
     * Adds/Removes the edit mode overlay.
     * @internal
     *
     * @param remove
     * Whether the edit overlay should be removed.
     */
    public setEditOverlay(remove?: boolean): void {
        const editMode = this,
            cnt = editMode.editOverlay,
            isSet = cnt?.classList.contains(
                EditGlobals.classNames.editOverlayActive
            );

        if (!remove && !isSet) {
            cnt?.classList.add(EditGlobals.classNames.editOverlayActive);
            editMode.isEditOverlayActive = true;
        } else if (remove && isSet) {
            cnt?.classList.remove(EditGlobals.classNames.editOverlayActive);
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
        /**
         * Context menu options.
         */
        contextMenu?: EditContextMenu.Options;
        /**
         * Confirmation popup options.
         */
        confirmationPopup?: ConfirmationPopup.Options;
        /**
         * Whether the edit mode should be enabled for the dashboards.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/edit-mode/ctx-enabled/ | context enabled}
         *
         * @default false
         *
         */
        enabled?: boolean;
        /**
         * Drag and drop options.
         */
        dragDrop?: DragDrop.Options;
        /**
         * The URL prefix for the icons used in the edit mode like the context
         * menu icons, the row and cell edit toolbar icons, etc.
         *
         * @default @product.assetPrefix@/gfx/dashboards-icons/
         */
        iconsURLPrefix?: string;
        /**
         * Additional Language options.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/edit-mode/lang/ | Norwegian language}
         */
        lang?: EditGlobals.LangOptions;
        /**
         * Resize options.
         */
        resize?: Resizer.Options;
        /**
         * Settings options.
         */
        settings?: SettingsOptions;
        /**
         * Toolbar options.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/edit-mode/toolbars-disabled}
         */
        toolbars?: Toolbars;
        /**
         * Tools options.
         */
        tools?: Tools;
        /**
         * Fullscreen options.
         */
        viewFullscreen?: ViewFullscreenOptions;
    }

    /**
     * Settings options
     */
    export interface SettingsOptions {
        /**
         * Whether the toolbar settings buttons should be enabled.
         *
         * @default true
         */
        enabled?: boolean;
    }

    export interface ViewFullscreenOptions {
        /**
         * Whether the view fullscreen button should be enabled.
         *
         * @default true
         */
        enabled?: boolean;
    }

    /**
    * Toolbar options.
    */
    export interface Toolbars {
        /**
        * Options of the cell toolbar.
        *
        * When the cell toolbar is disabled, the Add Component button is not
        * displayed.
        */
        cell?: CellEditToolbar.Options;
        /**
        * Options of the row toolbar.
        */
        row?: RowEditToolbar.Options;
        /**
        * Options of the sidebar.
        */
        sidebar?: SidebarPopup.Options;
    }

    /**
    * Tools options.
    */
    export interface Tools {
        /**
        * Add Component button options.
        */
        addComponentBtn?: AddComponentBtn;
        /**
        * @internal
        */
        contextMenu?: EditContextMenu;
        /**
        * @internal
        */
        contextButtonElement?: HTMLDOMElement;
        /**
        * @internal
        */
        standaloneEditToggle?: HTMLDOMElement;
        /**
        * @internal
        */
        container?: HTMLDOMElement;
    }

    /**
    * Add Component Button options.
    */
    export interface AddComponentBtn {
        /**
         * Whether the Add Component button should be visible.
         *
         * Note that the Add Component button is always disabled when cell
         * toolbars are disabled.
         *
         * @default true
         *
         */
        enabled?: boolean;
        /**
         * URL to the Add Component button icon.
         */
        icon: string;
    }

    /**
    * @internal
    */
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
