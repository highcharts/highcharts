import U from '../../Core/Utilities.js';
import Dashboard from './../Dashboard.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import EditRenderer from './EditRenderer.js';
import type Layout from './../Layout/Layout.js';
import type Cell from '../Layout/Cell.js';
import type Row from '../Layout/Row.js';
import CellEditToolbar from './Toolbar/CellEditToolbar.js';
import RowEditToolbar from './Toolbar/RowEditToolbar.js';
import Sidebar from './Sidebar.js';
import EditContextMenu from './EditContextMenu.js';
import DragDrop from './../Actions/DragDrop.js';
import Resizer from './../Actions/Resizer.js';
import ConfirmationPopup from './ConfirmationPopup.js';
import ContextDetection from './../Actions/ContextDetection.js';
import GUIElement from '../Layout/GUIElement.js';

const {
    merge,
    addEvent,
    createElement,
    css
} = U;

class EditMode {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: EditMode.Options = {
        enabled: true,
        tools: {
            addComponentBtn: {
                icon: EditGlobals.iconsURL + 'add.svg'
            },
            rwdIcons: {
                small: EditGlobals.iconsURL + 'smartphone.svg',
                medium: EditGlobals.iconsURL + 'tablet.svg',
                large: EditGlobals.iconsURL + 'computer.svg'
            }
        },
        confirmationPopup: {
            close: {
                icon: EditGlobals.iconsURL + 'close.svg'
            }
        }
    }

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        dashboard: Dashboard,
        options: EditMode.Options|undefined
    ) {
        this.options = merge(EditMode.defaultOptions, options || {});
        this.dashboard = dashboard;
        this.lang = merge({}, EditGlobals.lang, this.options.lang);

        // Init renderer.
        this.renderer = new EditRenderer(this);

        this.contextPointer = {
            isVisible: false,
            element: createElement(
                'div',
                { className: EditGlobals.classNames.contextDetectionPointer },
                {},
                this.dashboard.container
            )
        };

        this.isInitialized = false;
        this.isContextDetectionActive = false;
        this.tools = {};
        this.rwdMenu = [];
        this.rwdMode = this.dashboard.getLayoutContainerSize();

        this.createTools();

        this.confirmationPopup = new ConfirmationPopup(
            dashboard.container,
            this.options.confirmationPopup
        );
    }

    /* *
    *
    *  Properties
    *
    * */

    private active: boolean = false;
    public options: EditMode.Options;
    public dashboard: Dashboard;
    // public contextButtonElement?: HTMLDOMElement;
    // public contextMenu?: EditContextMenu;
    public lang: EditGlobals.LangOptions;
    public renderer: EditRenderer;
    public cellToolbar?: CellEditToolbar;
    public rowToolbar?: RowEditToolbar;
    public sidebar?: Sidebar;
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
                editMode, editMode.options.contextMenu || {}
            );
        }

        // Show context menu.
        if (editMode.tools.contextMenu) {
            if (!editMode.tools.contextMenu.isVisible) {
                editMode.tools.contextMenu.updatePosition(editMode.tools.contextButtonElement);
            }

            editMode.tools.contextMenu.setVisible(
                !editMode.tools.contextMenu.isVisible
            );
        }
    }

    public onEditModeToggle(): void {
        const editMode = this;

        if (editMode.active) {
            editMode.deactivateEditMode();
        } else {
            editMode.activateEditMode();
        }
    }

    public initEditMode(): void {
        const editMode = this,
            dashboard = editMode.dashboard;

        let layout;

        // Init resizers.
        // for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
        //     layout = dashboard.layouts[i];

        //     if (!layout.resizer) {
        //         editMode.initLayoutResizer(layout);
        //     }
        // }
        const guiOptions = dashboard.options.gui;

        if (
            !(editMode.options.resize &&
                !editMode.options.resize.enabled)
        ) {
            editMode.resizer = new Resizer(editMode);
        }

        //     editMode.resizer = Resizer.fromJSON(
        //         editMode, guiOptions.layoutOptions.resizerJSON
        //     );

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
            editMode.sidebar = new Sidebar(editMode);
        }

        editMode.isInitialized = true;
    }

    private initEvents(): void {
        const editMode = this,
            dashboard = editMode.dashboard;

        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            editMode.setLayoutEvents(dashboard.layouts[i]);
        }

        if (editMode.cellToolbar) {
            // Stop context detection when mouse on cell toolbar.
            addEvent(editMode.cellToolbar.container, 'mouseenter', function (): void {
                editMode.stopContextDetection();
            });

            addEvent(editMode.cellToolbar.container, 'mouseleave', function (): void {
                editMode.isContextDetectionActive = true;
            });
        }

        if (editMode.rowToolbar) {
            // Stop context detection when mouse on row toolbar.
            addEvent(editMode.rowToolbar.container, 'mouseenter', function (): void {
                editMode.stopContextDetection();
            });

            addEvent(editMode.rowToolbar.container, 'mouseleave', function (): void {
                editMode.isContextDetectionActive = true;
            });
        }

        addEvent(dashboard.layoutsWrapper, 'mousemove', editMode.onDetectContext.bind(editMode));
        addEvent(dashboard.layoutsWrapper, 'click', editMode.onContextConfirm.bind(editMode));
        addEvent(dashboard.layoutsWrapper, 'mouseleave', (): void => {
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

            addEvent(row.container, 'mousemove', function (e: PointerEvent): void {
                if (dragDrop.isActive && e.target === row.container) {
                    dragDrop.mouseRowContext = row;
                }
            });

            addEvent(row.container, 'mouseleave', function (e: PointerEvent): void {
                if (dragDrop.isActive && dragDrop.mouseRowContext === row) {
                    dragDrop.mouseRowContext = void 0;
                }

                if (editMode.isContextDetectionActive) {
                    editMode.mouseRowContext = void 0;
                }
            });
        }
    }

    public setCellEvents(
        cell: Cell
    ): void {
        const editMode = this;

        if (cell.nestedLayout) {
            editMode.setLayoutEvents(cell.nestedLayout);
        } else if (editMode.cellToolbar && cell.container) {
            // const cellToolbar = editMode.cellToolbar;

            // Hide cell toolbar when mouse on cell resizer.
            // const resizedCell = (cell as Resizer.ResizedCell).resizer;
            // if (resizedCell && resizedCell.snapX) {
            //     addEvent(resizedCell.snapX, 'mousemove', function (e): void {
            //         cellToolbar.hide();
            //     });
            // }

            // Init dragDrop and resizer cell events.
            if (editMode.dragDrop || editMode.resizer) {
                const dragDrop = editMode.dragDrop,
                    resizer = editMode.resizer;

                addEvent(cell.container, 'mouseenter', function (e: PointerEvent): void {
                    if (editMode.isContextDetectionActive) {
                        editMode.mouseCellContext = cell;
                    }
                });

                addEvent(cell.container, 'mousemove', function (e: PointerEvent): void {
                    if (dragDrop && dragDrop.isActive && e.target === cell.container) {
                        dragDrop.mouseCellContext = cell;
                        dragDrop.mouseRowContext = void 0;
                    }
                });

                addEvent(cell.container, 'mouseleave', function (): void {
                    if (dragDrop && dragDrop.isActive && dragDrop.mouseCellContext === cell) {
                        dragDrop.mouseCellContext = void 0;
                    }

                    if (editMode.isContextDetectionActive) {
                        editMode.mouseCellContext = void 0;
                    }
                });
            }
        }
    }

    public activateEditMode(): void {
        const editMode = this;

        if (!editMode.isInitialized) {
            editMode.initEditMode();
            editMode.initEvents();
        }

        // Set edit mode active class to dashboard.
        editMode.dashboard.container.classList.add(
            EditGlobals.classNames.editModeEnabled
        );

        // TODO all buttons should be activated, add some wrapper?
        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'block';
        }

        // Open the sidebar.
        if (editMode.sidebar) {
            editMode.sidebar.show();
            editMode.sidebar.updateTitle('General');
        }

        // Sets proper rwd mode.
        if (editMode.sidebar) {
            editMode.sidebar.afterCSSAnimate((): void => {
                editMode.rwdMode = editMode.dashboard.getLayoutContainerSize();
            });
        } else {
            editMode.rwdMode = editMode.dashboard.getLayoutContainerSize();
        }

        // show reponsive buttons
        this.showRwdButtons();

        editMode.active = true;
        editMode.isContextDetectionActive = true;
    }

    public deactivateEditMode(): void {
        const editMode = this,
            dashboardCnt = editMode.dashboard.container;

        this.editCellContext = void 0;
        this.potentialCellContext = void 0;

        dashboardCnt.classList.remove(
            EditGlobals.classNames.editModeEnabled
        );

        // Hide toolbars.
        editMode.hideToolbars();

        // TODO all buttons should be deactivated.
        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'none';
        }

        if (editMode.resizer) {
            editMode.resizer.disableResizer();
        }


        // hide reponsive buttons
        this.hideRwdButtons();

        // disable responsive width
        this.dashboard.layoutsWrapper.style.width = '100%';

        editMode.active = false;
        editMode.stopContextDetection();
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
                    if (editMode.cellToolbar && editMode.cellToolbar.isVisible) {
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
                        editMode.rowToolbar.showToolbar(currentCell && currentCell.row);
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
        this.tools.container = createElement(
            'div', {
                className: EditGlobals.classNames.editTools
            }, {},
            this.dashboard.container
        );

        // create context menu button
        if (
            options.contextMenu &&
            options.contextMenu.enabled
        ) {
            this.tools.contextButtonElement = this.renderer.renderContextButton(
                this.tools.container
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
                value: 'Add',
                callback: (): void => {
                    // sidebar trigger
                    if (editMode.sidebar) {
                        editMode.sidebar.show();
                        editMode.sidebar.updateTitle('General');
                    }
                },
                style: {
                    display: 'none'
                }
            }
        );
    }

    private createRwdMenu(): void {
        const rwdBreakingPoints = this.dashboard.options.respoBreakpoints;
        const toolsContainer = this.tools.container;
        const options = this.options;
        const rwdIcons = (options && options.tools && options.tools.rwdIcons) || {};

        for (const key in rwdBreakingPoints) {
            if (toolsContainer) {
                const btn = EditRenderer.renderButton(
                    toolsContainer,
                    {
                        className: EditGlobals.classNames.editToolsBtn,
                        icon: (rwdIcons as any)[key] || '',
                        value: key,
                        callback: (): void => {
                            this.dashboard.layoutsWrapper.style.width = rwdBreakingPoints[key] + 'px';
                            this.rwdMode = key;

                            // reflow elements
                            this.dashboard.reflow();
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
                cellContext = ContextDetection.getContext(editMode.mouseCellContext, e, offset).cell;
            } else if (editMode.mouseRowContext) {
                rowContext = editMode.mouseRowContext;
                cellContext = rowContext.layout.parentCell;
            }

            this.potentialCellContext = cellContext;

            if (cellContext) {
                const cellContextOffsets = GUIElement.getOffsets(cellContext, editMode.dashboard.container);
                const { width, height } = GUIElement.getDimFromOffsets(cellContextOffsets);

                editMode.showContextPointer(cellContextOffsets.left, cellContextOffsets.top, width, height);
            }
        }
    }

    public stopContextDetection(): void {
        this.isContextDetectionActive = false;
        this.hideContextPointer();
    }

    public onContextConfirm(): void {
        if (this.isContextDetectionActive && this.potentialCellContext) {
            this.editCellContext = this.potentialCellContext;

            if (this.cellToolbar) {
                this.cellToolbar.showToolbar(this.editCellContext);
            }

            if (this.rowToolbar) {
                this.rowToolbar.showToolbar(this.editCellContext.row);
            }

            if (this.sidebar) {
                this.sidebar.show(this.editCellContext);
            }

            if (this.resizer) {
                this.resizer.isResizerDetectionActive = true;
                this.resizer.setSnapPositions(this.editCellContext);
            }
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
}
namespace EditMode {
    export interface Options {
        enabled: boolean;
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
        settings?: Sidebar.Options;
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

export default EditMode;
