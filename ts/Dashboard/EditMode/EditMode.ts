import U from '../../Core/Utilities.js';
import Dashboard from './../Dashboard.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import EditRenderer from './EditRenderer.js';
import Resizer from './../Actions/Resizer.js';
import type Layout from './../Layout/Layout.js';
import CellEditToolbar from './Toolbar/CellEditToolbar.js';
import RowEditToolbar from './Toolbar/RowEditToolbar.js';
import Sidebar from './Sidebar.js';
import EditContextMenu from './EditContextMenu.js';
import DragDrop from './../Actions/DragDrop.js';

const {
    merge,
    pick
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
                icon: EditGlobals.iconsURL + 'add.svg',
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

        // create context menu button
        if (
            this.options.contextMenu &&
            this.options.contextMenu.enabled
        ) {
            this.contextButtonElement = this.renderer.renderContextButton();
        }

        this.isInitialized = false;

        // create add button
        const addIconURL = options && options.tools &&
            options.tools.addComponentBtn && options.tools.addComponentBtn.icon;

        this.addComponentBtn = EditRenderer.renderButton(
            this.dashboard.container,
            {
                className: EditGlobals.classNames.editToolsBtn,
                icon:  addIconURL,
                value: 'Add',
                callback: () => {
                    
                },
                style: {
                    display: 'none'
                }
            }
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
    public contextButtonElement?: HTMLDOMElement;
    public contextMenu?: EditContextMenu;
    public lang: EditGlobals.LangOptions;
    public renderer: EditRenderer;
    public cellToolbar?: CellEditToolbar;
    public rowToolbar?: RowEditToolbar;
    public sidebar?: Sidebar;
    public dragDrop?: DragDrop;
    public isInitialized: boolean;
    public addComponentBtn?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */

    public onContextBtnClick(
        editMode: EditMode
    ): void {
        // Init contextMenu if doesn't exist.
        if (!editMode.contextMenu) {
            editMode.contextMenu = new EditContextMenu(
                editMode, editMode.options.contextMenu || {}
            );
        }

        // Show context menu.
        if (editMode.contextMenu) {
            if (!editMode.contextMenu.isVisible) {
                editMode.contextMenu.updatePosition(editMode.contextButtonElement);
            }

            editMode.contextMenu.setVisible(
                !editMode.contextMenu.isVisible
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
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            layout = dashboard.layouts[i];

            if (!layout.resizer) {
                editMode.initLayoutResizer(layout);
            }
        }

        // Init dragDrop.
        if (
            !(editMode.options.dragDrop &&
                !editMode.options.dragDrop.enabled)
        ) {
            editMode.dragDrop = new DragDrop(editMode);
        }

        // Init cellToolbar.
        if (!editMode.cellToolbar) {
            editMode.cellToolbar = new CellEditToolbar(editMode);
        }

        // Init rowToolbar.
        if (!editMode.rowToolbar) {
            editMode.rowToolbar = new RowEditToolbar(editMode);
        }

        // Init optionsToolbar.
        if (!editMode.sidebar) {
            editMode.sidebar = new Sidebar(editMode);
        }

        editMode.isInitialized = true;
    }

    public activateEditMode(): void {
        const editMode = this;

        if (!editMode.isInitialized) {
            editMode.initEditMode();
        }

        editMode.active = true;

        // Set edit mode active class to dashboard.
        editMode.dashboard.container.classList.add(
            EditGlobals.classNames.editModeEnabled
        );

        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'block';
        }

    }

    public deactivateEditMode(): void {
        const editMode = this,
            dashboardCnt = editMode.dashboard.container;

        editMode.active = false;

        dashboardCnt.classList.remove(
            EditGlobals.classNames.editModeEnabled
        );

        // Hide toolbars.
        editMode.hideToolbars();

        if (this.addComponentBtn) {
            this.addComponentBtn.style.display = 'none';
        }
    }

    private initLayoutResizer(layout: Layout): void {
        const dashboard = this.dashboard,
            guiOptions = dashboard.options.gui;

        if (guiOptions) {
            if (guiOptions.layoutOptions.resize) {
                layout.resizer = new Resizer(layout);
            } else if (guiOptions.layoutOptions.resizerJSON) {
                layout.resizer = Resizer.fromJSON(
                    layout, guiOptions.layoutOptions.resizerJSON
                );
            }
        }
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
}
namespace EditMode {
    export interface Options {
        enabled: boolean;
        contextMenu?: EditContextMenu.Options;
        lang?: EditGlobals.LangOptions|string;
        toolbars?: EditMode.Toolbars;
        dragDrop?: DragDrop.Options;
        tools?: Tools;
    }

    export interface Toolbars {
        cell?: CellEditToolbar.Options;
        row?: RowEditToolbar.Options;
        settings?: Sidebar.Options;
    }

    export interface Tools {
        addComponentBtn: addComponentBtn
    }

    export interface addComponentBtn {
        icon: string;
    }
}

export default EditMode;
