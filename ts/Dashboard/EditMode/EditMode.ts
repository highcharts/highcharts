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

const {
    merge,
    css
} = U;

class EditMode {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: EditMode.Options = {
        enabled: true
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

        if (
            this.options.contextMenu &&
            this.options.contextMenu.enabled
        ) {
            this.contextButtonElement = this.renderer.renderContextButton();
        }
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

    /* *
    *
    *  Functions
    *
    * */

    public onContextBtnClick(
        editMode: EditMode
    ): void {
        // Init dropdown if doesn't exist.
        if (!editMode.contextMenu) {
            editMode.initContextMenu();
        }

        // Show context menu.
        if (editMode.contextMenu) {
            editMode.contextMenu.setVisible(
                !editMode.contextMenu.isVisible
            );
        }
    }

    public initContextMenu(): void {
        const editMode = this,
            contextButtonElement = editMode.contextButtonElement,
            width = 150;

        if (contextButtonElement) {
            editMode.contextMenu = new EditContextMenu(editMode, merge({
                style: {
                    width: width + 'px',
                    top: contextButtonElement.offsetTop +
                        contextButtonElement.offsetHeight + 'px',
                    left: contextButtonElement.offsetLeft - width +
                        contextButtonElement.offsetWidth + 'px'
                }
            }, editMode.options.contextMenu || {}));
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

    public activateEditMode(): void {
        const editMode = this,
            dashboard = editMode.dashboard;

        editMode.active = true;

        let layout;

        // Init resizers.
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            layout = dashboard.layouts[i];

            if (!layout.resizer) {
                editMode.initLayoutResizer(layout);
            }
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

        // Set edit mode active class to dashboard.
        editMode.dashboard.container.classList.add(
            EditGlobals.classNames.editModeEnabled
        );
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
     * The array of toolbar names to hide ('cell', 'row', 'options').
     */
    public hideToolbars(
        toolbarTypes?: Array<string>
    ): void {
        const editMode = this,
            toolbarsToHide = toolbarTypes || ['cell', 'row', 'options'];

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
                case 'options': {
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
    }

    export interface Toolbars {
        cell?: CellEditToolbar.Options;
        row?: RowEditToolbar.Options;
        settings?: Sidebar.Options;
    }
}

export default EditMode;
